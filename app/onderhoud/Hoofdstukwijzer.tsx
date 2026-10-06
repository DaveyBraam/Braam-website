"use client";

import { useEffect, useRef, useState } from "react";

/* De hoofdstukwijzer: een rustige balk onder de sitekop die laat zien in welk
   deel van de pagina u bent en hoe ver u daarin bent. Hij verschijnt pas na
   de hero en stuurt ook de lijn langs de startstappen (de enige beweging in
   de inhoud). Geen effect, alleen oriëntatie. */

type Hoofdstuk = { id: string; label: string };

export function Hoofdstukwijzer({ hoofdstukken }: { hoofdstukken: Hoofdstuk[] }) {
  const navRef = useRef<HTMLElement>(null);
  const [actief, setActief] = useState<string | null>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const header = document.querySelector<HTMLElement>(".site-header");
    const secties = hoofdstukken
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const tijdlijn = document.querySelector<HTMLElement>("[data-tijdlijn]");
    const stappen = tijdlijn ? Array.from(tijdlijn.querySelectorAll<HTMLElement>("[data-stap]")) : [];
    const balken = Array.from(nav.querySelectorAll<HTMLElement>("[data-balk]"));
    const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>("a"));
    let vorige: string | null = null;
    let frame = 0;

    const update = () => {
      frame = 0;
      const kop = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
      document.documentElement.style.setProperty("--oh-kop", `${Math.round(kop)}px`);
      const leeslijn = kop + nav.offsetHeight + window.innerHeight * 0.25;

      let nu: string | null = null;
      secties.forEach((sectie, i) => {
        const r = sectie.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (leeslijn - r.top) / Math.max(1, r.height)));
        balken[i]?.style.setProperty("--vul", p.toFixed(3));
        if (r.top <= leeslijn && r.bottom > leeslijn) nu = hoofdstukken[i].id;
      });

      const eerste = secties[0]?.getBoundingClientRect().top ?? 0;
      const laatste = secties[secties.length - 1]?.getBoundingClientRect().bottom ?? 0;
      nav.classList.toggle("is-zichtbaar", eerste < kop + nav.offsetHeight + 40 && laatste > kop + 80);

      if (nu !== vorige) {
        vorige = nu;
        setActief(nu);
        /* Op de telefoon schuift de rij mee, zonder de pagina te verplaatsen. */
        const link = links[hoofdstukken.findIndex((h) => h.id === nu)];
        const rij = nav.querySelector<HTMLElement>("ol");
        if (link && rij && rij.scrollWidth > rij.clientWidth) {
          rij.scrollTo({ left: link.offsetLeft - 16, behavior: "smooth" });
        }
      }

      if (tijdlijn) {
        const r = tijdlijn.getBoundingClientRect();
        const lijn = window.innerHeight * 0.62;
        const p = Math.min(1, Math.max(0, (lijn - r.top) / Math.max(1, r.height)));
        tijdlijn.style.setProperty("--vul", p.toFixed(3));
        stappen.forEach((stap) => stap.classList.toggle("is-bereikt", stap.getBoundingClientRect().top + 20 < lijn));
      }
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
  }, [hoofdstukken]);

  return (
    <nav className="oh-wijzer" ref={navRef} aria-label="Op deze pagina">
      <ol className="shell">
        {hoofdstukken.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} aria-current={actief === h.id ? "location" : undefined}>
              {h.label}
              <i data-balk aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
