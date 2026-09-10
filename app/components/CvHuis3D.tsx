"use client";

import { Edges } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* Het huis in 3D.

   Een echte scene, geen frame-reeks. Het verhaal loopt op scroll: buiten
   beginnen met het hele huis in de tuin, er als een drone omheen vliegen, de
   gevels openen, de woonkamer in, de vloer open voor de vloerverwarming, dan
   de verdeler, de ketel, de gasleiding, de rookgasafvoer door de schoorsteen,
   de aanvoer en retour naar de radiatoren, en tot slot weer wijder.

   Het dak en de tuin blijven altijd staan. Alleen de twee gevels aan de
   camerakant schuiven weg, en daardoor kijk je onder het dak door naar binnen.
   Dat betekent wel dat de camera bij de binnenstappen lager hangt dan eerst:
   met een dak erop kun je er niet meer van bovenaf in kijken.

   Alles wat aangewezen moet kunnen worden is een benoemd object met een groep.
   Oplichten werkt daardoor overal hetzelfde: de groepen die aan het woord zijn
   houden hun kleur, de rest verkleurt naar lichtgrijs. Dekkend, niet
   doorzichtig -- doorzichtig dempen gaf een mistbank waarin niets meer te zien
   was.

   ────────────────────────────────────────────────────────────────────────
   BIJSTUREN: alles staat in BEATS hieronder. Per stap:
     focus  waar de camera naar kijkt         [x, y, z] in meters
     zoom   pixels per meter — 40 is het hele erf, 300 is een leiding
     draai  hoek om het huis in graden — 45 is de werkstand voor binnen,
            de rondgang aan het begin loopt van 8 naar 72
     hoogte hoe hoog de camera hangt (0,52 binnen tot 0,9 bij de rondgang)
     open   0 = gevels dicht, 1 = voorgevel en rechtergevel weg
     vloer  0 = vloer dicht, 1 = vloerdek weg, slangen zichtbaar
     actief welke groepen oplichten ([] = alles even zwaar)
   De lengte van de reis is de hoogte van .huis3d in huis3d.css; HOUD bepaalt
   hoe lang een tekst stilstaat ten opzichte van het reizen ertussen.
   ──────────────────────────────────────────────────────────────────────── */

gsap.registerPlugin(ScrollTrigger);

const HOUD = 0.55;

type Beat = {
  id: string;
  kop: string;
  tekst: string;
  focus: [number, number, number];
  zoom: number;
  draai: number;
  hoogte: number;
  open: number;
  vloer: number;
  actief: string[];
};

const BEATS: Beat[] = [
  {
    id: "buiten",
    kop: "Een nieuwe ketel staat nooit op zichzelf.",
    tekst: "Het toestel is één onderdeel van een installatie die door het hele huis loopt.",
    focus: [0, 3.8, 0],
    zoom: 40,
    draai: 8,
    hoogte: 0.78,
    open: 0,
    vloer: 0,
    actief: [],
  },
  {
    id: "rondgang",
    kop: "Van buiten ziet u er niets van.",
    tekst: "Wat er binnen ligt bepaalt wat er kan: de ruimte voor het toestel, de route van de leidingen, de weg naar buiten.",
    focus: [0, 3.8, 0],
    zoom: 42,
    draai: 72,
    hoogte: 0.9,
    open: 0,
    vloer: 0,
    actief: [],
  },
  {
    id: "open",
    kop: "Dit zit er achter de muur.",
    tekst: "Twee verdiepingen, radiatoren aan de muren, vloerverwarming in de begane grond, en één toestel dat het allemaal voedt.",
    focus: [-0.4, 2.2, -0.6],
    zoom: 52,
    draai: 45,
    hoogte: 0.66,
    open: 1,
    vloer: 0,
    actief: [],
  },
  {
    id: "woonkamer",
    kop: "De woonkamer.",
    tekst: "Hier moet het warm worden. Hoe groot de ruimte is en hoe goed hij geïsoleerd is, bepaalt wat het toestel moet kunnen.",
    focus: [2.6, 0.9, -0.4],
    zoom: 100,
    draai: 48,
    hoogte: 0.6,
    open: 1,
    vloer: 0,
    actief: ["meubel", "radiator"],
  },
  {
    id: "vloer",
    kop: "Onder de vloer ligt de vloerverwarming.",
    tekst: "Slangen in banen naast elkaar, door het hele grondvlak. Een lage temperatuur over een groot oppervlak, en dus een gelijkmatige warmte.",
    focus: [0.8, 0.1, 0.0],
    zoom: 126,
    draai: 45,
    hoogte: 0.72,
    open: 1,
    vloer: 1,
    actief: ["vloerverwarming"],
  },
  {
    id: "verdeler",
    kop: "De verdeler.",
    tekst: "Alle slangen komen samen op één verdeler, laag tegen de muur naast de ketel. Daar wordt per groep afgesteld.",
    focus: [-4.2, 0.8, -2.4],
    zoom: 195,
    draai: 45,
    hoogte: 0.6,
    open: 1,
    vloer: 1,
    actief: ["verdeler", "vloerverwarming"],
  },
  {
    id: "ketel",
    kop: "De cv-ketel.",
    tekst: "Wandhangend, tot en met 40 kW. Wij plaatsen en onderhouden Intergas, Remeha, Nefit en Vaillant.",
    focus: [-2.4, 1.75, -2.3],
    zoom: 180,
    draai: 45,
    hoogte: 0.62,
    open: 1,
    vloer: 1,
    actief: ["ketel"],
  },
  {
    id: "gas",
    kop: "De gasleiding.",
    tekst: "Die beproeven we op lekdichtheid. Aannemen dat hij goed is, is geen controle.",
    focus: [-2.4, 0.72, -2.4],
    zoom: 285,
    draai: 45,
    hoogte: 0.56,
    open: 1,
    vloer: 1,
    actief: ["gas"],
  },
  {
    id: "rookgas",
    kop: "De rookgasafvoer.",
    tekst: "Vanaf de bovenkant van de ketel omhoog, door de verdieping en de schoorsteen naar buiten. Bij een nieuwe ketel gaat die mee.",
    focus: [-2.4, 5.0, -2.3],
    zoom: 78,
    draai: 40,
    hoogte: 0.52,
    open: 1,
    vloer: 1,
    actief: ["rookgas"],
  },
  {
    id: "cv",
    kop: "Aanvoer en retour.",
    tekst: "De eerste en de laatste leiding onder de ketel. Verwarmd water naar de radiatoren, afgekoeld water terug.",
    focus: [0.2, 0.9, -3.0],
    zoom: 76,
    draai: 45,
    hoogte: 0.66,
    open: 1,
    vloer: 1,
    actief: ["aanvoer", "retour", "radiator"],
  },
  {
    id: "systeem",
    kop: "Wie het plaatst, onderhoudt het daarna.",
    tekst: "Eén installatie, van de gasleiding tot de laatste radiator. Dezelfde mensen doen het advies, de plaatsing en de jaarlijkse beurt.",
    focus: [-0.4, 2.0, -0.8],
    zoom: 46,
    draai: 45,
    hoogte: 0.7,
    open: 1,
    vloer: 1,
    actief: [],
  },
];

