import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { reserveCvJourneyHeight } from './cv-woning-layout';

/**
 * Mount a reversible scene within the actual cv-ketel page.
 * @param {HTMLElement} section
 * @returns {() => void}
 */
export function mountCvWoning(section) {
const mount = section.querySelector('[data-scene-canvas]');
const status = section.querySelector('[data-scene-status]');
const copy = [...section.querySelectorAll('[data-beat]')];
const gasNote = section.querySelector('#cvw-gas-note');
const gasAnnotation = section.querySelector('#cvw-annotation');
const gasLeader = section.querySelector('#cvw-gas-leader');
const gasMarker = section.querySelector('#cvw-gas-marker');
const gasMarkerRing = section.querySelector('#cvw-gas-ring');
const markLayer = section.querySelector('#cvw-marks');
const markLines = section.querySelector('#cvw-mark-lines');
/* Where each label sits relative to the point it names, and when it arrives.
   The five connections fan out below the pipes on two rows so five labels can
   stand beside each other; the flue's two pipes split left and right. */
const MARK_PLAN = {
  // Aim at the foot of each pipe, not at the valve: a label sits below, and a
  // leader drawn from the valve would run straight through the pipe it names.
  '01-cv-aanvoer-koperen-leiding': { dx: 0, dy: 78, at: .800, out: [.90, .94], aim: { x: .5, y: .05, z: .5 } },
  '02-warm-water-koperen-leiding': { dx: 0, dy: 126, at: .810, out: [.90, .94], aim: { x: .5, y: .05, z: .5 } },
  '03-gas-koperen-leiding':        { dx: 0, dy: 78, at: .820, out: [.90, .94], aim: { x: .5, y: .05, z: .5 } },
  '04-koud-water-koperen-leiding': { dx: 0, dy: 126, at: .830, out: [.90, .94], aim: { x: .5, y: .05, z: .5 } },
  '05-cv-retour-koperen-leiding':  { dx: 0, dy: 78, at: .840, out: [.90, .94], aim: { x: .5, y: .05, z: .5 } },
  // Approach each pipe from the side it is nearest to, so the leader touches
  // the silhouette instead of crossing the shell.
  'concentrisch-binnenbuis':       { dx: -205, dy: -35, at: .912, out: [.958, .978], aim: { x: .12, y: .70, z: .5 } },
  'concentrisch-buitenbuis':       { dx:  185, dy:  60, at: .922, out: [.964, .984], aim: { x: .88, y: .28, z: .5 } },
};
const marks = [...(markLayer?.querySelectorAll('[data-mark]') || [])].map(el => ({
  el, name: el.dataset.mark, plan: MARK_PLAN[el.dataset.mark], anchor: null,
  path: document.createElementNS('http://www.w3.org/2000/svg', 'path'),
  dot: document.createElementNS('http://www.w3.org/2000/svg', 'circle'),
})).filter(mark => mark.plan);
for (const mark of marks) {
  mark.dot.setAttribute('r', '2.5');
  markLines?.append(mark.path, mark.dot);
}
const projectedMark = new THREE.Vector3();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const abort = new AbortController();
let disposed = false;
let loaded = false;
let started = false;
let animationFrame = 0;
let resizeFrame = 0;
let readySent = false;
let lastHeaderBottom = 0;
let gasAnchor;
let gasVisibility = 0;
const projectedGas = new THREE.Vector3();
const state = { ready: false, progress: 0, visualProgress: 0, lastVisualTime: 0, width: 1, height: 1, pageHeight: 1, scrollRange: 1, frames: [], needsRender: true };
const flueShells = [];
const flueTint = new THREE.Color(0x769eb9);
const clockPos = new THREE.Vector3();
const clockQuat = new THREE.Quaternion();
const targetPos = new THREE.Vector3();
const targetQuat = new THREE.Quaternion();
let renderer;
let scene;
let camera;

function announceReady() {
  if (readySent || disposed) return;
  readySent = true;
  section.dataset.ready = 'true';
  section.dispatchEvent(new Event('cvw:ready'));
}

function readMode() {
  const wasBelow = section.getBoundingClientRect().bottom < window.innerHeight * .3;
  const previousHeight = section.offsetHeight;
  section.dataset.mode = 'static';
  section.style.removeProperty('height');
  for (const el of [...copy, gasNote]) {
    el.removeAttribute('style');
    el.removeAttribute('aria-hidden');
  }
  if (wasBelow) {
    const top = window.scrollY + section.offsetHeight - previousHeight;
    if (window.__lenis) window.__lenis.scrollTo(top, { immediate: true, force: true });
    else window.scrollTo({ top, behavior: 'instant' });
  }
  announceReady();
}

function showError(error) {
  if (disposed || error?.name === 'AbortError') return;
  console.error('CV woning:', error);
  state.ready = false;
  readMode();
  status.textContent = 'De interactieve woning is niet beschikbaar. Je kunt alle uitleg hieronder lezen.';
}

function copyTop(el) {
  const top = section.getBoundingClientRect().top;
  const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0;
  const protectedTop = Math.max(0, headerBottom - Math.max(0, top));
  const bottomSpace = state.width < 700 ? 85 : 36;
  const available = state.height - Math.max(headerBottom, top, 0) - bottomSpace;
  return protectedTop + Math.max(35, Math.min(available * .13, available - el.offsetHeight - 16));
}

function sizeScene() {
  if (disposed || section.dataset.mode === 'static') return;
  const alreadyReading = section.getBoundingClientRect().bottom < window.innerHeight * .3;
  const delta = reserveCvJourneyHeight(section);
  // A late model/font load must not move text after someone skips the story.
  if (alreadyReading && delta) {
    const top = window.scrollY + delta;
    if (window.__lenis) window.__lenis.scrollTo(top, { immediate: true, force: true });
    else window.scrollTo({ top, behavior: 'instant' });
  }
  state.width = section.clientWidth;
  state.height = window.innerHeight;
  state.pageHeight = section.clientHeight;
  state.scrollRange = Math.max(1, state.pageHeight - state.height);
  if (renderer && camera) {
    const gl = renderer.getContext();
    const maxBuffer = Math.min(renderer.capabilities.maxTextureSize, gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
    // Keep the existing scroll composition, but allocate pixels only for the
    // visible frame. A page-height buffer made the detailed kitchen blurry.
    const memoryRatio = Math.sqrt(4_500_000 / (state.width * state.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75, memoryRatio, maxBuffer / state.height, maxBuffer / state.width);
    renderer.setPixelRatio(dpr);
    renderer.setSize(state.width, state.height, false);
    renderer.domElement.style.height = `${state.height}px`;
    camera.aspect = state.width / state.height;
    camera.updateProjectionMatrix();
  }
  updateFromScroll();
  state.needsRender = true;
  updateCopy();
  window.__lenis?.resize();
}

function scheduleResize() {
  if (resizeFrame || disposed) return;
  resizeFrame = requestAnimationFrame(() => { resizeFrame = 0; sizeScene(); });
}

function disposeObject(root) {
  const resources = new Set();
  if (root.background?.isTexture) resources.add(root.background);
  if (root.environment?.isTexture) resources.add(root.environment);
  root.traverse(object => {
    if (object.geometry) resources.add(object.geometry);
    for (const material of (Array.isArray(object.material) ? object.material : object.material ? [object.material] : [])) {
      resources.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) resources.add(value);
    }
    object.shadow?.dispose();
  });
  for (const resource of resources) resource.dispose();
}

function clamp(value, min = 0, max = 1) { return Math.max(min, Math.min(max, value)); }
function ease(a, b, value) { const t = clamp((value - a) / (b - a)); return t * t * (3 - 2 * t); }
function scrollOffset() { return clamp(-section.getBoundingClientRect().top, 0, state.scrollRange); }

/* The lines a block reveals one after another. The opening owns its own
   scripted intro, so it is driven whole and never per line. */
const copyLines = copy.map(el => el.classList.contains('cvw-opening')
  ? null
  : [...el.children].filter(node => node.nodeType === 1 && !(node instanceof SVGElement)));

function updateCopy() {
  const offset = scrollOffset();
  const p = state.visualProgress;
  // Beat 3 used to leave (.768-.814) while beat 4 arrived (.772-.815), in the
  // same place: both sat half-transparent on top of each other and neither
  // could be read. A block now finishes leaving before the next begins.
  const windows = [[-.10, 0, .27, .35], [.35, .42, .56, .625], [.625, .69, .74, .785], [.79, .845, .90, .94], [.900, .930, 1.10, 1.20]];
  for (const [i, el] of copy.entries()) {
    const w = windows[i];
    const arrival = ease(w[0], w[1], p);
    const departure = ease(w[2], w[3], p);
    const visible = arrival * (1 - departure);
    const top = copyTop(el);
    el.style.top = `${offset + top}px`;
    if (!state.ready || visible < .001) {
      el.style.opacity = '0';
      el.style.visibility = 'hidden';
      el.setAttribute('aria-hidden', 'true');
      el.style.pointerEvents = 'none';
      continue;
    }
    el.style.visibility = 'visible';
    // Leaving is not arriving reversed. The camera has moved on, so the whole
    // block recedes and softens at once, and faster than it came.
    el.style.opacity = (1 - departure).toFixed(3);
    el.style.transform = `translate3d(0, ${(-departure * 15).toFixed(1)}px, 0) scale(${(1 - departure * .022).toFixed(4)})`;
    el.style.filter = departure > .001 ? `blur(${(departure * 7).toFixed(2)}px)` : 'none';
    el.style.setProperty('--cvw-rule', ease(0, 1, arrival).toFixed(3));
    el.setAttribute('aria-hidden', visible < .05 ? 'true' : 'false');
    el.style.pointerEvents = visible > .8 ? 'auto' : 'none';
    // Arriving is composed: each line is uncovered from below, a beat after
    // the one above it, as though the movement set them down in order.
    const lines = copyLines[i];
    if (!lines) continue;
    for (const [j, line] of lines.entries()) {
      const t = ease(0, 1, clamp((arrival - j * .085) / .62));
      line.style.opacity = t.toFixed(3);
      line.style.transform = `translate3d(0, ${((1 - t) * 22).toFixed(1)}px, 0)`;
      line.style.clipPath = t > .999 ? 'none' : `inset(${((1 - t) * 100).toFixed(1)}% 0 0 0)`;
      line.style.filter = t > .999 ? 'none' : `blur(${((1 - t) * 3.4).toFixed(2)}px)`;
    }
  }
  const arrival = ease(state.width < 700 ? .807 : .791, .836, p);
  const departure = ease(.904, .945, p);
  gasVisibility = state.ready ? arrival * (1 - departure) : 0;
  const top = copyTop(gasNote);
  gasNote.style.top = `${offset + top}px`;
  gasNote.style.opacity = gasVisibility.toFixed(3);
  gasNote.style.setProperty('--cvw-rule', ease(0, 1, arrival).toFixed(3));
  gasNote.style.transform = `translate3d(${((1 - arrival) * 100 + departure * 90).toFixed(1)}px, ${((1 - arrival) * 18).toFixed(1)}px, 0)`;
  gasNote.setAttribute('aria-hidden', gasVisibility < .05 ? 'true' : 'false');
  gasNote.style.pointerEvents = gasVisibility > .8 ? 'auto' : 'none';
  // The last stretch dissolves the picture into the paper the text section
  // starts on, so the story hands over instead of stopping at a clip edge.
  section.style.setProperty('--cvw-outro', ease(.955, 1, p).toFixed(3));
  drawMarks();
  gasAnnotation.style.top = `${offset}px`;
  gasAnnotation.style.height = `${state.height}px`;
  gasAnnotation.setAttribute('viewBox', `0 0 ${state.width} ${state.height}`);
}

function updateFromScroll() {
  const progress = scrollOffset() / state.scrollRange;
  const top = section.getBoundingClientRect().top;
  if (Math.abs(progress - state.progress) > .000001 || top !== state.lastTop) state.needsRender = true;
  state.progress = progress;
  state.lastTop = top;
}

function applyCamera() {
  const frames = state.frames;
  const progress = state.visualProgress;
  let low = 0;
  let high = frames.length - 1;
  while (low + 1 < high) {
    const middle = (low + high) >> 1;
    if (frames[middle].p <= progress) low = middle;
    else high = middle;
  }
  const a = frames[low];
  const b = frames[high];
  const t = a.p === b.p ? 0 : clamp((progress - a.p) / (b.p - a.p));
  clockPos.fromArray(a.position);
  targetPos.fromArray(b.position);
  clockQuat.fromArray(a.quaternion).normalize();
  targetQuat.fromArray(b.quaternion).normalize();
  camera.position.copy(clockPos.lerp(targetPos, t));
  camera.quaternion.copy(clockQuat.slerp(targetQuat, t));
  const baseFov = THREE.MathUtils.lerp(a.fov, b.fov, t);
  // Preserve the product's horizontal framing in a narrower browser panel.
  const mobileGasFocus = state.width < 700 ? ease(.78, .838, progress) * (1 - ease(.90, .95, progress)) : 0;
  const framing = Math.max(1, (1.6 - .35 * mobileGasFocus) / camera.aspect);
  camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(baseFov) / 2) * framing));
  camera.clearViewOffset();
  if (state.width < 700) camera.setViewOffset(state.width, state.height, 0, -state.height * .19, state.width, state.height);
  camera.updateProjectionMatrix();
}

