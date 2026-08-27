"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const highlights = [
  { value: "25+ jaar", label: "ervaring met installatie en service" },
  { value: "1.900", label: "vaste onderhoudscontracten" },
  { value: "CO-VRIJ · STEK", label: "gecertificeerd vakwerk" },
  { value: "Eigen team", label: "voor advies, montage en onderhoud" },
];

const heroServices = [
  {
    label: "Warmtepomp",
    text: "Advies, hybride of all-electric en nette installatie.",
    href: "/offerte-aanvragen?dienst=warmtepomp",
    cta: "Vraag warmtepompadvies aan",
  },
  {
    label: "Cv-ketel",
    text: "Vervangen, veilig aansluiten en onderhouden.",
    href: "/offerte-aanvragen?dienst=cv-ketel",
    cta: "Bespreek uw cv-ketel",
  },
  {
    label: "Onderhoud",
    text: "Jaarlijkse controle en storingsservice met abonnement.",
    href: "/onderhoud#abonnementen",
    cta: "Bekijk onderhoudsabonnementen",
  },
  {
    label: "Airco & elektra",
    text: "Airco-installatie, service en praktische elektra-aanpassingen.",
    href: "/offerte-aanvragen?dienst=airco-elektra",
    cta: "Vraag gericht advies aan",
  },
];

const inspectionChecks = [
  "Druk en lekkage gecontroleerd",
  "Rookgasmeting en afstelling",
  "Rapportage voor onderhoud",
];

