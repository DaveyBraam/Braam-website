"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fotos, soorten, type Soort } from "./fotos";

/* Het fotoboek: alle foto's groot, elk met hetzelfde label (soort · stadium,
   titel). Bovenaan kiest u een soort werk; een foto aanklikken opent hem groot,
   met vorige en volgende (ook met de pijltjestoetsen). Geen scrollbeweging:
   na de werkwijze is dit de rust om zelf rond te kijken. */

type Keuze = "Alles" | Soort;

export function Fotoboek() {
  const [keuze, setKeuze] = useState<Keuze>("Alles");
  const [open, setOpen] = useState<number | null>(null);
  const dialoog = useRef<HTMLDialogElement>(null);
  const terug = useRef<HTMLElement | null>(null);

  const zichtbaar = keuze === "Alles" ? fotos : fotos.filter((f) => f.soort === keuze);
  const keuzes: { naam: Keuze; aantal: number }[] = [
    { naam: "Alles", aantal: fotos.length },
    ...soorten.map((s) => ({ naam: s, aantal: fotos.filter((f) => f.soort === s).length })).filter((s) => s.aantal > 0),
  ];

  const openen = (i: number, knop: HTMLElement) => {
    terug.current = knop;
    setOpen(i);
  };
  const sluiten = useCallback(() => setOpen(null), []);
  const stap = useCallback((r: number) => {
    setOpen((i) => (i === null ? i : (i + r + zichtbaar.length) % zichtbaar.length));
  }, [zichtbaar.length]);

  // Openen en sluiten lopen allebei via `open`; Esc en klikken naast de foto
  // sluiten de dialoog zelf en zetten `open` daarna terug.
  const wasOpen = useRef(false);
  useEffect(() => {
    const d = dialoog.current;
    if (!d) return;
    if (open !== null) {
      if (!d.open) {
        d.showModal();
        d.querySelector<HTMLButtonElement>(".pj-sluit")?.focus();
      }
      window.__lenis?.stop();
      wasOpen.current = true;
    } else if (wasOpen.current) {
      wasOpen.current = false;
      if (d.open) d.close();
      window.__lenis?.start();
      // Na de eigen focusterugzet van de dialoog, anders wint die.
      setTimeout(() => terug.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    const d = dialoog.current;
    if (!d) return;
    const dicht = () => setOpen(null);
    const toets = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); stap(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); stap(-1); }
    };
    d.addEventListener("close", dicht);
    d.addEventListener("keydown", toets);
    return () => {
      d.removeEventListener("close", dicht);
      d.removeEventListener("keydown", toets);
    };
  }, [stap]);

  const groot = open === null ? null : zichtbaar[open];

  return (
    <section className="pj-boek" id="fotoboek" aria-labelledby="pj-boek-titel">
      <div className="shell">
        <div className="pj-boek-kop">
          <h2 id="pj-boek-titel">Alle foto’s</h2>
          <p>Gemaakt bij echte projecten. Bij foto’s tijdens montage ziet u soms nog vulslangen, gereedschap of afwerkmateriaal. Klik op een foto om hem groot te bekijken.</p>
        </div>

        <div className="pj-soorten" role="group" aria-label="Kies een soort werk">
          {keuzes.map((k) => (
            <button key={k.naam} type="button" aria-pressed={keuze === k.naam} onClick={() => setKeuze(k.naam)}>
              {k.naam} <span className="pj-aantal">{k.aantal}</span>
            </button>
          ))}
        </div>

        <ul className="pj-raster" aria-live="polite">
          {zichtbaar.map((f, i) => (
            <li key={f.src} className={f.liggend ? "pj-tegel pj-tegel--liggend" : "pj-tegel"}>
              <button type="button" className="pj-tegel-knop" onClick={(e) => openen(i, e.currentTarget)} aria-label={`${f.titel}, ${f.stadium.toLowerCase()}: groot bekijken`}>
                <img src={f.src} alt={f.alt} loading="lazy" decoding="async" />
              </button>
              <p className="pj-label"><span>{f.soort} · {f.stadium}</span><strong>{f.titel}</strong></p>
            </li>
          ))}
        </ul>
      </div>

      <dialog className="pj-groot" ref={dialoog} aria-label={groot ? groot.titel : "Foto"} onClick={(e) => { if (e.target === e.currentTarget) sluiten(); }}>
        {groot && (
          <div className="pj-groot-binnen">
            <img src={groot.src} alt={groot.alt} />
            <div className="pj-groot-onder">
              <p className="pj-label"><span>{groot.soort} · {groot.stadium}</span><strong>{groot.titel}</strong></p>
              <p className="pj-groot-teller">{(open ?? 0) + 1} van {zichtbaar.length}</p>
              <div className="pj-groot-knoppen">
                <button type="button" onClick={() => stap(-1)}><span aria-hidden="true">←</span> Vorige</button>
                <button type="button" onClick={() => stap(1)}>Volgende <span aria-hidden="true">→</span></button>
                <button type="button" className="pj-sluit" onClick={sluiten}>Sluiten</button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