const KLEUR = {
  steen: "#ffffff", // de baksteentextuur draagt de kleur; wit laat hem door
  binnenmuur: "#efe9e2",
  stuc: "#f4efe8",
  vloerdek: "#d8c4a6",
  zand: "#cec5b5",
  beton: "#d0d0cb",
  dakpan: "#5f6469",
  nok: "#53585d",
  goot: "#9aa1a7",
  kozijn: "#f7f7f6",
  glas: "#bfd4e2",
  deur: "#2f4f6b",
  aarde: "#6a5c4c",
  haag: "#6d8f5b",
  struik: "#7fa268",
  pad: "#cdc7bd",
  ketel: "#f4f6f8",
  ketelPaneel: "#8f9ba7",
  verdeler: "#c3cad1",
  rookgas: "#8e959c",
  gas: "#e0a621",
  koudwater: "#3079c6",
  warmwater: "#c8443a",
  aanvoer: "#c8443a",
  retour: "#3079c6",
  vloerverwarming: "#d16a4e",
  radiator: "#f6f7f8",
  radiatorRib: "#dfe4e8",
  stof: "#7d8a93",
  stofLicht: "#b9bfc4",
  hout: "#a8834f",
  houtLicht: "#c9ac82",
  keuken: "#e8e4dd",
  blad: "#4a4f54",
} as const;

const R16 = 0.008;
const R22 = 0.011;
const R_ROOKGAS = 0.065;

const GEDEMPT = new THREE.Color("#e9e8e4");
const RAND = new THREE.Color("#26313c");
const RAND_GEDEMPT = new THREE.Color("#d0cfcb");

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
const meng = (a: number, b: number, t: number) => a + (b - a) * t;

const venster = (i: number) => {
  const stap = 1 / BEATS.length;
  const midden = i * stap + stap / 2;
  const half = (stap * HOUD) / 2;
  return [midden - half, midden + half] as const;
};

const lees = (p: number) => {
  const laatste = BEATS.length - 1;
  for (let i = 0; i <= laatste; i += 1) {
    const [van, tot] = venster(i);
    if (p <= van) {
      if (i === 0) return { van: BEATS[0], naar: BEATS[0], t: 0, index: 0 };
      const [, vorigeTot] = venster(i - 1);
      const t = smoothstep((p - vorigeTot) / Math.max(0.0001, van - vorigeTot));
      return { van: BEATS[i - 1], naar: BEATS[i], t, index: t < 0.5 ? i - 1 : i };
    }
    if (p <= tot) return { van: BEATS[i], naar: BEATS[i], t: 0, index: i };
  }
  return { van: BEATS[laatste], naar: BEATS[laatste], t: 0, index: laatste };
};

/* ---------------------------------------------------------------------- */
/* Texturen                                                               */
/* ---------------------------------------------------------------------- */

/* Hoeveel meter één keer de tekening beslaat. Bij de baksteen is dat te
   tellen: ongeveer vijf strekken naast elkaar en zestien lagen boven elkaar,
   dus een meter in het vierkant. De dakpannen zijn een tegel van twee meter.
   Deze getallen bepalen alles: de herhaling wordt er per vlak uit gerekend,
   zodat een gevel van twaalf meter er twaalf keer op krijgt en een kozijn van
   een halve meter een halve. Zonder dat wordt elke textuur een sticker die op
   het ene vlak uitgerekt is en op het andere geplet. */
const TEGEL = { baksteen: 1.0, dakpan: 2.0, gras: 2.0, grond: 1.2 };

type Set = { kleur: THREE.Texture; relief: THREE.Texture | null; ruw?: THREE.Texture };

/* Een gekloonde textuur deelt zijn bron met het origineel maar houdt zijn
   eigen herhaling -- en zijn eigen versienummer. Laadt het plaatje pas ná het
   klonen, dan blijft de kloon leeg tenzij hij alsnog te horen krijgt dat er
   iets te uploaden valt. Vandaar dit register. */
const KLONEN: THREE.Texture[] = [];

