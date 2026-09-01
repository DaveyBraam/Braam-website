"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/* De doorsnede. Bovenaan de cv-ketelpagina: een getekende plaat van de hele
   installatie, met vier teksten die er op scroll bij aanwijzen.

   Waarom lijnwerk en geen gegenereerd toestel, zoals op de warmtepompenpagina:
   het argument van deze pagina is dat de ketel het makkelijke deel is. Dat
   argument gaat over de afvoer, de gasleiding en de aansluiting -- dingen die
   je op een foto van een dichte ketel niet kúnt aanwijzen. Een plaat kan dat
   wel. Hij kost bovendien niets om te maken en draagt geen merknaam van een
   fabrikant, wat op een verzonnen toestel wel het geval zou zijn.

   Drie bewegingen, allemaal uit dezelfde scrollwaarde:
   1. de plaat tekent zichzelf, één keer, op de klok -- niet op scroll, want
      wie stil blijft staan hoort ook iets te zien;
   2. per tekst valt alles terug naar haarlijn behalve het onderdeel dat aan
      het woord is;
   3. de camera schuift er naartoe. Dat is puur een CSS-transform op de plaat,
      geen viewBox-geschrijf: zo blijft het op de compositor.

   Zonder JavaScript, of met prefers-reduced-motion, staat hier een gewoon
   document: de plaat als stilstaande tekening met alles even zwaar, en de
   teksten als blokken eronder. Dezelfde woorden. */

/* Wanneer welke tekst leesbaar is: [begin fade-in, vol, begin fade-uit, weg]. */
const WINDOWS: Record<string, [number, number, number, number]> = {
  b1: [-1, 0, 0.13, 0.19],
  b2: [0.2, 0.26, 0.36, 0.42],
  b3: [0.43, 0.49, 0.59, 0.65],
  b4: [0.66, 0.72, 0.82, 0.88],
  b5: [0.89, 0.95, 2, 3],
};

/* De camera: schaal en het punt van de plaat dat naar het midden moet. De
   fracties zijn posities in de tekening zelf (0..1 van de viewBox), dus ze
   blijven kloppen als de plaat van maat verandert. */
const SCHAAL: Array<[number, number]> = [
  [0, 1],
  [0.13, 1],
  [0.26, 1.34],
  [0.36, 1.34],
  [0.49, 1.3],
  [0.59, 1.3],
  [0.72, 1],
  [1, 1],
];
const FOCUS_X: Array<[number, number]> = [
  [0, 0.5],
  [0.13, 0.5],
  [0.26, 0.435],
  [0.36, 0.435],
  [0.49, 0.25],
  [0.59, 0.25],
  [0.72, 0.5],
  [1, 0.5],
];
const FOCUS_Y: Array<[number, number]> = [
  [0, 0.5],
  [0.13, 0.5],
  [0.26, 0.175],
  [0.36, 0.175],
  [0.49, 0.79],
  [0.59, 0.79],
  [0.72, 0.5],
  [1, 0.5],
];

/* Waar dat brandpunt in het beeld moet landen, als fractie van de stage — niet
   van de plaat. De plaat hangt onderaan, dus "naar het midden van de plaat"
   duwde de tekening het beeld uit. En het doel wijkt voor de tekst: bij de
   afvoer staat die links, dus gaat het detail naar rechts; bij de gasleiding
   andersom. */
const DOEL_X: Array<[number, number]> = [
  [0, 0.5], [0.13, 0.5], [0.26, 0.58], [0.36, 0.58],
  [0.49, 0.41], [0.59, 0.41], [0.72, 0.5], [1, 0.5],
];
const DOEL_Y: Array<[number, number]> = [
  [0, 0.5], [0.13, 0.5], [0.26, 0.46], [0.36, 0.46],
  [0.49, 0.56], [0.59, 0.56], [0.72, 0.5], [1, 0.5],
];

/* Dezelfde reis op een telefoon, maar dichterbij. Op 375px is de hele
   doorsnede een vaag huisje van een paar centimeter: de ketel wordt een leeg
   blokje en de leidingen verdwijnen. Daar staat de camera dus altíjd aan, op
   het toestel, en de details gaan nog een stap dichterbij. Wat er buiten het
   beeld valt, valt buiten het beeld -- de plaat klipt. */
