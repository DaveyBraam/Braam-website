"use client";

import { useEffect, useRef } from "react";
import { CvJourneyEntry } from "./CvJourneyEntry";

export function CvWoningJourney() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = section.current;
    if (!root) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    import("../lib/cv-woning-scene").then(({ mountCvWoning }) => {
      if (!cancelled) dispose = mountCvWoning(root);
    }).catch(() => {
      root.dataset.mode = "static";
      root.style.removeProperty("height");
      root.dataset.ready = "true";
      root.dispatchEvent(new Event("cvw:ready"));
    });
    return () => { cancelled = true; dispose?.(); };
  }, []);

  return (
    <>
    <CvJourneyEntry />
    <section ref={section} className="cv-woning" id="cv-woning" data-mode="static" aria-label="Van uw woning naar een nieuwe cv-ketel">
      <div className="cvw-canvas" data-scene-canvas aria-hidden="true" />
      <img className="cvw-poster" src="/models/cv-woning/opening.png?v=keuken-04" alt="Keuken in de woning die we volgen naar de cv-installatie" width="1440" height="900" fetchPriority="high" />
      <div className="cvw-wash" aria-hidden="true" />
      <div className="cvw-outro" aria-hidden="true" />
      <div className="cvw-masthead">
        <a href="#cv-informatie" className="cvw-skip">Direct naar informatie <span aria-hidden="true">↓</span></a>
        <span className="cvw-edition">Ketelwijzer</span>
      </div>
        <div className="cvw-copy cvw-opening" data-beat="opening">
          <svg className="cvw-opening-outline" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M 50 0 H 0 V 100 H 50" pathLength="1" vectorEffect="non-scaling-stroke" />
            <path d="M 50 0 H 100 V 100 H 50" pathLength="1" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="cvw-opening-content">
          <p className="cvw-eyebrow"><span className="cvw-number">01</span> Het begin</p>
          <h1 className="cvw-heading">Een nieuwe cv-ketel.<br /><span>Afgestemd op uw woning.</span></h1>
          <p className="cvw-body">Van de eerste douche tot een warm huis op een winterdag. We kijken naar uw woning en uw warmwatergebruik, en kiezen daar het toestel bij.</p>
          <div className="cvw-note"><span>Wat u gaat zien</span> Vijf stappen, van de kamers die u verwarmt tot de doorvoer op het dak.</div>
          <span className="cvw-scroll-cue"><span className="cvw-scroll-line"></span> Scroll om mee te lopen</span>
          </div>
        </div>

        <div className="cvw-copy" data-beat="radiator">
          <p className="cvw-eyebrow"><span className="cvw-number">02</span> De warmtevraag</p>
          <h2 className="cvw-heading">Warmte begint niet<br /><span>bij de ketel.</span></h2>
          <p className="cvw-body">Hoe uw woning nu verwarmd wordt bepaalt wat er kan. Daarom nemen we de bestaande radiatoren en de ruimtes die u gebruikt mee in het advies.</p>
          <div className="cvw-note"><span>Wat we meewegen</span> Radiatoren, vloerverwarming of allebei, en welk vermogen daarbij hoort.</div>
        </div>

        <div className="cvw-copy" data-beat="boiler">
          <p className="cvw-eyebrow"><span className="cvw-number">03</span> Het toestel</p>
          <h2 className="cvw-heading">Het juiste toestel<br /><span>is maatwerk.</span></h2>
          <p className="cvw-body">We stemmen de ketel en de aansluitingen af op uw situatie, met aandacht voor bereikbaarheid en afwerking.</p>
          <div className="cvw-note"><span>Vóór ingebruikname</span> We controleren werking, afstelling en rookgassen.</div>
        </div>

        <div className="cvw-copy" data-beat="pipes">
          <p className="cvw-eyebrow"><span className="cvw-number">04</span> De aansluitingen</p>
          <h2 className="cvw-heading">Wat eronder zit<br /><span>telt net zo hard.</span></h2>
          <p className="cvw-body">Het leidingwerk voor verwarming, water en gas controleren we stuk voor stuk, en we werken het overzichtelijk af.</p>
          <div className="cvw-note"><span>Vijf aansluitingen</span> Aanvoer · warm water · gas · koud water · retour</div>
        </div>

        <svg className="cvw-annotation" id="cvw-annotation" aria-hidden="true">
          <path id="cvw-gas-leader" d="M0 0" />
          <circle id="cvw-gas-ring" cx="0" cy="0" r="8" />
          <circle id="cvw-gas-marker" cx="0" cy="0" r="2.5" />
        </svg>
        <aside className="cvw-detail" id="cvw-gas-note" aria-label="Controle van de gasleiding">
          <p className="cvw-detail-index"><span>04.1</span> Controlepunt</p>
          <h3>De gasleiding.<br /><span>Gecontroleerd.</span></h3>
          <dl>
            <div><dt>Bij onderhoud</dt><dd>We meten altijd de gasdruk.</dd></div>
            <div><dt>Bij installatie</dt><dd>We beproeven de gasleiding op lekdichtheid.</dd></div>
          </dl>
          <p className="cvw-assurance">Een vastgesteld gaslek moet vóór ingebruikname en oplevering zijn hersteld en opnieuw gecontroleerd.</p>
        </aside>

        <div className="cvw-copy" data-beat="flue">
          <p className="cvw-eyebrow"><span className="cvw-number">05</span> De afvoer</p>
          <h2 className="cvw-heading">De afvoer is<br /><span>geen bijzaak.</span></h2>
          <p className="cvw-body">Rookgasafvoer en luchttoevoer moeten passen bij het toestel én bij het kanaal dat er al ligt. We bekijken het traject, de verbindingen en de dakdoorvoer.</p>
          <div className="cvw-note"><span>De route</span> Recht omhoog door het dak, of na een bocht door de gevel.</div>
        </div>

      {/* Named points from the model itself, not invented positions. The five
          connections carry the functions the owner confirmed. */}
      <svg className="cvw-mark-lines" id="cvw-mark-lines" aria-hidden="true" />
      <div className="cvw-marks" id="cvw-marks">
        <span className="cvw-mark" data-mark="01-cv-aanvoer-koperen-leiding">CV-aanvoer</span>
        <span className="cvw-mark" data-mark="02-warm-water-koperen-leiding">Warm water</span>
        <span className="cvw-mark" data-mark="03-gas-koperen-leiding">Gas</span>
        <span className="cvw-mark" data-mark="04-koud-water-koperen-leiding">Koud water</span>
        <span className="cvw-mark" data-mark="05-cv-retour-koperen-leiding">CV-retour</span>
        <span className="cvw-mark" data-mark="concentrisch-binnenbuis">Binnenbuis</span>
        <span className="cvw-mark" data-mark="concentrisch-buitenbuis">Buitenbuis</span>
      </div>
      <p className="cvw-status" data-scene-status role="status" aria-live="polite" />
    </section>
    </>
  );
}
