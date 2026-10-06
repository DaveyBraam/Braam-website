import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import "../aanvraag.css";

type ThanksPageProps = {
  searchParams: Promise<{ type?: string; dienst?: string; onderwerp?: string }>;
};

/* Per soort aanvraag dezelfde route als naast het formulier: uw deel is
   gedaan, de eerste stap van Braam is nu aan de beurt. */
type Bedankt = { kruimel: string; titel: string; accent: string; tekst: string; team: string; email: string; daarna: string[]; terugLabel: string; terugHref: string };

const thanksContent: Record<string, Bedankt> = {
  offerte: {
    kruimel: "Aanvraag ontvangen",
    titel: "Bedankt.",
    accent: "We bekijken uw aanvraag persoonlijk.",
    tekst: "Uw aanvraag is binnengekomen bij het juiste team. We beoordelen uw gegevens en nemen contact op over de beste vervolgstap.",
    team: "service of planning",
    email: "service@robbraam.com",
    daarna: ["We beoordelen uw aanvraag persoonlijk", "We bepalen welke informatie of opname nodig is", "We nemen contact op over de vervolgstap"],
    terugLabel: "Terug naar de homepage",
    terugHref: "/",
  },
  abonnement: {
    kruimel: "Onderhoudsaanvraag ontvangen",
    titel: "Bedankt.",
    accent: "We controleren eerst of het abonnement past.",
    tekst: "Uw aanvraag is naar onze planning verzonden. We controleren merk, type, woonplaats en gekozen pakket voordat het abonnement definitief wordt.",
    team: "planning",
    email: "planning@robbraam.com",
    daarna: ["Planning controleert merk, model en woonplaats", "U ontvangt de bevestiging van de afspraken", "Planning maakt de eerste afspraak"],
    terugLabel: "Terug naar onderhoud",
    terugHref: "/onderhoud",
  },
  onderhoud: {
    kruimel: "Onderhoudsaanvraag ontvangen",
    titel: "Bedankt.",
    accent: "Uw losse onderhoudsbeurt is aangevraagd.",
    tekst: "Uw aanvraag is naar onze planning verzonden. We beoordelen de installatie en nemen contact op om de mogelijkheden, kosten en afspraak af te stemmen.",
    team: "planning",
    email: "planning@robbraam.com",
    daarna: ["Planning beoordeelt uw installatie, merk en woonplaats", "We nemen contact op en stemmen afspraak en kosten af"],
    terugLabel: "Terug naar onderhoud",
    terugHref: "/onderhoud",
  },
  terugbellen: {
    kruimel: "Terugbelverzoek ontvangen",
    titel: "Bedankt.",
    accent: "We bellen u persoonlijk terug.",
    tekst: "Uw terugbelverzoek is verzonden naar service of planning. We nemen contact op om uw vraag kort door te spreken.",
    team: "service of planning",
    email: "service@robbraam.com",
    daarna: ["Uw verzoek komt bij service of planning binnen", "We bellen u persoonlijk terug"],
    terugLabel: "Terug naar de homepage",
    terugHref: "/",
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
  const [eerste, ...rest] = content.daarna;

  return (
    <>
      <SiteHeader />
      <main className="av av-bedankt">
        <section className="av-kop" aria-labelledby="av-titel">
          <div className="shell av-kop-raster">
            <div className="av-kop-tekst">
              <p className="av-kruimel"><Link href="/">Home</Link><span><span aria-hidden="true">/</span><span>{content.kruimel}</span></span></p>
              <h1 id="av-titel">{content.titel}<em>{content.accent}</em></h1>
              <p className="av-intro">{content.tekst}</p>
              <div className="av-acties">
                <Link className="button button-primary" href={content.terugHref}>{content.terugLabel} <span aria-hidden="true">→</span></Link>
                <div className="av-kop-contact"><a href="tel:+31736222199"><small>Dringend?</small><strong>073 622 2199</strong></a></div>
              </div>
            </div>
            <div className="av-route-vast" aria-label="De route van uw aanvraag">
              <p className="av-route-kop">Uw aanvraag</p>
              <ol className="av-route-u">
                <li className="is-klaar"><span className="av-stip" aria-hidden="true" />Gegevens ingevuld</li>
                <li className="is-klaar"><span className="av-stip" aria-hidden="true" />Verstuurd naar {content.team}</li>
              </ol>
              <p className="av-route-overgang">Nu is Braam aan zet</p>
              <ol className="av-route-u av-route-nu">
                <li className="is-actief" aria-current="step"><span className="av-stip" aria-hidden="true" /><span>{eerste}<small>De volgende stap</small></span></li>
                {rest.map((stap) => <li key={stap}><span className="av-stip" aria-hidden="true" />{stap}</li>)}
              </ol>
            </div>
          </div>
        </section>

        {/* Papier tussen de kop en de footer: wat u kunt doen als u nog iets
            wilt doorgeven. */}
        <section className="av-nog-iets">
          <div className="shell av-nog-iets-raster">
            <h2>Nog iets vergeten door te geven?</h2>
            <p>Een merk, een foto van het typeplaatje of een andere wens: stuur het gerust na. Vermeld daarbij uw naam en postcode.</p>
            <div className="av-nog-iets-contact">
              <a href={`mailto:${content.email}`}><small>Mail</small><strong>{content.email}</strong></a>
              <a href="tel:+31736222199"><small>Bel</small><strong>073 622 2199</strong></a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