function updateGasLeader() {
  if (!gasAnchor || gasVisibility < .005 || state.width < 700) {
    gasAnnotation.style.opacity = '0';
    return;
  }
  camera.updateMatrixWorld();
  projectedGas.copy(gasAnchor).project(camera);
  if (projectedGas.z < -1 || projectedGas.z > 1) { gasAnnotation.style.opacity = '0'; return; }
  const x = (projectedGas.x * .5 + .5) * state.width;
  const y = (-projectedGas.y * .5 + .5) * state.height;
  const note = gasNote.getBoundingClientRect();
  const endY = note.top + 39;
  gasLeader.setAttribute('d', `M ${x.toFixed(1)} ${y.toFixed(1)} L ${(x + 20).toFixed(1)} ${y.toFixed(1)} L ${(note.left - 20).toFixed(1)} ${endY.toFixed(1)} L ${note.left.toFixed(1)} ${endY.toFixed(1)}`);
  for (const marker of [gasMarker, gasMarkerRing]) { marker.setAttribute('cx', x.toFixed(1)); marker.setAttribute('cy', y.toFixed(1)); }
  gasAnnotation.style.opacity = gasVisibility.toFixed(3);
}

function drawMarks() {
  if (!markLayer || !markLines) return;
  const offset = scrollOffset();
  markLayer.style.top = `${offset}px`;
  markLines.style.top = `${offset}px`;
  markLines.setAttribute('viewBox', `0 0 ${state.width} ${state.height}`);
  if (state.width < 700 || !state.ready) { markLines.style.opacity = '0'; return; }
  const p = state.visualProgress;
  let anyVisible = 0;
  for (const mark of marks) {
    const { el, plan, anchor } = mark;
    if (!anchor) { el.style.opacity = '0'; continue; }
    const visible = ease(plan.at, plan.at + .018, p) * (1 - ease(plan.out[0], plan.out[1], p));
    if (visible < .004) {
      el.style.opacity = '0';
      mark.path.setAttribute('d', 'M0 0');
      mark.dot.setAttribute('r', '0');
      continue;
    }
    projectedMark.copy(anchor).project(camera);
    if (projectedMark.z < -1 || projectedMark.z > 1) {
      el.style.opacity = '0';
      mark.path.setAttribute('d', 'M0 0');
      mark.dot.setAttribute('r', '0');
      continue;
    }
    const x = (projectedMark.x * .5 + .5) * state.width;
    const y = (-projectedMark.y * .5 + .5) * state.height;
    const lx = x + plan.dx;
    const ly = y + plan.dy;
    el.style.opacity = visible.toFixed(3);
    el.style.left = `${lx.toFixed(1)}px`;
    el.style.top = `${ly.toFixed(1)}px`;
    // Down (or across) from the point, then along to the label: a dimension
    // leader, the same hand as the gas note's.
    const midY = (y + ly) / 2;
    mark.path.setAttribute('d', `M ${x.toFixed(1)} ${y.toFixed(1)} L ${x.toFixed(1)} ${midY.toFixed(1)} L ${lx.toFixed(1)} ${midY.toFixed(1)} L ${lx.toFixed(1)} ${(ly + (ly > y ? -14 : 14)).toFixed(1)}`);
    mark.dot.setAttribute('cx', x.toFixed(1));
    mark.dot.setAttribute('cy', y.toFixed(1));
    mark.dot.setAttribute('r', (2.5 * visible).toFixed(2));
    anyVisible = Math.max(anyVisible, visible);
  }
  markLines.style.opacity = anyVisible.toFixed(3);
}

