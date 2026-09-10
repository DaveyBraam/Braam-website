"use client";

import { Grid, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

/* Een kijkdoos om het model te controleren, geen onderdeel van de pagina.

   Slepen draait, scrollen zoomt, rechtermuisknop schuift. Het raster onder de
   ketel is een meter in het vierkant met vakjes van tien centimeter, zodat de
   maat te controleren is zonder te rekenen: de kast hoort viereneenhalf vakje
   breed te zijn en zeveneneenhalf hoog. */

type Kijkbaar = {
  bestand: string;
  titel: string;
  doel: [number, number, number];
  standen: Record<string, [number, number, number]>;
  raster: number;
  maten: ReadonlyArray<readonly [string, string]>;
};

const KETEL_MATEN = [
  ["Kast", "440 × 750 × 340 mm"],
  ["Aansluitingen", "5 × 16 mm, hart op hart 62 mm"],
  ["Afvoer", "concentrisch 60 / 100 mm"],
  ["Oorsprong", "muurvlak, onderkant kast, midden"],
  ["Bestand", "ketel.glb — 32 kB, Draco"],
] as const;

const KETEL_STANDEN: Record<string, [number, number, number]> = {
  voor: [0, 0.38, 1.5],
  driekwart: [1.05, 0.62, 1.25],
  zij: [1.5, 0.38, 0.1],
  onder: [0.7, -0.35, 1.1],
  boven: [0.5, 1.35, 0.9],
};

export const KETEL: Kijkbaar = {
  bestand: "/huis3d/ketel.glb",
  titel: "De ketel, van alle kanten",
  doel: [0, 0.36, -0.17],
  standen: KETEL_STANDEN,
  raster: 2,
  maten: KETEL_MATEN,
};

/* De woning uit bouw-huis.py. De oorsprong ligt op de linker-voorhoek, dus het
   midden van het huis zit op 4,2 breed en 4,5 diep. */
export const WONING: Kijkbaar = {
  bestand: "/huis3d/huis.glb",
  titel: "De woning, van alle kanten",
  doel: [4.2, 4.0, -4.5],
  standen: {
    voor: [4.2, 4.5, 17],
    driekwart: [13, 8.5, 13],
    achter: [4.2, 6.0, -20],
    zij: [18, 5.5, -4.5],
    boven: [7, 17, 6],
  },
  raster: 20,
  maten: [
    ["Buitenmaat", "8,4 × 9,0 m, nok op 9,2 m"],
    ["Begane grond", "hal met trap, woonkamer, keuken"],
    ["Verdieping", "drie slaapkamers, badkamer"],
    ["Zolder", "open, onder het pannendak"],
    ["Dak", "zadeldak, 36°, echte pannen"],
    ["Bestand", "huis.glb — 185 kB, Draco"],
  ],
};

/* De knoppen zetten de camera; OrbitControls moet dat daarna te horen krijgen,
   anders draait hij bij de eerste sleep terug naar zijn eigen idee. */
function Stand({ wat, naam }: { wat: Kijkbaar; naam: string }) {
  const { camera, controls } = useThree();
  useEffect(() => {
    camera.position.set(...wat.standen[naam]);
    const c = controls as unknown as { target?: THREE.Vector3; update?: () => void } | null;
    if (c?.target) {
      c.target.set(...wat.doel);
      c.update?.();
    }
  }, [wat, naam, camera, controls]);
  return null;
}

function Model({ bestand }: { bestand: string }) {
  const { scene } = useGLTF(bestand, "/draco/gltf/");
  const model = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={model} />;
}

export function KetelKijker({ wat = KETEL }: { wat?: Kijkbaar }) {
  const [stand, setStand] = useState<string>("driekwart");
  const [gemonteerd, setGemonteerd] = useState(false);

  useEffect(() => setGemonteerd(true), []);

  return (
    <section className="kijker">
      <div className="kijker-doek">
        {gemonteerd && (
          <Canvas
            camera={{ position: wat.standen.driekwart, fov: 40, near: 0.05, far: 200 }}
            dpr={[1, 2]}
            gl={{ antialias: true }}
          >
            <ambientLight intensity={1.1} />
            <hemisphereLight args={["#ffffff", "#d7dde2", 0.8]} />
            <directionalLight position={[2.2, 3, 2.6]} intensity={2.2} />
            <directionalLight position={[-2, 1.4, -1.6]} intensity={0.6} />

            <Model bestand={wat.bestand} />
            <Stand wat={wat} naam={stand} />

            {/* Het raster ligt op de onderkant van de kast, dus precies op de
                oorsprong van het model. */}
            <Grid
              args={[wat.raster, wat.raster]}
              cellSize={wat.raster / 20}
              cellThickness={0.6}
              cellColor="#c9ced3"
              sectionSize={wat.raster / 4}
              sectionThickness={1.1}
              sectionColor="#8d959c"
              fadeDistance={6}
              infiniteGrid={false}
              position={[0, 0, 0]}
            />

            <OrbitControls
              makeDefault
              enableDamping
              dampingFactor={0.08}
              target={wat.doel}
              minDistance={wat.raster * 0.15}
              maxDistance={wat.raster * 4}
            />
          </Canvas>
        )}
      </div>

      <aside className="kijker-blad">
        <h1>{wat.titel}</h1>
        <p className="kijker-hulp">
          Slepen draait het toestel, scrollen zoomt in, rechtermuisknop schuift het beeld.
          Elk vakje in het raster is {wat.raster >= 10 ? "een meter" : "10 centimeter"}.
        </p>

        <div className="kijker-standen">
          {Object.keys(wat.standen).map((naam) => (
            <button
              key={naam}
              type="button"
              onClick={() => setStand(naam)}
              aria-current={stand === naam ? "true" : undefined}
            >
              {naam}
            </button>
          ))}
        </div>

        <dl className="kijker-maten">
          {wat.maten.map(([label, waarde]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{waarde}</dd>
            </div>
          ))}
        </dl>

        <p className="kijker-hulp">
          Klopt er iets niet, dan is dat een aanpassing in{" "}
          <code>{wat === KETEL ? "scripts/blender/bouw-ketel.py" : "scripts/blender/bouw-huis.py"}</code> — het model wordt daar
          opgebouwd, niet met de hand getekend.
        </p>
      </aside>
    </section>
  );
}
