"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* De route van warmte.

   Een redactionele doorsnede, geen woningconfigurator. De bouwkundige schil is
   bewust stil: mat wit, geen textuur, geen tuin, geen dak om naar te kijken.
   Alles wat installatie is -- ketel, leidingen, radiator, vloerverwarming,
   rookgasafvoer, gasleiding, meetinstrument -- is wel echt uitgewerkt en klopt
   technisch. Zo kijkt de bezoeker naar de installatie en niet naar het huis.

   De camera is vast. Bij het laden schuift hij één keer rustig naar de
   openingscompositie en staat daarna stil. Per hoofdstuk verplaatst hij zich
   in ongeveer een seconde naar de volgende stand en staat dan weer stil, zodat
   er gelezen kan worden. Er wordt niet gescrubd: scrollen kiest een
   hoofdstuk, de camera doet de rest. Geen vlucht, geen rondgang, geen vrij
   bestuurbare camera.

   Naar binnen kijken gebeurt met een snijvlak en met plaatselijke
   doorzichtigheid, niet door het huis uit elkaar te laten vliegen.

   Alle koppen, uitleg en navigatie staan als gewone HTML buiten het canvas.

   Over modellen: de geometrie wordt hier opgebouwd in code. Er zijn dus geen
   GLB-bestanden om te optimaliseren; wat die eis beoogt -- gedeelde
   materialen, juiste schaal, geen zware texturen -- zit er wel in. Alle maten
   zijn meters, en elk systeem deelt één materiaal. */

gsap.registerPlugin(ScrollTrigger);

/* ---------------------------------------------------------------------- */
/* De hoofdstukken                                                        */
/* ---------------------------------------------------------------------- */

type Stand = { oog: [number, number, number]; doel: [number, number, number] };

type Hoofdstuk = {
  id: string;
  kop: string;
  /* Korte naam voor de navigatie: de koppen zelf zijn te lang voor zes
     kolommen naast elkaar en liepen over elkaar heen. */
  kort: string;
  tekst: string;
  stand: Stand;
  actief: string[];
  /* Doorzichtigheid van de bouwkundige delen, zodat er doorheen te kijken is
     zonder dat er iets wegvliegt. */
  vloer: number;
  verdieping: number;
  /* Hoe zichtbaar de scene is. Het eerste hoofdstuk staat op nul: dan leest de
     bezoeker alleen de tekst en komt het huis daarna pas in beeld. */
  scene: number;
};

