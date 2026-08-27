import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

type ThanksPageProps = {
  searchParams: Promise<{ type?: string; dienst?: string; onderwerp?: string }>;
};

const thanksContent: Record<string, { eyebrow: string; title: string; text: string; primaryLabel: string; primaryHref: string }> = {
  offerte: {
    eyebrow: "Aanvraag ontvangen",
    title: "Bedankt. We bekijken uw aanvraag persoonlijk.",
    text: "Uw aanvraag is binnengekomen bij het juiste team. We beoordelen uw gegevens en nemen contact op over de beste vervolgstap.",
    primaryLabel: "Terug naar de homepage",
    primaryHref: "/",
  },
  abonnement: {
    eyebrow: "Onderhoudsaanvraag ontvangen",
    title: "Bedankt. We controleren eerst of het abonnement past.",
    text: "Uw aanvraag is naar onze planning verzonden. We controleren merk, type, woonplaats en gekozen pakket voordat het abonnement definitief wordt.",
    primaryLabel: "Terug naar onderhoud",
    primaryHref: "/onderhoud",
  },
  onderhoud: {
    eyebrow: "Onderhoudsaanvraag ontvangen",
    title: "Bedankt. Uw losse onderhoudsbeurt is aangevraagd.",
    text: "Uw aanvraag is naar onze planning verzonden. We beoordelen de installatie en nemen contact op om de mogelijkheden, kosten en afspraak af te stemmen.",
    primaryLabel: "Terug naar onderhoud",
    primaryHref: "/onderhoud",
  },
  terugbellen: {
    eyebrow: "Terugbelverzoek ontvangen",
    title: "Bedankt. We bellen u persoonlijk terug.",
    text: "Uw terugbelverzoek is verzonden naar service of planning. We nemen contact op om uw vraag kort door te spreken.",
    primaryLabel: "Terug naar de homepage",
    primaryHref: "/",
  },
};

export const metadata: Metadata = {
  title: "Bedankt voor uw aanvraag | Rob Braam",
  description: "Bedanktpagina na een aanvraag of terugbelverzoek bij Rob Braam.",
  robots: { index: false, follow: false },
};

export default async function ThanksPage({ searchParams }: ThanksPageProps) {
  const params = await searchParams;
  const content = thanksContent[params.type ?? ""] ?? thanksContent.offerte;

  return (
    <>
      <SiteHeader />
      <main className="thanks-page">
        <section className="application-success thanks-success">
          <div className="success-orbit" aria-hidden="true"><span>✓</span></div>
          <p className="eyebrow"><span /> {content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.text}</p>
          <div className="success-actions">
            <Link className="button button-primary" href={content.primaryHref}>{content.primaryLabel} <span aria-hidden="true">→</span></Link>
            <a href="tel:+31736222199">Dringend? Bel 073 622 2199</a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
