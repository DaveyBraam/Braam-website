import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { Reis } from './Reis';
import { controles } from './controles';
import './cv-ketels.css';

/* Cv-ketels (sinds 8 oktober 2026): keuringsronde langs de eigen 3D-ketel.
   Licht, met één donker moment: bij de gasleiding en de rookgasafvoer gaat het
   licht uit en wordt de installatie doorgelicht. Tekstblokken blijven staan om
   rustig te lezen (65+). Achtergrond: scrollcraft/builds/cv-ketels-v2/BRIEF.md
   De vorige versie staat nog als /concept-product/cv-ketels (noindex).

   Vaste regels: u-vorm, geen aantallen medewerkers of klanten, prijzen zoals
   op /onderhoud, merken zonder aantal, telefoon nergens weggestopt. */

/* eslint-disable @next/next/no-img-element */
export const metadata: Metadata = {
  title: 'Nieuwe cv-ketel plaatsen of vervangen',
  description: "Veilige plaatsing, vervanging en onderhoud van cv-ketels door een CO-gecertificeerd installatiebedrijf vanuit 's-Hertogenbosch, actief in Noord-Brabant en aangrenzende delen van Gelderland.",
  alternates: { canonical: '/cv-ketels' },
  robots: { index: true, follow: true },
};

function Pijl() {
  return <svg className="ck-pijl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" /></svg>;
}
function Plus() {
  return <svg className="ck-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 12h14M12 5v14" /></svg>;
}
function Vink() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.3 3 3 6-6.6" /></svg>;
}

