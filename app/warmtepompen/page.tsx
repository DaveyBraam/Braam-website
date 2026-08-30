import type { Metadata } from "next";
import Link from "next/link";
import { ContactCTA } from "../components/ContactCTA";
import { MobileActionBar } from "../components/MobileActionBar";
import { PageHero } from "../components/PageHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = { title: "Warmtepomp voor uw woning | Rob Braam", description: "Advies, installatie en onderhoud van warmtepompen van 7, 9 en 11 kW voor woningen, met vaste merken en onderhoud door hetzelfde team." };

/* Wat er in het abonnement zit. Zelfde lijst als op de homepage en de
   onderhoudspagina: één bron, zodat een wijziging niet op drie plaatsen
   nagelopen hoeft te worden. */
const abonnementInhoud = [
  "Ieder jaar een geplande controle van uw installatie",
  "24/7 storingsservice",
  "Voorrijkosten en arbeidsloon inbegrepen binnen de abonnementsafspraken",
  "Comfort: materiaal apart. Comfort Plus: materiaal binnen de onderhoudsmantel inbegrepen",
  "Jaarlijks of per maand betalen",
];

const werkwijze = [
  "Uw aanvraag, de installatiegegevens en de foto's beoordelen",
  "Zo nodig een technische opname op locatie inplannen",
  "Woning, afgifte, opstelplaats en groepenkast in kaart brengen",
  "Advies en offerte uitwerken",
];