const HOOFDSTUKKEN: Hoofdstuk[] = [
  {
    id: "opening",
    kort: "Middenin",
    kop: "U staat er middenin.",
    tekst:
      "Achter de muren van uw huis loopt een installatie die u zelden ziet. Eén toestel, een handvol leidingen, en een route die begint bij de meterkast en eindigt bij de radiator in de kamer waar u zit.",
    stand: { oog: [6.3, 2.7, 6.8], doel: [2.5, 0.95, -2.4] },
    actief: [],
    vloer: 1,
    verdieping: 1,
    scene: 0,
  },
  {
    id: "binnen",
    kort: "Wat er staat",
    kop: "Dit is wat er staat.",
    tekst:
      "De ketel aan de wand, de afvoer door het dak, de gasleiding uit de meterkast, en het leidingwerk naar de radiatoren en de vloer.",
    stand: { oog: [6.3, 2.7, 6.8], doel: [2.5, 0.95, -2.4] },
    actief: [],
    vloer: 1,
    verdieping: 1,
    scene: 1,
  },
  {
    id: "ketel",
    kort: "De ketel",
    kop: "Het begint bij de ketel.",
    tekst:
      "Wandhangend, tot en met 40 kW. Hij verwarmt uw huis én maakt uw warme water: twee kringen uit één toestel.",
    stand: { oog: [3.1, 2.0, 1.1], doel: [0.9, 1.45, -2.8] },
    actief: ["ketel"],
    vloer: 1,
    verdieping: 1,
    scene: 1,
  },
  {
    id: "rookgas",
    kort: "Rookgasafvoer",
    kop: "Omhoog, door het dak naar buiten.",
    tekst:
      "Concentrisch: door de binnenbuis gaan de rookgassen weg, door de ruimte eromheen komt verbrandingslucht terug. Eén kanaal, van de bovenkant van het toestel tot de dakdoorvoer.",
    stand: { oog: [4.2, 4.1, 3.4], doel: [0.9, 3.8, -2.8] },
    actief: ["rookgas"],
    vloer: 1,
    verdieping: 0.22,
    scene: 1,
  },
  {
    id: "meterkast",
    kort: "Meterkast",
    kop: "De gasleiding komt uit de meterkast.",
    tekst:
      "Daar zit de gasmeter, en daarnaast de groepenkast die de ketel van stroom voorziet. De leiding ertussen beproeven we op lekdichtheid — aannemen dat hij goed is, is geen controle.",
    stand: { oog: [1.9, 1.7, 0.5], doel: [-0.05, 1.25, -2.85] },
    actief: ["gas", "meterkast", "meting"],
    vloer: 1,
    verdieping: 1,
    scene: 1,
  },
  {
    id: "terug",
    kort: "Terug",
    kop: "En dan terug naar het toestel.",
    tekst:
      "Daar wordt het gas verbrand en het water verwarmd. Wat eruit komt gaat twee kanten op: naar de kraan, en naar de verwarming.",
    stand: { oog: [3.6, 2.2, 1.9], doel: [0.9, 1.4, -2.8] },
    actief: ["ketel", "gas"],
    vloer: 1,
    verdieping: 1,
    scene: 1,
  },
  {
    id: "cv",
    kort: "Aanvoer en retour",
    kop: "Aanvoer en retour.",
    tekst:
      "De eerste en de laatste leiding onder de ketel. Verwarmd water het huis in, afgekoeld water terug — een kring die blijft rondgaan zolang er warmte gevraagd wordt.",
    stand: { oog: [4.8, 2.2, 3.6], doel: [2.0, 0.7, -2.6] },
    actief: ["aanvoer", "retour"],
    vloer: 0.35,
    verdieping: 1,
    scene: 1,
  },
  {
    id: "radiator",
    kort: "Radiator",
    kop: "Hier komt de warmte de kamer in.",
    tekst:
      "Aan het eind van de aanvoer staat de radiator. Wat hij afgeeft aan de kamer, verlaat hem afgekoeld via de retour.",
    stand: { oog: [5.9, 1.9, 1.4], doel: [4.5, 0.7, -2.9] },
    actief: ["radiator", "aanvoer", "retour"],
    vloer: 1,
    verdieping: 1,
    scene: 1,
  },
  {
    id: "slot",
    kort: "Rond",
    kop: "En het eindigt waar het begon.",
    tekst:
      "Terug bij de ketel, waar het afgekoelde water opnieuw wordt verwarmd. Wie die installatie plaatst, onderhoudt hem daarna — dezelfde mensen, van het advies tot de jaarlijkse beurt.",
    stand: { oog: [3.4, 2.1, 1.7], doel: [0.9, 1.45, -2.8] },
    actief: [],
    vloer: 1,
    verdieping: 1,
    scene: 1,
  },
];

/* ---------------------------------------------------------------------- */
/* Materialen: één per systeem, gedeeld door alles wat erbij hoort        */
/* ---------------------------------------------------------------------- */

const STREEP_PERIODE = 0.5; // meter per streep in de stromingstekening

/* De stroming wordt niet met deeltjes of pijlen getoond maar met een rustig
   verschuivend streeppatroon in de gloed van de leiding zelf. */
function streepTextuur() {
  const c = document.createElement("canvas");
  c.width = 8;
  c.height = 64;
  const g = c.getContext("2d");
  if (!g) return null;
  const grad = g.createLinearGradient(0, 0, 0, 64);
  grad.addColorStop(0, "#000000");
  grad.addColorStop(0.42, "#000000");
  grad.addColorStop(0.62, "#ffffff");
  grad.addColorStop(0.82, "#000000");
  grad.addColorStop(1, "#000000");
  g.fillStyle = grad;
  g.fillRect(0, 0, 8, 64);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  return t;
}

