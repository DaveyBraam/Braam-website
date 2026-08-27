"use client";

import Link from "next/link";
import { useState } from "react";
import { subscriptions } from "../data";

type InstallationId = "cv" | "hybride" | "all-electric";

const installations: Array<{ id: InstallationId; label: string; help: string; prefix: string }> = [
  { id: "cv", label: "Alleen een cv-ketel", help: "Intergas, Remeha, Nefit of Vaillant", prefix: "cv-" },
  { id: "hybride", label: "Cv-ketel + hybride warmtepomp", help: "Onderhoud voor beide toestellen", prefix: "hybride-" },
  { id: "all-electric", label: "All-electric warmtepomp", help: "Warmtepomp zonder cv-ketel", prefix: "all-electric-" },
];

export function SubscriptionCards() {
  const [installation, setInstallation] = useState<InstallationId>("cv");
  const activeInstallation = installations.find((item) => item.id === installation) ?? installations[0];
  const visibleSubscriptions = subscriptions.filter((item) => item.id.startsWith(activeInstallation.prefix));

  return (
    <>
      <div className="subscription-selector" aria-labelledby="installation-choice-title">
        <div className="subscription-selector-heading"><span>Stap 1</span><div><h3 id="installation-choice-title">Welke installatie heeft u?</h3><p>Kies eerst het toestel dat bij u thuis staat. Daarna vergelijkt u nog maar twee pakketten.</p></div></div>
        <div className="installation-tabs" role="radiogroup" aria-label="Kies uw installatie">
          {installations.map((item) => <button className={installation === item.id ? "installation-tab is-active" : "installation-tab"} type="button" role="radio" aria-checked={installation === item.id} onClick={() => setInstallation(item.id)} key={item.id}><span className="installation-tab-check" aria-hidden="true">{installation === item.id ? "✓" : ""}</span><span><strong>{item.label}</strong><small>{item.help}</small></span></button>)}
        </div>
      </div>
      <div className="subscription-compare-heading"><span>Stap 2</span><div><h3>Comfort of Comfort Plus?</h3><p>De service is bij beide pakketten geregeld. Het belangrijkste verschil is hoe materiaal wordt berekend.</p></div></div>
      <div className="pricing-grid">
        {visibleSubscriptions.map((subscription) => (
          <article className={`price-card${subscription.featured ? " price-card-featured" : ""}`} key={subscription.id}>
            {subscription.featured && <span className="popular-badge">{subscription.featuredLabel ?? "Meest compleet"}</span>}
            <span className="plan-label">{subscription.label}</span>
            <h3>{subscription.title}</h3>
            <p className="plan-description">{subscription.description}</p>
            <div className="plan-monthly-primary"><span>€</span><strong>{subscription.monthlyPrice}</strong><small>per maand</small></div>
            <p className="plan-payment-detail">Bij 12 termijnen via automatische incasso.<br /><strong>Jaarprijs € {subscription.price},– inclusief btw.</strong> Jaarbetaling blijft ook mogelijk.</p>
            <div className="plan-benefit-groups">
              <section className="plan-benefit-group" aria-label="Afspraken bij het onderhoud">
                <h4>Bij het onderhoud</h4>
                <ul>{subscription.maintenanceFeatures.map((feature) => {
                  const isExcluded = feature.includes("niet inbegrepen");
                  return <li className={isExcluded ? "plan-benefit-exclusion" : undefined} key={feature}><span aria-hidden="true">{isExcluded ? "i" : "✓"}</span>{feature}</li>;
                })}</ul>
              </section>
              <section className="plan-benefit-group" aria-label="Afspraken bij een storing">
                <h4>Bij een storing</h4>
                <ul>{subscription.breakdownFeatures.map((feature) => {
                  const isExcluded = feature.includes("niet inbegrepen");
                  return <li className={isExcluded ? "plan-benefit-exclusion" : undefined} key={feature}><span aria-hidden="true">{isExcluded ? "i" : "✓"}</span>{feature}</li>;
                })}</ul>
              </section>
            </div>
            <Link className="plan-button" href={`/abonnement-aanvragen?abonnement=${subscription.id}`}>Vraag dit abonnement aan <span aria-hidden="true">→</span></Link>
          </article>
        ))}
      </div>
      <aside className="subscription-addon-bar" aria-label="Extra optie voor mechanische ventilatie">
        <span className="subscription-addon-icon" aria-hidden="true">+</span>
        <div className="subscription-addon-copy">
          <span>Extra bij het ketel- of combinatieabonnement</span>
          <strong>Mechanische ventilatiebox laten meeschoonmaken</strong>
          <p>Voor € 37,50 extra per jaar nemen we de ventilatiebox mee tijdens het geplande onderhoud.</p>
        </div>
        <Link href="/abonnement-aanvragen?ventilatie=ja">Toevoegen aan mijn abonnement <span aria-hidden="true">→</span></Link>
      </aside>
      <p className="pricing-note">De maandbedragen zijn de jaarprijs gedeeld door twaalf en afgerond op centen. In de bevestiging staat het exacte incassoschema; één termijn kan door afronding enkele centen afwijken. Het abonnement is een doorlopend servicepakket en geen betaling per bezoek.</p>
    </>
  );
}