export default function WarmtepompenPage() {
  return <><SiteHeader /><main className="dienst">
    <PageHero eyebrow="Warmtepompen voor woningen" title="Een warmtepomp die bij uw woning past." accent="Begint met een goede beoordeling." intro="Wij werken met warmtepompen van 7, 9 en 11 kW. Welk vermogen geschikt is, bepalen we vooral aan de hand van het warmteverlies, de isolatie en de warmteafgifte via radiatoren of vloerverwarming. Na uw aanvraag laten we weten welke vervolgstap nodig is." image="/projects/warmtepomp-berlicum.jpg" imageAlt="Vaillant warmtepomp geplaatst door Rob Braam in Berlicum" primaryLabel="Vraag naar de mogelijkheden" primaryHref="/offerte-aanvragen?dienst=warmtepomp" badge="Door ons geplaatst" />

    {/* De tweesprong. Dit is de plek waar later de film komt: dezelfde
        techniekwand in twee toestanden. Tot die tijd doen twee eigen foto's
        het werk, en de vergelijking staat er volwaardig. */}
    <section className="section keuze reveal" id="keuze">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Twee manieren.<br />Uw woning bepaalt welke.</h2></div>
          <p>Het verschil zit in één vraag: houdt u de cv-ketel, of gaat hij eruit? Dat bepaalt wat er in de techniekruimte staat, wat het kost en wat het onderhoud is. Welke van de twee bij uw woning past, blijkt uit het warmteverlies, de isolatie en de manier waarop de warmte wordt afgegeven.</p>
        </div>

        <div className="keuze-grid">
          <article>
            <figure>
              <img src="/projects/installaties/installatie-04.webp" alt="Hybride warmtepompopstelling met voorraadvat en leidingwerk, geplaatst door Rob Braam" width="1600" height="1200" loading="lazy" decoding="async" />
              <figcaption>Hybride — door ons geplaatst</figcaption>
            </figure>
            <h3>De cv-ketel blijft hangen</h3>
            <p>De warmtepomp verwarmt zoveel mogelijk elektrisch. Op koude momenten en voor warm tapwater helpt de cv-ketel mee.</p>
            <dl className="keuze-feiten">
              <div><dt>In de techniekruimte</dt><dd>Cv-ketel én warmtepomp</dd></div>
              <div><dt>Warm tapwater</dt><dd>Via de cv-ketel</dd></div>
              <div><dt>Vaak mogelijk</dt><dd>In een bestaande woning</dd></div>
              <div><dt>Onderhoud samen</dt><dd><strong>€&nbsp;24,08</strong> per maand · jaarprijs €&nbsp;289</dd></div>
            </dl>
            <div className="keuze-acties">
              <Link className="text-link" href="/offerte-aanvragen?dienst=warmtepomp">Offerte voor een hybride warmtepomp <span aria-hidden="true">→</span></Link>
              <Link className="text-link" href="/abonnement-aanvragen?abonnement=hybride-comfort">Onderhoud regelen <span aria-hidden="true">→</span></Link>
            </div>
          </article>

          <article>
            <figure>
              <img src="/projects/installaties/installatie-05.webp" alt="All-electric warmtepomp-binnenopstelling met buffervat en expansievat, geplaatst door Rob Braam" width="1600" height="1200" loading="lazy" decoding="async" />
              <figcaption>Volledig elektrisch — door ons geplaatst</figcaption>
            </figure>
            <h3>De cv-ketel gaat eruit</h3>
            <p>Ook wel full-electric genoemd. De warmtepomp verzorgt de verwarming en het warme water, zonder hulp van een cv-ketel.</p>
            <dl className="keuze-feiten">
              <div><dt>In de techniekruimte</dt><dd>Binnenunit met buffervat</dd></div>
              <div><dt>Warm tapwater</dt><dd>Via een boilervat</dd></div>
              <div><dt>Geen gas meer</dt><dd>Voor de verwarming</dd></div>
              <div><dt>Onderhoud</dt><dd><strong>€&nbsp;19,92</strong> per maand · jaarprijs €&nbsp;239</dd></div>
            </dl>
            <div className="keuze-acties">
              <Link className="text-link" href="/offerte-aanvragen?dienst=warmtepomp">Offerte voor een volledig elektrische warmtepomp <span aria-hidden="true">→</span></Link>
              <Link className="text-link" href="/abonnement-aanvragen?abonnement=all-electric-comfort">Onderhoud regelen <span aria-hidden="true">→</span></Link>
            </div>
          </article>
        </div>

        <p className="keuze-afbakening"><strong>7, 9 en 11 kW.</strong> Wij werken met warmtepompen in deze vermogens voor woningen. Grote bedrijfsunits, cascadeopstellingen en collectieve systemen vallen buiten onze werkzaamheden.</p>
      </div>
    </section>

    <section className="section werkwijze-section reveal">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Eerst beoordelen.<br />Dan gericht opnemen.</h2></div>
          <p>Na uw aanvraag bekijken we eerst de omschrijving, foto&apos;s en gegevens van de bestaande installatie. Als een technische opname nodig is, plannen we daarvoor een afspraak op locatie. Tijdens die opname verzamelen we de gegevens voor de warmteverliesberekening en brengen we het afgiftesysteem, de mogelijke plaats van de buitenunit en de elektrische aansluiting in kaart.</p>
        </div>
        <ol className="werkwijze-lijst">
          {werkwijze.map((stap, i) => (
            <li key={stap}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><p>{stap}</p></li>
          ))}
        </ol>
        <p className="werkwijze-noot">Onze eigen elektricien legt de voeding aan en breidt zo nodig de groepenkast uit. U hoeft daar niemand voor te zoeken.</p>
      </div>
    </section>

    {/* Het onderhoud hoort op deze pagina: wie hem plaatst, onderhoudt hem
        daarna. Dat is de belofte die een installateur die uitbesteedt niet
        kan doen, en hij is hier concreet te maken met een prijs. */}
    <section className="section onderhoud-blok reveal" id="onderhoud">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Wie hem plaatst,<br />onderhoudt hem daarna.</h2></div>
          <p>Een warmtepomp heeft jaarlijks onderhoud nodig. Bij ons blijft dat bij hetzelfde team: dezelfde mensen die de installatie hebben geplaatst, kennen uw woning al voordat er iets misgaat. Geen onderaannemer, geen wisselende gezichten.</p>
        </div>

        <div className="onderhoud-grid">
          <ul className="onderhoud-inhoud">
            {abonnementInhoud.map((punt) => <li key={punt}>{punt}</li>)}
          </ul>
          <div className="onderhoud-prijzen">
            <Link href="/abonnement-aanvragen?abonnement=hybride-comfort">
              <span>Cv-ketel met hybride warmtepomp</span>
              <strong><small>€</small>24,08</strong>
              <em>Comfort vanaf, per maand · jaarprijs €&nbsp;289</em>
            </Link>
            <Link href="/abonnement-aanvragen?abonnement=all-electric-comfort">
              <span>Volledig elektrische warmtepomp</span>
              <strong><small>€</small>19,92</strong>
              <em>Comfort vanaf, per maand · jaarprijs €&nbsp;239</em>
            </Link>
            <Link className="text-link" href="/onderhoud">Vergelijk Comfort en Comfort&nbsp;Plus <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </div>
    </section>

    <section className="section merken-section reveal">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Vaste merken.<br />Verschillende opstellingen.</h2></div>
          <p>Voor installatie en onderhoud werken we met een vaste set merken. Heeft u al een warmtepomp van een ander merk? Stuur merk en model mee; onderhoud aan andere merken beoordelen we op aanvraag.</p>
        </div>
        <div className="merken-lijst">
          <article>
            <span>LG THERMA V</span>
            <h3>Hoge aanvoertemperatuur en verschillende binnenopstellingen.</h3>
            <div>
              <p>De LG THERMA V R290 Monobloc is een lucht-waterwarmtepomp voor de verwarming van de woning. LG vermeldt een watertemperatuur tot 75 °C en biedt verschillende combinaties met binnendelen. Met een passende combi-unit kunnen onder meer een warmwatervat, elektrische bijverwarming en een expansievat in de binnenopstelling worden opgenomen.</p>
              <p>De hogere mogelijke watertemperatuur kan mogelijkheden bieden bij bestaande radiatoren. Dat betekent niet dat iedere woning zonder aanpassingen geschikt is: het benodigde vermogen en de gewenste aanvoertemperatuur moeten eerst worden berekend.</p>
              <a href="https://www.lg.com/nl/warmtepomp/therma-v-r290-monobloc/" target="_blank" rel="noreferrer">Bekijk de units van LG <span aria-hidden="true">↗</span></a>
            </div>
          </article>
          <article>
            <span>Vaillant aroTHERM plus</span>
            <h3>Verwarming, warm water en koeling in één systeem.</h3>
            <div>
              <p>Vaillant beschrijft de aroTHERM plus als een lucht-waterwarmtepomp voor verwarming, warm water en koeling. Het systeem werkt met het natuurlijke koudemiddel R290, kan water tot 75 °C leveren en kan worden toegepast met vloerverwarming of radiatoren.</p>
              <p>Voor warm tapwater kan de buitenunit worden gecombineerd met een passend binnendeel, zoals de uniTOWER met geïntegreerd voorraadvat. Welke functies, capaciteit en binnenopstelling nodig zijn, hangt af van uw woning en gebruik.</p>
              <a href="https://www.vaillant.nl/producten/arothermplus/" target="_blank" rel="noreferrer">Bekijk de units van Vaillant <span aria-hidden="true">↗</span></a>
            </div>
          </article>
        </div>
        <p className="merken-noot">De genoemde mogelijkheden komen uit de productinformatie van de fabrikanten. Welke uitvoering, functies en aanpassingen voor uw woning worden aangeboden, staat pas vast in onze offerte.</p>
      </div>
    </section>

    <section className="section faq-section reveal">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Dit willen klanten vaak<br />eerst van ons weten.</h2></div>
          <p>U hoeft de techniek vooraf niet zelf uit te zoeken. Stuur bij uw aanvraag vooral door wat u al weet; wij bepalen daarna welke informatie of opname nog nodig is.</p>
        </div>
        <div className="faq-lijst">
          <article><h3>Kan mijn woning van het gas af?</h3><p>Dat hangt onder meer af van het warmteverlies, de isolatie, de warmteafgifte en de elektrische aansluiting. Daarom beoordelen we dit altijd per woning.</p></article>
          <article><h3>Heb ik vloerverwarming nodig?</h3><p>Niet altijd. Ook geschikte radiatoren kunnen werken, maar de benodigde watertemperatuur en capaciteit moeten bij de woning passen. Dat beoordelen we vooraf en, wanneer nodig, tijdens een technische opname.</p></article>
          <article><h3>Kan een warmtepomp ook koelen?</h3><p>Dat kan bij geschikte systemen en een passende afgifte-installatie. Niet iedere radiator of vloerverwarming is automatisch geschikt; in de offerte staat welke functies voor uw woning worden aangeboden.</p></article>
          <article><h3>Hoe zit het met geluid en de buitenunit?</h3><p>Het model, het benodigde vermogen en de plaats van de buitenunit bepalen samen wat u en de buren horen. Als een opname nodig is, nemen we de mogelijke opstelplaats daarin mee.</p></article>
          <article><h3>Moet ik zelf een elektricien regelen?</h3><p>Nee. Onze eigen elektricien kan de groepenkast uitbreiden en de juiste voeding voor de warmtepomp aanleggen.</p></article>
          <article><h3>Kan Braam het onderhoud blijven doen?</h3><p>Ja. Voor de merken die wij plaatsen bieden we standaard onderhoud. Heeft u een ander merk, dan beoordelen we op basis van merk, model en installatie of onderhoud mogelijk is.</p></article>
        </div>
      </div>
    </section>

    <ContactCTA title="Interesse in een warmtepomp?" text="Vertel ons iets over uw woning en huidige installatie. We beoordelen de aanvraag en laten weten of een technische opname nodig is. Daarna werken we het advies en de offerte uit." primaryLabel="Vraag warmtepompadvies aan" primaryHref="/offerte-aanvragen?dienst=warmtepomp" />
  </main><MobileActionBar href="/offerte-aanvragen?dienst=warmtepomp" label="Vraag advies aan" /><SiteFooter /></>;
}
