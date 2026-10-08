import * as T from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/* De ketel aan de wand, in twee standen. Licht: ochtendlicht door een raam op
   een lichte wand. Donker: het licht gaat uit, de kast en de buitenbuis worden
   doorzichtig, de gasleiding vult zich geel en in de dubbelwandige afvoer
   stroomt verse lucht omlaag en rookgas omhoog. Het model (installatie.glb)
   blijft ongewijzigd; alleen de presentatie past zich aan. */

export type Staat = {
  /** Doorlopende camerastand: 2.5 ligt halverwege stand 2 en 3. */
  stand: number;
  /** 0 of 1; de scène dooft zelf in de tijd, als een lichtknop. */
  donker: number;
  /** 0..1: hoe ver de gasleiding gevuld is. */
  gas: number;
  /** 0..1: lucht en rookgas zichtbaar, kast doorzichtig. */
  rook: number;
  /** 0..1: display van de ketel aan. */
  aan: number;
  /** 0..1: het raamlicht schuift een fractie mee in de kop. */
  zon: number;
};
export type KetelScene = { zet: (s: Partial<Staat>) => void; zichtbaar: (v: boolean) => void; weg: () => void };

type Vec = [number, number, number];
type Stand = { doel: Vec; camera: Vec; schuif: number; mobielDoel?: Vec; mobiel?: number };

/* Positief schuiven zet het toestel rechts in beeld, negatief links. Een camera
   op negatieve z kijkt naar de wand; hogere x staat links in beeld. */
const standen: Stand[] = [
  { doel: [.63, 3.33, -.3], camera: [.92, 3.78, -5.25], schuif: 0, mobielDoel: [.63, 3.78, -.3], mobiel: .95 }, // kop
  { doel: [.63, 3.2, -.31], camera: [-.35, 3.62, -2.05], schuif: -.2, mobielDoel: [.63, 3.14, -.31], mobiel: 1.2 }, // aansluitingen
  { doel: [3.36, 3.4, -.2], camera: [3.9, 3.85, -3.05], schuif: -.2, mobiel: 1.1 }, // uw woning
  { doel: [.63, 4.25, -.3], camera: [.25, 4.35, -5.8], schuif: -.2, mobiel: 1.05 }, // licht uit
  { doel: [.63, 3.22, -.31], camera: [-.25, 3.52, -1.8], schuif: -.2, mobielDoel: [.63, 3.2, -.31], mobiel: 1.25 }, // gasleiding
  { doel: [.63, 5.5, -.29], camera: [-.55, 4.62, -4.7], schuif: -.2, mobielDoel: [.63, 5.3, -.29], mobiel: 1.0 }, // lucht en rookgas
  { doel: [.63, 3.92, -.4], camera: [-.2, 4.05, -3.0], schuif: -.2, mobielDoel: [.63, 3.9, -.4], mobiel: 1.15 }, // licht aan
];

const LICHT = { wand: '#e8eef4', vloer: '#dfe7ef' };
const NACHT = { wand: '#0c1a28', vloer: '#0a1621' };
const GAS = '#f3c331';
const LUCHT = '#8fcaf8';
const ROOKGAS = '#eef3f9';

const AS = new T.Vector2(.63, -.286); // as van de concentrische afvoer (x, z)