const serviceNodes = [
  { label: "Warmtepomp", meta: "advies & installatie", className: "node-heatpump" },
  { label: "Cv-ketel", meta: "vervangen & onderhoud", className: "node-boiler" },
  { label: "Onderhoud", meta: "1.900 contracten", className: "node-maintenance" },
  { label: "Airco", meta: "STEK service", className: "node-airco" },
  { label: "Elektra", meta: "groepen & kast", className: "node-electric" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function HomeHero3D() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setHeroProgress = (progress: number) => {
      const sceneTwo = smoothstep(0.16, 0.72, progress);
      const route = smoothstep(0.08, 0.92, progress);
      const settle = smoothstep(0.62, 1, progress);

      section.style.setProperty("--journey-progress", progress.toFixed(4));
      section.style.setProperty("--journey-scene-two", sceneTwo.toFixed(4));
      section.style.setProperty("--hero-copy-y", `${(-16 * progress).toFixed(1)}px`);
      section.style.setProperty("--journey-image-scale", `${(1.02 + progress * 0.045).toFixed(4)}`);
      section.style.setProperty("--maintenance-opacity", (1 - sceneTwo * 0.64).toFixed(4));
      section.style.setProperty("--inspection-opacity", sceneTwo.toFixed(4));
      section.style.setProperty("--pressure-opacity", (1 - sceneTwo * 0.42).toFixed(4));
      section.style.setProperty("--maintenance-x", `${(-88 * route).toFixed(1)}px`);
      section.style.setProperty("--maintenance-y", `${(-30 * route).toFixed(1)}px`);
      section.style.setProperty("--maintenance-scale", `${(1.055 - route * 0.11).toFixed(4)}`);
      section.style.setProperty("--inspection-x", `${(118 - sceneTwo * 118).toFixed(1)}px`);
      section.style.setProperty("--inspection-y", `${(42 - sceneTwo * 58).toFixed(1)}px`);
      section.style.setProperty("--inspection-scale", `${(0.86 + sceneTwo * 0.15).toFixed(4)}`);
      section.style.setProperty("--journey-tilt", `${(55 - progress * 24).toFixed(2)}deg`);
      section.style.setProperty("--journey-turn", `${(-10 + progress * 16).toFixed(2)}deg`);
      section.style.setProperty("--journey-lift", `${(-34 * progress).toFixed(1)}px`);
      section.style.setProperty("--journey-route-fill", `${(route * 100).toFixed(1)}%`);
      section.style.setProperty("--journey-node-rise", `${(-62 * route).toFixed(1)}px`);
      section.style.setProperty("--journey-core-y", `calc(-50% + ${(-36 * route).toFixed(1)}px)`);
      section.style.setProperty("--journey-maintenance-node-rise", `${(-45 * route).toFixed(1)}px`);
      section.style.setProperty("--pressure-rise", `${(-22 * route).toFixed(1)}px`);
      section.style.setProperty("--journey-tablet-rise", `${(-78 * sceneTwo).toFixed(1)}px`);
      section.style.setProperty("--journey-service-opacity", smoothstep(0.38, 0.82, progress).toFixed(4));
      section.style.setProperty("--inspection-card-opacity", (0.82 + sceneTwo * 0.18).toFixed(4));
      section.style.setProperty("--journey-core-scale", `${(0.88 + settle * 0.12).toFixed(4)}`);
      section.style.setProperty("--mobile-perspective-scale", `${(0.78 + sceneTwo * 0.08).toFixed(4)}`);
    };

    if (reducedMotion) {
      setHeroProgress(0.58);
      section.classList.add("inspection-reduced-motion");
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const sectionStyle = window.getComputedStyle(section);
      const stickyMode = sectionStyle.getPropertyValue("--journey-sticky-mode").trim() === "1";
      const travel = Math.max(1, stickyMode ? rect.height - window.innerHeight : rect.height * 0.78);
      const progress = clamp((rect.top * -1) / travel, 0, 1);
      setHeroProgress(progress);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="hero world-hero inspection-hero" id="top" ref={sectionRef}>
      <div className="world-hero-stage inspection-hero-stage">
        <div className="shell world-hero-layout inspection-hero-layout">
          <div className="hero-copy world-hero-copy inspection-hero-copy">
            <p className="eyebrow"><span /> Service & Montagebedrijf Rob Braam</p>
            <h1>Warmtepomp, cv-ketel en onderhoud.<br /><em>Zeker geregeld.</em></h1>
            <p className="hero-lead">Al meer dan 25 jaar helpen wij particuliere klanten met installatie, onderhoud en service aan cv-ketels, warmtepompen, airco&apos;s en elektra-aanpassingen. Met alle benodigde certificeringen en 1.900 vaste onderhoudscontracten.</p>
            <div className="hero-actions inspection-hero-actions">
              <Link className="button button-primary" href="/offerte-aanvragen?dienst=warmtepomp">Vraag warmtepompadvies aan <span aria-hidden="true">↗</span></Link>
              <Link className="button button-ghost" href="/cv-ketels">Cv-ketel vervangen of onderhouden <span aria-hidden="true">→</span></Link>
              <Link className="button button-glass-blue" href="/onderhoud#abonnementen">Bekijk onderhoudsabonnementen <span aria-hidden="true">↓</span></Link>
            </div>
            <a className="phone-link inspection-phone-link" href="tel:+31736222199">
              <span className="phone-icon" aria-hidden="true">↗</span>
              <span><small>Even overleggen?</small><strong>073 622 2199</strong></span>
            </a>
            <div className="hero-service-panel" aria-label="Snel naar de juiste aanvraag">
              <div className="hero-service-panel-heading"><span>Direct naar de juiste hulp</span><small>Warmtepomp · cv-ketel · onderhoud · airco · elektra</small></div>
              <div className="hero-service-grid">
                {heroServices.map((service) => (
                  <Link href={service.href} key={service.label}>
                    <strong>{service.label}</strong>
                    <span>{service.text}</span>
                    <b>{service.cta} <i aria-hidden="true">→</i></b>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="inspection-journey" aria-label="Scrollanimatie: van cv-ketelonderhoud naar visuele inspectie en vervolgaanvraag">
            <div className="journey-perspective" aria-hidden="true">
              <div className="journey-floor">
                <span className="floor-grid" />
                <span className="journey-route route-main" />
                <span className="journey-route route-branch-a" />
                <span className="journey-route route-branch-b" />
              </div>

              <figure className="journey-photo maintenance-shot">
                <img src="/hero/cv-ketel-onderhoud-start.webp" alt="" fetchPriority="high" />
                <figcaption>Start: onderhoud aan de cv-ketel</figcaption>
              </figure>

              <figure className="journey-photo inspection-shot">
                <img src="/hero/monteur-tablet-inspectie.webp" alt="" />
                <figcaption>Daarna: visuele inspectie met tablet</figcaption>
              </figure>

              <div className="pressure-card">
                <span className="pressure-ring" />
                <strong>1,5</strong>
                <small>bar</small>
              </div>

              <div className="inspection-card">
                <small>Onderhoudscontrole</small>
                <strong>Cv-ketel veilig afgesteld</strong>
                <ul>
                  {inspectionChecks.map((check) => <li key={check}>{check}</li>)}
                </ul>
              </div>

              <div className="tablet-panel">
                <div className="tablet-top"><span /> Visuele inspectie</div>
                <div className="tablet-row"><b>Warmtepomp</b><i>advies klaar</i></div>
                <div className="tablet-row"><b>Cv-ketel</b><i>onderhoud gepland</i></div>
                <div className="tablet-row"><b>Airco</b><i>service mogelijk</i></div>
              </div>

              {serviceNodes.map((node) => (
                <div className={`journey-node ${node.className}`} key={node.label}>
                  <small>{node.meta}</small>
                  <strong>{node.label}</strong>
                </div>
              ))}

              <div className="journey-core">
                <span className="core-ring" />
                <span className="core-pulse" />
                <strong>Braam</strong>
                <small>advies · installatie · service</small>
              </div>
            </div>
            <div className="inspection-scroll-cue" aria-hidden="true">
              <span>Scroll: onderhoud → inspectie</span>
              <i />
            </div>
          </div>
        </div>

        <div className="shell highlight-bar">
          {highlights.map((item) => <div className="highlight" key={item.label}><span className="check" aria-hidden="true">✓</span><span><strong>{item.value}</strong><small>{item.label}</small></span></div>)}
        </div>
      </div>
    </section>
  );
}
