import { useEffect, useRef } from 'react';

const TAMIL_GLYPHS = ['அ', 'ஆ', 'இ', 'உ', 'எ', 'ஓ', 'க்', 'த்', 'ண்', 'ழ்', 'ஞ்', 'ற்'];
const SPRINKLE_COLORS = ['#D4AF37', '#F2C35E', '#A86E2A', '#FFF1C4'];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function isInsideCircularGallery(target) {
  return target instanceof Element && target.closest('.gallery-canvas-wrap') !== null;
}

function isInsideExcludedZone(target) {
  if (!(target instanceof Element)) {
    return false;
  }

  return target.closest('.gallery-canvas-wrap, .no-mouse-trail') !== null;
}

export default function MouseTrailEffect() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return undefined;
    }

    let width = 0;
    let height = 0;
    let animationFrameId = 0;

    const particles = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawnMoveTrail = (x, y) => {
      const count = 3 + Math.floor(Math.random() * 3);

      for (let i = 0; i < count; i += 1) {
        const isGlyph = Math.random() > 0.55;
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 1.6,
          vy: (Math.random() - 0.5) * 1.6 - 0.5,
          life: 42 + Math.random() * 26,
          maxLife: 42 + Math.random() * 26,
          size: isGlyph ? 14 + Math.random() * 10 : 2 + Math.random() * 2,
          color: pick(SPRINKLE_COLORS),
          glyph: isGlyph ? pick(TAMIL_GLYPHS) : null,
          rotate: (Math.random() - 0.5) * 0.06,
          angle: Math.random() * Math.PI * 2,
        });
      }
    };

    const spawnClickBurst = (x, y) => {
      const count = 20;
      const step = (Math.PI * 2) / count;

      for (let i = 0; i < count; i += 1) {
        const theta = i * step + Math.random() * 0.18;
        const speed = 1.9 + Math.random() * 2.4;
        particles.push({
          x,
          y,
          vx: Math.cos(theta) * speed,
          vy: Math.sin(theta) * speed,
          life: 60 + Math.random() * 26,
          maxLife: 60 + Math.random() * 26,
          size: 18 + Math.random() * 14,
          color: pick(SPRINKLE_COLORS),
          glyph: pick(TAMIL_GLYPHS),
          rotate: (Math.random() - 0.5) * 0.09,
          angle: theta,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.01;
        p.vx *= 0.992;
        p.life -= 1;
        p.angle += p.rotate;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = p.life / p.maxLife;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        if (p.glyph) {
          ctx.fillStyle = p.color;
          ctx.font = `600 ${p.size}px "Noto Sans Tamil", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.glyph, 0, 0);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = window.requestAnimationFrame(draw);
    };

    const onMouseMove = (event) => {
      if (isInsideExcludedZone(event.target)) {
        return;
      }

      spawnMoveTrail(event.clientX, event.clientY);
    };

    const onMouseDown = (event) => {
      if (isInsideExcludedZone(event.target)) {
        return;
      }

      spawnClickBurst(event.clientX, event.clientY);
    };

    const onTouchStart = (event) => {
      const touch = event.touches?.[0];
      if (!touch) {
        return;
      }

      if (isInsideExcludedZone(event.target)) {
        return;
      }

      spawnClickBurst(touch.clientX, touch.clientY);
    };

    const onTouchMove = (event) => {
      const touch = event.touches?.[0];
      if (!touch) {
        return;
      }

      if (isInsideExcludedZone(event.target)) {
        return;
      }

      // Keep touch trail lighter than mouse to avoid dense particles while scrolling.
      if (Math.random() > 0.75) {
        spawnMoveTrail(touch.clientX, touch.clientY);
      }
    };

    resize();
    draw();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="mouse-trail-canvas" aria-hidden="true" />;
}