function applyFlueReveal() {
  const reveal = ease(.936, .985, state.visualProgress);
  for (const { object, materials, colors, castShadow } of flueShells) {
    for (const [index, material] of materials.entries()) {
      const transparent = reveal > .001;
      if (material.transparent !== transparent) {
        material.transparent = transparent;
        material.depthWrite = !transparent;
        material.needsUpdate = true;
      }
      material.opacity = 1 - .72 * reveal;
      material.color.copy(colors[index]).lerp(flueTint, reveal * .8);
    }
    const nextShadow = castShadow && reveal < .02;
    if (object.castShadow !== nextShadow) {
      object.castShadow = nextShadow;
      renderer.shadowMap.needsUpdate = true;
    }
  }
}

function render(force = false) {
  const rect = section.getBoundingClientRect();
  if (!force && (rect.bottom <= 0 || rect.top >= state.height)) return;
  const offset = clamp(-rect.top, 0, state.scrollRange);
  applyCamera();
  applyFlueReveal();
  updateGasLeader();
  renderer.setScissorTest(false);
  renderer.clear();
  renderer.domElement.style.transform = `translate3d(0, ${offset}px, 0)`;
  renderer.setViewport(0, 0, state.width, state.height);
  renderer.setScissor(0, 0, state.width, state.height);
  renderer.setScissorTest(true);
  renderer.render(scene, camera);
  state.needsRender = false;
  announceReady();
}

