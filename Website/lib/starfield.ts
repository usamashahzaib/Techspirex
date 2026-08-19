/*
  The hero's deep-field layer: a dense volume of stars wrapping the camera and
  streaming past as an endless tunnel, barrel-rolling slowly while the page
  scroll dives the camera forward down it and the cursor steers the heading and
  pushes nearby stars aside.

  WebGL, not Canvas 2D (unlike lib/node-field.ts): the tunnel is 4,200 additive
  point sprites through a three-composer bloom chain, which is a GPU job. That
  cost is why this renderer is hero-only - the quieter `BrandNodeField` mesh
  still carries the motif on every other dark section, so the site spends
  exactly one GPU context.

  Colors are the brand palette rather than the source scene's mint/jade: same
  value structure (soft accent / saturated accent / bone), inked in Techspirex
  cyan over brand-ink so the tunnel reads as this site and not a borrowed demo.

  `three` is pinned to 0.143.0 on purpose. This scene is built on WebGL1Renderer
  and pre-color-management output, both of which r163 removed - bumping the
  dependency does not just change numbers here, it changes what the hero looks
  like and will fail to compile. Port deliberately or not at all.
*/

import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";

const CONFIG = {
  bgColor: "#171035", // brand-ink
  flameColor: "#9eefff", // brand-cyan-pale
  flameColor2: "#c9bff0", // brand-lilac-bright
  flameAmt: 0.2,
  colorA: "#62e4ff", // brand-cyan-bright
  colorB: "#10d2f6", // brand-cyan
  colorC: "#faf7ee", // brand-cream
  opacity: 2,
  pointSize: 50,
  brightness: 1.85,
  drift: 2.35,
  twinkle: 1,
  spin: 0.03,
  repelRadius: 5,
  repelStrength: 0.35,
  scrollPush: 8,
  scrollDrift: 6,
  scrollSpin: 0.1,
  parallax: 0.6,
};

const LAYERS = { NONE: 0, TORUS_SCENE: 1, BLOOM_SCENE: 2, ENTIRE_SCENE: 3 };

const DEPTH = 30;
const COUNT = 4200;
const COUNT_COMPACT = 2400;

