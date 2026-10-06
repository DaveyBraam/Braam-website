import type { Metadata } from "next";
import { Suspense } from "react";
import { AanvraagPagina } from "../components/aanvraag/AanvraagPagina";
import { QuoteRequestForm } from "../components/QuoteRequestForm";

export const metadata: Metadata = {
  title: "Offerte of advies aanvragen | Rob Braam",
  description: "Vraag persoonlijk advies of een offerte aan voor een cv-ketel, warmtepomp, airco, elektra of onderhoud.",
  robots: { index: false, follow: true },
};

export default function QuoteRequestPage() {
  return (
    <AanvraagPagina
      kruimels={[{ label: "Offerte aanvragen" }]}
      titel="Vertel wat u nodig heeft."
      accent="Wij kijken persoonlijk mee."
      intro="U hoeft niet vooraf alle technische antwoorden te kennen. Kies de dienst, beschrijf kort uw situatie en wij bepalen welke informatie of opname nog nodig is."
      puntenLabel="Persoonlijk beoordeeld"
      punten={["Werk en offertes gaan naar service", "Onderhoud gaat naar planning", "We kijken naar uw woning en installatie", "U zit met dit formulier nergens aan vast"]}
      email="service@robbraam.com"
      daarna={["We beoordelen uw aanvraag persoonlijk", "We bepalen welke informatie of opname nodig is", "We nemen contact op over de vervolgstap"]}
    >
      <Suspense fallback={<div className="application-loading">Formulier wordt geladen…</div>}><QuoteRequestForm /></Suspense>
    </AanvraagPagina>
  );
}
