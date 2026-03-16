import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * DotGrid – interactive canvas background.
 * Uses GSAP (standard elastic easing, no InertiaPlugin) for shock-wave animations.
 *
 * Props:
 *  dotSize    {number}  radius of each dot in px           (default 6)
 *  gap        {number}  spacing between dot centres in px  (default 22)
 *  baseColor  {string}  hex colour for idle dots            (default '#5A3A1B')
 *  activeColor{string}  hex colour for activated dots       (default '#D4AF37')
 *  proximity  {number}  mouse‑influence radius in px        (default 120)
 *  shockRadius{number}  max shock-wave radius in px         (default 250)
 *  global     {boolean} when true, listens on window/document so the grid
 *                       reacts to mouse across the entire page            (default false)
 */
export default function DotGrid({
  dotSize = 6,
  gap = 22,
  baseColor = '#5A3A1B',
  activeColor = '#D4AF37',
  proximity = 120,
  shockRadius = 250,
  global: isGlobal = false,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    /* ─── colour helpers ─── */
    const hexToRgb = (hex) => ({
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    });
    const lerp = (a, b, t) => a + (b - a) * t;

    const base = hexToRgb(baseColor);
    const active = hexToRgb(activeColor);

    /* ─── state ─── */
    let dots = [];
    let waves = []; // { x, y, radius, strength }
    let mouse = { x: -9999, y: -9999 };
    let rafId = null;
    let width = 0;
    let height = 0;

    /* ─── build dot grid ─── */
    const buildGrid = (w, h) => {
      dots = [];
      const step = dotSize + gap;
      const cols = Math.ceil(w / step) + 1;
      const rows = Math.ceil(h / step) + 1;
      const offsetX = (w - (cols - 1) * step) / 2;
      const offsetY = (h - (rows - 1) * step) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            x: offsetX + c * step,
            y: offsetY + r * step,
            activation: 0, // 0 = idle, 1 = fully active
          });
        }
      }
    };

    /* ─── resize ─── */
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
      buildGrid(width, height);
    };

    /* ─── render loop ─── */
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mx = mouse.x;
      const my = mouse.y;

      for (const dot of dots) {
        /* mouse proximity activation */
        const dx = dot.x - mx;
        const dy = dot.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mouseAct = dist < proximity ? Math.pow(1 - dist / proximity, 1.6) : 0;

        /* wave ring activation */
        let waveAct = 0;
        for (const wave of waves) {
          const wdx = dot.x - wave.x;
          const wdy = dot.y - wave.y;
          const wdist = Math.sqrt(wdx * wdx + wdy * wdy);
          const ringWidth = shockRadius * 0.22;
          const diff = Math.abs(wdist - wave.radius);
          if (diff < ringWidth) {
            const ring = (1 - diff / ringWidth) * wave.strength;
            waveAct = Math.max(waveAct, ring);
          }
        }

        const target = Math.min(1, mouseAct + waveAct);
        /* smooth towards target — fast rise, slow fall */
        dot.activation += (target - dot.activation) * (target > dot.activation ? 0.24 : 0.08);

        const t = dot.activation;
        const r = Math.round(lerp(base.r, active.r, t));
        const g = Math.round(lerp(base.g, active.g, t));
        const b = Math.round(lerp(base.b, active.b, t));
        const alpha = lerp(0.5, 1, t);
        const radius = (dotSize / 2) * lerp(0.78, 1.55, t);

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(render);
    };

    /* ─── input handlers ─── */
    const onMouseMove = (e) => {
      if (isGlobal) {
        // Canvas is fixed at (0,0), so clientX/Y === canvas coords
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      } else {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      }
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    /**
     * Shock wave on click — GSAP elastic easing, no InertiaPlugin.
     * The wave expands to shockRadius with a power2 ease, then its
     * strength fades out. No Club GSAP plugins required.
     */
    const onClick = (e) => {
      const wave = {
        x: isGlobal ? e.clientX : e.clientX - canvas.getBoundingClientRect().left,
        y: isGlobal ? e.clientY : e.clientY - canvas.getBoundingClientRect().top,
        radius: 0,
        strength: 1,
      };
      waves.push(wave);

      /* Expand radius */
      gsap.to(wave, {
        radius: shockRadius,
        duration: 1.2,
        ease: 'power2.out',
      });

      /* Fade strength – starts after a short delay so the ring is visible */
      gsap.to(wave, {
        strength: 0,
        duration: 0.9,
        delay: 0.3,
        ease: 'power1.in',
        onComplete: () => {
          waves = waves.filter((w) => w !== wave);
        },
      });
    };

    /* ─── touch support ─── */
    const onTouchMove = (e) => {
      const touch = e.touches[0];
      if (isGlobal) {
        // fixed canvas at (0,0) — clientX/Y map directly
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
      } else {
        const rect = canvas.getBoundingClientRect();
        mouse.x = touch.clientX - rect.left;
        mouse.y = touch.clientY - rect.top;
      }
    };

    /* ─── init ─── */
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // In global mode listen on the whole window so the grid reacts
    // everywhere on the page (canvas itself has pointer-events:none)
    const moveTarget = isGlobal ? window : canvas;
    const clickTarget = isGlobal ? window : canvas;

    moveTarget.addEventListener('mousemove', onMouseMove, { passive: true });
    if (!isGlobal) canvas.addEventListener('mouseleave', onMouseLeave, { passive: true });
    moveTarget.addEventListener('touchmove', onTouchMove, { passive: true });
    clickTarget.addEventListener('click', onClick);
    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      moveTarget.removeEventListener('mousemove', onMouseMove);
      if (!isGlobal) canvas.removeEventListener('mouseleave', onMouseLeave);
      moveTarget.removeEventListener('touchmove', onTouchMove);
      clickTarget.removeEventListener('click', onClick);
      gsap.killTweensOf(waves);
    };
  }, [dotSize, gap, baseColor, activeColor, proximity, shockRadius, isGlobal]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        /* In global fixed mode no mask needed — full coverage is intentional.
           In local mode fade edges so text stays readable. */
        maskImage: isGlobal
          ? undefined
          : 'radial-gradient(circle, white 50%, transparent 100%)',
        WebkitMaskImage: isGlobal
          ? undefined
          : 'radial-gradient(circle, white 50%, transparent 100%)',
      }}
    />
  );
}
