"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/* De studio. Eén buitenunit op het papier van het handboek, zes teksten
   eromheen. De tekst is de hoofdrol; het toestel draait erachter als decor.

   De beweging zit niet in de clips maar in de curve hieronder: de draai is
   gelijkmatig gegenereerd, en THETA maakt er een reis van met rustpunten.
   Bij elke tekst hoort veel scrollafstand en weinig graden; tussen de
   teksten is het andersom. Bijstellen kost dus geen credits, alleen code.

   De frames staan in public/warmtepompen/studio: `draai` en `intro` voor
   breed, `mdraai` en `mintro` voor smal — zelfde afspraak als de homepage.
   Zonder JavaScript, of met prefers-reduced-motion, valt dit blok terug op
   wat de server al levert: de eerste frame als stilstaande grond en de
   beats als blokken onder elkaar. */

const FRAMES = {
  draai: 64,
  intro: 36,
  mdraai: 40,
  mintro: 24,
};

/* Waar het toestel in de gegenereerde frames staat: middelpunt en hoogte van
   het blok (toestel plus contactschaduw) als fractie van het beeld. Deze twee
   getallen zijn gemeten aan het startcanvas waarmee de clips zijn gemaakt. */
const UNIT_IN_FRAME = { cx: 0.5, cy: 0.55, h: 0.6 };
const UNIT_IN_FRAME_M = { cx: 0.5, cy: 0.5, h: 0.34 };

/* Scrollvoortgang -> draaihoek. De plateaus zijn de leesmomenten; daar remt
   het toestel af tot bijna stilstand. Tussen 0,315 en 0,47 vliegt de reeks
   door — daar passeert de vermogensregel. */
const THETA: Array<[number, number]> = [
  [0.0, 0],
  [0.105, 0],
  [0.19, 55],
  [0.315, 70],
  [0.42, 150],
  [0.47, 180],
  [0.6, 196],
  [0.675, 228],
  [0.77, 240],
  [0.84, 318],
  [0.925, 326],
  [1.0, 360],
];

/* Het toestel komt omhoog bij de splitsing (beat 2) en zakt weer als het
   wegdraait: verticale positie van het toestelmiddelpunt in de stage. */
const RISE: Array<[number, number]> = [
  [0.0, 0.57],
  [0.17, 0.5],
  [0.32, 0.5],
  [0.47, 0.55],
  [0.6, 0.55],
  [0.75, 0.53],
  [0.86, 0.53],
  [1.0, 0.52],
];

/* Wanneer welke tekst leesbaar is: [begin fade-in, vol, begin fade-uit, weg].
   De vensters volgen de plateaus van THETA. */
const WINDOWS: Record<string, [number, number, number, number]> = {
  b1: [-1, 0, 0.105, 0.165],
  b2: [0.17, 0.225, 0.315, 0.37],
  kw: [0.35, 0.39, 0.42, 0.455],
  b3: [0.465, 0.515, 0.6, 0.655],
  b4: [0.675, 0.725, 0.77, 0.815],
  b5: [0.835, 0.88, 0.925, 0.965],
  b6: [0.955, 0.995, 2, 3],
};

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);
const smoothstep = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

/* Lineair zoeken in een korte keyframelijst, met smoothstep per segment: zo
   versnelt en vertraagt de draai vanzelf rond elk rustpunt. */
const sample = (keys: Array<[number, number]>, p: number) => {
  if (p <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i += 1) {
    const [p1, v1] = keys[i];
    if (p <= p1) {
      const [p0, v0] = keys[i - 1];
      return v0 + (v1 - v0) * smoothstep((p - p0) / (p1 - p0));
    }
  }
  return keys[keys.length - 1][1];
};

const window01 = (key: string, p: number) => {
  const [a, b, c, d] = WINDOWS[key];
  const rise = b <= a ? 1 : smoothstep((p - a) / (b - a));
  const fall = 1 - smoothstep((p - c) / (d - c));
  return Math.min(rise, fall);
};

const framePath = (dir: string, index: number) =>
  `/warmtepompen/studio/${dir}/frame_${String(index + 1).padStart(4, "0")}.jpg`;

