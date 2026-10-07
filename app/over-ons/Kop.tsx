"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/* De kop: ons eigen pand in 's-Hertogenbosch bij avond, met licht in de
   voordeur. Vlakken, elk met een eigen snelheid: de foto met het deurlicht (één
   groep, zodat het licht in de deur blijft), de avondlucht erboven, en de tekst. */

/* Nieuwe foto van het pand? Alleen deze regels aanpassen:
   - src: het bestand in public/over-ons/ (liggend 3:2, minstens 1600 px breed);
   - deurX / deurY: waar de onderkant van de voordeur staat, in procenten van
     de breedte en hoogte van de foto. Daar komt het licht. */
const pand = { src: "/over-ons/pand-avond.webp", deurX: 43, deurY: 62.6 };


export function Kop() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--k", "0");
      el.dataset.klaar = "";
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
      el.style.setProperty("--k", k.toFixed(4));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    const start = window.setTimeout(() => { el.dataset.klaar = ""; }, 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.clearTimeout(start);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="oo-kop" ref={ref} aria-labelledby="oo-titel" style={{ "--deur-x": pand.deurX / 100, "--deur-y": pand.deurY / 100 } as React.CSSProperties}>
      <div className="oo-kop-scene" aria-hidden="true">
      <div className="oo-kop-beeld">
        <img src={pand.src} alt="" fetchPriority="high" decoding="async" />
        <div className="oo-deurlicht" />
      </div>
      <div className="oo-lucht" />
      </div>

      <div className="shell oo-kop-tekst">
        <p className="oo-kruimel"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Over ons</span></p>
        <h1 id="oo-titel">Sinds 2000 een vertrouwd bedrijf.</h1>
        <p className="oo-lead">Het begon bij Rob Braam zelf, hier in ’s-Hertogenbosch. Hij werkt er nog steeds. En we werken nog altijd zo: met een eigen team, van het eerste advies tot het onderhoud jaren later.</p>
        <div className="oo-acties">
          <Link className="button button-primary" href="/contact">Neem contact met ons op <span aria-hidden="true">↗</span></Link>
          <a className="oo-bel" href="tel:+31736222199"><small>Even overleggen?</small><strong>073 622 2199</strong></a>
        </div>
      </div>
      <p className="oo-kop-onder">Ons pand aan de Jacob van Wassenaerstraat in ’s-Hertogenbosch</p>
    </section>
  );
}
