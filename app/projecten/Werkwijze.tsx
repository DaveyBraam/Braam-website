"use client";

import { useEffect, useRef, useState } from "react";
import { werkwijze } from "./fotos";

/* De piek: zo installeren wij. Op de computer blijft dit deel staan terwijl u
   scrolt; per stap valt er een foto van die stap op de stapel, en de laatste is
   altijd het opgeleverde werk. Alle stappen zijn de hele tijd leesbaar; de
   beweging laat alleen zien waar u bent. Op de telefoon en zonder beweging
   staan de stappen gewoon onder elkaar, elk met zijn foto. */

export function Werkwijze() {
  const ref = useRef<HTMLElement>(null);
  const [actief, setActief] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const vast = window.matchMedia("(min-width: 861px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let laatste = -1;
    const update = () => {
      frame = 0;
      if (!vast.matches) { el.style.removeProperty("--pj-t"); return; }
      const rect = el.getBoundingClientRect();
      const reis = Math.max(1, rect.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -rect.top / reis));
      const t = p * werkwijze.length;
      el.style.setProperty("--pj-t", t.toFixed(4));
      const nu = Math.min(werkwijze.length - 1, Math.max(0, Math.floor(t + 0.25)));
      if (nu !== laatste) { laatste = nu; setActief(nu); }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    vast.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      vast.removeEventListener("change", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="pj-werk" ref={ref} aria-labelledby="pj-werk-titel" style={{ "--pj-n": werkwijze.length } as React.CSSProperties}>
      <div className="pj-werk-vast">
        <div className="shell pj-werk-raster">
          <h2 id="pj-werk-titel">Zo installeren wij.</h2>
          <p className="pj-werk-intro">Van de eerste leiding tot het opgeleverde werk, in vier stappen. De foto’s zijn van onze eigen monteurs.</p>
          <ol className="pj-stappen">
            {werkwijze.map((w, i) => (
              <li key={w.stap} className="pj-stap" data-actief={i === actief ? "" : undefined} style={{ "--i": i } as React.CSSProperties}>
                <div className="pj-stap-tekst">
                  <h3><span className="pj-stap-nr" aria-hidden="true">{i + 1}</span>{w.stap}</h3>
                  <p>{w.tekst}</p>
                  <p className="pj-stap-foto">Foto: {w.foto.titel.toLowerCase()}, {w.foto.stadium.toLowerCase()}</p>
                </div>
                <figure className="pj-stap-afdruk">
                  <img src={w.foto.src} alt={w.foto.alt} loading="lazy" decoding="async" />
                </figure>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
