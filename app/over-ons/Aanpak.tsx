"use client";

import { useEffect, useRef, useState } from "react";

/* De piek: van uw eerste telefoontje tot het onderhoud jaren later, in vijf
   stappen van één bedrijf. In dezelfde beeldtaal als de kop: een grote foto
   rechts die links wegvloeit in het donkerblauw, tekst op donker ernaast.

   Computer met beweging: het deel blijft staan en per stap vloeit de volgende
   foto in beeld; de stappen links zijn aan te klikken. Telefoon en zonder
   beweging: de stappen staan onder elkaar, elk met een foto. De teksten komen
   uit de bestaande over-ons- en onderhoudspagina; niets nieuws beloven. */

const stappen = [
  {
    naam: "Telefoon en planning",
    kop: "U belt met ons eigen kantoor.",
    tekst: "U spreekt rechtstreeks met ons eigen team in ’s-Hertogenbosch. Sommige vragen zijn snel telefonisch te beantwoorden; voor de rest maken we een afspraak.",
    foto: "/over-ons/planning.webp",
    alt: "Medewerker van Rob Braam plant afspraken aan de telefoon",
    plek: "62% 40%",
  },
  {
    naam: "Advies",
    kop: "Eerst luisteren, dan adviseren.",
    tekst: "Voor een groter plan kijken we bij u thuis of ontvangen we u op afspraak in ’s-Hertogenbosch. We leggen de techniek in normale taal uit en zeggen eerlijk wat wel en niet nodig is.",
    foto: "/about/ontvangstruimte-braam.png",
    alt: "Adviesgesprek aan tafel in de ontvangstruimte van Rob Braam",
    plek: "50% 60%",
  },
  {
    naam: "Eigen team",
    kop: "Geen onderaannemers.",
    tekst: "Het werk doen we met ons eigen team van gecertificeerde vakmensen, voor installatie én elektra. Wie bij u adviseert en plaatst, hoort bij hetzelfde bedrijf.",
    foto: "/over-ons/team.webp",
    alt: "Twee monteurs van Rob Braam bij de bedrijfsbussen",
    plek: "58% 40%",
  },
  {
    naam: "Installatie",
    kop: "Netjes geplaatst.",
    tekst: "Een installatie moet goed functioneren, verzorgd zijn aangelegd en later bereikbaar blijven voor onderhoud. Na het inregelen lopen we alles na en leggen we uit hoe het werkt.",
    foto: "/projects/installaties/installatie-03.webp",
    alt: "Warmtepomp met voorraadvat en buffervat, geplaatst door Rob Braam",
    plek: "50% 45%",
  },
  {
    naam: "Onderhoud",
    kop: "En daarna blijven we.",
    tekst: "Na de oplevering kunt u bij hetzelfde bedrijf terecht voor onderhoud, een servicevraag of gewoon uitleg. Wie uw installatie plaatst, onderhoudt hem ook.",
    foto: "/projects/installaties/installatie-08.webp",
    alt: "Cv-ketel met leidingwerk, geïnstalleerd door Rob Braam",
    plek: "50% 40%",
  },
];

export function Aanpak() {
  const ref = useRef<HTMLElement>(null);
  const [actief, setActief] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const vast = window.matchMedia("(min-width: 921px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let laatste = -1;
    const update = () => {
      frame = 0;
      if (!vast.matches) return;
      const rect = el.getBoundingClientRect();
      const reis = Math.max(1, rect.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -rect.top / reis));
      el.style.setProperty("--p", p.toFixed(4));
      const nu = Math.min(stappen.length - 1, Math.floor(p * stappen.length));
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

  const naarStap = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const reis = el.offsetHeight - window.innerHeight;
    const y = el.getBoundingClientRect().top + window.scrollY + ((i + 0.35) / stappen.length) * reis;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section className="oo-aanpak" ref={ref} aria-labelledby="oo-aanpak-titel" style={{ "--n": stappen.length } as React.CSSProperties}>
      <div className="oo-aanpak-vast">
        <div className="oo-aanpak-beelden" aria-hidden="true">
          {stappen.map((s, i) => (
            <img key={s.foto} src={s.foto} alt="" loading="lazy" decoding="async" data-actief={i === actief ? "" : undefined} style={{ objectPosition: s.plek }} />
          ))}
        </div>

        <div className="shell oo-aanpak-raster">
          <div className="oo-aanpak-tekst">
            <h2 id="oo-aanpak-titel">Van uw eerste telefoontje tot het onderhoud jaren later.</h2>

            <ol className="oo-stappen">
              {stappen.map((s, i) => (
                <li key={s.naam} className="oo-stap" data-actief={i === actief ? "" : undefined}>
                  <figure className="oo-stap-foto"><img src={s.foto} alt={s.alt} loading="lazy" decoding="async" style={{ objectPosition: s.plek }} /></figure>
                  <button type="button" className="oo-stap-naam" onClick={() => naarStap(i)} aria-current={i === actief ? "step" : undefined}>{s.naam}</button>
                  <div className="oo-stap-inhoud">
                    <h3>{s.kop}</h3>
                    <p>{s.tekst}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
