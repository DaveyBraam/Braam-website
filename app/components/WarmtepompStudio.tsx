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
/* [aankomst, vol, vertrek begint, weg] als scrollvoortgang.

   De middelste twee zijn de leesmomenten en liggen op de plateaus van THETA:
   daar staat de tekst stil in het midden terwijl het toestel afremt. Die zijn
   niet veranderd.

   De buitenste twee zijn opgerekt zodat opeenvolgende teksten elkaar
   overlappen: de volgende komt al van rechtsboven aanvliegen terwijl de vorige
   naar links wegzweeft. Zonder die overlap is het een reeks losse
   verschijningen in plaats van een doorlopende stroom -- en dat was precies de
   klacht. */
const WINDOWS: Record<string, [number, number, number, number]> = {
  b1: [-1, 0, 0.105, 0.2],
  b2: [0.13, 0.225, 0.315, 0.4],
  kw: [0.34, 0.39, 0.42, 0.49],
  b3: [0.43, 0.515, 0.6, 0.7],
  b4: [0.62, 0.725, 0.77, 0.86],
  b5: [0.8, 0.88, 0.925, 0.985],
  b6: [0.93, 0.995, 2, 3],
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

/* De positie van een tekst op zijn baan.

   -1  nog buiten beeld, rechtsboven, ver weg en klein
    0  in het midden, op volle grootte, leesbaar
   +1  linksonder vertrokken, dichtbij en groot

   Tussen `vol` en `uit` blijft de waarde op 0 hangen: dat is het leesmoment
   waar de tekst stil in het midden staat, hetzelfde plateau waarop het
   toestel afremt. Een tekst verschijnt dus nooit in het midden -- hij komt
   er aanvliegen en hij vliegt er weer uit. */
const travel = (key: string, p: number) => {
  const [in_, vol, uit, weg] = WINDOWS[key];
  if (p <= in_) return -1;
  if (p < vol) return -1 + smoothstep((p - in_) / (vol - in_));
  if (p <= uit) return 0;
  if (p < weg) return smoothstep((p - uit) / (weg - uit));
  return 1;
};

/* Volledig zichtbaar in het midden, vervagend naar beide uiteinden van de
   baan. De macht houdt hem lang leesbaar rond het midden en laat hem pas aan
   de randen echt weggaan. */
const zicht = (t: number) => 1 - Math.min(1, Math.pow(Math.abs(t), 1.7));

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
    const context = canvas.getContext("2d", { alpha: false });
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

    /* Alles wat het toestel doet — draaien, wijken, doven — komt uit dezelfde
       voortgang. De sluier is een wit vlak over de tekening: hoe verder het
       toestel weggedraaid staat, hoe dieper het in het papier terugtreedt. */
    /* De beats waarop de baan wordt gezet. Beat 2 heeft er twee -- links en
       rechts van het toestel -- die samen reizen maar uit elkaar staan. */
    const beatEls: Record<string, HTMLElement[]> = {
      b1: [".studio-beat-1"],
      b2: [".studio-beat-2a", ".studio-beat-2b"],
      kw: [".studio-kw"],
      b3: [".studio-beat-3"],
      b4: [".studio-beat-4"],
      b5: [".studio-beat-5"],
      b6: [".studio-beat-6"],
    } as unknown as Record<string, HTMLElement[]>;
    for (const naam of Object.keys(beatEls)) {
      beatEls[naam] = (beatEls[naam] as unknown as string[])
        .map((sel) => section.querySelector<HTMLElement>(sel))
        .filter((el): el is HTMLElement => el !== null);
    }

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

      const scale = 1 - 0.13 * depth;
      const veil = 0.14 + 0.42 * depth;
      const cy = sample(RISE, p);

      const key = `${bucket === intro ? "i" : "d"}:${index}:${theta.toFixed(2)}:${cy.toFixed(3)}:${canvas.width}`;
      if (!force && key === lastKey) return;
      lastKey = key;

      const width = canvas.width;
      const height = canvas.height;
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);

      const image = nearest(bucket, index);
      if (image) {
        /* Tekenen op toestelmaat, niet op beeldmaat: buiten het frame is de
           studio hetzelfde wit als het canvas, dus het kader is onzichtbaar. */
        const box = unitBox();
        const unitTarget = (variant ? 0.34 : 0.56) * height * scale;
        const s = unitTarget / (box.h * image.naturalHeight);
        const dw = image.naturalWidth * s;
        const dh = image.naturalHeight * s;
        const dx = width / 2 - box.cx * dw;
        const dy = cy * height - box.cy * dh;
        context.drawImage(image, dx, dy, dw, dh);
        if (veil > 0.001) {
          context.fillStyle = `rgba(255, 255, 255, ${veil.toFixed(3)})`;
          context.fillRect(0, 0, width, height);
        }
      }

      let actief = "";
      let hoogst = 0.4;
      for (const naam of ["b1", "b2", "kw", "b3", "b4", "b5", "b6"]) {
        const t = travel(naam, p);
        const o = zicht(t);
        for (const el of beatEls[naam]) {
          el.style.setProperty("--t", t.toFixed(4));
          el.style.setProperty("--o", o.toFixed(3));
        }
        section.style.setProperty(`--studio-${naam}`, o.toFixed(3));
        if (o > hoogst) {
          actief = naam;
          hoogst = o;
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
      if (resize()) paint(true);
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
            <h2 id="studio-titel">Voordat u een grote uitgave doet, moet u één ding zeker weten.</h2>
            <p>Of een warmtepomp in úw woning doet wat u ervan verwacht.</p>
          </header>

          <div className="studio-beat studio-beat-2a">
            <h3>Van het gas af</h3>
            <p>Helemaal elektrisch, of eerst een hybride opstelling naast uw bestaande cv-ketel. Later om te bouwen naar volledig elektrisch, als uw woning zover is.</p>
          </div>
          <div className="studio-beat studio-beat-2b">
            <h3>In de zomer koelen</h3>
            <p>Met hetzelfde toestel dat u in de winter verwarmt, als het systeem daarvoor geschikt is.</p>
          </div>

          <p className="studio-beat studio-kw" aria-label="Vermogens: 5, 7, 9 en 11 kilowatt">
            5 · 7 · 9 · 11 <span>kW</span>
          </p>

          <div className="studio-beat studio-beat-3">
            <h3>Daarom vragen we eerst wat u nú heeft.</h3>
            <p>Welk systeem er op dit moment bij u staat, en hoeveel gas u per jaar verbruikt in m³. Daaruit blijkt of een warmtepomp bij ú iets oplevert.</p>
            <p className="studio-oordeel">Is het niet verstandig, dan zeggen we dat.</p>
          </div>

          <div className="studio-beat studio-beat-4">
            <h3>Zijn de cijfers goed, dan komen we kijken.</h3>
            <p>Warmteverlies, isolatie, de afgifte via radiatoren of vloerverwarming, de plek voor de buitenunit en de groepenkast. Pas daarna een offerte.</p>
          </div>

          <div className="studio-beat studio-beat-5">
            <h3>En de elektra regelen wij ook.</h3>
            <p>Een warmtepomp vraagt een eigen groep en een zware voeding. Onze eigen elektricien legt die aan en breidt zo nodig de groepenkast uit. U hoeft geen tweede bedrijf te zoeken — en niemand kan naar de ander wijzen.</p>
          </div>

          <div className="studio-beat studio-beat-6">
            <h3>Wij helpen kiezen, plaatsen hem, en onderhouden hem daarna.</h3>
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
