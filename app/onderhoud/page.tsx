import type { Metadata } from "next";
import Link from "next/link";
import { ContactCTA } from "../components/ContactCTA";
import { MobileActionBar } from "../components/MobileActionBar";
import { PageHero } from "../components/PageHero";
import { RelatedKnowledge } from "../components/RelatedKnowledge";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { SubscriptionCards } from "../components/SubscriptionCards";

export const metadata: Metadata = { title: "Onderhoud: eenmalig of abonnement | Rob Braam", description: "Vergelijk eenmalig onderhoud met een onderhoudsabonnement voor cv-ketel, hybride combinatie of full-electric warmtepomp." };

/* Vier echte keurmerken met een echt logo. Het vijfde blok was een getekend
   "IW"-tegeltje zonder logo; dat feit staat nu in de CO-Keur-tekst, waar het
   inhoudelijk al bij hoorde. */
const keurmerken = [
  { logo: "/certifications/co-keur.png", titel: "CO-certificering via CO-Keur", tekst: "De verplichte controles en metingen aan gasverbrandingsinstallaties worden via CO-Keur vastgelegd en gerapporteerd. Onze monteurs behaalden hun Vakmanschap CO via Installatiewerk Nederland." },
  { logo: "/certifications/vca.png", titel: "VCA-gecertificeerd", tekst: "Aantoonbare aandacht voor veilig, gezond en milieubewust werken tijdens onze werkzaamheden." },
  { logo: "/certifications/installq.png", titel: "Geregistreerd bij InstallQ", tekst: "Braam staat geregistreerd bij InstallQ, de onafhankelijke stichting voor kwaliteitsborging in de installatiesector." },
  { logo: "/certifications/stek.png", titel: "STEK-gecertificeerd", tekst: "Voor werkzaamheden aan airco en warmtepompen waarbij koudemiddelen betrokken zijn." },
];

const abonnementStappen = [
  { titel: "Kijk naar uw installatie", tekst: "Alleen cv-ketel, cv-ketel met hybride warmtepomp, of een warmtepomp zonder cv-ketel." },
  { titel: "Kies Comfort of Comfort Plus", tekst: "Vergelijk of materiaal apart wordt berekend of binnen de onderhoudsmantel valt." },
  { titel: "Vraag beoordeling aan", tekst: "Wij controleren merk, type, woonplaats en installatie voordat het contract ingaat." },
];

const startStappen = [
  { titel: "U verstuurt de aanvraag", tekst: "U vult uw contactgegevens, installatie, betaalvoorkeur en gewenste startmoment in." },
  { titel: "Wij controleren de gegevens", tekst: "Onze planning beoordeelt merk, model, woonplaats en het gekozen abonnement." },
  { titel: "U ontvangt de bevestiging", tekst: "We leggen vast wat wordt onderhouden, vanaf wanneer en welke afspraken gelden. Bij maandbetaling volgt de incassomachtiging apart." },
  { titel: "Planning maakt de eerste afspraak", tekst: "We nemen contact op om de eerste onderhoudsbeurt met u in te plannen." },
  { titel: "Daarna blijft het geregeld", tekst: "Het jaarlijkse onderhoud en de storingsservice lopen volgens de bevestigde abonnementsafspraken." },
];

const verhuurderPunten = [
  { titel: "Gegevens per woning of pand", tekst: "Per adres ontvangen we graag type installatie, merk, model, vermogen en laatste onderhoudsdatum." },
  { titel: "Installaties in woningen", tekst: "Wij onderhouden individuele cv-ketels en warmtepompen in woningen. Voor warmtepompen werken we standaard met LG, Bosch en Vaillant; andere merken beoordelen we op aanvraag." },
  { titel: "Afspraken na controle", tekst: "We controleren merken, installaties en locaties. Daarna stemmen we werkzaamheden, planning en prijs met u af." },
];

