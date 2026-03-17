import { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Mesh, Program, Plane, Texture } from 'ogl';

/* ─── GLSL ─────────────────────────────────────────────────────────────── */
const VERT = /* glsl */ `
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uBorderRadius;
  uniform float uAlpha;
  uniform float uAspect;
  uniform float uTextureAspect;
  varying vec2 vUv;

  float roundedRectSDF(vec2 p, vec2 halfSize, float r) {
    vec2 q = abs(p) - halfSize + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    // Correct for plane aspect ratio so corners look circular
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    float d = roundedRectSDF(p, vec2(0.5 * uAspect, 0.5), uBorderRadius);
    if (d > 0.0) discard;

    // Keep image ratio and fill the plane (cover), avoiding squeezed/shrunken look.
    vec2 scale = vec2(1.0, 1.0);
    if (uAspect > uTextureAspect) {
      scale.y = uTextureAspect / uAspect;
    } else {
      scale.x = uAspect / uTextureAspect;
    }
    vec2 uv = (vUv - 0.5) * scale + 0.5;

    vec4 texColor = texture2D(uTexture, uv);
    gl_FragColor = vec4(texColor.rgb, texColor.a * uAlpha);
  }
`;

/* ─── Constants ──────────────────────────────────────────────────────────── */
const PLANE_W = 3.4;
const PLANE_H = 3.12;
const SPACING = PLANE_W + 0.5;   // world-units between item centres
const PLANE_ASPECT = PLANE_W / PLANE_H;
const CAM_Z = 6;
const FOV = 45;
const TAN_HALF_FOV_V = Math.tan((FOV * 0.5 * Math.PI) / 180);

/* ─── generate a coloured canvas placeholder ─── */
function makePlaceholderCanvas(text, index) {
  const colors = ['#3E2723', '#5A3A1B', '#7B1E1E'];
  const bg = colors[index % colors.length];
  const c = Object.assign(document.createElement('canvas'), {
    width: 600,
    height: 380,
  });
  const ctx = c.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 600, 380);
  // subtle dot pattern
  ctx.fillStyle = '#D4AF3730';
  for (let x = 20; x < 600; x += 30) {
    for (let y = 20; y < 380; y += 30) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 36px "Noto Sans Tamil", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 300, 190);
  return c;
}

/* ─── Component ────────────────────────────────────────────────────────── */
/**
 * CircularGallery
 *
 * @param {Array}    items         – Array of { id, title, image, ... } (eventsData shape)
 * @param {number}   bend          – Arc curvature (0 = flat, 1.2 = moderate arc)
 * @param {string}   textColor     – CSS colour for text labels
 * @param {number}   borderRadius  – Rounded-corner radius in normal UV units (0.05)
 * @param {Function} onEventClick  – Called with the clicked item's data object
 */