const SCHAAL_M: Array<[number, number]> = [
  [0, 1.7], [0.13, 1.7], [0.26, 2.5], [0.36, 2.5],
  [0.49, 2.4], [0.59, 2.4], [0.72, 1.7], [1, 1.7],
];
const FOCUS_X_M: Array<[number, number]> = [
  [0, 0.44], [0.13, 0.44], [0.26, 0.435], [0.36, 0.435],
  [0.49, 0.25], [0.59, 0.25], [0.72, 0.44], [1, 0.44],
];
const FOCUS_Y_M: Array<[number, number]> = [
  [0, 0.42], [0.13, 0.42], [0.26, 0.19], [0.36, 0.19],
  [0.49, 0.78], [0.59, 0.78], [0.72, 0.42], [1, 0.42],
];

const DOEL_Y_M: Array<[number, number]> = [
  [0, 0.68], [0.13, 0.68], [0.26, 0.72], [0.36, 0.72],
  [0.49, 0.74], [0.59, 0.74], [0.72, 0.68], [1, 0.68],
];

/* Hoeveel de camera zich met die plek bemoeit. Op nul staat de plaat precies
   waar de opmaak hem zet en telt alleen de schaal; op één wordt het brandpunt
   naar zijn plek gebracht. Zo hoeft het overzicht geen doelwaarden te kennen
   die toevallig kloppen. */
const CAMERA: Array<[number, number]> = [
  [0, 0], [0.13, 0], [0.26, 1], [0.36, 1],
  [0.49, 1], [0.59, 1], [0.72, 0], [1, 0],
];

/* Per laag: hoe hard hij meedoet. 1 is inkt, 0 is haarlijn. Bij de vierde
   beat vallen ze allemaal terug -- daar staat de tekst alleen. */
const LAGEN: Record<string, Array<[number, number]>> = {
  huis: [
    [0, 1], [0.19, 1], [0.26, 0.42], [0.59, 0.42], [0.66, 0.42],
    [0.72, 0.1], [0.82, 0.1], [0.9, 1], [1, 1],
  ],
  ketel: [
    [0, 1], [0.19, 1], [0.26, 0.26], [0.59, 0.26], [0.66, 0.26],
    [0.72, 0.1], [0.82, 0.1], [0.9, 1], [1, 1],
  ],
  afvoer: [
    [0, 1], [0.19, 1], [0.26, 1], [0.36, 1], [0.43, 0.2], [0.59, 0.2],
    [0.72, 0.1], [0.82, 0.1], [0.9, 1], [1, 1],
  ],
  gas: [
    [0, 1], [0.19, 1], [0.26, 0.2], [0.36, 0.2], [0.49, 1], [0.59, 1],
    [0.72, 0.1], [0.82, 0.1], [0.9, 1], [1, 1],
  ],
  afgifte: [
    [0, 1], [0.19, 1], [0.26, 0.2], [0.59, 0.2], [0.66, 0.2],
    [0.72, 0.1], [0.82, 0.1], [0.9, 1], [1, 1],
  ],
};

const TEKEN_MS = 1700;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

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