export function WarmtepompStudio() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    /* Zonder JavaScript is dit blok een document; [data-live] komt er pas op
       zodra de film kan draaien. Wie beperkte beweging vraagt, houdt het
       document — en wie dat tijdens het bezoek aanzet, krijgt het terug. */
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 660px)");
    let variant = narrow.matches ? "m" : "";

    let draai: Array<HTMLImageElement | undefined> = [];
    let intro: Array<HTMLImageElement | undefined> = [];
    let disposed = false;
    let generation = 0;
    let frame = 0;
    let progress = 0;
    let lastKey = "";
    let onScreen = true;

    /* De introclip speelt op de klok, niet op scroll: het toestel staat stil
       en de fan draait aan. Zodra er gescrold wordt neemt de scrub het over —
       de laatste introframe is dezelfde als draaiframe één, dus die overgang
       is geen naad. */
    let introState: "wacht" | "speelt" | "klaar" = "wacht";
    let introStart = 0;
    const INTRO_MS = 2600;

    const counts = () => ({
      draai: variant ? FRAMES.mdraai : FRAMES.draai,
      intro: variant ? FRAMES.mintro : FRAMES.intro,
    });
    const unitBox = () => (variant ? UNIT_IN_FRAME_M : UNIT_IN_FRAME);

    const load = (bucket: Array<HTMLImageElement | undefined>, dir: string, index: number) =>
      new Promise<void>((resolve) => {
        if (bucket[index]) return resolve();
        const image = new Image();
        image.decoding = "async";
        image.onload = () => {
          bucket[index] = image;
          resolve();
          if (image.decode) image.decode().catch(() => {});
        };
        image.onerror = () => resolve();
        image.src = framePath(dir, index);
      });

    const nearest = (bucket: Array<HTMLImageElement | undefined>, index: number) => {
      if (bucket[index]) return bucket[index];
      for (let step = 1; step < bucket.length; step += 1) {
        if (bucket[index - step]) return bucket[index - step];
        if (bucket[index + step]) return bucket[index + step];
      }
      return undefined;
    };

    const sourceWidth = () => (variant ? 484 : 1600);

    const resize = () => {
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return false;
      /* Niet breder dan de frames zelf: meer backing store is alleen maar
         tekenwerk per frame, geen detail — de les van de homepage. */
      const width = Math.max(1, Math.min(Math.round(rect.width * ratio), sourceWidth()));
      const height = Math.max(1, Math.round((width * rect.height) / rect.width));
      if (canvas.width === width && canvas.height === height) return false;
      canvas.width = width;
      canvas.height = height;
      return true;
    };

    const readProgress = () => {
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      return clamp01(-rect.top / distance);
    };

    /* De tekst is de hoofdrol, dus het toestel wijkt. De gemeten vakken van
       de tekstblokken (bijgehouden in `vakken`) zijn harde grenzen: zodra een
       tekst aan het woord is wordt het toestel eronder of ernaast geklemd en
       krimpt het als het niet past. Zo kan een kop die een regel meer omslaat
       nooit over het toestel vallen, op geen enkele maat. */
    let vakken: Record<string, { top: number; bottom: number; left: number; right: number; width: number }> = {};
    let stageBreedte = 1;
    let stageHoogte = 1;
    let metaTop = Infinity;

    const meet = () => {
      const stage = section.querySelector<HTMLElement>(".studio-stage");
      if (!stage) return;
      const basis = stage.getBoundingClientRect();
      if (basis.width <= 0 || basis.height <= 0) return;
      stageBreedte = basis.width;
      stageHoogte = basis.height;
      vakken = {};
      const kies: Array<[string, string]> = [
        ["b1", ".studio-beat-1"],
        ["b2a", ".studio-beat-2a"],
        ["b2b", ".studio-beat-2b"],
        ["kw", ".studio-kw"],
        ["b3", ".studio-beat-3"],
        ["b4", ".studio-beat-4"],
        ["b5", ".studio-beat-5"],
        ["b6", ".studio-beat-6"],
      ];
      for (const [naam, keuze] of kies) {
        const el = section.querySelector<HTMLElement>(keuze);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        vakken[naam] = {
          top: r.top - basis.top,
          bottom: r.bottom - basis.top,
          left: r.left - basis.left,
          right: r.right - basis.left,
          width: r.width,
        };
      }
      const meta = section.querySelector<HTMLElement>(".studio-meta");
      metaTop = Infinity;
      if (meta && getComputedStyle(meta).display !== "none") {
        metaTop = meta.getBoundingClientRect().top - basis.top;
      }
    };

    /* Verhouding breedte/hoogte van het toestelblok in de frames; frontaal
       gemeten aan de referentie en het ruimst, dus veilig voor elke stand. */
    const UNIT_AR = 1.45;

    const paint = (force = false) => {
      const p = progress;
      const theta = sample(THETA, p);
      const rad = (theta * Math.PI) / 180;
      const depth = (1 - Math.cos(rad)) / 2;

      const total = counts();
      let bucket = draai;
      let index = Math.min(total.draai - 1, Math.floor((theta / 360) * total.draai));
      if (introState !== "klaar") {
        if (introState === "speelt") {
          const t = clamp01((performance.now() - introStart) / INTRO_MS);
          bucket = intro;
          index = Math.min(total.intro - 1, Math.round(t * (total.intro - 1)));
          if (t >= 1) introState = "klaar";
        } else {
          bucket = intro;
          index = 0;
        }
      }

      const win: Record<string, number> = {};
      for (const naam of ["b1", "b2", "kw", "b3", "b4", "b5", "b6"]) {
        win[naam] = window01(naam, p);
      }

      /* Wat eisen de sprekende teksten op, in css-maat van de stage? Teksten
         bovenin duwen het toestel omlaag, een blok onderin (telefoon) duwt
         het omhoog, kolommen ernaast begrenzen de breedte. De klem grijpt op
         volle kracht zodra een tekst leesbaar wordt, en lost vloeiend. */
      const MARGE = 26;
      let vrijBoven = 0;
      let vrijOnder = Math.min(metaTop - 10, stageHoogte - (variant ? 98 : 8));
      let baanHalf = Infinity;
      let klem = 0;
      const eisers: Array<[string, string]> = [
        ["b1", "b1"],
        ["b2a", "b2"],
        ["b2b", "b2"],
        ["kw", "kw"],
        ["b3", "b3"],
        ["b4", "b4"],
        ["b5", "b5"],
        ["b6", "b6"],
      ];
      for (const [vak, venster] of eisers) {
        const kracht = win[venster];
        const r = vakken[vak];
        if (!r || kracht < 0.02) continue;
        const breed = r.width > 0.6 * stageBreedte;
        if (r.top < 0.42 * stageHoogte || (breed && r.top < 0.6 * stageHoogte)) {
          vrijBoven = Math.max(vrijBoven, r.bottom + MARGE);
        } else if (breed) {
          vrijOnder = Math.min(vrijOnder, r.top - MARGE);
        } else {
          const binnenkant = r.left + r.width / 2 < stageBreedte / 2 ? r.right : r.left;
          baanHalf = Math.min(baanHalf, Math.abs(stageBreedte / 2 - binnenkant) - MARGE);
        }
        klem = Math.max(klem, kracht);
      }
      klem = smoothstep(Math.min(1, klem / 0.5));

      const scale = 1 - 0.07 * depth;
      const veil = 0.1 + 0.34 * depth;

      /* Alles hieronder in canvaspixels; ratio zet css-maat om. */
      const width = canvas.width;
      const height = canvas.height;
      const ratio = width / stageBreedte;

      let doelH = variant ? 0.34 * height : Math.min(0.56 * height, 0.32 * width);
      if (baanHalf < Infinity) {
        const baanH = Math.max(48 * ratio, (2 * Math.max(0, baanHalf) * ratio) / UNIT_AR);
        doelH += (Math.min(doelH, baanH) - doelH) * klem;
      }
      let effH = doelH * scale;

      /* Past het niet tussen tekst en maatlijn, dan krimpt het toestel tot
         het wél past — desnoods tot een postzegel. Decor mag klein zijn;
         over de tekst heen mag het nooit. */
      const boven = vrijBoven * ratio;
      const onder = Math.max(boven + 48 * ratio, vrijOnder * ratio);
      const past = onder - boven;
      if (effH > past) effH += (past - effH) * klem;

      let cyPx = sample(RISE, p) * height;
      const minCy = boven + effH / 2;
      const maxCy = Math.max(minCy, onder - effH / 2);
      const gewenst = Math.min(Math.max(cyPx, minCy), maxCy);
      cyPx += (gewenst - cyPx) * klem;

      const key = `${bucket === intro ? "i" : "d"}:${index}:${theta.toFixed(2)}:${Math.round(cyPx)}:${Math.round(effH)}:${width}`;
      if (!force && key === lastKey) return;

      /* Zolang er geen enkel frame binnen is, blijft het canvas doorzichtig
         en is de poster eronder de stilstaande grond. Nooit tekst op leeg. */
      const image = nearest(bucket, index);
      if (image) {
        lastKey = key;
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
        /* Tekenen op toestelmaat, niet op beeldmaat: buiten het frame is de
           studio hetzelfde wit als het canvas, dus het kader is onzichtbaar. */
        const box = unitBox();
        const s = effH / (box.h * image.naturalHeight);
        const dw = image.naturalWidth * s;
        const dh = image.naturalHeight * s;
        const dx = width / 2 - box.cx * dw;
        const dy = cyPx - box.cy * dh;
        context.drawImage(image, dx, dy, dw, dh);
        if (veil > 0.001) {
          context.fillStyle = `rgba(255, 255, 255, ${veil.toFixed(3)})`;
          context.fillRect(0, 0, width, height);
        }
      }

      let actief = "";
      let hoogst = 0.4;
      for (const naam of ["b1", "b2", "kw", "b3", "b4", "b5", "b6"]) {
        const waarde = win[naam];
        section.style.setProperty(`--studio-${naam}`, waarde.toFixed(3));
        if (waarde > hoogst) {
          actief = naam;
          hoogst = waarde;
        }
      }
      if (section.dataset.actief !== actief) section.dataset.actief = actief;
      if (ctaRef.current) ctaRef.current.tabIndex = actief === "b6" ? 0 : -1;
    };

    const update = () => {
      if (!onScreen) return;
      progress = readProgress();
      /* Scrollen onderbreekt de intro: de bezoeker heeft het stuur gepakt. */
      if (introState !== "klaar" && progress > 0.012) introState = "klaar";
      paint();
    };

    const register = () => {
      window.__scrubUpdaters ??= [];
      if (!window.__scrubUpdaters.includes(update)) window.__scrubUpdaters.push(update);
    };
    const unregister = () => {
      const updaters = window.__scrubUpdaters;
      if (!updaters) return;
      const at = updaters.indexOf(update);
      if (at >= 0) updaters.splice(at, 1);
    };

    const wake = () => {
      if (frame || !onScreen) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    /* De introklok: zolang de intro speelt tikt er een eigen rAF, want er is
       dan geen scroll die de canvas wakker houdt. */
    let introFrame = 0;
    const introTick = () => {
      introFrame = 0;
      if (disposed || introState !== "speelt") return;
      paint();
      introFrame = window.requestAnimationFrame(introTick);
    };

    const maybeStartIntro = () => {
      if (introState !== "wacht" || !onScreen) return;
      if (readProgress() > 0.04) {
        introState = "klaar";
        paint(true);
        return;
      }
      introState = "speelt";
      introStart = performance.now();
      introFrame = window.requestAnimationFrame(introTick);
    };

    const boot = async () => {
      const run = (generation += 1);
      const total = counts();
      draai = new Array(total.draai);
      intro = new Array(total.intro);
      resize();
      meet();
      await load(draai, `${variant}draai`, 0);
      if (disposed || run !== generation) return;
      progress = readProgress();
      paint(true);

      /* Eerst de intro (die speelt zo), dan de draaireeks rondom de huidige
         hoek, dan de rest. Acht tegelijk, zoals de homepage. */
      const queue: Array<[Array<HTMLImageElement | undefined>, string, number]> = [];
      for (let i = 0; i < total.intro; i += 1) queue.push([intro, `${variant}intro`, i]);
      for (let i = 1; i < total.draai; i += 1) queue.push([draai, `${variant}draai`, i]);
      let cursor = 0;
      let introLoaded = 0;
      const worker = async () => {
        while (!disposed && run === generation) {
          const next = cursor;
          cursor += 1;
          if (next >= queue.length) return;
          const [bucket, dir, index] = queue[next];
          await load(bucket, dir, index);
          if (bucket === intro) {
            introLoaded += 1;
            if (introLoaded === total.intro) maybeStartIntro();
          }
          if (next % 12 === 11) paint(true);
        }
      };
      await Promise.all(Array.from({ length: 8 }, worker));
      if (!disposed && run === generation) paint(true);
    };

    const start = () => {
      section.dataset.live = "true";
      lastKey = "";
      register();
      void boot();
    };
    const stopLive = () => {
      delete section.dataset.live;
      delete section.dataset.actief;
      unregister();
      stop();
      introState = "klaar";
    };
    const onMotionChange = () => {
      if (reducedMotion.matches) stopLive();
      else start();
    };

    if (!reducedMotion.matches) start();

    document.fonts?.ready.then(() => {
      if (disposed) return;
      meet();
      paint(true);
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) {
          wake();
          maybeStartIntro();
        } else stop();
      },
      { rootMargin: "20% 0px" },
    );
    observer.observe(section);

    const onResize = () => {
      resize();
      meet();
      progress = readProgress();
      paint(true);
      wake();
    };
    const onVariantChange = () => {
      const next = narrow.matches ? "m" : "";
      if (next === variant) return;
      variant = next;
      lastKey = "";
      introState = "klaar";
      resize();
      void boot();
    };

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });
    narrow.addEventListener("change", onVariantChange);
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      disposed = true;
      unregister();
      stop();
      if (introFrame) window.cancelAnimationFrame(introFrame);
      observer.disconnect();
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      narrow.removeEventListener("change", onVariantChange);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <section
      className="studio"
      ref={sectionRef}
      aria-labelledby="studio-titel"
    >
      <div className="studio-stage">
        <div className="studio-plaat" aria-hidden="true">
          <img
            className="studio-grond"
            src="/warmtepompen/studio/poster.jpg"
            alt=""
            width="1600"
            height="900"
            decoding="async"
          />
          <canvas className="studio-canvas" ref={canvasRef} />
        </div>

        <div className="studio-meta" aria-hidden="true">
          <div className="studio-maat" />
          <p className="studio-bijschrift">Vaillant aroTHERM plus · buitenunit</p>
        </div>

        <div className="studio-beats">
          <header className="studio-beat studio-beat-1">
            <h1 id="studio-titel">Voordat u een grote uitgave doet, moet u één ding zeker weten.</h1>
            <p>Of een warmtepomp in úw woning doet wat u ervan verwacht.</p>
          </header>

          <div className="studio-beat studio-beat-2a">
            <h2>Van het gas af</h2>
            <p>Helemaal elektrisch, of eerst een hybride opstelling naast uw bestaande cv-ketel. Later om te bouwen naar volledig elektrisch, als uw woning zover is.</p>
          </div>
          <div className="studio-beat studio-beat-2b">
            <h2>In de zomer koelen</h2>
            <p>Met hetzelfde toestel dat u in de winter verwarmt, als het systeem daarvoor geschikt is.</p>
          </div>

          <p className="studio-beat studio-kw" aria-label="Vermogens: 5, 7, 9 en 11 kilowatt">
            5 · 7 · 9 · 11 <span>kW</span>
          </p>

          <div className="studio-beat studio-beat-3">
            <h2>Daarom vragen we eerst wat u nú heeft.</h2>
            <p>Welk systeem er op dit moment bij u staat, en hoeveel gas u per jaar verbruikt in m³. Daaruit blijkt of een warmtepomp bij ú iets oplevert.</p>
            <p className="studio-oordeel">Is het niet verstandig, dan zeggen we dat.</p>
          </div>

          <div className="studio-beat studio-beat-4">
            <h2>Zijn de cijfers goed, dan komen we kijken.</h2>
            <p>Warmteverlies, isolatie, de afgifte via radiatoren of vloerverwarming, de plek voor de buitenunit en de groepenkast. Pas daarna een offerte.</p>
          </div>

          <div className="studio-beat studio-beat-5">
            <h2>En de elektra regelen wij ook.</h2>
            <p>Een warmtepomp vraagt een eigen groep en een zware voeding. Onze eigen elektricien legt die aan en breidt zo nodig de groepenkast uit. U hoeft geen tweede bedrijf te zoeken — en niemand kan naar de ander wijzen.</p>
          </div>

          <div className="studio-beat studio-beat-6">
            <h2>Wij helpen kiezen, plaatsen hem, en onderhouden hem daarna.</h2>
            <p>Dezelfde mensen. Van het eerste advies tot de jaarlijkse beurt.</p>
            <Link className="button button-primary" href="/offerte-aanvragen?dienst=warmtepomp" ref={ctaRef}>
              Vraag naar de mogelijkheden<span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