function laad(url: string, srgb: boolean) {
  const t = new THREE.TextureLoader().load(url, (geladen) => {
    for (const k of KLONEN) if (k.source === geladen.source) k.needsUpdate = true;
  });
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function kloon(t: THREE.Texture) {
  const k = t.clone();
  k.wrapS = THREE.RepeatWrapping;
  k.wrapT = THREE.RepeatWrapping;
  KLONEN.push(k);
  return k;
}

let SETS: Record<"baksteen" | "dakpan" | "gras" | "grond", Set> | null = null;
function sets() {
  if (!SETS) {
    SETS = {
      baksteen: {
        kleur: laad("/huis3d/baksteen-diff.jpg", true),
        relief: laad("/huis3d/baksteen-nor.jpg", false),
      },
      dakpan: {
        kleur: laad("/huis3d/dakpan-diff.jpg", true),
        relief: laad("/huis3d/dakpan-nor.jpg", false),
      },
      gras: {
        kleur: laad("/huis3d/gras-diff.jpg", true),
        relief: laad("/huis3d/gras-nor.jpg", false),
        ruw: laad("/huis3d/gras-rough.jpg", false),
      },
      grond: {
        kleur: laad("/huis3d/grond-diff.jpg", true),
        relief: laad("/huis3d/grond-nor.jpg", false),
        ruw: laad("/huis3d/grond-rough.jpg", false),
      },
    };
  }
  return SETS;
}

/* Zes materialen voor de zes vlakken van een blok, elk met de herhaling die
   bij de ware maat van dát vlak hoort. De volgorde is die van three: +x, -x,
   +y, -y, +z, -z. */
function vlakken(maat: [number, number, number], set: Set, tegel: number, tint = "#ffffff") {
  const [w, h, d] = maat;
  const paren: Array<[number, number]> = [
    [d, h], [d, h],
    [w, d], [w, d],
    [w, h], [w, h],
  ];
  return paren.map(([u, v]) => {
    const kleur = kloon(set.kleur);
    kleur.repeat.set(Math.max(0.04, u / tegel), Math.max(0.04, v / tegel));
    const m = new THREE.MeshStandardMaterial({
      map: kleur,
      color: new THREE.Color(tint),
      roughness: 0.96,
      metalness: 0,
    });
    if (set.relief) {
      const relief = kloon(set.relief);
      relief.repeat.copy(kleur.repeat);
      m.normalMap = relief;
      m.normalScale = new THREE.Vector2(0.8, 0.8);
    }
    return m;
  });
}

/* Een blok met een echte textuur erop. */
function Bekleed({
  groep,
  soort,
  positie = [0, 0, 0],
  maat,
  rotatie,
  tint = "#ffffff",
}: {
  groep: string;
  soort: "baksteen" | "dakpan" | "gras" | "grond";
  positie?: [number, number, number];
  maat: [number, number, number];
  rotatie?: [number, number, number];
  tint?: string;
}) {
  const materialen = useMemo(() => vlakken(maat, sets()[soort], TEGEL[soort], tint), [maat, soort, tint]);
  return (
    <mesh
      position={positie}
      rotation={rotatie}
      material={materialen}
      userData={{ groep, basis: tint }}
    >
      <boxGeometry args={maat} />
      <Edges threshold={20} color={RAND} />
    </mesh>
  );
}

/* ---------------------------------------------------------------------- */
/* Bouwstenen                                                             */
/* ---------------------------------------------------------------------- */

type DeelProps = {
  groep: string;
  kleur: string;
  positie?: [number, number, number];
  maat: [number, number, number];
  rotatie?: [number, number, number];
  rand?: boolean;
};

function Deel({ groep, kleur, positie = [0, 0, 0], maat, rotatie, rand = true }: DeelProps) {
  return (
    <mesh position={positie} rotation={rotatie} userData={{ groep, basis: kleur }}>
      <boxGeometry args={maat} />
      <meshStandardMaterial color={kleur} roughness={0.94} metalness={0} />
      {rand && <Edges threshold={20} color={RAND} />}
    </mesh>
  );
}

/* Een gevel: gemetseld blok met de herhaling per vlak op ware maat. */
function Gevel({
  positie,
  maat,
  rotatie,
}: {
  positie: [number, number, number];
  maat: [number, number, number];
  rotatie?: [number, number, number];
}) {
  return <Bekleed groep="huis" soort="baksteen" positie={positie} maat={maat} rotatie={rotatie} />;
}

/* Een raam: kozijn met glas erin, plus een vensterbank. */
function Raam({
  positie,
  breed = 1.6,
  hoog = 1.3,
  draai = 0,
}: {
  positie: [number, number, number];
  breed?: number;
  hoog?: number;
  draai?: number;
}) {
  return (
    <group position={positie} rotation={[0, THREE.MathUtils.degToRad(draai), 0]}>
      <Deel groep="huis" kleur={KLEUR.kozijn} maat={[breed, hoog, 0.1]} />
      <Deel groep="huis" kleur={KLEUR.glas} positie={[0, 0, 0.03]} maat={[breed - 0.18, hoog - 0.18, 0.06]} rand={false} />
      <Deel groep="huis" kleur={KLEUR.kozijn} positie={[0, 0, 0.04]} maat={[0.06, hoog - 0.18, 0.06]} rand={false} />
      <Deel groep="huis" kleur={KLEUR.kozijn} positie={[0, -hoog / 2 - 0.05, 0.04]} maat={[breed + 0.16, 0.08, 0.24]} />
    </group>
  );
}

function Voordeur({ positie }: { positie: [number, number, number] }) {
  return (
    <group position={positie}>
      <Deel groep="huis" kleur={KLEUR.kozijn} maat={[1.16, 2.26, 0.1]} />
      <Deel groep="huis" kleur={KLEUR.deur} positie={[0, -0.04, 0.05]} maat={[1.0, 2.1, 0.07]} />
      <Deel groep="huis" kleur={KLEUR.glas} positie={[0, 0.55, 0.09]} maat={[0.44, 0.7, 0.03]} rand={false} />
      <Deel groep="huis" kleur={KLEUR.goot} positie={[0.36, -0.06, 0.11]} maat={[0.05, 0.3, 0.05]} rand={false} />
    </group>
  );
}

type BuisProps = {
  groep: string;
  kleur: string;
  van: [number, number, number];
  naar: [number, number, number];
  dikte?: number;
};

function Buis({ groep, kleur, van, naar, dikte = R22 }: BuisProps) {
  const { positie, rotatie, lengte } = useMemo(() => {
    const a = new THREE.Vector3(...van);
    const b = new THREE.Vector3(...naar);
    const richting = new THREE.Vector3().subVectors(b, a);
    const l = richting.length();
    const midden = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      richting.clone().normalize(),
    );
    const e = new THREE.Euler().setFromQuaternion(q);
    return {
      positie: [midden.x, midden.y, midden.z] as [number, number, number],
      rotatie: [e.x, e.y, e.z] as [number, number, number],
      lengte: l,
    };
  }, [van, naar]);

  return (
    <mesh position={positie} rotation={rotatie} userData={{ groep, basis: kleur }}>
      <cylinderGeometry args={[dikte, dikte, lengte, 10]} />
      <meshStandardMaterial color={kleur} roughness={0.85} metalness={0.1} />
    </mesh>
  );
}

/* Een reeks punten aan elkaar geregen, zodat een leiding een pad heeft in
   plaats van losse stukken. */
