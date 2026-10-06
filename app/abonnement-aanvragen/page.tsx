import type { Metadata } from "next";
import { Suspense } from "react";
import { AanvraagPagina } from "../components/aanvraag/AanvraagPagina";
import { SubscriptionApplicationForm } from "../components/SubscriptionApplicationForm";

export const metadata: Metadata = {
  title: "Onderhoudsabonnement aanvragen | Rob Braam",
  description: "Vraag onderhoud aan voor uw eigen woning of voor meerdere huurwoningen en panden.",
  robots: { index: false, follow: false },
};

export default function SubscriptionApplicationPage() {
  return (
    <AanvraagPagina
      kruimels={[{ label: "Onderhoud", href: "/onderhoud" }, { label: "Abonnement aanvragen" }]}
      titel="Eerst uw installatie."
      accent="Dan het passende onderhoud."
      intro="Dit formulier is een aanvraag, geen directe aankoop. We controleren het soort installatie, merk, model, woonplaats en de gekozen betaalwijze. Daarna neemt onze planning contact op."
      puntenLabel="Goed om te weten"
      punten={["Ieder jaar een controle door Braam gepland", "Doorlopend servicepakket, niet betalen per bezoek", "Maandelijkse incasso of jaarbetaling", "Geen automatische acceptatie"]}
      email="planning@robbraam.com"
      daarna={["Planning controleert merk, model en woonplaats", "U ontvangt de bevestiging van de afspraken", "Planning maakt de eerste afspraak"]}
      formulierId="aanvraagformulier"
    >
      <Suspense fallback={<div className="application-loading">Formulier wordt geladen…</div>}><SubscriptionApplicationForm /></Suspense>
    </AanvraagPagina>
  );
}