export default function CvKetels() {
  return <>
    <SiteHeader />
    <main className="ck">
      <Reis>
        <section className="ck-kop" data-stand="0" aria-labelledby="ck-titel">
          <div className="ck-kop-tekst">
            <h1 id="ck-titel">Comfort. <span>Tot in detail.</span></h1>
            <p className="ck-intro">Een warm huis. Een fijne douche. Het begint met een ketel die bij u past.</p>
            <div className="ck-acties">
              <Link className="ck-knop" href="/offerte-aanvragen?dienst=cv-ketel">Bespreek uw cv-ketel <Pijl /></Link>
              <a className="ck-bellijn" href="tel:+31736222199">Of bel 073 622 2199</a>
            </div>
          </div>
        </section>

        <section className="ck-hst" id="ck-aansluitingen" data-stand="1" data-kant="rechts" aria-labelledby="ck-t-aansluitingen">
          <div className="ck-tekst">
            <h2 id="ck-t-aansluitingen">Elk detail. <span>Een functie.</span></h2>
            <p>Wat onder de ketel zit, telt net zo hard. Verwarming, water en gas: we controleren het leidingwerk stuk voor stuk.</p>
            <dl className="ck-paren">
              <div><dt>Cv-aanvoer en retour</dt><dd>Warmte naar uw radiatoren. Water terug naar de ketel.</dd></div>
              <div><dt>Warm en koud water</dt><dd>De verbinding met uw douche en kranen.</dd></div>
            </dl>
          </div>
        </section>

        <section className="ck-hst" id="ck-woning" data-stand="2" data-kant="rechts" aria-labelledby="ck-t-woning">
          <div className="ck-tekst">
            <h2 id="ck-t-woning">Afgestemd op <span>uw woning.</span></h2>
            <p>We kijken naar uw huidige radiatoren, eventuele vloerverwarming en de regeling. Daar stemmen we uw cv-ketel op af.</p>
            <p>We stellen het verwarmingsvermogen en de aanvoertemperatuur passend in en controleren hoe uw installatie daarop reageert.</p>
            <details className="ck-meer">
              <summary>Waarom uw woning het uitgangspunt is <Plus /></summary>
              <div>
                <p>Uw radiatoren, vloerverwarming en de ruimtes die u gebruikt bepalen welk vermogen nodig is. Uw warmwatergebruik bepaalt het gewenste douche- en kraancomfort. We nemen beide mee in het advies.</p>
                <p>Ook kijken we naar de bestaande installatie, de bereikbaarheid van het toestel en de afwerking. In de offerte staat welk toestel past en welke aanpassingen nodig zijn.</p>
              </div>
            </details>
          </div>
        </section>

        <section className="ck-hst ck-stilte" data-stand="3" data-donker="1" data-kant="rechts" aria-labelledby="ck-t-stilte">
          <div className="ck-tekst">
            <h2 id="ck-t-stilte">Wat u niet ziet, <span>controleren wij.</span></h2>
            <p>Het gas naar de ketel. De lucht die erin gaat en het rookgas dat eruit gaat.</p>
          </div>
        </section>

        <section className="ck-hst ck-gas" id="ck-gasleiding" data-stand="4" data-kant="rechts" aria-labelledby="ck-t-gas">
          <div className="ck-tekst">
            <h2 id="ck-t-gas">De gasleiding. <span>Apart gecontroleerd.</span></h2>
            <dl className="ck-paren">
              <div><dt>Bij onderhoud</dt><dd>We meten de gasdruk.</dd></div>
              <div><dt>Bij installatie</dt><dd>We beproeven de bestaande gasleiding op lekdichtheid.</dd></div>
            </dl>
            <div className="ck-voorwaarde">
              <strong>Eerst herstellen. Dan in gebruik.</strong>
              <p>Een vastgesteld gaslek moet vóór ingebruikname en oplevering zijn hersteld en opnieuw gecontroleerd.</p>
            </div>
          </div>
        </section>

        <section className="ck-hst ck-rook" id="ck-rookgas" data-stand="5" data-kant="rechts" aria-labelledby="ck-t-rook">
          <div className="ck-tekst">
            <h2 id="ck-t-rook">Veiligheid. <span>In samenhang.</span></h2>
            <p>De ketel, luchttoevoer en rookgasafvoer vormen één installatie. Daarom kijken we verder dan het toestel: van de verbinding aan de ketel tot de doorvoer door het dak of de gevel.</p>
            <p className="ck-uitleg">In een dubbelwandige afvoer gaat het rookgas door de binnenste buis naar buiten. Verse lucht komt door de buitenste buis naar binnen.</p>
            <div className="ck-voorwaarde">
              <strong>Een onveilige installatie stellen we niet in bedrijf.</strong>
            </div>
            <details className="ck-meer">
              <summary>Wat verandert er bij vervanging? <Plus /></summary>
              <div>
                <p>Bij vervanging van een afvoergebonden cv-ketel vervangen we ook de bijbehorende individuele rookgasafvoer en zorgen we voor passende luchttoevoer.</p>
                <p>Bij onderhoud controleren we beugeling, afschot, verbindingen en lekkage. Niet iedere afwijking betekent dat de complete afvoer direct vervangen moet worden. Als de veiligheid niet vaststaat, is nader onderzoek of herstel nodig.</p>
              </div>
            </details>
            <div className="ck-keur">
              <span className="ck-keur-logo"><img src="/certifications/co-keur.png" width="128" height="61" alt="CO-keur.nl Nederland" /></span>
              <p>CO-gecertificeerd<span>BRL 6000-25 · Vakmanschap CO</span></p>
            </div>
          </div>
        </section>

        <section className="ck-hst ck-terug" id="ck-oplevering" data-stand="6" data-kant="rechts" aria-labelledby="ck-t-oplevering">
          <div className="ck-tekst">
            <h2 id="ck-t-oplevering">Goed werk. <span>Vastgelegd.</span></h2>
            <p>We controleren de werking, stellen de ketel af en meten de verbranding. U ontvangt een rapport met de resultaten, afwijkingen en ons advies.</p>
            <ul className="ck-metingen" aria-label="Onder meer deze metingen voeren wij uit">
              <li><strong>CO</strong><span>Koolmonoxide</span></li>
              <li><strong>O<sub>2</sub></strong><span>Zuurstof</span></li>
              <li><strong>°C</strong><span>Rookgastemperatuur</span></li>
            </ul>
            <p className="ck-noot"><strong>Voor ingebruikname.</strong> Werking, afstelling en rookgassen gecontroleerd. Metingen vastgelegd in het opleverings- en beproevingsrapport.</p>
            <details className="ck-meer">
              <summary>Certificering en vakbekwaamheid <Plus /></summary>
              <div>
                <p>Onze CO-certificering en registraties lopen via CO-Keur, volgens BRL 6000-25. Onze monteurs hebben hun Vakmanschap CO via Installatiewerk Nederland behaald.</p>
                <a className="ck-tekstlink" href="https://www.volkshuisvestingnederland.nl/onderwerpen/verduurzamen-en-verbeteren/koolmonoxide-voorkomen" target="_blank" rel="noreferrer">Lees de officiële uitleg <Pijl /></a>
              </div>
            </details>
          </div>
        </section>
      </Reis>

      <section className="ck-daarna" aria-labelledby="ck-t-daarna">
        <div className="ck-rand ck-daarna-raster">
          <div>
            <h2 id="ck-t-daarna">Ook daarna. <span>Bij Braam.</span></h2>
            <p>Wie uw installatie plaatst, onderhoudt hem daarna. Advies, installatie en service blijven bij ons eigen team.</p>
          </div>
          <div className="ck-prijs">
            <p className="ck-prijs-naam">Comfort, cv-ketel</p>
            <p className="ck-prijs-bedrag"><small>vanaf €</small>11,58<small>per maand</small></p>
            <p className="ck-prijs-jaar">€ 139 per jaar, jaarlijks onderhoud</p>
            <div className="ck-acties">
              <Link className="ck-knop" href="/abonnement-aanvragen?abonnement=cv-comfort">Onderhoud regelen <Pijl /></Link>
              <a className="ck-tekstlink" href="#ck-naslag">Wat is inbegrepen?</a>
            </div>
            <p className="ck-storing">Hulp nodig bij een storing? <a href="tel:+31736222199">Bel 073 622 2199</a></p>
          </div>
        </div>
      </section>

      <section className="ck-naslag" id="ck-naslag" aria-labelledby="ck-t-naslag">
        <div className="ck-rand">
          <div className="ck-naslag-kop">
            <h2 id="ck-t-naslag">Helder afgesproken. <span>Van begin tot onderhoud.</span></h2>
            <p>De belangrijkste afspraken op één plek. Zodat u weet waar u aan toe bent.</p>
          </div>
          <div className="ck-naslag-raster">
            <nav className="ck-naslag-index" aria-label="In deze naslag">
              <a href="#ck-werkwijze">Van advies tot oplevering</a>
              <a href="#ck-abonnementen">Onderhoud en abonnementen</a>
              <a href="#ck-merken">Merken en vermogen</a>
              <Link href="/kennisbank">Praktische uitleg voor thuis <Pijl /></Link>
            </nav>
            <div className="ck-naslag-bladen">
              <article id="ck-werkwijze" aria-labelledby="ck-t-werkwijze">
                <h3 id="ck-t-werkwijze">Eerst kijken. Dan kiezen.</h3>
                <ol className="ck-stappen">
                  <li><h4>Uw situatie</h4><p>We bespreken uw wensen en bekijken de ketel, aansluitingen, gasleiding en rookgasafvoer.</p></li>
                  <li><h4>Een duidelijke offerte</h4><p>U ziet welk toestel we plaatsen en welke aanpassingen aan leidingwerk, afvoer of regeling nodig zijn.</p></li>
                  <li><h4>Gecontroleerd opgeleverd</h4><p>Na plaatsing beproeven we de gasleiding, stellen we af en leggen we de controles en metingen vast.</p></li>
                </ol>
              </article>
              <article id="ck-abonnementen" aria-labelledby="ck-t-abonnementen">
                <h3 id="ck-t-abonnementen">De zorg gaat verder.</h3>
                <p>Jaarlijks een geplande controle. Bij onderhoud én storing zijn voorrijkosten en arbeidsloon inbegrepen. Met een abonnement heeft u toegang tot onze 24/7 storingsservice.</p>
                <div className="ck-vergelijk">
                  <div><h4>Comfort</h4><p>Materiaal wordt apart berekend.</p><Link className="ck-tekstlink" href="/abonnement-aanvragen?abonnement=cv-comfort">Comfort aanvragen <Pijl /></Link></div>
                  <div><h4>Comfort Plus</h4><p>Materiaal binnen de onderhoudsmantel inbegrepen. Binnenkort beschikbaar; nu al op aanvraag voor ketels van maximaal 5 jaar oud.</p><Link className="ck-tekstlink" href="/abonnement-aanvragen?abonnement=cv-comfort-plus">Comfort Plus aanvragen <Pijl /></Link></div>
                </div>
                <Link className="ck-tekstlink" href="/eenmalig-onderhoud-aanvragen">Liever eenmalig onderhoud <Pijl /></Link>
              </article>
              <article id="ck-merken" aria-labelledby="ck-t-merken">
                <h3 id="ck-t-merken">Past uw ketel bij onze service?</h3>
                <p>Wij onderhouden Intergas, Remeha, Nefit en Vaillant, tot en met <strong>40 kW</strong>. Voor woningen en vergelijkbare kleinschalige panden.</p>
                <p><strong>Let op:</strong> een Intergas-ketel onderhouden we wel, maar we plaatsen er geen nieuwe.</p>
                <p className="ck-merken" aria-label="Merken voor onderhoud"><span>Intergas</span><span>Remeha</span><span>Nefit</span><span>Vaillant</span></p>
                <p className="ck-klein">Collectieve ketelhuizen, cascadeopstellingen en grote bedrijfsinstallaties vallen buiten onze werkzaamheden. Vermeld bij uw aanvraag het merk, model en vermogen, als dat bekend is. Het afgebeelde toestel is van Vaillant.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="ck-slot" aria-labelledby="ck-t-slot">
        <div className="ck-rand ck-slot-raster">
          <div className="ck-slot-lijst">
            <p className="ck-slot-lijst-titel">Bij elke cv-ketel lopen we dit na</p>
            <ul>{controles.map(c => <li key={c.id}><i><Vink /></i>{c.lang}</li>)}</ul>
          </div>
          <div className="ck-slot-vraag">
            <h2 id="ck-t-slot">Een goed begin? <span>Even overleggen.</span></h2>
            <p>Vertel ons welk toestel u heeft en waar u hulp bij zoekt. Dan kijkt iemand uit ons team met u mee.</p>
            <div className="ck-acties">
              <Link className="ck-knop" href="/offerte-aanvragen?dienst=cv-ketel">Bespreek uw cv-ketel <Pijl /></Link>
              <a className="ck-bel" href="tel:+31736222199"><small>Of bel</small><strong>073 622 2199</strong></a>
            </div>
            <p className="ck-mail"><a href="mailto:service@robbraam.com">service@robbraam.com</a><a href="mailto:planning@robbraam.com">planning@robbraam.com <span>voor onderhoud</span></a></p>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
