import type { Metadata } from 'next';
import Link from 'next/link';
import { Story } from './Story';
import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';
import '../service-story-theme.css';
import './product-story.css';

/* eslint-disable @next/next/no-img-element */
export const metadata: Metadata = {
  title: 'Uw cv-ketel. Comfort tot in detail — lokaal concept',
  robots: { index: false, follow: false },
};
function Arrow() { return <svg className="ps-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" /></svg>; }
function Plus() { return <svg className="ps-icon ps-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14M12 5v14" /></svg>; }
function Index({ number, children }: { number: string; children: React.ReactNode }) { return <p className="ps-eyebrow"><span>{number}</span>{children}</p>; }

export default function ProductStoryPage() {
  return <><a className="ps-skip" href="#ps-scene-1">Naar de inhoud</a><SiteHeader />
    <main className="cv-product service-story">
      <div className="ps-productnav"><span><strong>Cv-ketels</strong><span>Een gids voor uw installatie</span></span><a href="tel:+31736222199">073 622 2199 <span aria-hidden="true">↗</span></a></div>
      <Story>
        <section className="ps-chapter ps-hero" id="ps-scene-1" aria-labelledby="ps-title-1"><div className="ps-panel">
          <Index number="01 / 04">Afgestemd op uw woning</Index>
          <h1 id="ps-title-1">Comfort.<br /><em>Tot in detail.</em></h1>
          <p className="ps-intro">Een warm huis. Een fijne douche.<br />Het begint met een ketel die bij u past.</p>
          <div className="ps-actions"><Link className="ps-button" href="/offerte-aanvragen?dienst=cv-ketel">Bespreek uw cv-ketel <Arrow /></Link><a className="ps-textlink" href="#ps-scene-2">Ontdek de details <span aria-hidden="true">↓</span></a></div>
          <details className="ps-detail ps-hero-detail"><summary>Waarom uw woning het uitgangspunt is <Plus /></summary><div><p>Uw radiatoren, vloerverwarming en de ruimtes die u gebruikt bepalen welk vermogen nodig is. Uw warmwatergebruik bepaalt het gewenste douche- en kraancomfort. We nemen beide mee in het advies.</p><p>Ook kijken we naar de bestaande installatie, de bereikbaarheid van het toestel en de afwerking. In de offerte staat welk toestel past en welke aanpassingen nodig zijn.</p></div></details>
        </div><figure className="ps-mobile-figure"><img src="/concept-3d/cv-ketels/installation-overview.webp" alt="De complete cv-installatie" width="1000" height="1100" loading="lazy" /><figcaption>FIG. 01 — De complete cv-installatie</figcaption></figure></section>

        <section className="ps-chapter" id="ps-scene-2" aria-labelledby="ps-title-2"><div className="ps-panel">
          <Index number="02 / 04">De aansluitingen</Index>
          <h2 id="ps-title-2">Elk detail.<br /><em>Een functie.</em></h2>
          <p className="ps-body">Wat onder de ketel zit, telt net zo hard. Verwarming, water en gas: we controleren het leidingwerk stuk voor stuk.</p>
          <div className="ps-pipe-reading"><dl className="ps-connections"><div><dt><span>01</span> Cv-aanvoer & retour</dt><dd>Warmte naar uw radiatoren. Water terug naar de ketel.</dd></div><div><dt><span>02</span> Warm & koud water</dt><dd>De verbinding met uw douche en kranen.</dd></div></dl></div>
          <article className="ps-radiator-copy" data-heating-detail aria-labelledby="ps-radiator-title">
            <p className="ps-gas-index">02.1 / Uw huidige installatie</p>
            <h3 id="ps-radiator-title">Afgestemd op<br />uw woning.</h3>
            <p>We kijken naar uw huidige radiatoren, eventuele vloerverwarming en de regeling. Daar stemmen we uw cv-ketel op af.</p>
            <p>We stellen het verwarmingsvermogen en de aanvoertemperatuur passend in en controleren hoe uw installatie daarop reageert.</p>
          </article>
          <article className="ps-gas-focus" aria-labelledby="ps-gas-title">
            <p className="ps-gas-index">02.2 / Belangrijk controlepunt</p>
            <h3 id="ps-gas-title">De gasleiding.<br />Apart gecontroleerd.</h3>
            <dl><div><dt>Bij onderhoud</dt><dd>We meten de gasdruk.</dd></div><div><dt>Bij installatie</dt><dd>We beproeven de bestaande gasleiding op lekdichtheid.</dd></div></dl>
            <p className="ps-gas-condition"><strong>Eerst herstellen. Dan in gebruik.</strong> Een vastgesteld gaslek moet vóór ingebruikname en oplevering zijn hersteld en opnieuw gecontroleerd.</p>
          </article>
        </div><figure className="ps-mobile-figure"><img src="/concept-3d/cv-ketels/connection-detail.webp" alt="Het leidingwerk onder de cv-ketel" width="1000" height="1100" loading="lazy" /><figcaption>FIG. 02 — Het leidingwerk onder de cv-ketel</figcaption></figure></section>

        <section className="ps-chapter" id="ps-scene-3" aria-labelledby="ps-title-3"><div className="ps-panel">
          <Index number="03 / 04">Luchttoevoer & rookgasafvoer</Index>
          <h2 id="ps-title-3">Veiligheid.<br /><em>In samenhang.</em></h2>
          <p className="ps-body">De ketel, luchttoevoer en rookgasafvoer vormen één installatie. Daarom kijken we verder dan het toestel.</p>
          <div className="ps-margin-note"><span>Controlepunt / 03.1</span><p>Van de verbinding aan de ketel tot de doorvoer door het dak of de gevel.</p></div>
          <details className="ps-detail"><summary>Wat verandert er bij vervanging? <Plus /></summary><div><p>Bij vervanging van een afvoergebonden cv-ketel vervangen we ook de bijbehorende individuele rookgasafvoer en zorgen we voor passende luchttoevoer.</p><p>Bij onderhoud controleren we beugeling, afschot, verbindingen en lekkage. Niet iedere afwijking betekent dat de complete afvoer direct vervangen moet worden. Als de veiligheid niet vaststaat, is nader onderzoek of herstel nodig. Een onveilige installatie stellen we niet in bedrijf.</p></div></details>
          <div className="ps-cert"><img src="/certifications/co-keur.png" width="128" height="61" alt="CO-keur.nl Nederland" /><p>CO-gecertificeerd<span>BRL 6000-25 · Vakmanschap CO</span></p></div>
        </div><figure className="ps-mobile-figure"><img src="/concept-3d/cv-ketels/installation-overview.webp" alt="Ketel, luchttoevoer en rookgasafvoer" width="1000" height="1100" loading="lazy" /><figcaption>FIG. 03 — Ketel, luchttoevoer en rookgasafvoer</figcaption></figure></section>

        <section className="ps-chapter" id="ps-scene-4" aria-labelledby="ps-title-4"><div className="ps-panel">
          <Index number="04 / 04">Controle & oplevering</Index>
          <h2 id="ps-title-4">Goed werk.<br /><em>Vastgelegd.</em></h2>
          <p className="ps-body">We controleren de werking, stellen de ketel af en meten de verbranding. U ontvangt een rapport met de resultaten, afwijkingen en ons advies.</p>
          <div className="ps-measurements" aria-label="Onder meer deze metingen voeren wij uit"><div><strong>CO</strong><span>Koolmonoxide</span></div><div><strong>O₂</strong><span>Zuurstof</span></div><div><strong>°C</strong><span>Rookgastemperatuur</span></div></div>
          <div className="ps-margin-note"><span>Voor ingebruikname</span><p>Werking, afstelling en rookgassen gecontroleerd. Metingen vastgelegd in het opleverings- en beproevingsrapport.</p></div>
          <details className="ps-detail"><summary>Certificering en vakbekwaamheid <Plus /></summary><div><p>Onze CO-certificering en registraties lopen via CO-Keur, volgens BRL 6000-25. Onze monteurs hebben hun Vakmanschap CO via Installatiewerk Nederland behaald.</p><a href="https://www.volkshuisvestingnederland.nl/onderwerpen/verduurzamen-en-verbeteren/koolmonoxide-voorkomen" target="_blank" rel="noreferrer">Lees de officiële uitleg <Arrow /></a></div></details>
        </div><figure className="ps-mobile-figure"><img src="/concept-3d/cv-ketels/installation-overview.webp" alt="De installatie die we controleren" width="1000" height="1100" loading="lazy" /><figcaption>FIG. 04 — De installatie die we controleren</figcaption></figure></section>

      </Story>

      <section className="ps-aftercare" id="ps-scene-5" aria-labelledby="ps-title-5">
        <div className="ps-aftercare-intro">
          <Index number="Na oplevering">Onderhoud & service</Index>
          <h2 id="ps-title-5">Ook daarna.<br /><em>Bij Braam.</em></h2>
          <p className="ps-body">Wie uw installatie plaatst, onderhoudt hem daarna. Advies, installatie en service blijven bij ons eigen team.</p>
        </div>
        <div className="ps-aftercare-details">
          <div className="ps-offer"><span>Comfort · cv-ketel</span><strong><small>vanaf €</small> 11,58<small> / maand</small></strong><p>€ 139 per jaar · jaarlijks onderhoud</p></div>
          <div className="ps-actions"><Link className="ps-button" href="/abonnement-aanvragen?abonnement=cv-comfort">Onderhoud regelen <Arrow /></Link><a className="ps-textlink" href="#ps-handboek">Wat is inbegrepen? <span aria-hidden="true">↓</span></a></div>
          <p className="ps-service-note">Hulp nodig bij een storing?<br /><a href="tel:+31736222199">Bel 073 622 2199 <span aria-hidden="true">↗</span></a></p>
        </div>
      </section>

      <section className="ps-handbook" id="ps-handboek" aria-labelledby="ps-handbook-title">
        <div className="ps-handbook-heading"><Index number="Naslag">Goed om te weten</Index><h2 id="ps-handbook-title">Helder afgesproken.<br /><em>Van begin tot onderhoud.</em></h2><p>De belangrijkste afspraken op één plek.<br />Zodat u weet waar u aan toe bent.</p></div>
        <div className="ps-handbook-grid">
          <div className="ps-manual-index"><span>In deze gids</span><a href="#ps-werkwijze">01 — Van advies tot oplevering</a><a href="#ps-service">02 — Onderhoud & abonnementen</a><a href="#ps-merken">03 — Merken & vermogen</a><Link href="/kennisbank">Praktische uitleg voor thuis <Arrow /></Link></div>
          <div className="ps-manual-pages">
            <article id="ps-werkwijze"><Index number="01">Onze werkwijze</Index><h3>Eerst kijken. Dan kiezen.</h3><ol className="ps-process"><li><span>01</span><div><h4>Uw situatie</h4><p>We bespreken uw wensen en bekijken de ketel, aansluitingen, gasleiding en rookgasafvoer.</p></div></li><li><span>02</span><div><h4>Een duidelijke offerte</h4><p>U ziet welk toestel we plaatsen en welke aanpassingen aan leidingwerk, afvoer of regeling nodig zijn.</p></div></li><li><span>03</span><div><h4>Gecontroleerd opgeleverd</h4><p>Na plaatsing beproeven we de gasleiding, stellen we af en leggen we de controles en metingen vast.</p></div></li></ol></article>
            <article id="ps-service"><Index number="02">Onderhoud & abonnementen</Index><h3>De zorg gaat verder.</h3><p>Jaarlijks een geplande controle. Bij onderhoud én storing zijn voorrijkosten en arbeidsloon inbegrepen. Met een abonnement heeft u toegang tot onze 24/7 storingsservice.</p><div className="ps-comparison"><div><h4>Comfort</h4><p>Materiaal wordt apart berekend.</p><Link href="/abonnement-aanvragen?abonnement=cv-comfort">Comfort aanvragen <Arrow /></Link></div><div><h4>Comfort Plus</h4><p>Materiaal binnen de onderhoudsmantel inbegrepen.</p><Link href="/onderhoud#abonnementen">Bekijk de voorwaarden <Arrow /></Link></div></div><Link className="ps-textlink" href="/eenmalig-onderhoud-aanvragen">Liever eenmalig onderhoud <Arrow /></Link></article>
            <article id="ps-merken"><Index number="03">Merken & vermogen</Index><h3>Past uw ketel bij onze service?</h3><p>Wij onderhouden Intergas, Remeha, Nefit en Vaillant, tot en met <strong>40 kW</strong>. Voor woningen en vergelijkbare kleinschalige panden.</p><div className="ps-brands" aria-label="Merken voor onderhoud"><span>Intergas</span><span>Remeha</span><span>Nefit</span><span>Vaillant</span></div><p className="ps-small">Collectieve ketelhuizen, cascadeopstellingen en grote bedrijfsinstallaties vallen buiten onze werkzaamheden. Vermeld bij uw aanvraag het merk, model en vermogen, als dat bekend is. Het afgebeelde toestel is van Vaillant.</p></article>
          </div>
        </div>
      </section>
      <section className="ps-closing"><Index number="Rob Braam">Advies · installatie · onderhoud</Index><h2>Een goed begin?<br /><em>Even overleggen.</em></h2><p>Vertel ons welk toestel u heeft en waar u hulp bij zoekt.<br />Dan kijkt iemand uit ons team met u mee.</p><div className="ps-actions"><Link className="ps-button" href="/offerte-aanvragen?dienst=cv-ketel">Bespreek uw cv-ketel <Arrow /></Link><a className="ps-textlink" href="tel:+31736222199">073 622 2199 <Arrow /></a></div><div className="ps-contact"><a href="mailto:service@robbraam.com">service@robbraam.com</a><a href="mailto:planning@robbraam.com">planning@robbraam.com · onderhoud</a></div></section>
    </main><SiteFooter />
  </>;
}