const SNIJVLAK = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.35);

type Bak = {
  materialen: Record<string, THREE.MeshStandardMaterial>;
  stroming: Array<{ mat: THREE.MeshStandardMaterial; richting: number }>;
};

let BAK: Bak | null = null;

function bouwMaterialen(): Bak {
  if (BAK) return BAK;

  const bouwkundig = (kleur: string, dekking = 1) =>
    new THREE.MeshStandardMaterial({
      color: kleur,
      roughness: 0.96,
      metalness: 0,
      transparent: true,
      opacity: dekking,
      side: THREE.DoubleSide,
    });

  const stromend = (kleur: string, gloed: string, richting: number) => {
    const streep = streepTextuur();
    const m = new THREE.MeshStandardMaterial({
      color: kleur,
      roughness: 0.34,
      metalness: 0.55,
      emissive: new THREE.Color(gloed),
      emissiveIntensity: 0.5,
      ...(streep ? { emissiveMap: streep } : {}),
    });
    return { m, richting, streep };
  };

  const aanvoer = stromend("#b23a2f", "#ff5a44", 1);
  const retour = stromend("#25659f", "#4aa3ff", -1);
  const gas = stromend("#c08a10", "#ffcf4a", 1);
  const rookgas = stromend("#7b8288", "#b9c2c9", 1);

  const materialen: Record<string, THREE.MeshStandardMaterial> = {
    wit: bouwkundig("#f4f4f2"),
    witVloer: bouwkundig("#eeeeec"),
    witVerdieping: bouwkundig("#eeeeec"),
    ketel: new THREE.MeshStandardMaterial({ color: "#e9ecef", roughness: 0.42, metalness: 0.12 }),
    ketelDonker: new THREE.MeshStandardMaterial({ color: "#454b52", roughness: 0.5, metalness: 0.2 }),
    display: new THREE.MeshStandardMaterial({
      color: "#12303a",
      roughness: 0.22,
      metalness: 0.1,
      emissive: new THREE.Color("#2ea3b8"),
      emissiveIntensity: 0.55,
    }),
    koper: new THREE.MeshStandardMaterial({ color: "#b06a3c", roughness: 0.3, metalness: 0.85 }),
    warmwater: new THREE.MeshStandardMaterial({ color: "#d2705f", roughness: 0.35, metalness: 0.5 }),
    koudwater: new THREE.MeshStandardMaterial({ color: "#5f92c4", roughness: 0.35, metalness: 0.5 }),
    rvs: new THREE.MeshStandardMaterial({ color: "#c9ced3", roughness: 0.26, metalness: 0.9 }),
    chroom: new THREE.MeshStandardMaterial({ color: "#dfe4e8", roughness: 0.12, metalness: 1 }),
    keramiek: new THREE.MeshStandardMaterial({ color: "#fbfbfa", roughness: 0.16, metalness: 0 }),
    radiator: new THREE.MeshStandardMaterial({ color: "#dde3e8", roughness: 0.38, metalness: 0.18 }),
    meterHuis: new THREE.MeshStandardMaterial({ color: "#1d2328", roughness: 0.5, metalness: 0.3 }),
    meterWijzer: new THREE.MeshStandardMaterial({ color: "#c8342a", roughness: 0.5, metalness: 0 }),
    meterPlaat: new THREE.MeshStandardMaterial({ color: "#fdfdfc", roughness: 0.6, metalness: 0 }),
    aanvoer: aanvoer.m,
    retour: retour.m,
    gas: gas.m,
    rookgas: rookgas.m,
    vloerverwarming: new THREE.MeshStandardMaterial({ color: "#b8503f", roughness: 0.6, metalness: 0.05 }),
  };

  BAK = {
    materialen,
    stroming: [
      { mat: aanvoer.m, richting: aanvoer.richting },
      { mat: retour.m, richting: retour.richting },
      { mat: gas.m, richting: gas.richting },
      { mat: rookgas.m, richting: rookgas.richting },
    ],
  };
  return BAK;
}

