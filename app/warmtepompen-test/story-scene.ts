import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { shots, storyFrame, cinematicCamera } from "./story-timeline";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export interface WarmtepompScene {
  progress(value: number, immediate?: boolean, reading?: number): void;
  visible(value: boolean): void;
  paused(value: boolean): void;
  dispose(): void;
}
const assets = [
  { file: "buitenunit-v4/buitenunit.glb", height: 1.1, turn: 0 },
  { file: "binnenunit.glb", height: .45, turn: 0 },
  { file: "hybride-v1/installatie.glb", height: 2.2, turn: Math.PI },
  { file: "handboek-v1/boilervat.glb", height: 1.75, turn: 0 },
  { file: "vaillant-buffer-v2/vaillant-buffervat.glb", height: .939, turn: 0 },
  { file: "handboek-v1/thermostaat.glb", height: .25, turn: 0 },
];
export async function createWarmtepompScene(host: HTMLElement, onProgress: (percent: number) => void, onError: () => void, signal: AbortSignal, onWaiting: (waiting: boolean) => void = () => {}): Promise<WarmtepompScene> {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.25 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = .85;
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .01, 60);
  // Fade the finished silhouette rather than each piece of its casing. A single
  // reusable target keeps depth-tested product interiors hidden during fades.
  const fadeTarget = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: true });
  fadeTarget.samples = Math.min(4, renderer.capabilities.maxSamples);
  const compositeScene = new THREE.Scene(), compositeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const compositeGeometry = new THREE.PlaneGeometry(2, 2);
  const compositeMaterial = new THREE.MeshBasicMaterial({ map: fadeTarget.texture, transparent: true, depthTest: false, depthWrite: false });
  compositeScene.add(new THREE.Mesh(compositeGeometry, compositeMaterial));
  const room = new RoomEnvironment(), pm = new THREE.PMREMGenerator(renderer);
  const environment = pm.fromScene(room, .04); room.dispose(); pm.dispose();
  scene.environment = environment.texture; scene.environmentIntensity = .65;
  scene.add(new THREE.HemisphereLight(0xf2f6ff, 0x334758, .85));
  const key = new THREE.DirectionalLight(0xffffff, 3.8); key.position.set(-3, 5, 5); scene.add(key);
  key.castShadow = true;
  const shadowSize = innerWidth < 700 ? 1024 : 2048; key.shadow.mapSize.set(shadowSize, shadowSize);
  Object.assign(key.shadow.camera, { left: -2.5, right: 2.5, top: 2.5, bottom: -2.5, near: .1, far: 14 });
  key.shadow.bias = -.0001; key.shadow.normalBias = .002;
  const fill = new THREE.DirectionalLight(0xb9d9ff, 2.2); fill.position.set(4, 2, -3); scene.add(fill);
  const models: (THREE.Group | undefined)[] = [];
  let disposed = false, loaded = false, visible = true, paused = false, complete = false;
  let hostWidth = 1, hostHeight = 1;
  let current = 0, target = 0, frame = 0, last = 0, completed = 0, reading = 0;
  const labels = assets.map(() => { const el = document.createElement("span"); el.className = "ws-model-label"; host.appendChild(el); return el; });
  const heatLabel = document.createElement("span"); heatLabel.className = "ws-model-label ws-heat-label"; heatLabel.textContent = "Naar uw verwarming"; host.appendChild(heatLabel);
  const path = new THREE.CurvePath<THREE.Vector3>();
  const corners = [[-.95,-.83,-.1],[-.95,-1.03,-.1],[.28,-1.03,-.1],[.28,-.74,-.1],[.28,-1.03,-.1],[1.35,-1.03,-.1]];
  for (let i = 1; i < corners.length; i++) path.add(new THREE.LineCurve3(new THREE.Vector3(...corners[i-1]), new THREE.Vector3(...corners[i])));
  const flowGeometry = new THREE.BufferGeometry().setFromPoints(path.getSpacedPoints(90));
  const flowMaterial = new THREE.LineBasicMaterial({ color: 0x90caff, transparent: true, opacity: .65, depthWrite: false });
  const flowLine = new THREE.Line(flowGeometry, flowMaterial); scene.add(flowLine);
  const routeGeometry = flowGeometry.clone(), routeMaterial = new THREE.LineBasicMaterial({ color: 0x97bbcf, transparent: true, opacity: .35, depthWrite: false });
  const routeLine = new THREE.Line(routeGeometry, routeMaterial); scene.add(routeLine);
  const markerGeometry = new THREE.SphereGeometry(.026, 8, 6), markerMaterial = new THREE.MeshBasicMaterial({ color: 0xbce1ff, transparent: true });
  const flowMarker = new THREE.Mesh(markerGeometry, markerMaterial); scene.add(flowMarker);
  const projected = new THREE.Vector3();
  const placeLabel = (el: HTMLElement, x: number, y: number, opacity: number) => {
    projected.set(x, y, 0).project(camera);
    const visible = opacity > .01 && Math.abs(projected.x) < .97 && Math.abs(projected.y) < .97;
    el.style.opacity = visible ? String(opacity) : "0";
    el.style.left = `${(projected.x + 1) * hostWidth / 2}px`;
    el.style.top = `${(1 - projected.y) * hostHeight / 2}px`;
  };
  const draw = () => {
    if (!complete && current > 0) { onWaiting(true); return; }
    onWaiting(false);
    const sample = storyFrame(current);
    const shot = cinematicCamera(current, reading);
    const distance = Math.max(shot.height, shot.width / camera.aspect) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) * 1.025;
    camera.position.set(Math.sin(shot.angle), shot.rise, Math.cos(shot.angle)).normalize().multiplyScalar(distance);
    camera.lookAt(0, 0, 0); camera.updateMatrixWorld();
    models.forEach((model, index) => {
      if (!model) return;
      const { x, y, opacity, name, visible } = sample.models[index];
      model.visible = visible;
      labels[index].textContent = name;
      const labelY = index === 2 ? y - .04 : y + assets[index].height / 2 + .1;
      placeLabel(labels[index], x, labelY, visible ? sample.labels * opacity : 0);
      if (!model.visible) return;
      model.position.set(x, y, 0);
    });
    flowLine.visible = flowMarker.visible = routeLine.visible = sample.flow > .01;
    routeMaterial.opacity = sample.flow * .35;
    flowMaterial.opacity = sample.flow * .65; markerMaterial.opacity = sample.flow;
    const heatProgress = .3 + reading * .7;
    flowGeometry.setDrawRange(0, Math.max(2, Math.round(heatProgress * flowGeometry.getAttribute("position").count)));
    flowMarker.position.copy(path.getPoint(heatProgress));
    placeLabel(heatLabel, 1.03, -1.18, sample.flow);
    const fading = sample.models.map((model, index) => ({ ...model, index })).filter(model => model.visible && model.opacity < .999);
    fading.forEach(model => { if (models[model.index]) models[model.index]!.visible = false; });
    renderer.setRenderTarget(null); renderer.autoClear = true; renderer.render(scene, camera);
    if (fading.length) {
      const modelVisibility = models.map(model => model?.visible ?? false);
      const flowVisible = flowLine.visible;
      flowLine.visible = flowMarker.visible = routeLine.visible = false;
      for (const fade of fading) {
        models.forEach((model, index) => { if (model) model.visible = index === fade.index; });
        renderer.setRenderTarget(fadeTarget); renderer.autoClear = true; renderer.render(scene, camera);
        compositeMaterial.opacity = fade.opacity;
        renderer.setRenderTarget(null); renderer.autoClear = false; renderer.render(compositeScene, compositeCamera);
      }
      models.forEach((model, index) => { if (model) model.visible = modelVisibility[index]; });
      flowLine.visible = flowMarker.visible = routeLine.visible = flowVisible;
      renderer.autoClear = true;
    }
  };
  const tick = (time: number) => {
    frame = 0;
    if (disposed || !visible || !loaded || paused) { last = 0; return; }
    const dt = last ? Math.min((time - last) / 1000, .05) : 1 / 60; last = time;
    current += (target - current) * (1 - Math.exp(-dt / .145));
    if (Math.abs(target - current) < .00015) current = target;
    draw();
    if (current !== target) frame = requestAnimationFrame(tick); else last = 0;
  };
  const wake = () => { if (!frame && !disposed && loaded && visible && !paused) frame = requestAnimationFrame(tick); };
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    hostWidth = Math.max(width, 1); hostHeight = Math.max(height, 1);
    camera.aspect = hostWidth / hostHeight;
    camera.updateProjectionMatrix(); renderer.setSize(Math.max(width, 1), Math.max(height, 1));
    const pixels = renderer.getDrawingBufferSize(new THREE.Vector2()); fadeTarget.setSize(pixels.x, pixels.y);
    // Resizing clears the drawing buffer, including when animation is paused.
    if (loaded && !disposed) draw();
    wake();
  };
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
  const releaseModel = (object: THREE.Object3D) => {
    const textures = new Set<THREE.Texture>(), meshMaterials = new Set<THREE.Material>();
    object.traverse(child => {
      if (!(child instanceof THREE.Mesh)) return;
      child.geometry.dispose();
      (Array.isArray(child.material) ? child.material : [child.material]).forEach(material => meshMaterials.add(material));
    });
    meshMaterials.forEach(material => { Object.values(material).forEach(value => { if (value instanceof THREE.Texture) textures.add(value); }); material.dispose(); });
    textures.forEach(texture => { texture.dispose(); const data = texture.source?.data; if (typeof ImageBitmap !== "undefined" && data instanceof ImageBitmap) data.close(); });
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true; cancelAnimationFrame(frame); resizeObserver.disconnect();
    renderer.domElement.removeEventListener("webglcontextlost", lost); signal.removeEventListener("abort", dispose);
    models.forEach(model => { if (model) releaseModel(model); }); labels.forEach(label => label.remove()); heatLabel.remove(); flowGeometry.dispose(); flowMaterial.dispose(); routeGeometry.dispose(); routeMaterial.dispose(); markerGeometry.dispose(); markerMaterial.dispose(); environment.dispose(); fadeTarget.dispose(); compositeGeometry.dispose(); compositeMaterial.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
  };
  const lost = (event: Event) => { event.preventDefault(); if (!disposed) { onError(); dispose(); } };
  renderer.domElement.addEventListener("webglcontextlost", lost); signal.addEventListener("abort", dispose, { once: true });
  try {
    if (signal.aborted) throw new Error("Geannuleerd");
    const loadModel = async (index: number) => {
      const asset = assets[index];
      const response = await fetch(asset.file.startsWith("/") ? asset.file : `/warmtepompen-test/${asset.file}`, { signal });
      if (!response.ok) throw new Error("3D-model kon niet laden");
      const buffer = await response.arrayBuffer();
      if (disposed || signal.aborted) return;
      const gltf = await new GLTFLoader().parseAsync(buffer, "/warmtepompen-test/");
      if (disposed || signal.aborted) { releaseModel(gltf.scene); return; }
      const model = new THREE.Group(), product = gltf.scene;
      product.rotation.y = asset.turn; product.updateMatrixWorld(true);
      const bounds = new THREE.Box3().setFromObject(product), size = bounds.getSize(new THREE.Vector3());
      const scale = asset.height / Math.max(size.y, .001);
      product.scale.multiplyScalar(scale); product.updateMatrixWorld(true);
      product.position.sub(new THREE.Box3().setFromObject(product).getCenter(new THREE.Vector3()));
      model.add(product); models[index] = model; scene.add(model);
      product.traverse(child => {
        if (!(child instanceof THREE.Mesh)) return;
        child.castShadow = true; child.receiveShadow = true;
        (Array.isArray(child.material) ? child.material : [child.material]).forEach(material => {
          if (!(material instanceof THREE.MeshStandardMaterial)) return;
          for (const value of Object.values(material)) if (value instanceof THREE.Texture) renderer.initTexture(value);
        });
      });
      completed++; onProgress(index === 0 ? 95 : Math.round(completed / assets.length * 100));
    };
    await loadModel(0);
    if (disposed || signal.aborted) throw new Error("Geannuleerd");
    // Compile the complete outside unit before revealing the first interactive frame.
    resize(); await renderer.compileAsync(scene, camera); await renderer.compileAsync(compositeScene, compositeCamera);
    if (disposed || signal.aborted) throw new Error("Geannuleerd");
    loaded = true; draw(); onProgress(100);
    // The first whole product is visible before the remaining installation loads.
    void Promise.all(assets.slice(1).map((_, index) => loadModel(index + 1))).then(async () => {
      if (disposed || signal.aborted) return;
      models.forEach(model => { if (model) model.visible = true; });
      await renderer.compileAsync(scene, camera);
      if (disposed || signal.aborted) return;
      complete = true; draw(); wake();
    }).catch(() => { if (!disposed && !signal.aborted) onError(); });
  } catch (error) { dispose(); throw error; }
  return {
    progress(value, immediate = false, read = 0) { if (paused) return; reading = THREE.MathUtils.clamp(read, 0, 1); target = THREE.MathUtils.clamp(value, 0, shots.length - 1); if (immediate) { current = target; if (loaded && !disposed) draw(); } else wake(); },
    visible(value) { visible = value; if (value) wake(); else { cancelAnimationFrame(frame); frame = 0; last = 0; } },
    paused(value) { paused = value; if (value) { cancelAnimationFrame(frame); frame = 0; last = 0; } else wake(); },
    dispose,
  };
}
