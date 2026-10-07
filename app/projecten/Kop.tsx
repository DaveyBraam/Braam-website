"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { fotos } from "./fotos";

/* De kop: drie afdrukken van eigen werk op een stapel. Diepte komt uit vier
   vlakken die bij scrollen elk een eigen snelheid hebben: koel licht (traagst),
   de achterste afdruk, de middelste, en de voorste met zijn label (snelst).
   De stapel waaiert daarbij iets uit, zodat het fotoboek eronder begint. */

const achter = fotos.find((f) => f.src.endsWith("installatie-05.webp"))!;
const midden = fotos.find((f) => f.src.endsWith("warmtepomp-berlicum.jpg"))!;
const voor = fotos.find((f) => f.src.endsWith("installatie-04.webp"))!;

export function Kop() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
      el.style.setProperty("--pj-k", k.toFixed(4));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="pj-kop" ref={ref} aria-labelledby="pj-titel">
      <div className="shell pj-kop-raster">
        <div className="pj-kop-tekst">
          <p className="pj-kruimel"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Projecten</span></p>
          <h1 id="pj-titel">Dit werk hebben we zelf gemaakt.</h1>
          <p className="pj-lead">Op deze pagina ziet u echte installaties van Braam: van buitenunit tot complete techniekruimte. Een deel van de foto’s is bewust tijdens montage en inregeling gemaakt, zodat u ook het werk achter de toestellen ziet.</p>
          <div className="pj-acties">
            <Link className="button button-primary" href="/offerte-aanvragen">Vertel ons over uw project <span aria-hidden="true">↗</span></Link>
            <a className="pj-bel" href="tel:+31736222199"><small>Even overleggen?</small><strong>073 622 2199</strong></a>
          </div>
          <p className="pj-naar-boek"><a href="#fotoboek">Bekijk alle {fotos.length} foto’s</a></p>
        </div>

        <div className="pj-stapel" aria-hidden="true">
          <div className="pj-licht" />
          <div className="pj-afdruk pj-afdruk--achter"><img src={achter.src} alt="" decoding="async" /></div>
          <div className="pj-afdruk pj-afdruk--midden"><img src={midden.src} alt="" decoding="async" /></div>
          <div className="pj-afdruk pj-afdruk--voor"><img src={voor.src} alt="" fetchPriority="high" decoding="async" /></div>
          <p className="pj-kaartje"><span>{voor.soort} · {voor.stadium}</span><strong>{voor.titel}</strong></p>
        </div>
      </div>
    </section>
  );
}