/* ---------------------------------------------------------------------- */
/* Bouwstenen                                                             */
/* ---------------------------------------------------------------------- */

function Blok({
  groep,
  mat,
  positie = [0, 0, 0],
  maat,
  rotatie,
}: {
  groep: string;
  mat: THREE.Material;
  positie?: [number, number, number];
  maat: [number, number, number];
  rotatie?: [number, number, number];
}) {
  return (
    <mesh position={positie} rotation={rotatie} material={mat} userData={{ groep }}>
      <boxGeometry args={maat} />
    </mesh>
  );
}

function Cilinder({
  groep,
  mat,
  positie,
  straal,
  hoogte,
  rotatie,
  zijden = 20,
}: {
  groep: string;
  mat: THREE.Material;
  positie: [number, number, number];
  straal: number;
  hoogte: number;
  rotatie?: [number, number, number];
  zijden?: number;
}) {
  return (
    <mesh position={positie} rotation={rotatie} material={mat} userData={{ groep }}>
      <cylinderGeometry args={[straal, straal, hoogte, zijden]} />
    </mesh>
  );
}

/* Een leidingtracé als één buis over een reeks punten. De uv wordt op lengte
   geschaald, zodat het stromingspatroon overal even dicht staat ook al deelt
   elk tracé hetzelfde materiaal. */
function Trace({
  groep,
  mat,
  punten,
  straal = 0.008,
}: {
  groep: string;
  mat: THREE.Material;
  punten: Array<[number, number, number]>;
  straal?: number;
}) {
  const geometrie = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      punten.map((p) => new THREE.Vector3(...p)),
      false,
      "catmullrom",
      0.02,
    );
    const lengte = curve.getLength();
    const g = new THREE.TubeGeometry(curve, Math.max(24, Math.round(lengte * 14)), straal, 12, false);
    const uv = g.attributes.uv;
    const schaal = lengte / STREEP_PERIODE;
    for (let i = 0; i < uv.count; i += 1) uv.setY(i, uv.getY(i) * schaal);
    uv.needsUpdate = true;
    return g;
  }, [punten, straal]);

  return <mesh geometry={geometrie} material={mat} userData={{ groep }} />;
}

/* ---------------------------------------------------------------------- */
/* De woning: stil, wit, vereenvoudigd                                    */
/* ---------------------------------------------------------------------- */

/* Het huis komt uit het aangeleverde model. Het is één mesh met één materiaal,
   dus per kamer laten vervagen kan niet -- maar dat hoeft ook niet: het is al
   een doorsnede, de voor- en zijgevel zijn er al af. Je kijkt zo naar binnen.

   Wat er wel bij moet, bouw ik in code: de aansluitingen onder de ketel en de
   leidingen die het huis in lopen. Die moeten kunnen oplichten en stromen, en
   dat kan alleen als ze losse objecten zijn. */
function Huis() {
  const { scene } = useGLTF("/huis3d/woning.glb", "/draco/gltf/");
  const model = useMemo(() => {
    const kloon = scene.clone(true);
    kloon.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.userData.groep = "huis";
    });
    return kloon;
  }, [scene]);
  return <primitive object={model} />;
}

useGLTF.preload("/huis3d/woning.glb");

/* ---------------------------------------------------------------------- */
/* Waar de installatie zit                                                */
/* ---------------------------------------------------------------------- */

/* Opgemeten aan het model zelf, niet gegokt. Het kastje dat de ketel voorstelt
   is 0,55 breed, 0,52 diep en 0,90 hoog, en de onderkant hangt op 5,41 meter --
   dat is de zolder. Daaronder komen de vijf aansluitingen. */
const KETEL = {
  x: (1.336 + 1.883) / 2,
  z: (0.256 + 0.776) / 2,
  onder: 5.414,
  breed: 1.883 - 1.336,
};