function Route({
  groep,
  kleur,
  punten,
  dikte = R22,
}: {
  groep: string;
  kleur: string;
  punten: Array<[number, number, number]>;
  dikte?: number;
}) {
  return (
    <>
      {punten.slice(0, -1).map((p, i) => (
        <Buis key={i} groep={groep} kleur={kleur} van={p} naar={punten[i + 1]} dikte={dikte} />
      ))}
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* De tuin                                                                */
/* ---------------------------------------------------------------------- */

/* Het gazon.

   Twee aangeleverde sets vormen samen de grond: leafy_grass als begroeiing en
   gray_rocks waar de ondergrond doorkomt. Eerlijk gezegd is dat geen strak
   gazon -- de eerste is bladstrooisel, de tweede is grind -- dus dit leest als
   een natuurlijke, licht herfstige tuin. Wil je een geschoren grasmat, dan is
   daar een grasmat-textuur voor nodig; de koppeling hieronder blijft gelijk.

   Eén materiaal, één tekenopdracht. De herhaling wordt gebroken in de shader:
   dezelfde kaarten worden op drie schalen en drie hoeken bemonsterd en met
   laagfrequente ruis door elkaar gemengd. Daar bovenop een tweede masker dat
   het grind laat doorkomen, en een derde dat kleur en ruwheid laat variëren.
   Zonder dat zie je op een erf van vierentwintig meter meteen het raster. */

/* De menging als lagen, niet als berekening.

   Twee eerdere pogingen sneuvelden: onBeforeCompile wordt in deze three-build
   niet aangeroepen, en het vooraf bakken van één grote tegel op een canvas
   liep vast -- een geroteerde patroonvulling over zo'n vlak is zonder
   grafische kaart loodzwaar en blokkeert de hele pagina.

   Wat wél werkt en niets kost: dezelfde kaarten drie keer over elkaar leggen,
   elk op een andere schaal en onder een andere hoek. Three kan een textuur
   zelf draaien en herhalen, dus daar komt geen shader aan te pas. De bovenste
   twee lagen krijgen een wolkerig maskertje mee, zodat ze in vlekken
   doorkomen in plaats van als een tweede raster. Zo is er nergens een
   herhaling die het oog kan vastpakken. */

/* Het wolkerige masker: zachte vlekken op een klein doek. Elke vlek wordt
   negen keer getekend, één keer per buurpositie, zodat hij over de rand
   doorloopt en het masker naadloos blijft. */
function maskerTextuur(vlekken: number, sterkte: number) {
  const M = 256;
  const c = document.createElement("canvas");
  c.width = M;
  c.height = M;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#000000";
  g.fillRect(0, 0, M, M);
  for (let i = 0; i < vlekken; i += 1) {
    const x = Math.random() * M;
    const y = Math.random() * M;
    const r = M * (0.08 + Math.random() * 0.22);
    const a = sterkte * (0.5 + Math.random() * 0.5);
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        const px = x + dx * M;
        const py = y + dy * M;
        const grad = g.createRadialGradient(px, py, 0, px, py, r);
        grad.addColorStop(0, `rgba(255,255,255,${a})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = grad;
        g.beginPath();
        g.arc(px, py, r, 0, Math.PI * 2);
        g.fill();
      }
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  return t;
}

/* Eén laag van het maaiveld: dezelfde kaarten, eigen tegelmaat en eigen hoek. */
function grondLaag(
  soort: "gras" | "grond",
  tegel: number,
  hoek: number,
  masker: THREE.Texture | null,
  volgorde: number,
) {
  const set = sets()[soort];
  const kleur = kloon(set.kleur);
  const relief = set.relief ? kloon(set.relief) : null;
  const herhaling = new THREE.Vector2(24 / tegel, 19 / tegel);
  for (const t of [kleur, relief]) {
    if (!t) continue;
    t.repeat.copy(herhaling);
    t.center.set(0.5, 0.5);
    t.rotation = hoek;
  }
  if (masker) {
    /* Het masker staat bewust op een heel andere maat dan de kaarten: zo valt
       een vlek nooit samen met een tegelrand. */
    masker.repeat.set(2.1, 1.7);
  }
  const m = new THREE.MeshStandardMaterial({
    map: kleur,
    normalMap: relief ?? undefined,
    ...(masker ? { alphaMap: masker } : {}),
    transparent: !!masker,
    depthWrite: !masker,
    /* Licht vochtig: net onder dof, zodat het gazon een zachte glans krijgt
       in plaats van stof te zijn. */
    roughness: 0.84,
    metalness: 0,
    polygonOffset: true,
    polygonOffsetFactor: -volgorde,
    polygonOffsetUnits: -volgorde,
  });
  m.normalScale = new THREE.Vector2(0.9, 0.9);
  /* Een lichte correctie naar natuurlijk groen. Niet fel: dit haalt het
     roodbruin van het blad iets terug en laat de groene delen staan. */
  m.color = new THREE.Color(soort === "gras" ? "#b9c6a6" : "#b3b0a8");
  return m;
}

/* Het maaiveld: geen vlakke plaat maar een licht golvend vlak. De uitslag is
   klein -- ruim vier centimeter -- en zakt naar nul bij de gevels, zodat het
   terrein ongelijk oogt maar nergens onder het huis vandaan komt. */
function Gazon() {
  const geometrie = useMemo(() => {
    const g = new THREE.PlaneGeometry(24, 19, 120, 96);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    const hash = (x: number, z: number) => {
      const n = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
      return n - Math.floor(n);
    };
    const zacht = (x: number, z: number) => {
      const xi = Math.floor(x);
      const zi = Math.floor(z);
      const xf = x - xi;
      const zf = z - zi;
      const u = xf * xf * (3 - 2 * xf);
      const v = zf * zf * (3 - 2 * zf);
      const a = hash(xi, zi);
      const b = hash(xi + 1, zi);
      const c = hash(xi, zi + 1);
      const d = hash(xi + 1, zi + 1);
      return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
    };
    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const golf = 0.6 * zacht(x * 0.22, z * 0.22) + 0.4 * zacht(x * 0.55, z * 0.55);
      /* Vlak houden onder en vlak naast het huis: het huis staat op 12 bij 9,
         en binnen een halve meter daarbuiten mag er niets meer bewegen. */
      const buiten = Math.max(Math.abs(x) / 6.5, Math.abs(z) / 5.0);
      const demping = Math.min(1, Math.max(0, (buiten - 1) / 0.6));
      pos.setY(i, (golf - 0.5) * 0.09 * demping);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  const lagen = useMemo(
    () => [
      grondLaag("gras", 2.0, 0, null, 0),
      grondLaag("gras", 3.4, 0.95, maskerTextuur(16, 0.95), 1),
      grondLaag("grond", 2.6, 0.55, maskerTextuur(9, 0.7), 2),
    ],
    [],
  );

  return (
    <group position={[0, -0.44, 0]}>
      {lagen.map((materiaal, i) => (
        <mesh
          key={i}
          geometry={geometrie}
          material={materiaal}
          userData={{ groep: "tuin", basis: "#" + materiaal.color.getHexString() }}
        />
      ))}
    </group>
  );
}

function Tuin() {
  const struiken: Array<[number, number, number]> = [
    [-3.6, 4.9], [-2.8, 5.0], [4.0, 4.9], [4.9, 5.1], [-5.2, 5.0],
  ].map(([x, z]) => [x, -0.28, z]);

  return (
    <group name="tuin">
      {/* Het grondlichaam onder het maaiveld, zodat het erf een rand heeft */}
      {/* Het grondlichaam ligt bewust twee centimeter lager dan het maaiveld.
          Lagen ze gelijk, dan vechten ze om dezelfde diepte en wint de plaat --
          en dan is het gazon een egale bruine vlek. */}
      <Deel groep="tuin" kleur={KLEUR.aarde} positie={[0, -0.64, 0]} maat={[24, 0.34, 19]} />
      <Gazon />

      {/* Het pad naar de voordeur: hetzelfde grind als in de grond */}
      <Bekleed groep="tuin" soort="grond" positie={[1.6, -0.42, 6.9]} maat={[1.5, 0.1, 4.8]} />
      <Bekleed groep="tuin" soort="grond" positie={[1.6, -0.42, 4.72]} maat={[2.6, 0.1, 0.9]} />

      {/* De haag rond het erf */}
      <Deel groep="tuin" kleur={KLEUR.haag} positie={[0, -0.1, 9.3]} maat={[24, 0.72, 0.5]} />
      <Deel groep="tuin" kleur={KLEUR.haag} positie={[0, -0.1, -9.3]} maat={[24, 0.72, 0.5]} />
      <Deel groep="tuin" kleur={KLEUR.haag} positie={[-11.8, -0.1, 0]} maat={[0.5, 0.72, 19]} />
      <Deel groep="tuin" kleur={KLEUR.haag} positie={[11.8, -0.1, 0]} maat={[0.5, 0.72, 19]} />

      {/* Struiken tegen de voorgevel */}
      {struiken.map(([x, y, z], i) => (
        <Deel key={i} groep="tuin" kleur={KLEUR.struik} positie={[x, y, z]} maat={[0.7, 0.62, 0.7]} />
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------------- */
/* Het huis                                                               */
/* ---------------------------------------------------------------------- */

const VLOER_Y = 0.16;

function Huis({ open, vloer }: { open: React.RefObject<number>; vloer: React.RefObject<number> }) {
  const gevelVoor = useRef<THREE.Group>(null);
  const gevelRechts = useRef<THREE.Group>(null);
  const vloerdek = useRef<THREE.Group>(null);

  /* Alleen de twee gevels aan de camerakant schuiven weg. Het dak blijft
     staan -- dat was de opdracht -- en dus kijk je er onderdoor naar binnen in
     plaats van erin. */
  useFrame(() => {
    const o = open.current ?? 0;
    const v = vloer.current ?? 0;
    if (gevelVoor.current) {
      gevelVoor.current.position.z = o * 11;
      gevelVoor.current.visible = o < 0.9;
    }
    if (gevelRechts.current) {
      gevelRechts.current.position.x = o * 11;
      gevelRechts.current.visible = o < 0.9;
    }
    if (vloerdek.current) {
      vloerdek.current.position.y = v * 1.5;
      vloerdek.current.visible = v < 0.92;
    }
  });

  return (
    <group name="huis">
      {/* Fundering en zandbed */}
      <Deel groep="huis" kleur={KLEUR.beton} positie={[0, -0.3, 0]} maat={[12.4, 0.36, 9.4]} />
      <Deel groep="huis" kleur={KLEUR.zand} positie={[0, -0.06, 0]} maat={[12, 0.12, 9]} />

      {/* Verdiepingsvloer. De rand ligt op x = 0: de zichtlijn naar de ketel
          kruist dit vlak rond x = -1,2, en ligt de vloer daar nog, dan schuift
          hij precies voor het toestel langs. */}
      <Deel groep="huis" kleur={KLEUR.vloerdek} positie={[3, 2.92, 0]} maat={[6, 0.24, 9]} />

      {/* De gevels die blijven staan */}
      <Gevel positie={[0, 2.9, -4.5]} maat={[12, 5.9, 0.24]} />
      <Gevel positie={[-6, 2.9, 0]} maat={[0.24, 5.9, 9]} />

      {/* Binnenwanden, gestuukt */}
      <Deel groep="huis" kleur={KLEUR.binnenmuur} positie={[-3.4, 1.45, -2.62]} maat={[5.2, 2.9, 0.18]} />
      <Deel groep="huis" kleur={KLEUR.binnenmuur} positie={[2.2, 4.4, -1.8]} maat={[0.16, 2.7, 5]} />
      <Deel groep="huis" kleur={KLEUR.binnenmuur} positie={[-0.4, 1.45, -4.3]} maat={[0.16, 2.9, 0.4]} />

      {/* Ramen in de gevels die blijven staan */}
      <Raam positie={[3.4, 1.6, -4.34]} breed={2.4} hoog={1.4} />
      <Raam positie={[3.4, 4.45, -4.34]} breed={2.4} hoog={1.3} />
      <Raam positie={[-2.0, 4.45, -4.34]} breed={1.4} hoog={1.3} />
      <Raam positie={[-5.84, 1.6, 1.8]} breed={2.2} hoog={1.4} draai={90} />
      <Raam positie={[-5.84, 4.45, 1.4]} breed={1.6} hoog={1.3} draai={90} />

      {/* De trap */}
      <group name="trap">
        {Array.from({ length: 9 }, (_, i) => (
          <Deel
            key={i}
            groep="huis"
            kleur={KLEUR.houtLicht}
            positie={[0.9, VLOER_Y + 0.16 + i * 0.31, 3.9 - i * 0.29]}
            maat={[1.1, 0.14, 0.3]}
          />
        ))}
      </group>

      {/* Het vloerdek dat wegschuift */}
      <group ref={vloerdek}>
        <Deel groep="huis" kleur={KLEUR.vloerdek} positie={[0, 0.1, 0]} maat={[12, 0.12, 9]} />
      </group>

      {/* De gevels die wijken. De voordeur en de ramen zitten hierin: bij het
          openen gaan ze mee naar buiten. */}
      <group ref={gevelVoor}>
        <Gevel positie={[0, 2.9, 4.5]} maat={[12, 5.9, 0.24]} />
        <Voordeur positie={[1.6, 1.28, 4.65]} />
        <Raam positie={[-2.6, 1.6, 4.66]} breed={2.6} hoog={1.5} />
        <Raam positie={[4.2, 1.6, 4.66]} breed={1.6} hoog={1.4} />
        <Raam positie={[-2.6, 4.45, 4.66]} breed={1.8} hoog={1.3} />
        <Raam positie={[1.6, 4.45, 4.66]} breed={1.4} hoog={1.3} />
        <Raam positie={[4.2, 4.45, 4.66]} breed={1.4} hoog={1.3} />
      </group>
      <group ref={gevelRechts}>
        <Gevel positie={[6, 2.9, 0]} maat={[0.24, 5.9, 9]} />
        <Raam positie={[6.16, 1.6, -1.4]} breed={2.0} hoog={1.4} draai={90} />
        <Raam positie={[6.16, 4.45, 1.4]} breed={1.6} hoog={1.3} draai={90} />
      </group>

      <Dak open={open} />
    </group>
  );
}

/* Het dak: twee schilden, een nokvorst, dakgoten met hemelwaterafvoer, twee
   topgevels en een gemetselde schoorsteen. Blijft altijd staan. */
function Dak({ open }: { open: React.RefObject<number> }) {
  const nabij = useRef<THREE.Group>(null);

  /* Het dakschild aan de camerakant gaat mee met de gevels. Het dak blijft
     staan -- nok, schoorsteen, goten en beide topgevels blijven -- maar dit ene
     vlak moet weg, anders snijdt het precies de zichtlijn naar de ketel af: die
     hangt in de verste hoek, en elke blik daarheen verlaat het huis boven de
     goot. Van buiten, als alles dicht is, is het gewoon een compleet dak. */
  useFrame(() => {
    const o = open.current ?? 0;
    if (nabij.current) nabij.current.visible = o < 0.35;
  });

  return (
    <group name="dak">
      <Bekleed
        groep="huis"
        soort="dakpan"
        positie={[0, 7.05, -2.42]}
        maat={[12.9, 0.26, 5.6]}
        tint="#cfae94"
        rotatie={[THREE.MathUtils.degToRad(-26), 0, 0]}
      />
      <group ref={nabij}>
        <Bekleed
          groep="huis"
          soort="dakpan"
          positie={[0, 7.05, 2.42]}
          maat={[12.9, 0.26, 5.6]}
          tint="#cfae94"
          rotatie={[THREE.MathUtils.degToRad(26), 0, 0]}
        />
      </group>
      <Deel groep="huis" kleur={KLEUR.nok} positie={[0, 8.5, 0]} maat={[13, 0.2, 0.32]} />

      {/* Dakgoten langs beide gootlijnen, met twee regenpijpen */}
      <Deel groep="huis" kleur={KLEUR.goot} positie={[0, 5.74, 4.86]} maat={[13, 0.18, 0.24]} />
      <Deel groep="huis" kleur={KLEUR.goot} positie={[0, 5.74, -4.86]} maat={[13, 0.18, 0.24]} />
      <Deel groep="huis" kleur={KLEUR.goot} positie={[-6.2, 2.6, 4.86]} maat={[0.14, 6.3, 0.14]} />
      <Deel groep="huis" kleur={KLEUR.goot} positie={[6.2, 2.6, -4.86]} maat={[0.14, 6.3, 0.14]} />

      <Topgevel x={-6.06} />
      <Topgevel x={6.06} />

      {/* De schoorsteen waar de rookgasafvoer doorheen komt */}
      <Schoorsteen />
    </group>
  );
}

function Schoorsteen() {
  return (
    <group name="schoorsteen" position={[-2.4, 0, -2.3]}>
      <Bekleed groep="huis" soort="baksteen" positie={[0, 7.6, 0]} maat={[0.9, 2.6, 0.9]} />
      <Deel groep="huis" kleur={KLEUR.nok} positie={[0, 8.98, 0]} maat={[1.08, 0.16, 1.08]} />
    </group>
  );
}

/* De topgevel is geen blok maar een driehoek, dus hij krijgt zijn textuur
   anders: de uv's van een extrusie zijn de vormcoördinaten zelf, en die staan
   al in meters. Eén gedeeld door de tegelmaat is dus meteen de goede
   herhaling. */
function Topgevel({ x }: { x: number }) {
  const vorm = useMemo(() => {
    const s = new THREE.Shape();
    /* Zo diep als het dak reikt (z van -4,9 tot 4,9), niet zo breed als het
       huis lang is. Stond hier 6,4, en dan steekt de gevel een meter voor en
       achter het dak uit. */
    s.moveTo(-4.9, 0);
    s.lineTo(4.9, 0);
    s.lineTo(0, 2.72);
    s.closePath();
    return s;
  }, []);

  const materiaal = useMemo(() => {
    const set = sets().baksteen;
    const kleur = kloon(set.kleur);
    kleur.repeat.set(1 / TEGEL.baksteen, 1 / TEGEL.baksteen);
    const m = new THREE.MeshStandardMaterial({ map: kleur, roughness: 0.96, metalness: 0 });
    if (set.relief) {
      const relief = kloon(set.relief);
      relief.repeat.copy(kleur.repeat);
      m.normalMap = relief;
      m.normalScale = new THREE.Vector2(0.8, 0.8);
    }
    return m;
  }, []);

  return (
    <mesh
      position={[x, 5.78, 0]}
      rotation={[0, THREE.MathUtils.degToRad(90), 0]}
      material={materiaal}
      userData={{ groep: "huis", basis: "#ffffff" }}
    >
      <extrudeGeometry args={[vorm, { depth: 0.22, bevelEnabled: false }]} />
      <Edges threshold={20} color={RAND} />
    </mesh>
  );
}

/* ---------------------------------------------------------------------- */
/* Meubels                                                                */
/* ---------------------------------------------------------------------- */

function Bank({ positie, draai = 0 }: { positie: [number, number, number]; draai?: number }) {
  return (
    <group position={positie} rotation={[0, THREE.MathUtils.degToRad(draai), 0]}>
      <Deel groep="meubel" kleur={KLEUR.stof} positie={[0, 0.2, 0]} maat={[2.4, 0.28, 0.92]} />
      <Deel groep="meubel" kleur={KLEUR.stofLicht} positie={[-0.6, 0.42, 0.02]} maat={[1.1, 0.18, 0.82]} />
      <Deel groep="meubel" kleur={KLEUR.stofLicht} positie={[0.6, 0.42, 0.02]} maat={[1.1, 0.18, 0.82]} />
      <Deel groep="meubel" kleur={KLEUR.stof} positie={[0, 0.52, -0.4]} maat={[2.4, 0.62, 0.16]} />
      <Deel groep="meubel" kleur={KLEUR.stof} positie={[-1.14, 0.42, 0]} maat={[0.14, 0.42, 0.92]} />
      <Deel groep="meubel" kleur={KLEUR.stof} positie={[1.14, 0.42, 0]} maat={[0.14, 0.42, 0.92]} />
      {[-1.05, 1.05].map((dx) =>
        [-0.36, 0.36].map((dz) => (
          <Deel key={`${dx}-${dz}`} groep="meubel" kleur={KLEUR.hout} positie={[dx, 0.05, dz]} maat={[0.08, 0.1, 0.08]} rand={false} />
        )),
      )}
    </group>
  );
}

function Tafel({
  positie,
  breed = 1.8,
  diep = 0.9,
  hoog = 0.74,
}: {
  positie: [number, number, number];
  breed?: number;
  diep?: number;
  hoog?: number;
}) {
  return (
    <group position={positie}>
      <Deel groep="meubel" kleur={KLEUR.houtLicht} positie={[0, hoog, 0]} maat={[breed, 0.06, diep]} />
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <Deel
            key={`${sx}-${sz}`}
            groep="meubel"
            kleur={KLEUR.hout}
            positie={[sx * (breed / 2 - 0.1), hoog / 2, sz * (diep / 2 - 0.1)]}
            maat={[0.07, hoog, 0.07]}
            rand={false}
          />
        )),
      )}
    </group>
  );
}

function Stoel({ positie, draai = 0 }: { positie: [number, number, number]; draai?: number }) {
  return (
    <group position={positie} rotation={[0, THREE.MathUtils.degToRad(draai), 0]}>
      <Deel groep="meubel" kleur={KLEUR.hout} positie={[0, 0.45, 0]} maat={[0.44, 0.05, 0.44]} />
      <Deel groep="meubel" kleur={KLEUR.hout} positie={[0, 0.72, -0.19]} maat={[0.44, 0.5, 0.05]} />
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <Deel key={`${sx}-${sz}`} groep="meubel" kleur={KLEUR.hout} positie={[sx * 0.18, 0.22, sz * 0.18]} maat={[0.045, 0.45, 0.045]} rand={false} />
        )),
      )}
    </group>
  );
}

function Keukenblok({ positie, draai = 0 }: { positie: [number, number, number]; draai?: number }) {
  return (
    <group position={positie} rotation={[0, THREE.MathUtils.degToRad(draai), 0]}>
      <Deel groep="meubel" kleur={KLEUR.keuken} positie={[0, 0.44, 0]} maat={[3.0, 0.88, 0.62]} />
      <Deel groep="meubel" kleur={KLEUR.blad} positie={[0, 0.91, 0]} maat={[3.08, 0.06, 0.66]} />
      {[-1.05, -0.35, 0.35, 1.05].map((dx) => (
        <Deel key={dx} groep="meubel" kleur={KLEUR.kozijn} positie={[dx, 0.44, 0.32]} maat={[0.5, 0.02, 0.02]} rand={false} />
      ))}
      <Deel groep="meubel" kleur={KLEUR.keuken} positie={[1.2, 1.72, -0.12]} maat={[1.5, 0.7, 0.38]} />
    </group>
  );
}

function Bed({ positie }: { positie: [number, number, number] }) {
  return (
    <group position={positie}>
      <Deel groep="meubel" kleur={KLEUR.hout} positie={[0, 0.2, 0]} maat={[2.0, 0.3, 1.7]} />
      <Deel groep="meubel" kleur={KLEUR.stofLicht} positie={[0, 0.42, 0.06]} maat={[1.94, 0.2, 1.6]} />
      <Deel groep="meubel" kleur={KLEUR.kozijn} positie={[0, 0.56, -0.62]} maat={[1.6, 0.14, 0.4]} rand={false} />
      <Deel groep="meubel" kleur={KLEUR.hout} positie={[0, 0.62, -0.88]} maat={[2.0, 0.8, 0.1]} />
    </group>
  );
}

function Meubels() {
  return (
    <group name="meubels">
      {/* Woonkamer */}
      <Bank positie={[2.6, VLOER_Y, -1.2]} />
      <Tafel positie={[2.6, VLOER_Y, 0.5]} breed={1.3} diep={0.7} hoog={0.42} />
      <Deel groep="meubel" kleur={KLEUR.hout} positie={[5.3, VLOER_Y + 0.55, -1.2]} maat={[0.44, 1.1, 2.2]} />
      <Deel groep="meubel" kleur={KLEUR.blad} positie={[5.02, VLOER_Y + 0.82, -1.2]} maat={[0.06, 0.6, 1.05]} rand={false} />

      {/* Eethoek */}
      <Tafel positie={[3.2, VLOER_Y, 2.7]} breed={1.9} diep={1.0} />
      <Stoel positie={[2.5, VLOER_Y, 3.6]} />
      <Stoel positie={[3.9, VLOER_Y, 3.6]} />
      <Stoel positie={[2.5, VLOER_Y, 1.8]} draai={180} />
      <Stoel positie={[3.9, VLOER_Y, 1.8]} draai={180} />

      {/* Keuken tegen de linkergevel */}
      <Keukenblok positie={[-5.5, VLOER_Y, 2.2]} draai={90} />

      {/* Verdieping */}
      <Bed positie={[3.6, 3.04, 1.4]} />
      <Deel groep="meubel" kleur={KLEUR.keuken} positie={[5.3, 4.0, -2.6]} maat={[0.56, 1.9, 1.7]} />
    </group>
  );
}

/* Een echte paneelradiator: twee panelen met convectorlamellen ertussen, een
   rooster erop en twee aansluitingen naar de muur. */
function Radiator({
  positie,
  breed = 1.6,
  draai = 0,
}: {
  positie: [number, number, number];
  breed?: number;
  draai?: number;
}) {
  const lamellen = Math.max(6, Math.round(breed / 0.12));
  return (
    <group position={positie} rotation={[0, THREE.MathUtils.degToRad(draai), 0]}>
      <Deel groep="radiator" kleur={KLEUR.radiator} positie={[0, 0, -0.045]} maat={[breed, 0.6, 0.05]} />
      <Deel groep="radiator" kleur={KLEUR.radiator} positie={[0, 0, 0.045]} maat={[breed, 0.6, 0.05]} />
      {Array.from({ length: lamellen }, (_, i) => (
        <Deel
          key={i}
          groep="radiator"
          kleur={KLEUR.radiatorRib}
          positie={[-breed / 2 + 0.08 + (i * (breed - 0.16)) / (lamellen - 1), 0, 0]}
          maat={[0.02, 0.52, 0.06]}
          rand={false}
        />
      ))}
      <Deel groep="radiator" kleur={KLEUR.radiator} positie={[0, 0.31, 0]} maat={[breed, 0.04, 0.14]} />
      <Deel groep="radiator" kleur={KLEUR.radiator} positie={[-breed / 2 + 0.02, 0, 0]} maat={[0.04, 0.6, 0.14]} rand={false} />
      <Deel groep="radiator" kleur={KLEUR.radiator} positie={[breed / 2 - 0.02, 0, 0]} maat={[0.04, 0.6, 0.14]} rand={false} />
    </group>
  );
}

/* ---------------------------------------------------------------------- */
/* De installatie                                                         */
/* ---------------------------------------------------------------------- */

const AANSLUITING: Array<{ groep: keyof typeof KLEUR; x: number }> = [
  { groep: "aanvoer", x: -2.62 },
  { groep: "warmwater", x: -2.51 },
  { groep: "gas", x: -2.4 },
  { groep: "koudwater", x: -2.29 },
  { groep: "retour", x: -2.18 },
];

function Vloerverwarming() {
  const banen = useMemo(() => {
    const paden: Array<Array<[number, number, number]>> = [];
    const y = 0.0;
    const zVan = -3.7;
    const zTot = 3.7;
    for (let i = 0; i < 10; i += 1) {
      const x = -1.6 + i * 0.66;
      const heen = i % 2 === 0;
      const a = heen ? zVan : zTot;
      const b = heen ? zTot : zVan;
      paden.push([
        [x, y, a],
        [x, y, b],
        [x + 0.66, y, b],
      ]);
    }
    return paden;
  }, []);

  return (
    <group name="vloerverwarming">
      {banen.map((punten, i) => (
        <Route key={i} groep="vloerverwarming" kleur={KLEUR.vloerverwarming} punten={punten} dikte={R16} />
      ))}
      <Route
        groep="vloerverwarming"
        kleur={KLEUR.vloerverwarming}
        punten={[
          [-4.2, 0.52, -2.44],
          [-4.2, 0.0, -2.44],
          [-4.2, 0.0, -3.7],
          [-1.6, 0.0, -3.7],
        ]}
        dikte={R16}
      />
    </group>
  );
}

function Installatie() {
  return (
    <group name="installatie">
      <group name="ketel">
        <Deel groep="ketel" kleur={KLEUR.ketel} positie={[-2.4, 1.9, -2.3]} maat={[0.9, 0.78, 0.42]} />
        <Deel groep="ketel" kleur={KLEUR.ketelPaneel} positie={[-2.4, 1.63, -2.08]} maat={[0.54, 0.12, 0.03]} />
      </group>

      <group name="verdeler">
        <Deel groep="verdeler" kleur={KLEUR.verdeler} positie={[-4.2, 0.78, -2.46]} maat={[0.86, 0.5, 0.16]} />
        {Array.from({ length: 6 }, (_, i) => (
          <Deel key={i} groep="verdeler" kleur={KLEUR.kozijn} positie={[-4.55 + i * 0.14, 0.56, -2.4]} maat={[0.05, 0.16, 0.05]} rand={false} />
        ))}
      </group>

      {/* De rookgasafvoer loopt door tot in de schoorsteen */}
      <Buis groep="rookgas" kleur={KLEUR.rookgas} van={[-2.4, 2.29, -2.3]} naar={[-2.4, 8.9, -2.3]} dikte={R_ROOKGAS} />
      <Deel groep="rookgas" kleur={KLEUR.rookgas} positie={[-2.4, 9.02, -2.3]} maat={[0.3, 0.14, 0.3]} />

      {AANSLUITING.map(({ groep, x }) => (
        <Buis key={groep} groep={groep} kleur={KLEUR[groep]} van={[x, 1.51, -2.3]} naar={[x, 0.62, -2.3]} dikte={R16} />
      ))}

      <Route
        groep="gas"
        kleur={KLEUR.gas}
        punten={[
          [-2.4, 0.62, -2.3],
          [-2.4, 0.3, -2.3],
          [-2.4, 0.3, -2.56],
          [-2.4, -0.3, -2.56],
        ]}
        dikte={R16}
      />
      <Route
        groep="koudwater"
        kleur={KLEUR.koudwater}
        punten={[
          [-2.29, 0.62, -2.3],
          [-2.29, 0.36, -2.3],
          [-2.29, 0.36, -2.52],
          [-2.29, -0.3, -2.52],
        ]}
        dikte={R16}
      />
      <Route
        groep="warmwater"
        kleur={KLEUR.warmwater}
        punten={[
          [-2.51, 0.62, -2.3],
          [-2.51, 0.44, -2.3],
          [-2.51, 0.44, -2.54],
          [-2.51, 3.3, -2.54],
          [-2.51, 3.3, -1.9],
        ]}
        dikte={R16}
      />

      <Route
        groep="aanvoer"
        kleur={KLEUR.aanvoer}
        punten={[
          [-2.62, 0.62, -2.3],
          [-2.62, 0.42, -2.3],
          [-2.62, 0.42, -4.16],
          [3.0, 0.42, -4.16],
          [3.0, 0.62, -4.16],
        ]}
      />
      <Route
        groep="aanvoer"
        kleur={KLEUR.aanvoer}
        punten={[
          [-2.62, 0.42, -4.16],
          [-5.6, 0.42, -4.16],
          [-5.6, 0.42, 1.2],
          [-5.6, 0.62, 1.2],
        ]}
      />
      <Route
        groep="aanvoer"
        kleur={KLEUR.aanvoer}
        punten={[
          [3.0, 0.42, -4.16],
          [4.7, 0.42, -4.16],
          [4.7, 3.52, -4.16],
        ]}
      />
      <Route
        groep="retour"
        kleur={KLEUR.retour}
        punten={[
          [-2.18, 0.62, -2.3],
          [-2.18, 0.26, -2.3],
          [-2.18, 0.26, -4.3],
          [4.1, 0.26, -4.3],
          [4.1, 0.62, -4.3],
        ]}
      />
      <Route
        groep="retour"
        kleur={KLEUR.retour}
        punten={[
          [-2.18, 0.26, -4.3],
          [-5.76, 0.26, -4.3],
          [-5.76, 0.26, 2.4],
          [-5.76, 0.62, 2.4],
        ]}
      />

      <Radiator positie={[3.4, 0.92, -4.22]} breed={2.0} />
      <Radiator positie={[-5.72, 0.92, 1.8]} breed={1.6} draai={90} />
      <Radiator positie={[4.4, 3.82, -4.22]} breed={1.6} />

      <Vloerverwarming />
    </group>
  );
}

/* ---------------------------------------------------------------------- */
/* De regie                                                               */
/* ---------------------------------------------------------------------- */

function Regie({
  voortgang,
  open,
  vloer,
  onBeat,
}: {
  voortgang: React.RefObject<number>;
  open: React.RefObject<number>;
  vloer: React.RefObject<number>;
  onBeat: (index: number) => void;
}) {
  const { camera, scene } = useThree();
  const doel = useRef(new THREE.Vector3(0, 3.2, 0));
  const laatste = useRef(-1);

  useFrame(() => {
    const p = voortgang.current ?? 0;
    const { van, naar, t, index } = lees(p);

    const focus = new THREE.Vector3(
      meng(van.focus[0], naar.focus[0], t),
      meng(van.focus[1], naar.focus[1], t),
      meng(van.focus[2], naar.focus[2], t),
    );
    doel.current.lerp(focus, 0.12);

    const draai = THREE.MathUtils.degToRad(meng(van.draai, naar.draai, t));
    const hoogte = meng(van.hoogte, naar.hoogte, t);
    const richting = new THREE.Vector3(Math.cos(draai), hoogte, Math.sin(draai)).normalize();
    camera.position.set(
      doel.current.x + richting.x * 70,
      doel.current.y + richting.y * 70,
      doel.current.z + richting.z * 70,
    );
    camera.lookAt(doel.current);

    const ortho = camera as THREE.OrthographicCamera;
    ortho.zoom += (meng(van.zoom, naar.zoom, t) - ortho.zoom) * 0.12;
    ortho.updateProjectionMatrix();

    open.current = meng(van.open, naar.open, t);
    vloer.current = meng(van.vloer, naar.vloer, t);

    /* Oplichten. Een blok met een echte textuur heeft zes materialen, één per
       vlak, dus het dempen loopt nu per materiaal in plaats van per mesh. */
    const actief = new Set([...van.actief, ...naar.actief]);
    const alles = actief.size === 0;
    const stel = (mat: THREE.MeshStandardMaterial, aan: boolean, basis: string) => {
      if (!mat.userData.basisKleur) mat.userData.basisKleur = new THREE.Color(basis);
      mat.color.lerp(aan ? mat.userData.basisKleur : GEDEMPT, 0.1);
      /* Een textuur laat zich niet weglerpen: de kleur vermenigvuldigt met de
         map, dus gedempt metselwerk bleef gewoon baksteenkleurig. De map gaat
         er daarom helemaal af zolang het vlak niet aan het woord is. Dat is een
         hercompilatie van de shader, maar dat gebeurt een paar keer per reis en
         niet per frame. */
      if (mat.userData.eigenMap === undefined) mat.userData.eigenMap = mat.map ?? null;
      if (mat.userData.eigenMap) {
        const wil = aan ? mat.userData.eigenMap : null;
        if (mat.map !== wil) {
          mat.map = wil;
          mat.needsUpdate = true;
        }
      }
    };

    scene.traverse((obj) => {
      const eigen = obj.userData?.groep as string | undefined;
      const groep = eigen ?? (obj.parent?.userData?.groep as string | undefined);
      if (!groep) return;
      /* De tuin doet nooit mee met het dempen: dat is de omgeving, niet een
         onderdeel dat aan de beurt kan zijn. */
      const aan = alles || groep === "tuin" || actief.has(groep);
      const materiaal = (obj as THREE.Mesh).material;
      if (!materiaal) return;
      if (eigen) {
        const basis = obj.userData.basis as string;
        if (Array.isArray(materiaal)) {
          for (const m of materiaal) stel(m as THREE.MeshStandardMaterial, aan, basis);
        } else {
          stel(materiaal as THREE.MeshStandardMaterial, aan, basis);
        }
      } else {
        const lijn = materiaal as THREE.LineBasicMaterial;
        if (!Array.isArray(lijn)) lijn.color.lerp(aan ? RAND : RAND_GEDEMPT, 0.1);
      }
    });

    if (index !== laatste.current) {
      laatste.current = index;
      onBeat(index);
    }
  });

  return null;
}

function Licht() {
  return (
    <>
      {/* Standard-materialen rekenen anders dan de lambert die hier eerst
          stond: dezelfde sterktes brandden alles wit uit. */}
      <ambientLight intensity={1.15} />
      <hemisphereLight args={["#ffffff", "#c4ccd2", 0.7]} />
      <directionalLight position={[18, 26, 14]} intensity={1.5} />
      <directionalLight position={[-16, 12, -10]} intensity={0.5} />
    </>
  );
}

export function CvHuis3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const voortgang = useRef(0);
  const open = useRef(0);
  const vloer = useRef(0);
  const [beat, setBeat] = useState(0);
  const [gemonteerd, setGemonteerd] = useState(false);

  useEffect(() => setGemonteerd(true), []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !gemonteerd) return;

    /* Lenis verzet de pagina zelf, dus ScrollTrigger moet van Lenis horen dat
       er iets veranderd is in plaats van van het scroll-event. */
    const lenis = window.__lenis;
    const onLenis = () => ScrollTrigger.update();
    lenis?.on("scroll", onLenis);

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        voortgang.current = self.progress;
      },
    });

    return () => {
      lenis?.off("scroll", onLenis);
      trigger.kill();
    };
  }, [gemonteerd]);

  const huidige = BEATS[beat] ?? BEATS[0];

  return (
    <section className="huis3d" ref={sectionRef} aria-labelledby="huis3d-titel">
      <div className="huis3d-stage">
        <div className="huis3d-canvas">
          {gemonteerd && (
            <Canvas
              orthographic
              camera={{ position: [66, 34, 10], zoom: 40, near: -400, far: 800 }}
              dpr={[1, 2]}
              gl={{ antialias: true }}
              style={{ background: "transparent" }}
            >
              <Licht />
              <Tuin />
              <Huis open={open} vloer={vloer} />
              <Meubels />
              <Installatie />
              <Regie voortgang={voortgang} open={open} vloer={vloer} onBeat={setBeat} />
            </Canvas>
          )}
        </div>

        <div className="huis3d-woord">
          {BEATS.map((b, i) => (
            <div className="huis3d-beat" key={b.id} data-actief={i === beat ? "1" : "0"}>
              {i === 0 ? <h1 id="huis3d-titel">{b.kop}</h1> : <h2>{b.kop}</h2>}
              <p>{b.tekst}</p>
            </div>
          ))}
        </div>

        <div className="huis3d-index" aria-hidden="true">
          {BEATS.map((b, i) => (
            <span key={b.id} data-actief={i === beat ? "1" : "0"} />
          ))}
        </div>
      </div>

      <p className="huis3d-stand" aria-hidden="true">
        {String(beat + 1).padStart(2, "0")} · {huidige.id}
      </p>
    </section>
  );
}
