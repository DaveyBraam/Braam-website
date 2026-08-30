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

/* Comfort en Comfort Plus deelden acht opsommingsregels waarvan er zes
   woordelijk gelijk waren: twaalf regels herhaling om één verschil te tonen,
   en kaarten van 1296px hoog. Wat in beide pakketten zit staat nu één keer;
   daaronder staat alleen nog waar ze uit elkaar lopen. Het verschil wordt
   hier afgeleid uit de data, niet overgetypt, zodat het klopt blijft als de
   pakketten veranderen. */
const alleenIn = (a: string[], b: string[]) => a.filter((item) => !b.includes(item));
const gedeeldMet = (a: string[], b: string[]) => a.filter((item) => b.includes(item));

export function SubscriptionCards() {
  const [installation, setInstallation] = useState<InstallationId>("cv");
  const activeInstallation = installations.find((item) => item.id === installation) ?? installations[0];
  const zichtbaar = subscriptions.filter((item) => item.id.startsWith(activeInstallation.prefix));

  const basis = zichtbaar.find((item) => !item.featured) ?? zichtbaar[0];
  const plus = zichtbaar.find((item) => item.featured) ?? zichtbaar[1];
  if (!basis || !plus) return null;

  const gedeeldOnderhoud = gedeeldMet(basis.maintenanceFeatures, plus.maintenanceFeatures);
  const gedeeldStoring = gedeeldMet(basis.breakdownFeatures, plus.breakdownFeatures);

  const verschil = (pakket: typeof basis, ander: typeof plus) => [
    ...new Set([
      ...alleenIn(pakket.maintenanceFeatures, ander.maintenanceFeatures),
      ...alleenIn(pakket.breakdownFeatures, ander.breakdownFeatures),
    ]),
  ];

  const pakketten = [
    { data: basis, verschil: verschil(basis, plus) },
    { data: plus, verschil: verschil(plus, basis) },
  ];

  return (
    <>
      <div className="abo-keuzeblok" aria-labelledby="installation-choice-title">
        <h3 id="installation-choice-title">Welke installatie heeft u?</h3>
        <p>Kies eerst het toestel dat bij u thuis staat. Daarna vergelijkt u nog maar twee pakketten.</p>
        <div className="abo-tabs" role="radiogroup" aria-label="Kies uw installatie">
          {installations.map((item) => (
            <button
              className={installation === item.id ? "abo-tab is-active" : "abo-tab"}
              type="button"
              role="radio"
              aria-checked={installation === item.id}
              onClick={() => setInstallation(item.id)}
              key={item.id}
            >
              <strong>{item.label}</strong>
              <small>{item.help}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="abo-gedeeld">
        <h3>In beide pakketten hetzelfde</h3>
        <div className="abo-gedeeld-grid">
          <div>
            <h4>Bij het onderhoud</h4>
            <ul className="check-list">{gedeeldOnderhoud.map((punt) => <li key={punt}>{punt}</li>)}</ul>
          </div>
          <div>
            <h4>Bij een storing</h4>
            <ul className="check-list">{gedeeldStoring.map((punt) => <li key={punt}>{punt}</li>)}</ul>
          </div>
        </div>
      </div>

      <div className="abo-verschil">
        <h3>Waar ze uit elkaar lopen</h3>
        <div className="abo-verschil-grid">
          {pakketten.map(({ data, verschil: eigen }) => (
            <article key={data.id}>
              <span>{data.title}</span>
              <strong><small>€</small>{data.monthlyPrice}</strong>
              <em>per maand · jaarprijs €&nbsp;{data.price},– incl. btw</em>
              <ul className="check-list">{eigen.map((punt) => <li key={punt}>{punt}</li>)}</ul>
              <Link className="text-link" href={`/abonnement-aanvragen?abonnement=${data.id}`}>
                Vraag {data.title} aan <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>

      <div className="abo-extra">
        <p><strong>Mechanische ventilatiebox laten meeschoonmaken?</strong> Voor €&nbsp;37,50 extra per jaar nemen we de ventilatiebox mee tijdens het geplande onderhoud. Alleen bij het ketel- of combinatieabonnement.</p>
        <Link className="text-link" href="/abonnement-aanvragen?ventilatie=ja">Toevoegen aan mijn abonnement <span aria-hidden="true">→</span></Link>
      </div>

      <p className="keuze-afbakening">De maandbedragen zijn de jaarprijs gedeeld door twaalf en afgerond op centen. In de bevestiging staat het exacte incassoschema; één termijn kan door afronding enkele centen afwijken. Het abonnement is een doorlopend servicepakket en geen betaling per bezoek.</p>
    </>
  );
}