/* ---------------------------------------------------------------------- */
/* De installatie                                                         */
/* ---------------------------------------------------------------------- */


/* De ketel zelf hangt al in het aangeleverde model, op zolder. Mijn eigen
   ketelmodel is hier dus niet nodig; dat blijft staan voor de kijkdoos op
   /ketel. Wat het model mist zijn de aansluitingen eronder, en die komen
   hieronder erbij. */

/* De vijf aansluitingen onder de ketel, in de volgorde waarin ze onder een
   combiketel hangen. De twee buitenste zijn de verwarmingskring -- aanvoer
   rood, retour blauw -- en de middelste is het gas. De twee ertussen zijn het
   tapwater: warm eruit, koud erin. */
const AANSLUITING = [
  { groep: "aanvoer", mat: "aanvoer", dx: -0.124, lengte: 0.52 },
  { groep: "warmwater", mat: "warmwater", dx: -0.062, lengte: 0.40 },
  { groep: "gas", mat: "gas", dx: 0.0, lengte: 0.60 },
  { groep: "koudwater", mat: "koudwater", dx: 0.062, lengte: 0.40 },
  { groep: "retour", mat: "retour", dx: 0.124, lengte: 0.52 },
] as const;

function Installatie({ mats }: { mats: Record<string, THREE.MeshStandardMaterial> }) {
  return (
    <group name="installatie">
      {/* De aansluitbalk waar de leidingen uit komen: het model heeft die niet,
          en zonder zo'n balk hangen vijf pijpen in de lucht. */}
      <Blok
        groep="ketel"
        mat={mats.ketelDonker}
        positie={[KETEL.x, KETEL.onder - 0.02, KETEL.z]}
        maat={[KETEL.breed * 0.86, 0.04, 0.3]}
      />

      {AANSLUITING.map((a) => (
        <Cilinder
          key={a.groep}
          groep={a.groep}
          mat={mats[a.mat]}
          positie={[KETEL.x + a.dx, KETEL.onder - 0.04 - a.lengte / 2, KETEL.z]}
          straal={0.011}
          hoogte={a.lengte}
        />
      ))}

      {/* Wartels bovenaan elke stomp: dat maakt er een aansluiting van in
          plaats van een afgesneden pijp. */}
      {AANSLUITING.map((a) => (
        <Cilinder
          key={`wartel-${a.groep}`}
          groep={a.groep}
          mat={mats.rvs}
          positie={[KETEL.x + a.dx, KETEL.onder - 0.07, KETEL.z]}
          straal={0.017}
          hoogte={0.05}
          zijden={6}
        />
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------------- */
/* De regie                                                               */
/* ---------------------------------------------------------------------- */

const GEDEMPT = new THREE.Color("#d9dcdf");

function Regie({
  hoofdstuk,
  bak,
}: {
  hoofdstuk: number;
  bak: Bak;
}) {
  const { camera } = useThree();
  const doel = useRef(new THREE.Vector3(...HOOFDSTUKKEN[0].stand.doel));
  const eersteKeer = useRef(true);

  /* Camerastand per hoofdstuk. Eén beweging van ongeveer een seconde, daarna
     staat het beeld stil. Bij het laden één keer wat langer, als rustige
     opening. */
  useEffect(() => {
    const h = HOOFDSTUKKEN[hoofdstuk] ?? HOOFDSTUKKEN[0];
    const duur = eersteKeer.current ? 1.8 : 1.0;
    const vanaf = eersteKeer.current
      ? { x: h.stand.oog[0] + 1.4, y: h.stand.oog[1] + 0.8, z: h.stand.oog[2] + 1.6 }
      : { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    if (eersteKeer.current) camera.position.set(vanaf.x, vanaf.y, vanaf.z);
    eersteKeer.current = false;

    const tw1 = gsap.to(camera.position, {
      x: h.stand.oog[0],
      y: h.stand.oog[1],
      z: h.stand.oog[2],
      duration: duur,
      ease: "power2.inOut",
      overwrite: true,
    });
    const tw2 = gsap.to(doel.current, {
      x: h.stand.doel[0],
      y: h.stand.doel[1],
      z: h.stand.doel[2],
      duration: duur,
      ease: "power2.inOut",
      overwrite: true,
    });
    return () => {
      tw1.kill();
      tw2.kill();
    };
  }, [hoofdstuk, camera]);

  /* Dempen en doorzichtigheid. Alleen het systeem dat aan het woord is houdt
     zijn kleur; de rest verkleurt naar hetzelfde lichtgrijs. */
  useEffect(() => {
    const h = HOOFDSTUKKEN[hoofdstuk] ?? HOOFDSTUKKEN[0];
    const alles = h.actief.length === 0;
    const systemen: Record<string, string[]> = {
      ketel: ["ketel", "ketelDonker", "display"],
      aanvoer: ["aanvoer"],
      retour: ["retour"],
      gas: ["gas"],
      rookgas: ["rookgas"],
      warmwater: ["koper"],
      koudwater: ["koper"],
      kraan: ["keramiek", "chroom"],
      radiator: ["radiator"],
      vloerverwarming: ["vloerverwarming"],
      meting: ["meterHuis", "meterPlaat", "meterWijzer", "rvs"],
    };
    const aan = new Set<string>();
    for (const groep of h.actief) for (const naam of systemen[groep] ?? []) aan.add(naam);

    for (const [naam, mat] of Object.entries(bak.materialen)) {
      if (naam.startsWith("wit")) continue;
      if (!mat.userData.basis) mat.userData.basis = mat.color.clone();
      const doelKleur = alles || aan.has(naam) ? mat.userData.basis : GEDEMPT;
      gsap.to(mat.color, { r: doelKleur.r, g: doelKleur.g, b: doelKleur.b, duration: 0.8, overwrite: true });
      if (mat.emissive) {
        gsap.to(mat, {
          emissiveIntensity: alles || aan.has(naam) ? 0.5 : 0.04,
          duration: 0.8,
          overwrite: true,
        });
      }
    }
    gsap.to(bak.materialen.witVloer, { opacity: h.vloer, duration: 0.8, overwrite: true });
    gsap.to(bak.materialen.witVerdieping, { opacity: h.verdieping, duration: 0.8, overwrite: true });
  }, [hoofdstuk, bak]);

  useFrame((_, delta) => {
    camera.lookAt(doel.current);
    /* De stroming: het streeppatroon schuift rustig door de leiding. Aanvoer
       en rookgas van de ketel af, retour ernaartoe. */
    for (const { mat, richting } of bak.stroming) {
      const kaart = mat.emissiveMap;
      if (kaart) kaart.offset.y = (kaart.offset.y - richting * delta * 0.16) % 1;
    }
  });

  return null;
}

function Licht() {
  return (
    <>
      <ambientLight intensity={1.1} />
      <hemisphereLight args={["#ffffff", "#dfe4e8", 0.75]} />
      <directionalLight position={[6, 8, 6]} intensity={1.9} />
      <directionalLight position={[-5, 4, 2]} intensity={0.55} />
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* De pagina                                                              */
/* ---------------------------------------------------------------------- */

export function RouteVanWarmte() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoofdstuk, setHoofdstuk] = useState(0);
  const [gemonteerd, setGemonteerd] = useState(false);
  const bak = useMemo(() => (gemonteerd ? bouwMaterialen() : null), [gemonteerd]);

  useEffect(() => setGemonteerd(true), []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !gemonteerd) return;

    const lenis = window.__lenis;
    const onLenis = () => ScrollTrigger.update();
    lenis?.on("scroll", onLenis);

    /* Scrollen kiest een hoofdstuk; het beeld wordt niet gescrubd. Iedere
       stop is één scherm hoog, zodat er per hoofdstuk één verhaal staat. */
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const i = Math.min(
          HOOFDSTUKKEN.length - 1,
          Math.max(0, Math.floor(self.progress * HOOFDSTUKKEN.length - 0.0001)),
        );
        setHoofdstuk((vorig) => (vorig === i ? vorig : i));
      },
    });

    return () => {
      lenis?.off("scroll", onLenis);
      trigger.kill();
    };
  }, [gemonteerd]);

  const naar = (i: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const hoogte = section.offsetHeight - window.innerHeight;
    const y = section.offsetTop + hoogte * ((i + 0.5) / HOOFDSTUKKEN.length);
    if (window.__lenis) window.__lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const huidig = HOOFDSTUKKEN[hoofdstuk] ?? HOOFDSTUKKEN[0];

  return (
    <section className="route" ref={sectionRef} aria-labelledby="route-titel">
      <div className="route-stage">
        <div className="route-canvas" aria-hidden="true">
          {gemonteerd && bak && (
            <Canvas
              camera={{ position: [6.8, 3.3, 6.6], fov: 34, near: 0.1, far: 80 }}
              dpr={[1, 2]}
              gl={{ antialias: true }}
              onCreated={({ gl }) => {
                gl.localClippingEnabled = true;
              }}
              style={{ background: "transparent" }}
            >
              <Licht />
              <Huis />
              <Installatie mats={bak.materialen} />
              <Regie hoofdstuk={hoofdstuk} bak={bak} />
            </Canvas>
          )}
        </div>

        {/* Alle tekst en navigatie staan buiten het canvas: leesbaar, te
            selecteren, en bruikbaar met toetsenbord en schermlezer. */}
        <div className="route-woord">
          <p className="route-reeks" id="route-titel">De route van warmte</p>

          <div className="route-verhaal">
          {HOOFDSTUKKEN.map((h, i) => (
            <article
              key={h.id}
              className="route-hoofdstuk"
              data-actief={i === hoofdstuk ? "1" : "0"}
              aria-hidden={i === hoofdstuk ? undefined : true}
            >
              <p className="route-nummer">
                Hoofdstuk {i + 1} van {HOOFDSTUKKEN.length}
              </p>
              <h2>{h.kop}</h2>
              <p>{h.tekst}</p>

              {h.id === "oplevering" && (
                <div className="route-rapport">
                  <p className="route-rapport-kop">
                    Opleverrapport <span>voorbeeld</span>
                  </p>
                  <dl>
                    <div><dt>Toestel</dt><dd>Wandhangende combiketel, ≤ 40 kW</dd></div>
                    <div><dt>Gasleiding</dt><dd>Beproefd op lekdichtheid — geen drukverlies</dd></div>
                    <div><dt>Rookgasafvoer</dt><dd>Concentrisch, dakdoorvoer gecontroleerd</dd></div>
                    <div><dt>Metingen</dt><dd>CO, O₂ en rookgastemperatuur vastgelegd</dd></div>
                    <div><dt>Bevindingen</dt><dd>Geen afwijkingen; installatie in bedrijf gesteld</dd></div>
                  </dl>
                  <p className="route-rapport-voet">
                    Een voorbeeld van wat er wordt vastgelegd. Uw eigen rapport bevat uw gemeten waarden.
                  </p>
                </div>
              )}
            </article>
          ))}
          </div>

          <nav className="route-nav" aria-label="Hoofdstukken">
            <ol>
              {HOOFDSTUKKEN.map((h, i) => (
                <li key={h.id}>
                  <button
                    type="button"
                    onClick={() => naar(i)}
                    aria-current={i === hoofdstuk ? "true" : undefined}
                  >
                    <span className="route-nav-nummer">{String(i + 1).padStart(2, "0")}</span>
                    {/* Alleen het hoofdstuk waar je bent draagt zijn naam. Zes
                        namen naast elkaar in kolommen van zestig pixels braken
                        midden in een woord. */}
                    {i === hoofdstuk && <span className="route-nav-naam">{h.kort}</span>}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      <p className="route-stand" aria-hidden="true">
        {String(hoofdstuk + 1).padStart(2, "0")} · {huidig.id}
      </p>
    </section>
  );
}
