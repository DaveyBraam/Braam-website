"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/* Een echte foto van onze planning aan de telefoon: onderhoud en afspraken
   lopen via planning. Er staat bewust geen toestel in beeld; een gegenereerd
   toestel met een merklogo is geen bestaand product.

   Diepte komt uit drie vlakken die bij scrollen elk een eigen snelheid hebben:
   de foto (traagst), een warme lichtsluier over de lucht, en de tekst. */

const installaties = [
  { naam: "Alleen een cv-ketel", prijs: "11,58", href: "/abonnement-aanvragen?abonnement=cv-comfort#aanvraagformulier" },
  { naam: "Cv-ketel + warmtepomp", prijs: "24,08", href: "/abonnement-aanvragen?abonnement=hybride-comfort#aanvraagformulier" },
  { naam: "Warmtepomp zonder cv-ketel", prijs: "19,92", href: "/abonnement-aanvragen?abonnement=all-electric-comfort#aanvraagformulier" },
];

export function OnderhoudHero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
      el.style.setProperty("--oh-p", p.toFixed(4));
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
    <section className={"oh-hero oh-hero--planning"} ref={ref} aria-labelledby="oh-hero-titel">
      <div className="oh-hero-beeld" aria-hidden="true">
        <picture>
          <source media="(max-width: 760px)" srcSet="/onderhoud/planning-m.webp" />
          <img src="/onderhoud/planning.webp" alt="" fetchPriority="high" decoding="async" />
        </picture>
      </div>
      <div className="oh-hero-licht" aria-hidden="true" />

      <div className="shell oh-hero-inhoud">
        <div className="oh-hero-tekst">
          <p className="oh-hero-kruimel"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Onderhoud &amp; abonnementen</span></p>

          <h1 id="oh-hero-titel">Onderhoud dat past bij uw situatie.<em>Eenmalig of met een abonnement.</em></h1>
          <p className="oh-hero-lead">Kies een losse onderhoudsbeurt als u één afspraak wilt maken, of een abonnement als u jaarlijks onderhoud en service vooraf wilt regelen. We leggen eerst uit wat bij uw installatie past.</p>

          <div className="oh-hero-acties">
            <Link className="button button-primary" href="#onderhoudskeuze">Vergelijk de opties <span aria-hidden="true">↓</span></Link>
            <a className="oh-hero-bel" href="tel:+31736222199"><small>Even overleggen?</small><strong>073 622 2199</strong></a>
          </div>
        </div>

        <div className="oh-hero-prijzen">
          <ul className="oh-hero-index" aria-label="Abonnementen per installatie, Comfort vanaf">
            {installaties.map((item) => (
              <li key={item.naam}>
                <Link href={item.href}>
                  <span>{item.naam}</span>
                  <strong><small>€</small>{item.prijs}<small> p/m</small></strong>
                </Link>
              </li>
            ))}
          </ul>
          <p className="oh-hero-noot">Comfort vanaf, per maand. Onderhoud door ons eigen team.</p>
        </div>
      </div>
    </section>
  );
}