export function createKetelScene(host: HTMLElement, opties: { klaar: () => void; mis: () => void; beweging: boolean }): KetelScene {
  const renderer = new T.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
  const smal = () => host.clientWidth < 760;
  renderer.setPixelRatio(Math.min(devicePixelRatio, smal() ? 1.5 : 1.6));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);

  const scene = new T.Scene();
  const achtergrond = new T.Color(LICHT.wand);
  scene.background = achtergrond;
  scene.fog = new T.Fog(achtergrond, 14, 34);
  const camera = new T.PerspectiveCamera(30, 1, .05, 60);

  const kamer = new RoomEnvironment(), pm = new T.PMREMGenerator(renderer), omgeving = pm.fromScene(kamer, .025);
  kamer.dispose(); pm.dispose();
  scene.environment = omgeving.texture; scene.environmentIntensity = .55;

  const hemel = new T.HemisphereLight('#ffffff', '#b9c8d8', 1.15); scene.add(hemel);
  /* Zachte vulling vanaf de kijker: wit gelakt staal blijft wit, ook buiten het raamlicht. */
  const vul = new T.DirectionalLight('#f4f8fc', .7); vul.position.set(1.4, 4.6, -7); vul.target.position.set(1.4, 3.6, -.1);
  scene.add(vul, vul.target);

  /* Het raam: een spotlamp met een raamkozijn als lichtpatroon. */
  const raam = new T.SpotLight('#fffdf8', 210, 30, T.MathUtils.degToRad(30), .55, 2);
  raam.position.set(-2.4, 6.4, -4.4);
  raam.target.position.set(.15, 3.95, -.1);
  raam.map = raamPatroon();
  raam.castShadow = true;
  raam.shadow.mapSize.set(2048, 2048); raam.shadow.camera.near = .5; raam.shadow.camera.far = 20;
  raam.shadow.bias = -.0001; raam.shadow.normalBias = .002; raam.shadow.radius = 4; raam.shadow.blurSamples = 10;
  scene.add(raam, raam.target);
  const raamBasis = raam.position.clone();

  /* In het donker: één koel strijklicht van opzij, zodat de vormen leesbaar blijven. */
  const strijk = new T.DirectionalLight('#7fb6e6', 0); strijk.position.set(3, 6, -3); strijk.target.position.set(.63, 4, -.3);
  scene.add(strijk, strijk.target);

  const wandMat = new T.MeshStandardMaterial({ color: LICHT.wand, roughness: .92, metalness: 0 });
  const wand = new T.Mesh(new T.PlaneGeometry(16, 8), wandMat);
  wand.position.set(.6, 6.6, -.104); wand.rotation.y = Math.PI; wand.receiveShadow = true; scene.add(wand);
  const vloerMat = new T.MeshStandardMaterial({ color: LICHT.vloer, roughness: .7, metalness: .02 });
  const vloer = new T.Mesh(new T.PlaneGeometry(40, 40), vloerMat);
  vloer.rotation.x = -Math.PI / 2; vloer.position.y = 2.9; vloer.receiveShadow = true; scene.add(vloer);

  /* Het dak, alleen in het donker te zien: een doorsnede waar de afvoer doorheen gaat. */
  const dakGeo = new T.BoxGeometry(2.5, .17, 1);
  const dakMat = new T.MeshBasicMaterial({ color: LUCHT, transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
  const dak = new T.Mesh(dakGeo, dakMat); dak.position.set(1.35, 5.705, -.104 - .5); scene.add(dak);
  const dakRandMat = new T.LineBasicMaterial({ color: LUCHT, transparent: true, opacity: 0, toneMapped: false });
  const dakRand = new T.LineSegments(new T.EdgesGeometry(dakGeo), dakRandMat); dakRand.position.copy(dak.position); scene.add(dakRand);

  /* De gasleiding vult zich van de vloerdoorvoer tot de aansluiting op de ketel. */
  const GAS_ONDER = 2.903, GAS_BOVEN = 3.483;
  const gasMat = new T.MeshStandardMaterial({ color: GAS, emissive: GAS, emissiveIntensity: .62, roughness: .38, metalness: .15, transparent: true, opacity: 0 });
  const gasBuis = new T.Mesh(new T.CylinderGeometry(.0158, .0158, 1, 20).translate(0, .5, 0), gasMat);
  gasBuis.position.set(.63, GAS_ONDER, -.3085); gasBuis.scale.y = .0001; scene.add(gasBuis);
  const gasKop = new T.Mesh(new T.CylinderGeometry(.021, .021, .012, 20), new T.MeshBasicMaterial({ color: '#fff6d6', transparent: true, opacity: 0, toneMapped: false }));
  gasKop.position.set(.63, GAS_ONDER, -.3085); scene.add(gasKop);

  /* Binnenbuis boven de koppeling: in het model is alleen het onderste deel
     dubbelwandig uitgewerkt. Doorzichtig getoond maakt het systeem leesbaar. */
  const binnenMat = new T.MeshStandardMaterial({ color: '#9aa7b1', metalness: .55, roughness: .35, transparent: true, opacity: 0, depthWrite: false });
  const binnenBuis = new T.Mesh(new T.CylinderGeometry(.037, .037, 6.3 - 4.86, 28, 1, true), binnenMat);
  binnenBuis.position.set(AS.x, (4.86 + 6.3) / 2, AS.y); binnenBuis.visible = false; scene.add(binnenBuis);

  /* Stromen: rookgas door de binnenbuis omhoog, verse lucht door de ring omlaag. */
  const rookgas = stroom(150, ROOKGAS, .012, (fase, uit) => {
    const y = 4.18 + fase * (6.34 - 4.18);
    const r = uit.r * .026;
    return [AS.x + Math.cos(uit.hoek) * r, y, AS.y + Math.sin(uit.hoek) * r];
  }, fase => T.MathUtils.smoothstep(fase, 0, .12) * (1 - T.MathUtils.smoothstep(fase, .9, 1)));
  const lucht = stroom(170, LUCHT, .011, (fase, uit) => {
    const y = 6.18 - fase * (6.18 - 4.3);
    const r = .044 + uit.r * .014;
    return [AS.x + Math.cos(uit.hoek) * r, y, AS.y + Math.sin(uit.hoek) * r];
  }, fase => T.MathUtils.smoothstep(fase, 0, .1) * (1 - T.MathUtils.smoothstep(fase, .86, 1)));
  scene.add(rookgas.punten, lucht.punten);

  /* Labels in beeld (HTML), geprojecteerd vanuit het model. */
  const labelHost = host.parentElement;
  const label = (naam: string) => labelHost?.querySelector<HTMLElement>(`[data-label="${naam}"]`) ?? null;
  const labels: { el: HTMLElement | null; punt: T.Vector3; zicht: () => number; rij?: boolean }[] = [];
  const leidingen: [string, number][] = [['aanvoer', .811], ['warm', .72], ['gas', .63], ['koud', .54], ['retour', .449]];
  for (const [naam, x] of leidingen) labels.push({ el: label(naam), punt: new T.Vector3(x, 2.93, -.309), zicht: () => nabij(1) * (1 - nu.donker), rij: true });
  labels.push({ el: label('radiator'), punt: new T.Vector3(3.25, 3.0, -.16), zicht: () => nabij(2) * (1 - nu.donker) });
  labels.push({ el: label('gasleiding'), punt: new T.Vector3(.63, 3.06, -.309), zicht: () => nu.donker * T.MathUtils.smoothstep(nu.gas, .55, .9) * (1 - nabij(5)) });
  labels.push({ el: label('rookgas'), punt: new T.Vector3(AS.x, 6.22, AS.y), zicht: () => nu.donker * T.MathUtils.smoothstep(nu.rook, .35, .8) });
  labels.push({ el: label('lucht'), punt: new T.Vector3(AS.x, 5.2, AS.y), zicht: () => nu.donker * T.MathUtils.smoothstep(nu.rook, .45, .9) });
  labels.push({ el: label('dak'), punt: new T.Vector3(1.35, 5.79, -.45), zicht: () => nu.donker * T.MathUtils.smoothstep(nu.rook, .2, .6) });

  // Wat doorzichtig wordt in het donker, met de oorspronkelijke doorzichtigheid.
  const kast: { m: T.Material & { opacity: number }; basis: number; eigen: boolean }[] = [];
  const leidingwerk: T.MeshStandardMaterial[] = [];
  let radiator: T.Group | null = null;
  const radiatorMat: T.Material[] = [];

  const doel: Staat = { stand: 0, donker: 0, gas: 0, rook: 0, aan: 0, zon: 0 };
  const nu: Staat = { ...doel };
  const nabij = (i: number) => Math.max(0, 1 - Math.abs(nu.stand - i) * 1.6);
  let geladen = false, zichtbaar = true, weg = false, raf = 0, vorige = 0, tijd = 0;
  const kleurL = new T.Color(), kleurD = new T.Color();
  const punt = new T.Vector3(), positie = new T.Vector3(), a = new T.Vector3(), b = new T.Vector3(), p = new T.Vector3();

  function richt(stand: number, w: number, h: number) {
    const i = Math.max(0, Math.min(standen.length - 2, Math.floor(stand)));
    const t = T.MathUtils.clamp(stand - i, 0, 1);
    const s0 = standen[i], s1 = standen[i + 1];
    const mobiel = w < 760;
    punt.fromArray(mobiel && s0.mobielDoel ? s0.mobielDoel : s0.doel).lerp(b.fromArray(mobiel && s1.mobielDoel ? s1.mobielDoel : s1.doel), t);
    positie.fromArray(s0.camera).lerp(a.fromArray(s1.camera), t);
    if (mobiel) {
      const k = T.MathUtils.lerp(s0.mobiel ?? 1.1, s1.mobiel ?? 1.1, t) * (w / h < .75 ? 1.35 : 1);
      positie.sub(punt).multiplyScalar(k).add(punt);
    }
    camera.position.copy(positie); camera.lookAt(punt);
    camera.aspect = w / Math.max(h, 1);
    const schuif = mobiel ? 0 : T.MathUtils.lerp(s0.schuif, s1.schuif, t);
    camera.setViewOffset(w, h, -w * schuif, 0, w, h);
    camera.updateProjectionMatrix();
  }

  function frame(ms: number) {
    raf = 0;
    if (weg || !zichtbaar || !geladen) return;
    const dt = vorige ? Math.min(ms - vorige, 50) : 16; vorige = ms;
    const glad = (huidig: number, naar: number, tau: number) => opties.beweging ? huidig + (naar - huidig) * (1 - Math.exp(-dt / tau)) : naar;
    nu.stand = glad(nu.stand, doel.stand, 150);
    nu.donker = glad(nu.donker, doel.donker, 210);
    nu.gas = glad(nu.gas, doel.gas, 160);
    nu.rook = glad(nu.rook, doel.rook, 260);
    nu.aan = glad(nu.aan, doel.aan, 300);
    nu.zon = glad(nu.zon, doel.zon, 200);
    const stromen = nu.donker > .02 && nu.rook > .02;
    if (opties.beweging && stromen) tijd += dt / 1000;

    const w = host.clientWidth, h = host.clientHeight;
    richt(nu.stand, w, h);

    // Licht en donker.
    const d = nu.donker;
    kleurL.set(LICHT.wand); kleurD.set(NACHT.wand); achtergrond.copy(kleurL).lerp(kleurD, d);
    (scene.fog as T.Fog).color.copy(achtergrond);
    wandMat.color.copy(kleurL).lerp(kleurD, d * .9);
    vloerMat.color.set(LICHT.vloer).lerp(kleurD.set(NACHT.vloer), d * .9);
    raam.intensity = 210 * (1 - d);
    raam.position.copy(raamBasis).add(p.set(-.5 * nu.zon, .25 * nu.zon, 0));
    hemel.intensity = T.MathUtils.lerp(1.15, .16, d);
    vul.intensity = .7 * (1 - d);
    scene.environmentIntensity = T.MathUtils.lerp(.55, .14, d);
    strijk.intensity = 1.1 * d;

    // Doorzichtig: in het donker de kast een beetje, bij de afvoer meer.
    const door = d * T.MathUtils.lerp(.35, .86, nu.rook);
    const doorzichtig = door > .002;
    for (const { m, basis, eigen } of kast) {
      const t = eigen || doorzichtig;
      if (m.transparent !== t) { m.transparent = t; m.needsUpdate = true; }
      m.opacity = basis * (1 - door);
      m.depthWrite = !doorzichtig || eigen;
    }
    const dof = d > .002;
    for (const m of leidingwerk) { if (m.transparent !== dof) { m.transparent = dof; m.needsUpdate = true; } m.opacity = 1 - d * .55; }
    binnenBuis.visible = d * nu.rook > .01; binnenMat.opacity = .5 * d * nu.rook;
    dakMat.opacity = .07 * d * nu.rook; dakRandMat.opacity = .38 * d * nu.rook;

    const g = d * nu.gas;
    gasBuis.scale.y = Math.max(.0001, nu.gas * (GAS_BOVEN - GAS_ONDER));
    gasMat.opacity = Math.min(1, d * 1.2) * T.MathUtils.smoothstep(nu.gas, 0, .04);
    gasKop.position.y = GAS_ONDER + nu.gas * (GAS_BOVEN - GAS_ONDER);
    (gasKop.material as T.MeshBasicMaterial).opacity = g * (1 - T.MathUtils.smoothstep(nu.gas, .9, 1));

    const zichtStroom = d * T.MathUtils.smoothstep(nu.rook, .1, .6);
    rookgas.zet(tijd * .2, zichtStroom * .9);
    lucht.zet(tijd * .16, zichtStroom);
    const schaal = h / (2 * Math.tan(T.MathUtils.degToRad(camera.fov / 2)));
    rookgas.schaal(schaal * renderer.getPixelRatio()); lucht.schaal(schaal * renderer.getPixelRatio());

    if (radiator) {
      const r = T.MathUtils.smoothstep(nu.stand, 1.15, 1.8);
      radiator.visible = r > .001;
      for (const m of radiatorMat) { const t = r < .999; if (m.transparent !== t) { m.transparent = t; m.needsUpdate = true; } m.opacity = r; }
    }

    renderer.render(scene, camera);

    // De leidinglabels delen één basislijn: de laagste leiding bepaalt de hoogte.
    let rijY = -Infinity;
    const plekken = labels.map(l => {
      p.copy(l.punt).project(camera);
      const x = (p.x + 1) * w / 2, y = (1 - p.y) * h / 2;
      if (l.rij) rijY = Math.max(rijY, y);
      return { x, y, binnen: Math.abs(p.x) < .97 && Math.abs(p.y) < .95 && p.z < 1 };
    });
    labels.forEach((l, i) => {
      if (!l.el) return;
      const { x, binnen } = plekken[i], y = l.rij ? rijY : plekken[i].y;
      l.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(var(--dx, -50%), var(--dy, 0px))`;
      l.el.style.opacity = binnen ? l.zicht().toFixed(3) : '0';
    });

    const rust = ['stand', 'donker', 'gas', 'rook', 'aan', 'zon'].every(k => Math.abs(nu[k as keyof Staat] - doel[k as keyof Staat]) < .0005);
    if (!rust || (stromen && opties.beweging)) wek();
  }
  function wek() { if (!raf && !weg && zichtbaar && geladen) raf = requestAnimationFrame(frame); }

  const maat = new ResizeObserver(() => { if (!weg) { renderer.setSize(host.clientWidth, host.clientHeight); wek(); } });
  maat.observe(host);
  const verloren = (e: Event) => { e.preventDefault(); opties.mis(); };
  renderer.domElement.addEventListener('webglcontextlost', verloren);
  const stop = new AbortController();

  laad('/concept-3d/cv-ketels/installatie.glb', stop.signal).then(g => {
    if (weg) { ruimOp(g.scene); return; }
    g.scene.traverse(o => { if (o instanceof T.Mesh) { o.castShadow = true; o.receiveShadow = true; } });
    g.scene.updateMatrixWorld(true);
    zetBeugelTegenWand(g.scene, -.104);

    const kastDelen = /behuizing|frontpaneel|serviceklep|bedieningsglas|Vaillant-logo|concentrisch-buitenbuis|concentrisch-basis|Concentric[ _]outer[ _]pipe|coupling/i;
    const leidingDelen = /^0[1245]-|condensafvoer|montagerail|railbeugel|aansluitpunt/;
    g.scene.traverse(o => {
      if (!(o instanceof T.Mesh)) return;
      const eigen = (bron: T.Material) => bron.clone();
      if (kastDelen.test(o.name)) {
        o.material = Array.isArray(o.material) ? o.material.map(eigen) : eigen(o.material);
        for (const m of Array.isArray(o.material) ? o.material : [o.material]) kast.push({ m: m as T.Material & { opacity: number }, basis: m.opacity, eigen: m.transparent });
        if (/logo/i.test(o.name)) o.renderOrder = 2;
      } else if (leidingDelen.test(o.name)) {
        o.material = Array.isArray(o.material) ? o.material.map(eigen) : eigen(o.material);
        for (const m of Array.isArray(o.material) ? o.material : [o.material]) if (m instanceof T.MeshStandardMaterial) leidingwerk.push(m);
      }
    });
    scene.add(g.scene);
    geladen = true; renderer.setSize(host.clientWidth, host.clientHeight); wek(); opties.klaar();

    laad('/models/cv-fotoreferentie/radiator-fotoreferentie.glb', stop.signal).then(r => {
      if (weg) { ruimOp(r.scene); return; }
      const box = new T.Box3().setFromObject(r.scene), midden = box.getCenter(new T.Vector3());
      r.scene.position.sub(midden);
      radiator = new T.Group(); radiator.add(r.scene); radiator.rotation.y = Math.PI;
      // Op de vloer gezet, met de achterkant tegen de wand.
      radiator.position.set(3.25, 2.9 + (midden.y - box.min.y), -.104 - (box.max.z - box.min.z) / 2 - .03);
      radiator.traverse(o => {
        if (!(o instanceof T.Mesh)) return;
        o.castShadow = true; o.receiveShadow = true;
        o.material = Array.isArray(o.material) ? o.material.map(m => m.clone()) : o.material.clone();
        radiatorMat.push(...(Array.isArray(o.material) ? o.material : [o.material]));
      });
      scene.add(radiator); wek();
    }).catch(() => { /* zonder radiator blijft de rest gewoon werken */ });
  }).catch(e => { if (!weg && (e as Error).name !== 'AbortError') opties.mis(); });

  return {
    zet(s) { Object.assign(doel, s); if (!geladen) Object.assign(nu, doel); wek(); },
    zichtbaar(v) { zichtbaar = v; if (v) { vorige = 0; wek(); } else { cancelAnimationFrame(raf); raf = 0; } },
    weg() {
      weg = true; stop.abort(); maat.disconnect(); cancelAnimationFrame(raf);
      renderer.domElement.removeEventListener('webglcontextlost', verloren);
      ruimOp(scene); omgeving.dispose(); raam.map?.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    },
  };
}

/* Een stroom deeltjes langs een pad. Elke stip heeft een vaste plek in de rij
   (fase) en een vaste hoek en straal; alleen de tijd schuift ze op. */
function stroom(aantal: number, kleur: string, grootte: number, plek: (fase: number, uit: { hoek: number; r: number }) => Vec, dekking: (fase: number) => number) {
  const posities = new Float32Array(aantal * 3), alfa = new Float32Array(aantal);
  const uit = Array.from({ length: aantal }, (_, i) => ({ start: (i + Math.random() * .6) / aantal, hoek: Math.random() * Math.PI * 2, r: Math.sqrt(Math.random()) }));
  const geo = new T.BufferGeometry();
  geo.setAttribute('position', new T.BufferAttribute(posities, 3));
  geo.setAttribute('alfa', new T.BufferAttribute(alfa, 1));
  const mat = new T.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { kleur: { value: new T.Color(kleur) }, grootte: { value: grootte }, schaal: { value: 600 }, dekking: { value: 0 } },
    vertexShader: `attribute float alfa; uniform float grootte; uniform float schaal; varying float vA;
      void main(){ vA = alfa; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = max(1.5, grootte * schaal / -mv.z); }`,
    fragmentShader: `uniform vec3 kleur; uniform float dekking; varying float vA;
      void main(){ float d = length(gl_PointCoord - .5); if (d > .5) discard; gl_FragColor = vec4(kleur, smoothstep(.5, .18, d) * vA * dekking); }`,
  });
  const punten = new T.Points(geo, mat); punten.frustumCulled = false; punten.renderOrder = 3;
  return {
    punten,
    zet(t: number, zicht: number) {
      punten.visible = zicht > .005;
      mat.uniforms.dekking.value = zicht;
      if (!punten.visible) return;
      for (let i = 0; i < aantal; i++) {
        const fase = (uit[i].start + t) % 1;
        const [x, y, z] = plek(fase, uit[i]);
        posities[i * 3] = x; posities[i * 3 + 1] = y; posities[i * 3 + 2] = z;
        alfa[i] = dekking(fase);
      }
      geo.attributes.position.needsUpdate = true; geo.attributes.alfa.needsUpdate = true;
    },
    schaal(s: number) { mat.uniforms.schaal.value = s; },
  };
}

/* Raamkozijn als lichtpatroon: vier ruiten met zachte randen. */
function raamPatroon() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d')!;
  x.fillStyle = '#3a3a3a'; x.fillRect(0, 0, 256, 256);
  x.filter = 'blur(2.5px)';
  x.fillStyle = '#fff';
  const ruit = (rx: number, ry: number, rw: number, rh: number) => x.fillRect(rx, ry, rw, rh);
  ruit(44, 30, 81, 95); ruit(131, 30, 81, 95); ruit(44, 131, 81, 95); ruit(131, 131, 81, 95);
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t;
}

function laad(url: string, signal: AbortSignal) {
  return fetch(url, { signal }).then(r => { if (!r.ok) throw Error('Model niet beschikbaar'); return r.arrayBuffer(); }).then(b => new GLTFLoader().parseAsync(b, ''));
}

/* Muurbeugel van de afvoer tegen de wand, zoals op de huidige ketelpagina. */
function zetBeugelTegenWand(model: T.Object3D, wandZ: number) {
  const plaat = model.getObjectByName('Wall_bracket_plate') ?? model.getObjectByName('Wall bracket plate');
  const arm = model.getObjectByName('Wall_bracket_arm') ?? model.getObjectByName('Wall bracket arm');
  const wereld = (o: T.Object3D, m: T.Matrix4) => {
    const ouder = o.parent?.matrixWorld ?? new T.Matrix4();
    o.applyMatrix4(ouder.clone().invert().multiply(m).multiply(ouder)); o.updateMatrixWorld(true);
  };
  if (!plaat) return;
  const box = new T.Box3().setFromObject(plaat);
  wereld(plaat, new T.Matrix4().makeTranslation(0, 0, wandZ - .0005 - box.max.z));
  if (!arm) return;
  const armBox = new T.Box3().setFromObject(arm);
  const eind = new T.Box3().setFromObject(plaat).min.z + .002;
  const r = (eind - armBox.min.z) / (armBox.max.z - armBox.min.z);
  if (r > 0) wereld(arm, new T.Matrix4().makeTranslation(0, 0, armBox.min.z).multiply(new T.Matrix4().makeScale(1, 1, r)).multiply(new T.Matrix4().makeTranslation(0, 0, -armBox.min.z)));
}

function ruimOp(root: T.Object3D) {
  const geo = new Set<T.BufferGeometry>(), mat = new Set<T.Material>(), tex = new Set<T.Texture>();
  root.traverse(o => {
    if (o instanceof T.Mesh || o instanceof T.Points || o instanceof T.LineSegments) {
      geo.add(o.geometry);
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) { mat.add(m); for (const v of Object.values(m)) if (v instanceof T.Texture) tex.add(v); }
    }
  });
  tex.forEach(t => t.dispose()); mat.forEach(m => m.dispose()); geo.forEach(g => g.dispose());
}
