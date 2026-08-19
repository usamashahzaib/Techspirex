/*
  Shared renderer behind every "living mesh" moment on the site - the hero
  centerpiece and the quieter backdrop used on every other dark section
  (`BrandNodeField`). One math/draw core, two presets, so the motif reads as
  one system end to end instead of a hero-only flourish.

  Canvas 2D, not WebGL: cheap enough to run on every dark section without a
  GPU-context budget, and the shape (torus of nodes) is simple enough that
  2D projection math is all it needs.
*/

const DARK_PALETTE = {
  meshLine: "119, 106, 157", // brand-violet-line
  nodeDim: "170, 160, 199", // brand-lilac
  signal: "16, 210, 246", // brand-cyan
  signalBright: "98, 228, 255", // brand-cyan-bright
  haloCore: "57, 42, 111", // brand-violet
  haloSignal: "16, 210, 246", // brand-cyan
};

// Same motif, inked instead of glowing - for paper/cream sections.
const LIGHT_PALETTE = {
  meshLine: "57, 42, 111", // brand-violet
  nodeDim: "57, 42, 111", // brand-violet
  signal: "16, 150, 180", // muted cyan, no neon on white
  signalBright: "16, 150, 180",
  haloCore: "57, 42, 111",
  haloSignal: "16, 150, 180",
};

const MAJOR_RADIUS = 1;

type Node = { u: number; v: number; signal: boolean };
type Projected = Node & { sx: number; sy: number; depth: number };

function project(u: number, v: number, minorRadius: number, rotY: number, rotX: number) {
  const x = (MAJOR_RADIUS + minorRadius * Math.cos(v)) * Math.cos(u);
  const y = minorRadius * Math.sin(v);
  const z = (MAJOR_RADIUS + minorRadius * Math.cos(v)) * Math.sin(u);

  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x1 = x * cosY - z * sinY;
  const z1 = x * sinY + z * cosY;

  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y1 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;

  return { x: x1, y: y1, z: z2 };
}

export type NodeFieldPreset = {
  uSteps: number;
  uStepsCompact: number;
  vSteps: number;
  vStepsCompact: number;
  minorRadius: number;
  scaleFactor: number;
  anchorX: number;
  anchorY: number;
  anchorXCompact: number;
  baseTilt: number;
  rotationSpeed: number;
  signalChance: number;
  reactive: boolean;
  glow: boolean;
  halo: boolean;
  entranceMs: number;
  bob: number;
  lineAlpha: number;
  nodeAlpha: number;
  fps: number;
  palette: typeof DARK_PALETTE;
};

export const HERO_PRESET: NodeFieldPreset = {
  uSteps: 48,
  uStepsCompact: 24,
  vSteps: 14,
  vStepsCompact: 8,
  minorRadius: 0.42,
  scaleFactor: 0.52,
  anchorX: 0.62,
  anchorY: 0.48,
  anchorXCompact: 0.5,
  baseTilt: 0.34,
  rotationSpeed: 0.12,
  signalChance: 0.05,
  reactive: true,
  glow: true,
  halo: true,
  entranceMs: 1500,
  bob: 10,
  lineAlpha: 1,
  nodeAlpha: 1,
  fps: 60,
  palette: DARK_PALETTE,
};

export function ambientPreset(
  anchorX: number,
  anchorY: number,
  anchorXCompact: number,
  tone: "dark" | "light" = "dark",
): NodeFieldPreset {
  return {
    uSteps: 22,
    uStepsCompact: 14,
    vSteps: 8,
    vStepsCompact: 6,
    minorRadius: 0.48,
    scaleFactor: 0.34,
    anchorX,
    anchorY,
    anchorXCompact,
    baseTilt: 0.3,
    rotationSpeed: 0.045,
    signalChance: 0.05,
    reactive: false,
    glow: false,
    halo: false,
    entranceMs: 0,
    bob: 4,
    lineAlpha: tone === "light" ? 0.16 : 0.55,
    nodeAlpha: tone === "light" ? 0.26 : 0.6,
    fps: 24,
    palette: tone === "light" ? LIGHT_PALETTE : DARK_PALETTE,
  };
}

