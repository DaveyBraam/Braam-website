import type { Metadata } from "next";
import Link from "next/link";
import { ContactCTA } from "../components/ContactCTA";
import { MobileActionBar } from "../components/MobileActionBar";
import { PageHero } from "../components/PageHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = { title: "Airco installeren in de regio | Rob Braam", description: "Advies, installatie en service voor energiezuinige airconditioning vanuit 's-Hertogenbosch, in Noord-Brabant en aangrenzende delen van Gelderland." };

const onderdelen = [
  { titel: "Passend vermogen", tekst: "We stemmen het vermogen af op de ruimte, zonbelasting en de manier waarop u de airco wilt gebruiken." },
  { titel: "Een rustige plek", tekst: "We zoeken een positie met goede luchtverdeling, zo min mogelijk geluid en een nette leidingroute." },
  { titel: "De juiste voeding", tekst: "Is een aparte groep nodig? Dan kan onze eigen elektricien dat direct in het werk meenemen." },
  { titel: "Uitleg en service", tekst: "Na de montage leggen we de bediening uit. Heeft u later een vraag, dan kunt u gewoon weer bij ons terecht." },
];

export default function AircoPage() {
  return <><SiteHeader /><main className="dienst">
    <PageHero eyebrow="Airconditioning" title="Airco voor de ruimte die u gebruikt." accent="Goed berekend en netjes geplaatst." intro="Wilt u een slaapkamer koel houden, een kantoor comfortabel maken of één leefruimte gericht verwarmen? We bekijken de ruimte en adviseren een systeem dat daarbij past." image="/projects/warmtepomp-vlijmen.jpg" imageAlt="Buitenunit van een installatie van Rob Braam" primaryLabel="Bespreek uw airco" primaryHref="/offerte-aanvragen?dienst=airco" badge="Koelen én verwarmen" />

    <section className="section reveal">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>We bepalen wat nodig is. Niet wat het grootste is.</h2></div>
          <p>De juiste capaciteit maakt een airco stiller, zuiniger en prettiger in gebruik. Daarom letten we op de grootte en ligging van de ruimte, de zon, de gewenste temperatuur en een nette route voor de leidingen.</p>
        </div>
        <ul className="check-list">
          <li>Voor woning, slaapkamer, kantoor of bedrijfspand</li>
          <li>Single-split en multi-split mogelijk</li>
          <li>Koelen en gericht verwarmen met één systeem</li>
          <li>Installatie door STEK-gecertificeerde vakmensen</li>
        </ul>
      </div>
    </section>

    <section className="section reveal">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Vier onderdelen<br />van een goede installatie.</h2></div>
          <p>Een airco die te zwaar is bemeten, slaat kort aan en weer af. Dat kost meer stroom, maakt meer geluid en koelt onregelmatiger. Daarom zit het werk vooral in wat er vóór de montage wordt bepaald.</p>
        </div>
        <ol className="werkwijze-lijst">
          {onderdelen.map((onderdeel, i) => (
            <li key={onderdeel.titel}>
              <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <p><strong>{onderdeel.titel}.</strong> {onderdeel.tekst}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>

    {/* Dit is de claim die de meeste mensen niet kennen, dus hij staat op
        inkt en krijgt de pagina even helemaal voor zichzelf. */}
    <section className="section onderhoud-blok reveal">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Een airco kan ook<br />gericht verwarmen.</h2></div>
          <p>Een moderne airco is technisch een lucht-luchtwarmtepomp. Daarmee kunt u bijvoorbeeld een werkkamer of leefruimte snel verwarmen zonder meteen de hele woning op temperatuur te brengen. We leggen graag uit wanneer dat wel en niet handig is.</p>
        </div>
        <ul className="onderhoud-inhoud">
          <li>Eén systeem dat in de zomer koelt en in het najaar bijverwarmt</li>
          <li>Warmte gericht in de ruimte waar u op dat moment bent</li>
          <li>Onze eigen elektricien legt de voeding aan als er een groep bij moet</li>
          <li>Werk aan koudemiddelen door STEK-gecertificeerde monteurs</li>
        </ul>
        <p className="werkwijze-noot"><Link className="text-link" href="/offerte-aanvragen?dienst=airco">Vertel ons om welke ruimtes het gaat <span aria-hidden="true">→</span></Link></p>
      </div>
    </section>

    <ContactCTA title="Welke ruimte wilt u koelen of verwarmen?" text="Stuur ons het aantal ruimtes en een korte omschrijving. We nemen persoonlijk contact op om capaciteit, plaatsing en mogelijkheden te bespreken." primaryLabel="Vraag aircoadvies aan" primaryHref="/offerte-aanvragen?dienst=airco" />
  </main><MobileActionBar href="/offerte-aanvragen?dienst=airco" label="Bespreek uw airco" /><SiteFooter /></>;
}