function tick(time) {
  if (disposed || section.dataset.mode !== 'animated') return;
  updateFromScroll();
  const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0;
  if (Math.abs(headerBottom - lastHeaderBottom) > .1) state.needsRender = true;
  lastHeaderBottom = headerBottom;
  const dt = state.lastVisualTime ? Math.min((time - state.lastVisualTime) / 1000, .05) : 1 / 60;
  state.lastVisualTime = time;
  const difference = state.progress - state.visualProgress;
  if (Math.abs(difference) > .000001) {
    state.visualProgress = window.__lenis || Math.abs(difference) < .00002
      ? state.progress : state.visualProgress + difference * (1 - Math.exp(-dt * 12));
    state.needsRender = true;
  }
  if (state.ready && state.needsRender) { updateCopy(); render(); }
}

async function init() {
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0xf4f0e9, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    renderer.domElement.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      showError(new Error('WebGL context lost'));
    }, { signal: abort.signal });
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf4f0e9);
    camera = new THREE.PerspectiveCamera(50, 1, .04, 100);

    const [gltf, motionResponse, garden, chair, hall, lampResponse] = await Promise.all([
      new GLTFLoader().loadAsync('/models/cv-woning/woning.glb?v=hal-01'),
      fetch('/models/cv-woning/motion.json', { signal: abort.signal }),
      new HDRLoader().loadAsync('/models/cv-woning/tuin.hdr'),
      new GLTFLoader().loadAsync('/models/cv-woning/stoel-rechts.glb?v=hal-01'),
      new GLTFLoader().loadAsync('/models/cv-woning/hal-trap.glb?v=hal-01'),
      fetch('/models/cv-woning/hal-lampen.json?v=hal-01', { signal: abort.signal }),
    ]);
    if (disposed) {
      for (const model of [gltf, chair, hall]) disposeObject(model.scene);
      garden.dispose();
      return;
    }
    if (!motionResponse.ok) throw new Error(`Camera route could not load (${motionResponse.status})`);
    if (!lampResponse.ok) throw new Error(`Hall lighting could not load (${lampResponse.status})`);
    const hallLamps = await lampResponse.json();
    // Room finishes are a separate asset. Replace only explicitly named hall
    // surfaces; the kitchen's original mesh buffers and baked atlas stay intact.
    const originalObjects = new Map();
    gltf.scene.traverse(object => originalObjects.set(object.userData.name || object.name, object));
    hall.scene.traverse(object => {
      if (!object.userData.replaces) return;
      const original = originalObjects.get(object.userData.replaces);
      if (!original) throw new Error(`Missing hall surface: ${object.userData.replaces}`);
      original.visible = false;
    });
    gltf.scene.add(chair.scene, hall.scene);
    const motion = await motionResponse.json();
    if (motion.coordinates !== 'three-y-up' || !Array.isArray(motion.frames) || motion.frames.length < 2) throw new Error('Invalid camera route');
    for (const frame of motion.frames) {
      if (!Number.isFinite(frame.p) || !Number.isFinite(frame.fov) || frame.position?.length !== 3 || frame.quaternion?.length !== 4 || ![...frame.position, ...frame.quaternion].every(Number.isFinite)) throw new Error('Invalid camera frame');
    }
    state.frames = [...motion.frames].sort((a, b) => a.p - b.p);
    const finishedFloors = new Set();
    const ceilingFinishes = new Map();
    gltf.scene.traverse(object => {
      if (object.isMesh) {
        // Ceilings share their exported paint with walls. Give only the ceiling
        // meshes a matte taupe finish, including the join beside the stairs.
        const surfaceName = object.userData.name || object.name;
        if (/^(Gestuct[ _]plafond|Plafondafwerking[ _]naast[ _]trap)/.test(surfaceName)) {
          const finishCeiling = material => {
            if (!ceilingFinishes.has(material)) {
              const finish = material.clone();
              finish.name = `${material.name} — plafond taupe`;
              finish.color.set(0xc7bbab);
              finish.roughness = .92;
              finish.envMapIntensity = .65;
              ceilingFinishes.set(material, finish);
            }
            return ceilingFinishes.get(material);
          };
          object.material = Array.isArray(object.material)
            ? object.material.map(finishCeiling) : finishCeiling(object.material);
        }
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        object.castShadow = !materials.some(material => material.transmission > .02 || material.opacity < .7);
        object.receiveShadow = true;
        let owner = object;
        while (owner && !owner.userData.cv_baked_surface) owner = owner.parent;
        for (const material of materials) {
          // These textures already carry the approved Blender light and color
          // treatment. Avoid applying a second exposure/contrast curve.
          if (owner) material.toneMapped = false;
          // Tint the original oak albedo once; all planks share this material.
          // Its grain, scale and normal map remain in the supplied export.
          if (material.name === 'K — eiken parket' && !finishedFloors.has(material)) {
            material.color.multiply(new THREE.Color().setRGB(.64, .54, .44));
            material.roughness = .6;
            material.envMapIntensity = .7;
            finishedFloors.add(material);
          }
          if (material.map) material.map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        }
      }
      // Camera movement comes only from the shared, editable route.
      if (object.isCamera) object.visible = false;
    });
    scene.add(gltf.scene);
    gltf.scene.updateMatrixWorld(true);
    const gasValve = gltf.scene.getObjectByName('03-gas-afsluiter-hendel');
    if (gasValve) gasAnchor = new THREE.Box3().setFromObject(gasValve).getCenter(new THREE.Vector3());
    for (const mark of marks) {
      const target = gltf.scene.getObjectByName(mark.name);
      if (!target) continue;
      const box = new THREE.Box3().setFromObject(target);
      const aim = mark.plan.aim || { x: .5, y: .5, z: .5 };
      mark.anchor = new THREE.Vector3(
        box.min.x + (box.max.x - box.min.x) * aim.x,
        box.min.y + (box.max.y - box.min.y) * aim.y,
        box.min.z + (box.max.z - box.min.z) * aim.z,
      );
    }
    gltf.scene.traverse(object => {
      if (!object.isMesh) return;
      let owner = object;
      while (owner && owner.userData.scroll_transparency_role !== 'flue-shell') owner = owner.parent;
      if (!owner) return;
      const original = Array.isArray(object.material) ? object.material : [object.material];
      const materials = original.map(material => material.clone());
      object.material = Array.isArray(object.material) ? materials : materials[0];
      flueShells.push({ object, materials, colors: materials.map(material => material.color.clone()), castShadow: object.castShadow });
    });

    const studio = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(studio, .04).texture;
    scene.environmentIntensity = .32;
    garden.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = garden;
    scene.backgroundIntensity = .65;
    scene.backgroundRotation.y = THREE.MathUtils.degToRad(-210);
    const kitchenReflections = pmrem.fromEquirectangular(garden).texture;
    gltf.scene.traverse(object => {
      for (const material of (Array.isArray(object.material) ? object.material : object.material ? [object.material] : [])) {
        // Outdoor reflections belong on glass and metal. Interior paint and
        // timber use the neutral room environment instead of unoccluded grass.
        if (material.isMeshStandardMaterial && material.name.startsWith('K —') && (material.metalness >= .2 || material.transmission > 0)) {
          material.envMap = kitchenReflections;
          material.envMapIntensity = .5;
          material.envMapRotation.y = THREE.MathUtils.degToRad(-210);
        }
      }
    });
    studio.dispose();
    pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xfff1e1, 0x9b8269, .68));
    scene.add(new THREE.AmbientLight(0xfff0de, .10));
    const daylight = new THREE.DirectionalLight(0xfff0dc, 1.65);
    daylight.position.set(2, 7, -11);
    daylight.target.position.set(2.5, 1, -4);
    daylight.castShadow = true;
    daylight.shadow.mapSize.set(2048, 2048);
    Object.assign(daylight.shadow.camera, { left: -7, right: 7, top: 8, bottom: -8, near: .2, far: 24 });
    daylight.shadow.bias = -.00025;
    daylight.shadow.normalBias = .006;
    scene.add(daylight, daylight.target);

    // Six spot-shadow maps leave room for the sun, environment, two area-light
    // lookup textures, and material maps on GPUs with 16 fragment texture units.
    // Eleven spot shadows required 17 samplers for the oak floor: it failed to draw.
    const interiorLights = [
      { position: [4.6, 2.4, -8.3], target: [.5, 1.1, -7.4], intensity: 18, mapSize: 1024 },
      { position: [2, 2.2, -.25], target: [1.8, 1, -3.2], intensity: 13, mapSize: 1024, color: 0xffe5c4, shadows: true },
      { position: [2.4, 1.70, -2.475], target: [2.4, .79, -2.475], intensity: 6.5, mapSize: 512, color: 0xffd5a4 },
      { position: [.99, 2.64, -1.35], target: [.35, .95, -1.35], intensity: 4.4, mapSize: 512, color: 0xffdfb7 },
      { position: [.99, 2.64, -3.3], target: [.35, .95, -3.3], intensity: 4.4, mapSize: 512, color: 0xffdfb7 },
      { position: [4.5, 2.4, -.3], target: [5.5, 1.5, -2.7], intensity: 10, mapSize: 512, color: 0xffe8cf, shadows: true },
      { position: [5.4, 5.1, -5.6], target: [5.4, 3.5, -3.6], intensity: 15, mapSize: 512, shadows: true },
      { position: [2, 4.85, -8.65], target: [2, 3.4, -6.8], intensity: 18, mapSize: 1024, color: 0xeef3ff, shadows: true },
      { position: [3.5, 5.2, -5.9], target: [1, 3.4, -7.3], intensity: 10, mapSize: 1024 },
      { position: [2.1, 5.1, -2.1], target: [.63, 3.9, -.35], intensity: 14, mapSize: 1024, shadows: true },
      { position: [1.8, 5.7, -1.8], target: [.63, 5.1, -.35], intensity: 12, mapSize: 512, shadows: true },
    ];
    for (const config of interiorLights) {
      const fill = new THREE.SpotLight(config.color || 0xfff2e3, config.intensity, 10, 1.15, .85, 2);
      fill.position.fromArray(config.position);
      fill.target.position.fromArray(config.target);
      fill.castShadow = Boolean(config.shadows);
      fill.shadow.mapSize.set(config.mapSize, config.mapSize);
      fill.shadow.camera.near = .08;
      fill.shadow.camera.far = 10;
      fill.shadow.bias = -.0002;
      fill.shadow.normalBias = .005;
      scene.add(fill, fill.target);
    }
    // Short-range wall washers stay in the stairwell. They add no shadow maps
    // and cannot reach the kitchen, preserving its approved light and GPU budget.
    for (const config of hallLamps) {
      const light = new THREE.SpotLight(config.color, config.intensity, config.distance, config.angle, config.penumbra, 2);
      light.position.fromArray(config.position);
      light.target.position.fromArray(config.target);
      light.castShadow = false;
      scene.add(light, light.target);
    }
    RectAreaLightUniformsLib.init();
    for (const config of [
      { position: [3.5, 4.15, -8.08], target: [2, 3.3, -8.9], width: 1.4, height: 1.4, intensity: 1.3 },
      { position: [1.65, 3.7, -1], target: [.63, 3.25, -.28], width: 1, height: 1.2, intensity: 2.2 },
    ]) {
      const softbox = new THREE.RectAreaLight(0xfff5e8, config.intensity, config.width, config.height);
      softbox.position.fromArray(config.position);
      softbox.lookAt(...config.target);
      scene.add(softbox);
    }
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.needsUpdate = true;


    loaded = true;
    state.ready = true;
    if (reducedMotion.matches) readMode();
    else {
      section.dataset.mode = 'animated';
      status.textContent = '';
      sizeScene();
      state.visualProgress = state.progress;
      updateCopy();
      render(true);
    }
  } catch (error) { showError(error); }
}