const EASE_OUT_EXPO = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function mountNodeField(
  canvas: HTMLCanvasElement,
  preset: NodeFieldPreset,
  prefersReducedMotion: boolean,
): () => void {
  const parent = canvas.parentElement;
  const ctx = canvas.getContext("2d");
  if (!parent || !ctx) return () => {};

  const isCompact = window.matchMedia("(max-width: 640px)").matches;
  const uSteps = isCompact ? preset.uStepsCompact : preset.uSteps;
  const vSteps = isCompact ? preset.vStepsCompact : preset.vSteps;
  const nodes: Node[] = [];
  for (let ui = 0; ui < uSteps; ui++) {
    for (let vi = 0; vi < vSteps; vi++) {
      nodes.push({
        u: (ui / uSteps) * Math.PI * 2,
        v: (vi / vSteps) * Math.PI * 2,
        signal: Math.random() < preset.signalChance,
      });
    }
  }

  let width = 0;
  let height = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    const rect = parent!.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(parent);

  let tiltX = 0;
  let tiltY = 0;
  let targetTiltX = 0;
  let targetTiltY = 0;

  function onMove(event: MouseEvent) {
    targetTiltX = (event.clientX / window.innerWidth - 0.5) * 1.0;
    targetTiltY = (event.clientY / window.innerHeight - 0.5) * 0.7;
  }
  if (preset.reactive && !prefersReducedMotion) window.addEventListener("mousemove", onMove);

  const start = performance.now();

  function draw(now: number) {
    const elapsed = now - start;
    const t = elapsed / 1000;

    if (preset.reactive) {
      tiltX += (targetTiltX - tiltX) * 0.06;
      tiltY += (targetTiltY - tiltY) * 0.06;
    }

    const entranceT = preset.entranceMs > 0 ? EASE_OUT_EXPO(Math.min(1, elapsed / preset.entranceMs)) : 1;

    ctx!.clearRect(0, 0, width, height);

    const rotY = (prefersReducedMotion ? 0.5 : t * preset.rotationSpeed + entranceT * 0.9) + tiltX;
    const rotX = preset.baseTilt + tiltY;
    const bob = prefersReducedMotion ? 0 : Math.sin(t * (Math.PI / 4)) * preset.bob;

    const scale = Math.min(width, height) * preset.scaleFactor * (0.55 + entranceT * 0.45);
    const cx = width * (isCompact ? preset.anchorXCompact : preset.anchorX);
    const cy = height * preset.anchorY + bob;

    if (preset.halo) {
      const haloR = Math.min(width, height) * 0.62;
      const halo = ctx!.createRadialGradient(cx, cy, 0, cx, cy, haloR);
      halo.addColorStop(0, `rgba(${preset.palette.haloSignal}, ${0.16 * entranceT})`);
      halo.addColorStop(0.4, `rgba(${preset.palette.haloCore}, ${0.22 * entranceT})`);
      halo.addColorStop(1, "rgba(23, 16, 53, 0)");
      ctx!.fillStyle = halo;
      ctx!.fillRect(0, 0, width, height);
    }

    const projected: Projected[] = nodes.map((n) => {
      const p = project(n.u, n.v, preset.minorRadius, rotY, rotX);
      return { ...n, sx: cx + p.x * scale, sy: cy + p.y * scale, depth: p.z };
    });

    const maxDepth = MAJOR_RADIUS + preset.minorRadius;
    ctx!.lineWidth = 1;
    for (let ui = 0; ui < uSteps; ui++) {
      for (let vi = 0; vi < vSteps; vi++) {
        const i = ui * vSteps + vi;
        const a = projected[i];
        const depthT = Math.max(0, Math.min(1, (a.depth + maxDepth) / (2 * maxDepth)));
        ctx!.strokeStyle = `rgba(${preset.palette.meshLine}, ${(0.04 + depthT * 0.09) * preset.lineAlpha * entranceT})`;

        const right = projected[((ui + 1) % uSteps) * vSteps + vi];
        ctx!.beginPath();
        ctx!.moveTo(a.sx, a.sy);
        ctx!.lineTo(right.sx, right.sy);
        ctx!.stroke();

        const down = projected[ui * vSteps + ((vi + 1) % vSteps)];
        ctx!.beginPath();
        ctx!.moveTo(a.sx, a.sy);
        ctx!.lineTo(down.sx, down.sy);
        ctx!.stroke();
      }
    }

    if (preset.glow) ctx!.globalCompositeOperation = "lighter";
    for (const p of projected) {
      const depthT = Math.max(0, Math.min(1, (p.depth + maxDepth) / (2 * maxDepth)));
      const size = p.signal ? 1.7 + depthT * 1.6 : 0.8 + depthT * 1.1;
      const color = p.signal ? preset.palette.signal : preset.palette.nodeDim;
      const alpha = (p.signal ? 0.55 + depthT * 0.45 : 0.22 + depthT * 0.5) * preset.nodeAlpha * entranceT;

      ctx!.beginPath();
      ctx!.fillStyle = `rgba(${color}, ${alpha})`;
      if (preset.glow && p.signal && depthT > 0.55) {
        ctx!.shadowColor = `rgba(${preset.palette.signalBright}, 0.85)`;
        ctx!.shadowBlur = 9;
      } else {
        ctx!.shadowBlur = 0;
      }
      ctx!.arc(p.sx, p.sy, size, 0, Math.PI * 2);
      ctx!.fill();
    }
    ctx!.shadowBlur = 0;
    ctx!.globalCompositeOperation = "source-over";
  }

  let raf = 0;
  let lastFrameTime = 0;
  const frameInterval = 1000 / preset.fps;
  const canAnimate = !prefersReducedMotion && (preset.entranceMs > 0 || preset.rotationSpeed > 0);

  draw(performance.now());

  function loop(now: number) {
    if (now - lastFrameTime >= frameInterval) {
      lastFrameTime = now;
      draw(now);
    }
    raf = requestAnimationFrame(loop);
  }

  /*
    Only spend main-thread/GPU budget on canvases actually on screen - a long
    page can carry several of these (hero + one `BrandNodeField` per dark
    section), so idle ones must not keep animating below/above the fold.
  */
  let intersectionObserver: IntersectionObserver | null = null;
  if (canAnimate) {
    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!raf) raf = requestAnimationFrame(loop);
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "200px" },
    );
    intersectionObserver.observe(canvas);
  }

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("mousemove", onMove);
    resizeObserver.disconnect();
    intersectionObserver?.disconnect();
  };
}
