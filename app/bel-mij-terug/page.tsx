import type { Metadata } from "next";
import { Suspense } from "react";
import { AanvraagPagina } from "../components/aanvraag/AanvraagPagina";
import { CallbackRequestForm } from "../components/CallbackRequestForm";

export const metadata: Metadata = {
  title: "Bel mij terug",
  description: "Laat Rob Braam u terugbellen over een offerte, onderhoud, servicevraag of afspraak.",
  robots: { index: false, follow: true },
};

export default function CallbackRequestPage() {
  return (
    <AanvraagPagina
      kruimels={[{ label: "Bel mij terug" }]}
      titel="Laat ons u persoonlijk terugbellen."
      accent="Eerst even overleggen."
      intro="Wilt u eerst kort overleggen voordat u een aanvraag doet? Laat uw nummer en onderwerp achter. Dan komt het verzoek direct bij service of planning terecht."
      puntenLabel="Geen verplichting"
      punten={["Nieuwe werkzaamheden gaan naar service", "Onderhoud en afspraken gaan naar planning", "Handig als u nog niet precies weet wat nodig is", "U zit nergens aan vast"]}
      email="service@robbraam.com"
      daarna={["Uw verzoek komt bij service of planning binnen", "We bellen u persoonlijk terug"]}
    >
      <Suspense fallback={<div className="application-loading">Formulier wordt geladen…</div>}><CallbackRequestForm /></Suspense>
    </AanvraagPagina>
  );
}