export default function CircularGallery({
  items = [],
  bend = 1.2,
  textColor = '#D4AF37',
  borderRadius = 0.05,
  onEventClick,
}) {
  const containerRef = useRef(null);
  const labelRefs = useRef([]);        // DOM refs for text labels
  const scrollRef = useRef(0);         // current interpolated scroll
  const targetScrollRef = useRef(0);   // target scroll (from wheel / drag)

  useEffect(() => {
    if (!items.length) return;
    const container = containerRef.current;
    if (!container) return;

    /* ─── OGL setup ─── */
    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.inset = '0';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';

    const camera = new Camera(gl, { fov: FOV, near: 0.1, far: 100 });
    camera.position.z = CAM_Z;

    const scene = new Transform();

    /* ─── Build meshes ─── */
    const geometry = new Plane(gl, { width: PLANE_W, height: PLANE_H });

    const meshes = items.map((item, i) => {
      const texture = new Texture(gl, {
        generateMipmaps: false,
        minFilter: gl.LINEAR,
        magFilter: gl.LINEAR,
      });

      // Load image; fall back to coloured canvas placeholder
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        texture.image = img;
        program.uniforms.uTextureAspect.value = img.naturalWidth / img.naturalHeight;
      };
      img.onerror = () => {
        texture.image = makePlaceholderCanvas(item.title, i);
        program.uniforms.uTextureAspect.value = 600 / 380;
      };
      img.src = item.image;
      // Trigger onerror immediately for missing local assets in dev
      setTimeout(() => {
        if (!img.complete || img.naturalWidth === 0) {
          texture.image = makePlaceholderCanvas(item.title, i);
          program.uniforms.uTextureAspect.value = 600 / 380;
        }
      }, 1500);

      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uTexture: { value: texture },
          uBorderRadius: { value: borderRadius },
          uAlpha: { value: 1.0 },
          uAspect: { value: PLANE_ASPECT },
          uTextureAspect: { value: PLANE_ASPECT },
        },
        transparent: true,
      });

      const mesh = new Mesh(gl, { geometry, program });
      mesh.setParent(scene);
      mesh._itemData = item;
      mesh._index = i;
      return mesh;
    });

    /* ─── Helpers ─── */
    const clampScroll = (v) => {
      const half = ((items.length - 1) * SPACING) / 2;
      return Math.max(-half, Math.min(half, v));
    };

    const tanHalfFovH = (w, h) => TAN_HALF_FOV_V * (w / h);

    const projectToScreen = (wx, wy, wz, w, h) => {
      const vz = CAM_Z - wz;
      const invVz = 1 / vz;
      const thfH = tanHalfFovH(w, h);
      const sx = (wx * invVz / thfH + 1) * 0.5 * w;
      const sy = (-wy * invVz / TAN_HALF_FOV_V + 1) * 0.5 * h;
      return { sx, sy };
    };

    /* ─── Position update ─── */
    const centerIndex = (items.length - 1) / 2;

    const updatePositions = (scroll, w, h) => {
      meshes.forEach((mesh, i) => {
        const offset = (i - centerIndex) * SPACING + scroll;

        // Parabolic arc: y drops at edges, z pushes back at edges
        const arcY = -bend * offset * offset * 0.018;
        const arcZ = -Math.abs(offset) * bend * 0.12;
        // Rotate face inward
        const rotY = -offset * bend * 0.07;
        // Scale: centre item slightly larger
        const proximity = Math.abs(offset) / SPACING;
        const sc = Math.max(0.72, 1 - proximity * 0.12);

        mesh.position.set(offset, arcY, arcZ);
        mesh.rotation.y = rotY;
        mesh.scale.set(sc, sc, 1);

        // Fade out items that are very far out of range
        const fade = Math.max(0, 1 - (Math.abs(offset) / (SPACING * items.length * 0.6)) * 0.8);
        mesh.program.uniforms.uAlpha.value = fade;

        // Update DOM label position
        const labelEl = labelRefs.current[i];
        if (labelEl && w && h) {
          // project bottom-centre of plane
          const bottomY = arcY - PLANE_H * sc * 0.5 - 0.18;
          const { sx, sy } = projectToScreen(offset, bottomY, arcZ, w, h);
          labelEl.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, 0)`;
          labelEl.style.opacity = Math.min(1, fade * 1.4);
        }
      });
    };

    /* ─── Resize ─── */
    let canvasW = 0;
    let canvasH = 0;

    const resize = () => {
      canvasW = container.offsetWidth;
      canvasH = container.offsetHeight;
      renderer.setSize(canvasW, canvasH);
      camera.perspective({ aspect: canvasW / canvasH });
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    /* ─── Intersection Observer — Reset gallery when leaving the section ─── */
    const resetToFirst = () => {
      targetScrollRef.current = clampScroll(centerIndex * SPACING);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When section is no longer visible (scrolled away), reset to first item
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            resetToFirst();
          }
        });
      },
      { threshold: 0.1 }
    );
    io.observe(container);

    /* ─── Render loop ─── */
    let rafId;
    const LERP_FACTOR = 0.07;

    // Initialize scroll to center the first item (essay writing)
    // The first item (index 0) should be at the center (offset = 0)
    targetScrollRef.current = clampScroll(centerIndex * SPACING);
    scrollRef.current = targetScrollRef.current;

    const tick = () => {
      rafId = requestAnimationFrame(tick);

      // Smooth scroll interpolation
      scrollRef.current += (targetScrollRef.current - scrollRef.current) * LERP_FACTOR;

      updatePositions(scrollRef.current, canvasW, canvasH);
      renderer.render({ scene, camera });
    };
    tick();

    /* ─── Pointer / wheel input ─── */
    let isDragging = false;
    let dragStartClientX = 0;
    let dragStartScroll = 0;

    const onWheel = (e) => {
      const dir = Math.sign(e.deltaY);
      if (!dir) return false;

      const delta = dir * SPACING * 0.35;
      const currentTarget = targetScrollRef.current;
      const nextTarget = currentTarget - delta;
      const half = ((items.length - 1) * SPACING) / 2;
      const EDGE_EPSILON = 0.001;

      const pushingPastLeftEdge = currentTarget <= -half + EDGE_EPSILON && nextTarget < -half;
      const pushingPastRightEdge = currentTarget >= half - EDGE_EPSILON && nextTarget > half;

      // At gallery edges, allow normal page scroll instead of trapping wheel input.
      if (pushingPastLeftEdge || pushingPastRightEdge) return false;

      e.preventDefault();
      targetScrollRef.current = clampScroll(nextTarget);
      return true;
    };

    const onPointerDown = (e) => {
      isDragging = true;
      dragStartClientX = e.clientX;
      dragStartScroll = targetScrollRef.current;
      gl.canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const delta = (e.clientX - dragStartClientX) * 0.008 * SPACING;
      targetScrollRef.current = clampScroll(dragStartScroll + delta);
    };

    const onPointerUp = (e) => {
      if (!isDragging) return;
      const moved = Math.abs(e.clientX - dragStartClientX);
      isDragging = false;

      // Treat as click if movement was minimal
      if (moved < 6 && onEventClick) {
        // Find the item closest to the current scroll-centre (world x ≈ 0)
        let closest = meshes[0];
        let closestDist = Infinity;
        meshes.forEach((m) => {
          const d = Math.abs(m.position.x);
          if (d < closestDist) { closestDist = d; closest = m; }
        });
        if (closestDist < SPACING * 0.65) {
          onEventClick(closest._itemData);
        }
      }
    };

    // Snap to nearest item when scroll momentum settles
    const snapToNearest = () => {
      const snapped = Math.round(-targetScrollRef.current / SPACING) * (-SPACING);
      targetScrollRef.current = clampScroll(snapped);
    };

    let snapTimeout;
    const onWheelEnd = () => {
      clearTimeout(snapTimeout);
      snapTimeout = setTimeout(snapToNearest, 350);
    };

    const wheelWithEnd = (e) => {
      const consumed = onWheel(e);
      if (consumed) onWheelEnd();
    };

    gl.canvas.addEventListener('wheel', wheelWithEnd, { passive: false });
    gl.canvas.addEventListener('pointerdown', onPointerDown);
    gl.canvas.addEventListener('pointermove', onPointerMove);
    gl.canvas.addEventListener('pointerup', onPointerUp);
    gl.canvas.addEventListener('pointercancel', () => { isDragging = false; });

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      clearTimeout(snapTimeout);
      gl.canvas.removeEventListener('wheel', wheelWithEnd);
      gl.canvas.removeEventListener('pointerdown', onPointerDown);
      gl.canvas.removeEventListener('pointermove', onPointerMove);
      gl.canvas.removeEventListener('pointerup', onPointerUp);
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
      renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [items, bend, borderRadius, onEventClick]);

  return (
    <div
      ref={containerRef}
      className="gallery-canvas-wrap select-none"
      style={{ height: '780px' }}
    >
      {/* DOM text labels — positioned via JS projection */}
      {items.map((item, i) => (
        <button
          key={item.id}
          ref={(el) => (labelRefs.current[i] = el)}
          onClick={() => onEventClick?.(item)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'translate(-50%, 0)',
            color: textColor,
            fontFamily: "'Noto Sans Tamil', sans-serif",
            fontSize: 'clamp(12px, 1.35vw, 15px)',
            fontWeight: '700',
            letterSpacing: '0.02em',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            background: 'rgba(62,39,35,0.82)',
            border: '1px solid rgba(212,175,55,0.65)',
            borderRadius: '10px',
            boxShadow: '0 8px 20px rgba(62,39,35,0.24)',
            backdropFilter: 'blur(2px)',
            cursor: 'pointer',
            padding: '7px 14px',
            pointerEvents: 'auto',
            whiteSpace: 'nowrap',
            transition: 'color 0.2s, border-color 0.2s, background 0.2s',
            zIndex: 2,
          }}
          aria-label={`${item.title} – விதிகளை காண்க`}
        >
          {item.title}
        </button>
      ))}

      {/* "Scroll / drag" hint */}
      <p
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: textColor,
          fontSize: '11px',
          opacity: 0.55,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 2,
          fontFamily: "'Noto Sans Tamil', sans-serif",
        }}
      >
        ← இழுக்கவும் அல்லது உருட்டவும் →
      </p>
    </div>
  );
}