export function CvDoorsnede() {
  const sectionRef = useRef<HTMLElement>(null);
  const plaatRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const plaat = plaatRef.current;
    if (!section || !plaat) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const smal = window.matchMedia("(max-width: 660px)");

    let disposed = false;
    let frame = 0;
    let onScreen = false;
    let progress = 0;
    let teken = 0;
    let tekenStart = 0;
    let tekenState: "wacht" | "loopt" | "klaar" = "wacht";
    let tekenFrame = 0;

    const blokken: Record<string, HTMLElement[]> = {};
    for (const [naam, sels] of Object.entries({
      b1: [".doorsnede-beat-1"],
      b2: [".doorsnede-beat-2"],
      b3: [".doorsnede-beat-3"],
      b4: [".doorsnede-beat-4"],
      b5: [".doorsnede-beat-5"],
    })) {
      blokken[naam] = sels
        .map((sel) => section.querySelector<HTMLElement>(sel))
        .filter((el): el is HTMLElement => el !== null);
    }

    /* De vakken van stage en plaat. Ze veranderen alleen bij een resize, dus
       ze worden daar opnieuw gemeten en verder met rust gelaten: een
       getBoundingClientRect per frame is een gedwongen herberekening van de
       opmaak, precies tijdens het scrollen. */
    let maten: {
      stageBreed: number; stageHoog: number;
      plaatLinks: number; plaatBoven: number; plaatBreed: number; plaatHoog: number;
    } | null = null;

    const meet = () => {
      const stage = section.querySelector<HTMLElement>(".doorsnede-stage");
      if (!stage) return;
      const sb = stage.getBoundingClientRect();
      const pb = plaat.getBoundingClientRect();
      if (sb.width <= 0 || pb.width <= 0) return;
      /* De plaat kan al getransformeerd staan; het onvervormde vak is wat we
         nodig hebben, dus offsetLeft/offsetTop ten opzichte van de stage. */
      maten = {
        stageBreed: sb.width,
        stageHoog: sb.height,
        plaatLinks: plaat.offsetLeft,
        plaatBoven: plaat.offsetTop,
        plaatBreed: plaat.offsetWidth,
        plaatHoog: plaat.offsetHeight,
      };
    };

    const readProgress = () => {
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      return clamp01(-rect.top / distance);
    };

    /* Alles wat per frame naar de stijl gaat, in één functie. Waarden worden
       alleen geschreven als ze echt veranderen: de laagsterktes en de
       zichtbaarheid slaan maar een paar keer per reis om, en een schrijfactie
       op een custom property is een herberekening van de hele subtree. */
    const vorige: Record<string, string> = {};
    const zet = (naam: string, waarde: string) => {
      if (vorige[naam] === waarde) return;
      vorige[naam] = waarde;
      section.style.setProperty(naam, waarde);
    };

    const paint = () => {
      const p = progress;

      /* De camera. Op smal staat de plaat stil: een tekening die op een
         telefoon ook nog inzoomt, laat te weinig over om te herkennen. */
      if (!maten) {
        plaat.style.transform = "";
      } else {
        const mob = smal.matches;
        const s = sample(mob ? SCHAAL_M : SCHAAL, p);
        const cam = mob ? 1 : sample(CAMERA, p);
        /* Waar het brandpunt terechtkomt na schalen om het midden van de plaat,
           en hoeveel er nog bij moet om het op zijn plek in het beeld te
           krijgen. Alles in pixels, want plaat en stage hebben niet dezelfde
           maat en ook niet hetzelfde midden. */
        const fx = sample(mob ? FOCUS_X_M : FOCUS_X, p);
        const fy = sample(mob ? FOCUS_Y_M : FOCUS_Y, p);
        const px = maten.plaatLinks + maten.plaatBreed * (0.5 + (fx - 0.5) * s);
        const py = maten.plaatBoven + maten.plaatHoog * (0.5 + (fy - 0.5) * s);
        const tx = cam * (maten.stageBreed * (mob ? 0.5 : sample(DOEL_X, p)) - px);
        /* Op smal hangt de plaat lager in beeld dan op breed: de tekst staat
           er bovenop in plaats van ernaast, dus alles wat de tekening hoger zet
           kost leesruimte. */
        const ty = cam * (maten.stageHoog * (mob ? sample(DOEL_Y_M, p) : sample(DOEL_Y, p)) - py);
        plaat.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${s.toFixed(4)})`;
      }

      for (const [naam, keys] of Object.entries(LAGEN)) {
        zet(`--laag-${naam}`, sample(keys, p).toFixed(3));
      }
      zet("--teken", teken.toFixed(3));
      /* De maatverdeling hoort bij de hele plaat. Zodra de camera een detail
         pakt, loopt hij dwars door de tekening heen -- dus dan is hij weg. */
      zet("--camera", sample(CAMERA, p).toFixed(3));

      let actief = "b1";
      let hoogst = -1;
      for (const naam of Object.keys(WINDOWS)) {
        const waarde = window01(naam, p);
        zet(`--cv-${naam}`, waarde.toFixed(3));
        /* Een uitgewerkte tekst hoort niet meer in het schilderwerk: op nul
           blijft er anders een spookregel staan die wel te selecteren is. */
        const zichtbaar = waarde > 0.004 ? "1" : "0";
        for (const blok of blokken[naam]) {
          if (blok.dataset.zicht === zichtbaar) continue;
          blok.dataset.zicht = zichtbaar;
          blok.style.visibility = zichtbaar === "1" ? "" : "hidden";
        }
        if (waarde > hoogst) {
          actief = naam;
          hoogst = waarde;
        }
      }
      if (section.dataset.actief !== actief) section.dataset.actief = actief;
      if (ctaRef.current) ctaRef.current.tabIndex = actief === "b5" ? 0 : -1;
    };

    const update = () => {
      if (!onScreen) return;
      progress = readProgress();
      /* Scrollen onderbreekt het tekenen: de bezoeker heeft het stuur gepakt
         en hoort de plaat compleet te zien, niet halverwege een lijn. */
      if (tekenState !== "klaar" && progress > 0.008) {
        tekenState = "klaar";
        teken = 1;
      }
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

    /* De plaat tekent zichzelf op een eigen klok: er is dan nog geen scroll
       die de boel wakker houdt. */
    const tekenTick = () => {
      tekenFrame = 0;
      if (disposed || tekenState !== "loopt") return;
      teken = clamp01((performance.now() - tekenStart) / TEKEN_MS);
      paint();
      if (teken >= 1) {
        tekenState = "klaar";
        return;
      }
      tekenFrame = window.requestAnimationFrame(tekenTick);
    };

    const maybeTeken = () => {
      if (tekenState !== "wacht" || !onScreen) return;
      if (readProgress() > 0.03) {
        tekenState = "klaar";
        teken = 1;
        paint();
        return;
      }
      tekenState = "loopt";
      tekenStart = performance.now();
      tekenFrame = window.requestAnimationFrame(tekenTick);
    };

    const start = () => {
      section.dataset.live = "true";
      register();
      meet();
      progress = readProgress();
      paint();
    };
    const stopLive = () => {
      delete section.dataset.live;
      delete section.dataset.actief;
      section.querySelectorAll<HTMLElement>(".doorsnede-beat").forEach((blok) => {
        delete blok.dataset.zicht;
        blok.style.visibility = "";
      });
      plaat.style.transform = "";
      unregister();
      stop();
      tekenState = "klaar";
      teken = 1;
    };
    const onMotionChange = () => {
      if (reducedMotion.matches) stopLive();
      else start();
    };

    if (!reducedMotion.matches) start();

    /* De plaat staat pas op zijn maat als de letter binnen is: daarvoor zijn
       de beats hoger en duwt de opmaak de plaat omlaag. */
    document.fonts?.ready.then(() => {
      if (disposed) return;
      meet();
      paint();
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) {
          meet();
          wake();
          maybeTeken();
        } else stop();
      },
      { rootMargin: "20% 0px" },
    );
    observer.observe(section);

    const onResize = () => {
      meet();
      progress = readProgress();
      paint();
      wake();
    };

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });
    smal.addEventListener("change", onResize);
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      disposed = true;
      unregister();
      stop();
      if (tekenFrame) window.cancelAnimationFrame(tekenFrame);
      observer.disconnect();
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      smal.removeEventListener("change", onResize);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <section className="doorsnede" ref={sectionRef} aria-labelledby="doorsnede-titel">
      <div className="doorsnede-stage">
        <div className="doorsnede-plaat" ref={plaatRef} aria-hidden="true">
          <svg viewBox="0 90 1200 570" role="img" aria-label="Doorsnede van een cv-installatie: ketel, rookgasafvoer door het dak, gasleiding en afgifte">
            <defs>
              <pattern id="cv-arcering" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="9" />
              </pattern>
            </defs>

            {/* ---- Het huis: dak, wanden, vloer. Context, nooit het onderwerp. */}
            <g className="laag laag-huis">
              <path className="poche" d="M150,340 L176,362 L176,560 L150,560 Z" />
              <path className="poche" d="M1050,340 L1024,362 L1024,560 L1050,560 Z" />
              <path className="poche" d="M410,250 L432,250 L432,560 L410,560 Z" />
              <path className="poche" d="M150,560 L1050,560 L1050,586 L150,586 Z" />

              <path className="lijn" pathLength="1" d="M150,340 L600,150 L1050,340" />
              <path className="lijn" pathLength="1" d="M150,362 L600,172 L1050,362" />
              <path className="lijn" pathLength="1" d="M150,340 L150,560 M1050,340 L1050,560" />
              <path className="lijn" pathLength="1" d="M176,362 L176,560 M1024,362 L1024,560" />
              <path className="lijn dik" pathLength="1" d="M150,560 L1050,560" />
              <path className="lijn" pathLength="1" d="M150,586 L1050,586" />
              <path className="lijn" pathLength="1" d="M410,250 L432,250 L432,560 M410,250 L410,560" />

              <g className="fijn dun">
                <path d="M230,306 L230,328 M310,272 L310,294 M390,239 L390,261 M470,205 L470,227 M570,163 L570,185" />
                <path d="M630,163 L630,185 M730,205 L730,227 M810,239 L810,261 M890,272 L890,294 M970,306 L970,328" />
              </g>
            </g>

            {/* ---- De afgifte: waar de warmte heen gaat. */}
            <g className="laag laag-afgifte">
              <path className="lijn" pathLength="1" d="M540,548 L540,570 L900,570 L900,545" />
              <path className="lijn" pathLength="1" d="M564,548 L564,578 L972,578 L972,545" />
              <path className="lijn" pathLength="1" d="M890,448 L990,448 L990,545 L890,545 Z" />
              <path className="lijn" pathLength="1" d="M890,458 L990,458 M890,535 L990,535" />
              <g className="fijn dun">
                <path d="M902,458 L902,535 M914,458 L914,535 M926,458 L926,535 M938,458 L938,535 M950,458 L950,535 M962,458 L962,535 M974,458 L974,535" />
                <path d="M905,545 L905,560 M975,545 L975,560" />
                <path className="golf" d="M212,573 C232,565 252,581 272,573 C292,565 312,581 332,573 C352,565 372,581 392,573" />
              </g>
              <g className="bijschrift">
                <path className="leider" d="M890,452 L846,452" />
                <text className="kop" x="836" y="448" textAnchor="end">Afgifte</text>
                <text className="sub" x="836" y="470" textAnchor="end">radiatoren of vloerverwarming</text>
              </g>
            </g>

            {/* ---- De gasleiding: van de meter door de wand naar het toestel. */}
            <g className="laag laag-gas">
              <path className="lijn" pathLength="1" d="M446,548 L300,548 L300,470 L176,470" />
              <g className="fijn dun">
                <path d="M170,464 L182,464 M170,476 L182,476" />
              </g>
              <g className="kraan">
                <path d="M290,497 L300,505 L290,513 Z" />
                <path d="M310,497 L300,505 L310,513 Z" />
                <path className="dun" d="M300,497 L300,487 M292,487 L308,487" />
              </g>
              <g className="bijschrift">
                <path className="leider" d="M300,556 L300,602" />
                <text className="kop" x="300" y="624" textAnchor="middle">Gasleiding</text>
                <text className="sub" x="300" y="646" textAnchor="middle">beproefd op lekdichtheid</text>
              </g>
            </g>

            {/* ---- De rookgasafvoer: concentrisch, door het dak. */}
            <g className="laag laag-afvoer">
              <path className="lijn" pathLength="1" d="M490,248 L490,110" />
              <path className="lijn" pathLength="1" d="M534,248 L534,110" />
              <path className="lijn dun" pathLength="1" d="M502,248 L502,124" />
              <path className="lijn dun" pathLength="1" d="M522,248 L522,124" />
              <path className="lijn" pathLength="1" d="M476,110 L548,110 M476,110 L476,124 M548,110 L548,124" />
              <path className="lijn" pathLength="1" d="M468,102 L556,102" />
              <path className="poche" d="M470,206 L554,170 L554,182 L470,218 Z" />
              <path className="lijn dun" pathLength="1" d="M470,206 L554,170 M470,218 L554,182" />

              <g className="fijn dun pijl">
                <path d="M512,264 L512,226 M505,236 L512,224 L519,236" />
                <path d="M496,226 L496,264 M489,254 L496,266 L503,254" />
              </g>

              {/* Eén bijschrift voor allebei. Er stonden er twee, en de tweede
                  had nergens plek: de nok is een driehoek en elke regel die er
                  past raakt het dak. Samen zeggen ze bovendien wat deze beat
                  zegt — het is één doorvoer met twee kanalen. */}
              <g className="bijschrift">
                <path className="leider" d="M556,112 L638,112" />
                <text className="kop" x="648" y="108">Rookgasafvoer en luchttoevoer</text>
                <text className="sub" x="648" y="130">één doorvoer, twee kanalen</text>
              </g>
            </g>

            {/* ---- Het toestel. Bewust generiek: de merken staan verderop op
                   de pagina, met hun eigen logo, waar ze horen.

                   En bewust sober van binnen. Er stond hier eerst een ventilator
                   met bladen, een gasblok, een pomp met een driehoek erin, een
                   expansievat en een sifon -- technisch juister, maar op plaathoogte
                   een verzameling rondjes en blokjes waarin een cv-ketel niet meer
                   te herkennen was. Wat hem herkenbaar maakt is de kast: staand
                   formaat, een naad onder de mantel, de wisselaar als lamellenpakket,
                   de brander eronder, het bedieningsvlak met een venster, en de
                   aansluitingen die er aan de onderkant uit komen. */}
            <g className="laag laag-ketel">
              <path className="lijn" pathLength="1" d="M432,262 L596,262 L596,494 L432,494 Z" />
              <path className="lijn" pathLength="1" d="M490,248 L534,248 L534,262 L490,262" />
              <path className="lijn dun" pathLength="1" d="M432,300 L596,300" />
              <path className="lijn dun" pathLength="1" d="M432,466 L596,466" />

              <g className="fijn">
                {/* De warmtewisselaar: een lamellenpakket, met de brander eronder. */}
                <path className="lijn dun" d="M454,326 L574,326 L574,390 L454,390 Z" />
                <path className="dun" d="M454,342 L574,342 M454,358 L574,358 M454,374 L574,374" />
                <path className="lijn" d="M470,414 L558,414" />
                <path className="dun" d="M482,414 L482,423 M504,414 L504,423 M526,414 L526,423 M548,414 L548,423" />
                {/* Het bedieningsvlak. */}
                <path className="lijn dun" d="M540,472 L584,472 L584,488 L540,488 Z" />
                <path className="dun" d="M446,481 L452,481 M462,481 L468,481" />
              </g>

              <path className="lijn" pathLength="1" d="M446,494 L446,548 M468,494 L468,548 M490,494 L490,548 M540,494 L540,548 M564,494 L564,548" />

              <g className="bijschrift">
                <path className="leider" d="M596,302 L664,302" />
                <text className="kop" x="674" y="298">Cv-ketel</text>
                <text className="sub" x="674" y="320">wandhangend, tot 40 kW</text>
              </g>
            </g>
          </svg>
        </div>

        <div className="doorsnede-meta" aria-hidden="true">
          <div className="doorsnede-maat" />
          <p className="doorsnede-bijschrift">Cv-installatie · doorsnede</p>
        </div>

        <div className="doorsnede-beats">
          <header className="doorsnede-beat doorsnede-beat-1">
            <h1 id="doorsnede-titel">Een nieuwe ketel staat nooit op zichzelf.</h1>
            <p>Het toestel is één onderdeel van een installatie die als geheel moet kloppen.</p>
          </header>

          <div className="doorsnede-beat doorsnede-beat-2">
            <h2>De afvoer is geen bijzaak.</h2>
            <p>Rookgasafvoer en luchttoevoer moeten passen bij het toestel én bij het kanaal dat er al ligt. Dat bepaalt vaak wat er wel en niet kan.</p>
          </div>

          <div className="doorsnede-beat doorsnede-beat-3">
            <h2>De gasleiding wordt beproefd, niet aangenomen.</h2>
            <p>Na plaatsing beproeven we de leiding op lekdichtheid, stellen we het toestel af en leggen we de metingen vast.</p>
          </div>

          <div className="doorsnede-beat doorsnede-beat-4">
            <h2>De ketel is het makkelijke deel.</h2>
            <p className="doorsnede-oordeel">Wat eromheen zit bepaalt of het veilig is.</p>
            <p>Daarom zijn we CO-gecertificeerd. We meten, we leveren op met een rapport, en u krijgt te horen wat er gemeten is.</p>
          </div>

          <div className="doorsnede-beat doorsnede-beat-5">
            <h2>Wie hem plaatst, onderhoudt hem daarna.</h2>
            <p>Dezelfde mensen, van de offerte tot de jaarlijkse beurt. Voor Intergas, Remeha, Nefit en Vaillant tot en met 40 kW.</p>
            <Link className="button button-primary" href="/offerte-aanvragen?dienst=cv-ketel" ref={ctaRef}>
              Bespreek uw cv-ketel<span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