function hexToVec3(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

const vertexShader = /* glsl */ `
uniform float uTime; uniform float uSize; uniform float uDrift; uniform float uDepth; uniform float uTwinkle;
uniform vec3 uCursor; uniform float uRepelRadius; uniform float uRepelStrength; uniform float uActivity;
uniform vec3 uColorA; uniform vec3 uColorB; uniform vec3 uColorC;
attribute float aScale; attribute float aPhase; attribute float aPalette; attribute float aBright;
varying vec3 vColor; varying float vTwinkle;
void main() {
  vec3 pos = position;
  // Endless drift toward +Z with mod-wrap.
  pos.z = mod(pos.z + uDrift + (uDepth * 0.5), uDepth) - (uDepth * 0.5);

  float tw = sin(uTime * 1.6 + aPhase * 6.2831);
  vTwinkle = (1.0 - uTwinkle) + uTwinkle * (0.55 + 0.45 * tw);

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);

  vec3 toParticle = modelPosition.xyz - uCursor;
  float dist = length(toParticle);
  float falloff = smoothstep(uRepelRadius, 0.0, dist);
  modelPosition.xyz += normalize(toParticle + vec3(0.0001)) * falloff * uRepelStrength * uActivity;

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
  gl_PointSize = uSize * aScale;
  gl_PointSize *= (1.0 / -viewPosition.z);

  vec3 base = aPalette < 0.5 ? uColorA : (aPalette < 1.5 ? uColorB : uColorC);
  vColor = base * aBright;
}
`;

const fragmentShader = /* glsl */ `
uniform float uOpacity; uniform float uBrightness;
varying vec3 vColor; varying float vTwinkle;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float strength = pow(1.0 - d * 2.0, 4.0);
  vec3 color = mix(vec3(0.0), vColor, strength);
  gl_FragColor = vec4(color * uBrightness, strength * uOpacity * vTwinkle);
}
`;

/*
  Composite pass: paints the brand-ink ground and its animated corner flames,
  then sums the two bloom chains and the raw scene on top.
*/
const FINAL_PASS = {
  uniforms: {
    iTime: { value: 0 },
    tDiffuse: { value: null as THREE.Texture | null },
    torusTexture: { value: null as THREE.Texture | null },
    bloomTexture: { value: null as THREE.Texture | null },
    uBg: { value: hexToVec3(CONFIG.bgColor) },
    uFlameA: { value: hexToVec3(CONFIG.flameColor) },
    uFlameB: { value: hexToVec3(CONFIG.flameColor2) },
    uFlameAmt: { value: CONFIG.flameAmt },
  },
  vertexShader: /* glsl */ `
varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }
`,
  fragmentShader: /* glsl */ `
uniform float iTime; uniform sampler2D tDiffuse; uniform sampler2D bloomTexture; uniform sampler2D torusTexture;
uniform vec3 uBg; uniform vec3 uFlameA; uniform vec3 uFlameB; uniform float uFlameAmt;
varying vec2 vUv;
vec3 warp3d(vec3 pos, float t){ float curv=.8,a=1.9,b=0.7; pos*=2.;
  pos.x+=curv*sin(t+a*pos.y)+t*b; pos.y+=curv*cos(t+a*pos.x);
  pos.y+=curv*sin(t+a*pos.z)+t*b; pos.z+=curv*cos(t+a*pos.y);
  pos.z+=curv*sin(t+a*pos.x)+t*b; pos.x+=curv*cos(t+a*pos.z);
  return 0.5+0.5*cos(pos.xyz+vec3(1,2,4)); }
void main(){
  vec2 uv = 2.*vUv - 1.;
  vec3 w = pow(warp3d(vec3(uv.x, sin(uv.y), uv.y), iTime*1.5), vec3(1.5));
  vec3 flame = 1.5*uFlameA*w.x; flame*=w.y; flame += uFlameB*w.z;
  flame *= smoothstep(0.25, 1., abs(uv.y));
  float md = smoothstep(-0.7, 1., -uv.y*uv.x); flame *= md*md;
  vec3 bg = uBg * (1.0 - 0.4 * length(uv));
  gl_FragColor = vec4(bg + flame*uFlameAmt + texture2D(bloomTexture, vUv).xyz + texture2D(torusTexture, vUv).xyz + texture2D(tDiffuse, vUv).xyz, 1.);
}
`,
};

/*
  Returns a cleanup function, or `null` when the browser cannot give us a WebGL
  context - the caller uses that null to swap in the Canvas 2D fallback rather
  than leaving the hero with an empty box.
*/
export function mountStarfield(
  canvas: HTMLCanvasElement,
  prefersReducedMotion: boolean,
): (() => void) | null {
  let renderer: THREE.WebGL1Renderer;
  try {
    renderer = new THREE.WebGL1Renderer({ canvas, antialias: true });
  } catch {
    return null;
  }

  const size = () => ({
    width: canvas.clientWidth || 1,
    height: canvas.clientHeight || 1,
  });

  /*
    Capped rather than raw devicePixelRatio: two UnrealBloomPass chains at 3x on
    a phone is a dropped-frame hero, and point sprites this soft lose nothing
    perceptible above 1.5x.
  */
  const pixelRatio = () => Math.min(window.devicePixelRatio, 1.5);

  const initial = size();
  renderer.setPixelRatio(pixelRatio());
  renderer.setSize(initial.width, initial.height, false);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(45, initial.width / initial.height, 0.1, 80);
  camera.position.set(0, 0, 5);
  camera.layers.enable(LAYERS.TORUS_SCENE);
  camera.layers.enable(LAYERS.BLOOM_SCENE);
  camera.layers.enable(LAYERS.ENTIRE_SCENE);
  scene.add(camera);

  const count = initial.width < 768 ? COUNT_COMPACT : COUNT;

  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const phases = new Float32Array(count);
  const palette = new Float32Array(count);
  const bright = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 24;
    positions[i3 + 1] = (Math.random() - 0.5) * 16;
    positions[i3 + 2] = (Math.random() - 0.5) * DEPTH;
    palette[i] = Math.floor(Math.random() * 3);
    bright[i] = 0.7 + Math.random() * 0.6;
    scales[i] = 0.5 + Math.pow(Math.random(), 1.4) * 2.5;
    phases[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aScale", new THREE.Float32BufferAttribute(scales, 1));
  geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
  geometry.setAttribute("aPalette", new THREE.Float32BufferAttribute(palette, 1));
  geometry.setAttribute("aBright", new THREE.Float32BufferAttribute(bright, 1));

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: CONFIG.pointSize },
      uOpacity: { value: 0 },
      uDrift: { value: 0 },
      uDepth: { value: DEPTH },
      uTwinkle: { value: prefersReducedMotion ? 0 : CONFIG.twinkle },
      uCursor: { value: new THREE.Vector3() },
      uRepelRadius: { value: CONFIG.repelRadius },
      uRepelStrength: { value: CONFIG.repelStrength },
      uActivity: { value: 0 },
      uColorA: { value: hexToVec3(CONFIG.colorA) },
      uColorB: { value: hexToVec3(CONFIG.colorB) },
      uColorC: { value: hexToVec3(CONFIG.colorC) },
      uBrightness: { value: CONFIG.brightness },
    },
    vertexShader,
    fragmentShader,
  });

  const points = new THREE.Points(geometry, material);
  points.layers.enable(LAYERS.ENTIRE_SCENE);

  const group = new THREE.Group();
  group.add(points);
  scene.add(group);

  const renderScene = new RenderPass(scene, camera);

  const torusComposer = new EffectComposer(renderer);
  torusComposer.renderToScreen = false;
  torusComposer.addPass(renderScene);
  torusComposer.addPass(new ShaderPass(GammaCorrectionShader));
  torusComposer.addPass(new UnrealBloomPass(new THREE.Vector2(initial.width, initial.height), 0.22, 0.2, 0));
  torusComposer.addPass(new ShaderPass(CopyShader));

  const bloomComposer = new EffectComposer(renderer);
  bloomComposer.renderToScreen = false;
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(new UnrealBloomPass(new THREE.Vector2(initial.width, initial.height), 0.4, 0.55, 0));
  bloomComposer.addPass(new ShaderPass(GammaCorrectionShader));

  const finalPass = new ShaderPass(FINAL_PASS);
  finalPass.uniforms.bloomTexture.value = bloomComposer.renderTarget1.texture;
  finalPass.uniforms.torusTexture.value = torusComposer.renderTarget1.texture;

  const finalComposer = new EffectComposer(renderer);
  finalComposer.addPass(renderScene);
  finalComposer.addPass(finalPass);

  const composers = [torusComposer, bloomComposer, finalComposer];

  /*
    `EffectComposer.setSize` swaps in freshly cloned render targets and disposes
    the old pair, so the two textures the composite pass samples have to be
    re-pointed after every resize - otherwise the hero samples a disposed
    target the moment the window changes width.
  */
  function resizeComposers(width: number, height: number) {
    for (const composer of composers) {
      composer.setPixelRatio(pixelRatio());
      composer.setSize(width, height);
    }
    finalPass.uniforms.bloomTexture.value = bloomComposer.renderTarget1.texture;
    finalPass.uniforms.torusTexture.value = torusComposer.renderTarget1.texture;
  }

  resizeComposers(initial.width, initial.height);

  /* ------------------------------------------------------------- pointer */

  const POINTER = {
    ndc: new THREE.Vector2(0, 0),
    world: new THREE.Vector3(0, 0, 0),
    target: new THREE.Vector3(0, 0, 0),
    active: false,
    activity: 0,
    lastMove: 0,
  };
  const mouseSmooth = { x: 0, y: 0 };

  const rayPoint = new THREE.Vector3();
  const rayDir = new THREE.Vector3();

  function onMove(event: MouseEvent) {
    POINTER.ndc.x = (event.clientX / window.innerWidth) * 2 - 1;
    POINTER.ndc.y = -((event.clientY / window.innerHeight) * 2 - 1);
    POINTER.active = true;
    POINTER.lastMove = performance.now();
  }

  function onOut() {
    POINTER.active = false;
  }

  function updatePointer() {
    let resolved = false;

    if (POINTER.active) {
      rayPoint.set(POINTER.ndc.x, POINTER.ndc.y, 0.5).unproject(camera);
      rayDir.copy(rayPoint).sub(camera.position).normalize();

      if (Math.abs(rayDir.z) > 1e-4) {
        const t = -camera.position.z / rayDir.z;
        if (t > 0 && Number.isFinite(t)) {
          POINTER.target.copy(camera.position).addScaledVector(rayDir, t);
          resolved = true;
        }
      }
    }

    if (!resolved) POINTER.target.set(0, 0, 0);

    POINTER.world.lerp(POINTER.target, 0.12);

    const idle = (performance.now() - POINTER.lastMove) / 1000;
    const want = POINTER.active && idle < 3 ? 1 : 0;
    POINTER.activity += (want - POINTER.activity) * 0.06;

    material.uniforms.uCursor.value.copy(POINTER.world);
    material.uniforms.uActivity.value = POINTER.activity;
  }

  /* -------------------------------------------------------------- scroll */

  let scrollTarget = 0;
  let scrollSmooth = 0;
  let scrollCurrent = 0;

  /*
    Progress is measured across the hero's own height, not the whole document:
    the dive should complete exactly as the hero scrolls out of frame, which is
    the section's viewport-height box - not page 12,000px down on /insights.
  */
  function readScroll() {
    const rect = canvas.getBoundingClientRect();
    const span = rect.height || window.innerHeight;
    scrollTarget = Math.min(1, Math.max(0, -rect.top / span));
  }

  /* -------------------------------------------------------------- update */

  const appearStart = performance.now();
  let t0 = performance.now() / 1000;

  function updateScene() {
    const scroll = scrollCurrent;
    const m = mouseSmooth;

    const t = performance.now() / 1000;
    const dt = Math.min(0.05, t - t0);
    t0 = t;

    material.uniforms.uTime.value = t;
    material.uniforms.uDrift.value += dt * (CONFIG.drift + scroll * CONFIG.scrollDrift);

    camera.position.set(m.x * CONFIG.parallax, m.y * CONFIG.parallax, 5 - scroll * CONFIG.scrollPush);
    camera.lookAt(m.x * CONFIG.parallax, m.y * CONFIG.parallax, -10);

    const elapsed = performance.now() - appearStart;
    const fade = Math.min(1, Math.max(0, (elapsed - 300) / 1400));
    material.uniforms.uOpacity.value = fade * CONFIG.opacity;

    group.rotation.z += dt * (CONFIG.spin + scroll * CONFIG.scrollSpin);
  }

  function renderFrame() {
    finalPass.uniforms.iTime.value = performance.now() / 1000;
    camera.layers.set(LAYERS.TORUS_SCENE);
    torusComposer.render();
    camera.layers.set(LAYERS.BLOOM_SCENE);
    bloomComposer.render();
    camera.layers.set(LAYERS.ENTIRE_SCENE);
    finalComposer.render();
  }

  /* --------------------------------------------------------------- loops */

  let raf = 0;

  function loop() {
    raf = requestAnimationFrame(loop);

    scrollSmooth += (scrollTarget - scrollSmooth) * 0.1;
    scrollCurrent += (scrollSmooth - scrollCurrent) * 0.06;
    mouseSmooth.x += (POINTER.ndc.x - mouseSmooth.x) * 0.06;
    mouseSmooth.y += (POINTER.ndc.y - mouseSmooth.y) * 0.06;

    updatePointer();
    updateScene();
    renderFrame();
  }

  const resizeObserver = new ResizeObserver(() => {
    const { width, height } = size();
    renderer.setPixelRatio(pixelRatio());
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    resizeComposers(width, height);
    readScroll();
    if (prefersReducedMotion) renderFrame();
  });
  resizeObserver.observe(canvas);

  readScroll();

  /*
    Reduced motion: the tunnel still exists as a still starfield, but nothing
    drifts, twinkles, spins, or dives. One frame, drawn at full opacity.
  */
  if (prefersReducedMotion) {
    material.uniforms.uOpacity.value = CONFIG.opacity;
    renderFrame();

    return () => {
      resizeObserver.disconnect();
      dispose();
    };
  }

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseout", onOut);
  window.addEventListener("scroll", readScroll, { passive: true });

  /*
    The hero is one screen of a long page - once it is scrolled past there is
    no reason to keep a bloom chain running, so the loop is gated on
    visibility exactly like the node-field canvases.
  */
  const intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (!raf) {
          t0 = performance.now() / 1000;
          raf = requestAnimationFrame(loop);
        }
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    { rootMargin: "120px" },
  );
  intersectionObserver.observe(canvas);

  // r143's EffectComposer has no `dispose` of its own - its targets and the
  // passes holding their own buffers have to be released by hand.
  function dispose() {
    geometry.dispose();
    material.dispose();
    for (const composer of composers) {
      composer.renderTarget1.dispose();
      composer.renderTarget2.dispose();
      for (const pass of composer.passes) {
        (pass as { dispose?: () => void }).dispose?.();
      }
    }
    renderer.dispose();
    renderer.forceContextLoss();
  }

  return () => {
    cancelAnimationFrame(raf);
    raf = 0;
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseout", onOut);
    window.removeEventListener("scroll", readScroll);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    dispose();
  };
}
