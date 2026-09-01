import type { Metadata } from "next";
import Link from "next/link";
import { ContactCTA } from "../components/ContactCTA";
import { CvDoorsnede } from "../components/CvDoorsnede";
import { MobileActionBar } from "../components/MobileActionBar";
import { RelatedKnowledge } from "../components/RelatedKnowledge";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = { title: "Cv-ketel installeren en onderhouden | Rob Braam", description: "Veilige plaatsing, vervanging en onderhoud van cv-ketels door een CO-gecertificeerd installatiebedrijf vanuit 's-Hertogenbosch, actief in Noord-Brabant en aangrenzende delen van Gelderland." };

const ketelmerken = [
  { naam: "Intergas", logo: "/brand/intergas-logo-dark.svg" },
  { naam: "Remeha", logo: "/brand/remeha-logo.svg" },
  { naam: "Nefit", logo: "/brand/nefit-bosch-logo.png" },
  { naam: "Vaillant", logo: "/brand/vaillant-logo.png" },
];

const stappen = [
  "We bespreken uw wensen en controleren ketel, rookgasafvoer, gasleiding en aansluitingen",
  "U ontvangt een offerte met het toestel en de werkzaamheden die nodig zijn",
  "Na plaatsing beproeven we de gasleiding, stellen we af en leggen we de metingen vast",
];

const abonnementInhoud = [
  "Ieder jaar een geplande controle van uw cv-ketel",
  "Bij onderhoud: voorrijkosten en arbeidsloon inbegrepen",
  "Bij storing: 24/7 storingsservice, voorrijkosten en arbeidsloon inbegrepen",
  "Comfort: materiaal wordt apart berekend",
  "Comfort Plus: materiaal binnen de onderhoudsmantel inbegrepen",
  "Voor Intergas, Remeha, Nefit en Vaillant",
];