export default function OnderhoudPage() {
  return <><SiteHeader /><main className="dienst">
    <PageHero eyebrow="Onderhoud & abonnementen" title="Onderhoud dat past bij uw situatie." accent="Eenmalig of met een abonnement." intro="Kies een losse onderhoudsbeurt als u één afspraak wilt maken, of een abonnement als u jaarlijks onderhoud en service vooraf wilt regelen. We leggen eerst uit wat bij uw installatie past." image="/projects/warmtepomp-berlicum.webp" imageAlt="Warmtepompinstallatie onderhouden door Rob Braam" primaryLabel="Vergelijk de opties" primaryHref="#onderhoudskeuze" badge="Onderhoud door ons eigen team" />

    <section className="section reveal">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Vaste contracten.<br />Persoonlijk contact.</h2></div>
          <p>Ons meeste onderhoud doen we in &apos;s-Hertogenbosch en omgeving. Bij een nieuwe onderhoudsaanvraag controleren we de installatie, het merk en de woonplaats, zodat u vooraf weet wat mogelijk is.</p>
        </div>
        <ul className="check-list">
          <li>Een eigen team, geen anoniem callcenter</li>
          <li>Gecertificeerde monteurs voor het werk dat zij uitvoeren</li>
          <li>Voor cv-ketels: Intergas, Remeha, Nefit en Vaillant</li>
          <li>Onderhoud en afspraken lopen via planning</li>
        </ul>
      </div>
    </section>

    <section className="section reveal">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Vakbekwaamheid<br />die u kunt herkennen.</h2></div>
          <p>Bij Braam staan veiligheid en aantoonbaar vakmanschap voorop. Daarom laten we duidelijk zien via welke certificering, erkenning en opleiding ons team werkt.</p>
        </div>
        <div className="cert-register">
          {keurmerken.map((merk) => (
            <article key={merk.titel}>
              <div className="cert-register-logo"><img src={merk.logo} alt="" loading="lazy" decoding="async" /></div>
              <h3>{merk.titel}</h3>
              <p>{merk.tekst}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="section reveal" id="onderhoudskeuze">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Eenmalig onderhoud<br />of een abonnement?</h2></div>
          <p>Bij een losse beurt maakt u één afspraak. Met een abonnement legt u het jaarlijkse onderhoud en de afgesproken servicevoordelen vooraf vast.</p>
        </div>
        <div className="keuze-grid">
          <article>
            <h3>Losse onderhoudsbeurt</h3>
            <p>Voor wie nu onderhoud wil laten uitvoeren zonder een jaarlijkse overeenkomst af te sluiten.</p>
            <ul className="check-list">
              <li>Eén onderhoudsafspraak</li>
              <li>Geen jaarlijkse contractverplichting</li>
              <li>Afspraak en kosten vooraf afgestemd</li>
              <li>Uw aanvraag komt herkenbaar bij planning binnen</li>
            </ul>
            <div className="keuze-acties">
              <Link className="text-link" href="/eenmalig-onderhoud-aanvragen">Vraag een losse beurt aan <span aria-hidden="true">→</span></Link>
            </div>
          </article>
          <article>
            <h3>Jaarlijks onderhoud met serviceafspraken</h3>
            <p>Kies Comfort als materiaal apart mag worden berekend, of Comfort Plus met materiaal binnen de onderhoudsmantel.</p>
            <ul className="check-list">
              <li>Onderhoud passend bij uw installatie</li>
              <li>24/7 storingsservice</li>
              <li>Voorrijkosten en arbeidsloon inbegrepen binnen de afspraken</li>
              <li>Comfort of Comfort Plus, afgestemd op uw voorkeur</li>
            </ul>
            <div className="keuze-acties">
              <Link className="text-link" href="#abonnementen">Bekijk de abonnementen <span aria-hidden="true">↓</span></Link>
            </div>
          </article>
        </div>
        <p className="keuze-afbakening"><strong>Twijfelt u?</strong> U hoeft niet direct te kiezen. Vertel ons welk systeem en merk u heeft; dan leggen we eerst uit welke optie past en wat buiten het contract valt.</p>
      </div>
    </section>

    {/* Het verhuurdersblok is het inkt-hoofdstuk van deze pagina: een ander
        publiek met een eigen afspraak, geen uitleg voor de huiseigenaar. */}
    <section className="section onderhoud-blok reveal" id="verhuurders">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Ook voor verhuurders<br />en vastgoedeigenaren.</h2></div>
          <p>Beheert u meerdere huurwoningen of kleinschalige panden? Geef per adres door welke installatie er hangt, inclusief merk, model en vermogen als dat bekend is. Daarna beoordelen we welke adressen binnen onze planning en onderhoudsscope passen.</p>
        </div>
        <ol className="werkwijze-lijst">
          {verhuurderPunten.map((punt, i) => (
            <li key={punt.titel}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><p><strong>{punt.titel}.</strong> {punt.tekst}</p></li>
          ))}
        </ol>
        <p className="werkwijze-noot">
          <Link className="button button-primary" href="/abonnement-aanvragen?type=verhuurder">Onderhoud voor meerdere panden bespreken <span aria-hidden="true">→</span></Link>
          <a className="onderhoud-bel" href="tel:+31736222199">Of bel 073 622 2199</a>
        </p>
      </div>
    </section>

    <section className="section reveal" id="abonnementen">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Welk systeem staat<br />er bij u thuis?</h2></div>
          <p>U sluit hier niet met één klik een abonnement af. Bekijk eerst welk systeem u heeft, wat inbegrepen is en hoe u wilt betalen. Na uw aanvraag controleren we of het abonnement bij uw installatie past.</p>
        </div>
        <ol className="werkwijze-lijst">
          {abonnementStappen.map((stap, i) => (
            <li key={stap.titel}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><p><strong>{stap.titel}.</strong> {stap.tekst}</p></li>
          ))}
        </ol>

        {/* Het ene getal dat het abonnement concreet maakt, op de maat van de
            prijzen: twee controles per 24 maanden. */}
        <div className="jaarcontrole">
          <div className="jaarcontrole-cijfer" aria-hidden="true"><strong>2×</strong><span>in 24 maanden</span></div>
          <div>
            <h3>Een controle per jaar, als onderdeel van een doorlopend servicepakket.</h3>
            <p>Bij Braam plannen we ieder jaar een controle van uw installatie: twee geplande controlemomenten in 24 maanden. Tijdens het bezoek controleren we het toestel visueel, voeren we veiligheids- en verbrandingsmetingen uit en stellen we het toestel bij wanneer dat nodig is.</p>
            <p>Niet ieder toestel hoeft tijdens elk jaarlijks bezoek volledig uit elkaar. Welke onderdelen we openen of reinigen hangt af van het toestel, de toestand en de meetresultaten.</p>
          </div>
          <aside>
            <strong>Stelt u zelf een controle uit?</strong>
            <p>Dan blijft het abonnement actief en blijven de abonnementskosten verschuldigd. Het abonnement is geen betaling per bezoek, maar een doorlopend pakket met jaarlijkse planning en de afgesproken service bij storingen.</p>
          </aside>
        </div>

        <SubscriptionCards />

        <div className="afspraken-grid">
          <article>
            <h3>Per maand of één keer per jaar.</h3>
            <p>De maandprijs staat voorop omdat deze makkelijker te vergelijken is. De volledige jaarprijs blijft altijd zichtbaar. Nieuwe klanten kiezen bij hun aanvraag tussen maandelijkse automatische incasso en betaling per jaar.</p>
            <dl className="keuze-feiten">
              <div><dt>Maandelijks</dt><dd>De jaarprijs verdeeld over 12 termijnen via automatische incasso. Na onze beoordeling ontvangt u eerst de bevestiging en incassomachtiging; pas daarna start de afschrijving.</dd></div>
              <div><dt>Jaarlijks</dt><dd>U betaalt de volledige jaarprijs in één keer. Bestaande klanten die dit al zo doen, kunnen deze betaalwijze behouden.</dd></div>
            </dl>
          </article>
          <article>
            <h3>Dit valt binnen het contract.</h3>
            <ul className="check-list">
              <li>Ieder jaar een door Braam geplande controle</li>
              <li>Recht op 24/7 storingsservice</li>
              <li>Geen voorrijkosten volgens de abonnementsafspraken</li>
              <li>Geen arbeidsloon voor werkzaamheden die binnen het contract vallen</li>
            </ul>
            <dl className="keuze-feiten">
              <div><dt>Comfort</dt><dd>Materiaal wordt apart berekend</dd></div>
              <div><dt>Comfort Plus</dt><dd>Materiaal binnen de onderhoudsmantel is inbegrepen</dd></div>
              <div><dt>Overig werk</dt><dd>Werk aan andere installaties of buiten de afspraken valt apart</dd></div>
            </dl>
          </article>
        </div>
        <p className="keuze-afbakening"><strong>Doorlopende overeenkomst:</strong> stelt u een geplande controle zelf uit of wilt u die een jaar overslaan, dan pauzeert het abonnement niet en blijven de abonnementskosten verschuldigd. Voor de start bevestigen we alle afspraken persoonlijk.</p>
      </div>
    </section>

    <section className="section reveal" id="zo-start-uw-abonnement">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Zo start uw<br />onderhoudsabonnement.</h2></div>
          <p>Een aanvraag wordt niet automatisch een contract. Eerst controleren we of het gekozen abonnement bij de installatie en het werkgebied past. Daarna bevestigen we de afspraken persoonlijk.</p>
        </div>
        <ol className="werkwijze-lijst">
          {startStappen.map((stap, i) => (
            <li key={stap.titel}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><p><strong>{stap.titel}.</strong> {stap.tekst}</p></li>
          ))}
        </ol>
        <p className="werkwijze-noot"><strong>Belangrijk:</strong> pas na onze persoonlijke bevestiging is het abonnement definitief en staat de ingangsdatum vast.</p>
      </div>
    </section>

    <section className="section reveal">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Kies de installatie<br />die bij u thuis staat.</h2></div>
          <p>Na uw keuze opent het aanvraagformulier op een aparte pagina. Uw installatie staat daar alvast geselecteerd; vervolgens kiest u Comfort of Comfort Plus en vult u uw gegevens in.</p>
        </div>
        <div className="onderhoud-prijzen onderhoud-prijzen-rij">
          <Link href="/abonnement-aanvragen?abonnement=cv-comfort#aanvraagformulier">
            <span>Alleen een cv-ketel</span>
            <strong><small>€</small>11,58</strong>
            <em>Comfort vanaf, per maand · jaarprijs €&nbsp;139</em>
            <p>Voor cv-ketels van Intergas, Remeha, Nefit en Vaillant.</p>
            <b>Naar cv-ketelabonnement <span aria-hidden="true">→</span></b>
          </Link>
          <Link href="/abonnement-aanvragen?abonnement=hybride-comfort#aanvraagformulier">
            <span>Cv-ketel + warmtepomp</span>
            <strong><small>€</small>24,08</strong>
            <em>Comfort vanaf, per maand · jaarprijs €&nbsp;289</em>
            <p>Voor een cv-ketel in combinatie met een hybride warmtepomp.</p>
            <b>Naar hybride abonnement <span aria-hidden="true">→</span></b>
          </Link>
          <Link href="/abonnement-aanvragen?abonnement=all-electric-comfort#aanvraagformulier">
            <span>Geen cv-ketel</span>
            <strong><small>€</small>19,92</strong>
            <em>Comfort vanaf, per maand · jaarprijs €&nbsp;239</em>
            <p>Voor een volledig elektrische warmtepomp zonder cv-ketel.</p>
            <b>Naar warmtepompabonnement <span aria-hidden="true">→</span></b>
          </Link>
        </div>
        <p className="keuze-afbakening"><strong>Weet u niet precies welk systeem u heeft?</strong> Kies de optie &lsquo;Ik weet het niet zeker&rsquo; in het formulier. Merk en model mag u invullen voor zover bekend; wij kijken daarna met u mee. <Link className="text-link" href="/abonnement-aanvragen?abonnement=onbekend#aanvraagformulier">Open het formulier en laat ons meekijken <span aria-hidden="true">→</span></Link></p>
      </div>
    </section>

    <RelatedKnowledge service="onderhoud" eyebrow="Handige tips over uw cv-ketel" title="Eerst zelf begrijpen wat u ziet." intro="Van waterdruk tot ontluchten en onderhoud: praktische uitleg helpt u om signalen beter te herkennen. Bij twijfel blijft ons serviceteam bereikbaar." />
    <ContactCTA title="Wilt u uw onderhoud vast regelen?" text="Vul uw contactgegevens en het merk en type van uw installatie in. We controleren welk abonnement past en laten u weten wat de volgende stap is." primaryLabel="Vraag een abonnement aan" primaryHref="/abonnement-aanvragen" />
  </main><MobileActionBar href="/abonnement-aanvragen" label="Onderhoud aanvragen" /><SiteFooter /></>;
}
