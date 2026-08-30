import type { Metadata } from "next";
import { ContactCTA } from "../components/ContactCTA";
import { MobileActionBar } from "../components/MobileActionBar";
import { PageHero } from "../components/PageHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = { title: "Elektra-installaties in de regio | Rob Braam", description: "Groepenkasten, uitbreidingen en elektrische aansluitingen voor warmtepomp en airco, vanuit 's-Hertogenbosch in Noord-Brabant en aangrenzende delen van Gelderland." };

const werkzaamheden = [
  { titel: "Groepenkast", tekst: "Vervangen of uitbreiden als de bestaande verdeler niet meer past bij het gebruik in uw woning of bedrijf." },
  { titel: "Warmtepomp", tekst: "Een veilige voeding en beveiliging, afgestemd op het type en vermogen dat wordt geplaatst." },
  { titel: "Airconditioning", tekst: "De juiste afzonderlijke groep voor de installatie, direct meegenomen in de planning van het werk." },
  { titel: "Extra groepen", tekst: "Aansluitingen voor nieuwe apparatuur, een werkruimte, verbouwing of andere uitbreiding." },
];

export default function ElektraPage() {
  return <><SiteHeader /><main className="dienst">
    <PageHero eyebrow="Elektra" title="Elektra die past bij wat u nu gebruikt." accent="En bij wat er nog bijkomt." intro="Moet de groepenkast worden vervangen, wilt u extra groepen of komt er een warmtepomp of airco bij? Onze eigen elektricien bekijkt wat nodig is en zorgt voor een veilige aansluiting." image="/about/bedrijfspand-braam.webp" imageAlt="Bedrijfspand en servicewagens van Rob Braam in 's-Hertogenbosch" primaryLabel="Vertel wat u wilt aanpassen" primaryHref="/offerte-aanvragen?dienst=elektra" badge="Elektricien in eigen team" />

    <section className="section reveal">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>We kijken verder dan<br />alleen die ene groep.</h2></div>
          <p>Nieuwe apparatuur kan invloed hebben op de hele verdeler en de beschikbare aansluiting. We bekijken daarom de bestaande groepenkast, het verwachte vermogen en uw plannen voor later. Zo voorkomt u dat een aanpassing snel opnieuw moet.</p>
        </div>
        <ul className="check-list">
          <li>Groepenkast vervangen of uitbreiden</li>
          <li>Aparte groepen voor warmtepomp en airco</li>
          <li>Aanpassingen bij verbouwing of verduurzaming</li>
          <li>Veilige controle en nette oplevering</li>
        </ul>
      </div>
    </section>

    <section className="section reveal">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Veelvoorkomend<br />elektrawerk.</h2></div>
          <p>We voeren zelfstandig elektrawerk uit en combineren het waar nodig met onze installatieprojecten. U houdt één planning en één aanspreekpunt.</p>
        </div>
        <ol className="werkwijze-lijst">
          {werkzaamheden.map((werk, i) => (
            <li key={werk.titel}>
              <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <p><strong>{werk.titel}.</strong> {werk.tekst}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section className="section reveal">
      <div className="shell beeldblok omgekeerd">
        <figure>
          <img src="/projects/vloerverwarming.jpg" alt="Installatiewerk uitgevoerd door Rob Braam" width="1600" height="1200" loading="lazy" decoding="async" />
          <figcaption>Installatie en elektra door één team</figcaption>
        </figure>
        <div>
          <h2>Warmtepomp of airco erbij? Wij regelen de voeding mee.</h2>
          <p>U hoeft voor de elektrische aansluiting geen tweede bedrijf te zoeken. Onze installatiemonteur en elektricien stemmen het werk samen af. Dat maakt de planning duidelijk en de verantwoordelijkheid helder.</p>
          <ul className="check-list">
            <li>Het werk onderling afgestemd</li>
            <li>Eén aanspreekpunt voor uw vragen</li>
            <li>Alles samen gecontroleerd en opgeleverd</li>
          </ul>
        </div>
      </div>
    </section>

    <ContactCTA title="Wat wilt u aan uw elektra aanpassen?" text="Stuur een korte omschrijving van de groepenkast of aansluiting. Onze elektricien kijkt persoonlijk mee met wat er nodig is." primaryLabel="Vraag advies over elektra" primaryHref="/offerte-aanvragen?dienst=elektra" />
  </main><MobileActionBar href="/offerte-aanvragen?dienst=elektra" label="Bespreek uw elektra" /><SiteFooter /></>;
}