function applyPreference() {
  if (reducedMotion.matches) { readMode(); return; }
  if (loaded) {
    section.dataset.mode = 'animated';
    state.ready = true;
    sizeScene();
  } else if (!started) {
    started = true;
    section.dataset.mode = 'loading';
    sizeScene();
    init();
  }
}
const observer = new ResizeObserver(scheduleResize);
for (const selector of ['#cv-vervolg', '.site-footer', '.site-header', '.topline']) {
  const element = document.querySelector(selector);
  if (element) observer.observe(element);
}
window.addEventListener('resize', scheduleResize, { passive: true, signal: abort.signal });
window.addEventListener('scroll', updateFromScroll, { passive: true, signal: abort.signal });
reducedMotion.addEventListener('change', applyPreference, { signal: abort.signal });
section.addEventListener('cvw:reset', () => {
  state.progress = 0;
  state.visualProgress = 0;
  state.needsRender = true;
  if (state.ready && section.dataset.mode === 'animated') { updateCopy(); render(); }
}, { signal: abort.signal });
document.fonts.ready.then(scheduleResize);
const updater = () => tick(performance.now());
const clock = () => { updater(); animationFrame = requestAnimationFrame(clock); };
if (window.__lenis) { window.__scrubUpdaters ??= []; window.__scrubUpdaters.push(updater); }
else animationFrame = requestAnimationFrame(clock);
applyPreference();

return () => {
  disposed = true;
  abort.abort();
  observer.disconnect();
  cancelAnimationFrame(animationFrame);
  cancelAnimationFrame(resizeFrame);
  if (window.__scrubUpdaters) window.__scrubUpdaters = window.__scrubUpdaters.filter(fn => fn !== updater);
  if (scene) disposeObject(scene);
  renderer?.dispose();
  renderer?.domElement.remove();
};
}