export default function CvKetelsPage() {
  return <><SiteHeader /><main className="dienst">
    <CvDoorsnede />

    <section className="section reveal">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Eerst kijken we<br />wat er nu staat.</h2></div>
          <p>We bepalen welk vermogen en warmwatercomfort bij uw huishouden passen en controleren hoe de bestaande installatie is opgebouwd. In de offerte maken we duidelijk welk toestel wordt geplaatst en welke aanpassingen aan rookgasafvoer, leidingwerk of regeling nodig zijn.</p>
        </div>
        <ul className="check-list">
          <li>Advies over vermogen en warm water</li>
          <li>Rookgasafvoer en luchttoevoer meegenomen</li>
          <li>Gasleiding gecontroleerd op lekdichtheid</li>
          <li>Oplevering met metingen en rapport</li>
        </ul>
      </div>
    </section>

    <section className="section reveal">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Deze cv-ketels<br />onderhouden wij.</h2></div>
          <p>Voor onderhoud werken we uitsluitend met deze merken. Zo weet u vooraf of een onderhoudsaanvraag bij ons past.</p>
        </div>
        <div className="merk-logos" aria-label="Cv-ketelmerken die wij onderhouden">
          {ketelmerken.map((merk) => (
            <figure key={merk.naam}>
              <div><img src={merk.logo} alt="" width="200" height="52" loading="lazy" decoding="async" /></div>
              <figcaption>{merk.naam}</figcaption>
            </figure>
          ))}
        </div>
        <div className="afbakening">
          <strong>Tot en met 40 kW</strong>
          <p>Wij onderhouden cv-ketels tot en met 40 kW in woningen en vergelijkbare kleinschalige panden. Collectieve ketelhuizen, cascadeopstellingen en grote bedrijfsinstallaties vallen buiten onze werkzaamheden. Stuur bij uw aanvraag merk, model en vermogen mee als dat bekend is.</p>
        </div>
      </div>
    </section>

    {/* Het CO-stelsel is een claim, geen uitleg, dus hij staat op inkt. Het
        keurmerk is het echte logo van CO-keur.nl; hier stond een getekend
        blauw schild met "CO / VRIJ", een certificering die onder die naam
        niet bestaat. */}
    <section className="section cert-blok reveal">
      <div className="shell cert-grid">
        <img className="cert-mark" src="/certifications/co-keur.png" alt="CO-keur.nl Nederland" width="640" height="305" loading="lazy" decoding="async" />
        <div>
          <h2>Toestel, luchttoevoer en rookgasafvoer horen bij elkaar.</h2>
        </div>
        <div>
          <p>Sinds 1 april 2023 mogen alleen gecertificeerde bedrijven werkzaamheden uitvoeren aan gasverbrandingsinstallaties. Dat gaat niet alleen om de cv-ketel, maar ook om de bijbehorende verbrandingsluchttoevoer en rookgasafvoer. De monteur moet aantoonbaar vakbekwaam zijn en zich kunnen legitimeren.</p>
          <div className="cert-bewijs">
            <strong>Bij Braam zijn certificering en vakbekwaamheid geregeld.</strong>
            <p>De CO-certificering en registraties lopen via CO-Keur. Onze monteurs hebben hun Vakmanschap CO via Installatiewerk Nederland behaald.</p>
          </div>
          <a className="text-link" href="https://www.volkshuisvestingnederland.nl/onderwerpen/verduurzamen-en-verbeteren/koolmonoxide-voorkomen" target="_blank" rel="noreferrer">Lees de officiële uitleg over het CO-stelsel <span aria-hidden="true">↗</span></a>
          <span className="cert-datum">Verplicht sinds 01.04.2023</span>
        </div>
      </div>
    </section>

    <section className="section reveal">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Rookgasafvoer en gasleiding<br />horen bij de controle.</h2></div>
          <p>De regels rond werkzaamheden aan cv-ketels zijn aangescherpt. Daarom kijken we bij vervanging en onderhoud naar de complete gasverbrandingsinstallatie en leggen we de uitgevoerde controles vast.</p>
        </div>
        <div className="keuze-grid">
          <article>
            <h3>Bij vervanging</h3>
            <p>Bij vervanging van een afvoergebonden cv-ketel wordt de bijbehorende individuele rookgasafvoer gelijktijdig vervangen. De bestaande gasleiding beproeven we op lekdichtheid. Na plaatsing stellen we de installatie in bedrijf en leggen we de controles en metingen vast.</p>
            <ul className="check-list">
              <li>Nieuwe rookgasafvoer en passende luchttoevoer</li>
              <li>Lekdichtheidsbeproeving van de gasleiding</li>
              <li>Controle van werking, afstelling en rookgassen</li>
              <li>Opleverings- en beproevingsrapport</li>
            </ul>
          </article>
          <article>
            <h3>Bij onderhoud</h3>
            <p>Een onderhoudsbeurt bestaat uit meer dan schoonmaken. We controleren het toestel, de aansluitingen, de verbrandingsluchttoevoer en de rookgasafvoer. Ook voeren we de voorgeschreven metingen uit. Na afloop ontvangt u een rapport met de resultaten, geconstateerde afwijkingen en ons advies.</p>
            <ul className="check-list">
              <li>Controle van beugeling, afschot, verbindingen en lekkage</li>
              <li>Metingen van onder meer CO, O₂ en rookgastemperatuur</li>
              <li>Controle van veilige werking en afstelling</li>
              <li>Afwijkingen en advies vastgelegd in het rapport</li>
            </ul>
          </article>
        </div>
        <p className="keuze-afbakening">Bij een bestaande installatie maken we onderscheid tussen een adviespunt en een onveilige situatie. Niet iedere afwijking betekent dat de complete rookgasafvoer direct moet worden vervangen, maar een advies tot aanpassing moet wel serieus worden genomen. Kan de veiligheid niet worden vastgesteld, dan is nader onderzoek of herstel nodig. <strong>Een onveilige installatie stellen we niet in bedrijf.</strong></p>
      </div>
    </section>

    <section className="section reveal">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>U weet vooraf<br />waar u aan toe bent.</h2></div>
          <p>Van de eerste beoordeling tot de oplevering ligt vast wat er gebeurt, wat het kost en wat er is gemeten. Zo komt u onderweg niets tegen wat u niet had verwacht.</p>
        </div>
        <ol className="werkwijze-lijst">
          {stappen.map((stap, i) => (
            <li key={stap}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><p>{stap}</p></li>
          ))}
        </ol>
      </div>
    </section>

    <section className="section onderhoud-blok reveal" id="onderhoud">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Wie hem plaatst,<br />onderhoudt hem daarna.</h2></div>
          <p>Een cv-ketel heeft jaarlijks onderhoud nodig, en de veiligheidscontrole hoort daarbij. Bij ons blijft dat bij hetzelfde team: dezelfde mensen die de installatie kennen, komen ook terug als er iets is.</p>
        </div>
        <div className="onderhoud-grid">
          <ul className="onderhoud-inhoud">
            {abonnementInhoud.map((punt) => <li key={punt}>{punt}</li>)}
          </ul>
          <div className="onderhoud-prijzen">
            <Link href="/abonnement-aanvragen?abonnement=cv-comfort">
              <span>Comfort</span>
              <strong><small>€</small>11,58</strong>
              <em>Vanaf, per maand · jaarprijs €&nbsp;139</em>
            </Link>
            <Link href="/onderhoud#abonnementen">
              <span>Comfort Plus</span>
              <strong><small>€</small>19,92</strong>
              <em>Vanaf, per maand · jaarprijs €&nbsp;239 · materiaal inbegrepen</em>
            </Link>
            <Link className="text-link" href="/onderhoud">Vergelijk Comfort en Comfort&nbsp;Plus <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </div>
    </section>

    <RelatedKnowledge service="cv-ketels" eyebrow="Handige tips over uw cv-ketel" title="Praktische uitleg voor thuis." intro="Lees wat u zelf veilig kunt controleren, zoals waterdruk, en wanneer terugkerende klachten door een monteur moeten worden onderzocht." />
    <ContactCTA title="Wilt u uw cv-ketel vervangen of onderhouden?" text="Vertel ons welk toestel u heeft en waar u hulp bij zoekt. Dan kijkt iemand uit ons team persoonlijk met u mee." primaryLabel="Vraag advies over uw cv-ketel" primaryHref="/offerte-aanvragen?dienst=cv-ketel" />
  </main><MobileActionBar href="/offerte-aanvragen?dienst=cv-ketel" label="Bespreek uw cv-ketel" /><SiteFooter /></>;
}
