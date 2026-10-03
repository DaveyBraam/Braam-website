import Link from "next/link";
import Image from "next/image";

/* The copy of the earlier live page (app/warmtepompen-test/WarmtepompContent.tsx),
   set as a calm, light page below the scroll journey. */
const brands = [["LG", "THERMA V R290 Monobloc", "/brand/lg-logo.svg", "https://www.lg.com/nl/warmtepomp/therma-v-r290-monobloc/"], ["Bosch", "Compress 5800i AW", "/brand/bosch-logo.png", "https://www.nefit-bosch.nl/ocs/compress-5800i-aw-21076799-p/"], ["Vaillant", "aroTHERM plus", "/brand/vaillant-logo.svg", "https://www.vaillant.nl/producten/arothermplus/"]];
const answers = [
  ["Ook met radiatoren?", "Dat kan. De capaciteit en benodigde watertemperatuur moeten passen bij uw woning."],
  ["Ook bij vorst?", "Ja. Vermogen en rendement veranderen met de buitentemperatuur; de opstelling moet daarop passen."],
  ["En het geluid?", "We bespreken de buitenplek, trillingen en geluid richting buren. Ook vrije luchtstroming en onderhoudsruimte tellen mee."],
  ["Ook koelen?", "Met een geschikt systeem en passende warmteafgifte. Bij vloerkoeling moet condensatie worden voorkomen; gewone radiatoren zijn doorgaans niet geschikt."],
];

export function Content() {
  return <div className="w5-content" id="w5-inhoud">
    <section className="w5-benefits" aria-labelledby="w5-benefits-title">
      <h2 id="w5-benefits-title">Minder gas gebruiken.<br /><em>Vooruit met uw woning.</em></h2>
      <div className="w5-benefit-list">
        <article><h3>Minder afhankelijk van gas</h3><p>Laat de warmtepomp uw woning verwarmen. Hybride met uw ketel als aanvulling, of volledig elektrisch voor verwarming én warm water.</p></article>
        <article><h3>Comfort dat bij u past</h3><p>Een warm huis begint bij een passende installatie. Wij stemmen het systeem af op uw woning, verwarming en warmwatergebruik.</p></article>
        <article><h3>Nu hybride. Later volledig elektrisch.</h3><p>U hoeft niet alles tegelijk te veranderen. De hybride opstelling die wij plaatsen kan later worden omgebouwd naar volledig elektrisch.</p></article>
      </div>
      <div className="w5-benefit-next"><p>Wat het financieel oplevert, hangt af van uw gas- en stroomverbruik, energietarieven en investering. Dat nemen we mee in ons advies.</p><Link className="w5-link" href="/offerte-aanvragen?dienst=warmtepomp">Vraag advies voor uw woning <span aria-hidden="true">↗</span></Link></div>
    </section>

    <section className="w5-installations" aria-labelledby="w5-installations-title">
      <div className="w5-installations-heading"><h2 id="w5-installations-title">Bij onze klanten.<br /><em>Door ons geïnstalleerd.</em></h2><p>Hybride en volledig elektrisch, geplaatst door ons eigen team.</p><Link className="w5-link" href="/projecten">Meer van ons werk <span aria-hidden="true">↗</span></Link></div>
      <figure className="w5-photo w5-photo-a"><Image unoptimized src="/projects/installaties/installatie-04.webp" alt="Door Rob Braam geïnstalleerde hybride binnenopstelling met cv-ketel, warmtepompregeling, vat en leidingwerk" width="960" height="1280" loading="lazy" /><figcaption><h3>Hybride</h3><p>Warmtepomp en cv-ketel werken samen. De ketel blijft onderdeel van de installatie.</p></figcaption></figure>
      <figure className="w5-photo w5-photo-b"><Image unoptimized src="/projects/installaties/installatie-05.webp" alt="Door Rob Braam geïnstalleerde volledig elektrische binnenopstelling met LG-binnenunit, boilervat, buffervat en leidingwerk" width="960" height="1280" loading="lazy" /><figcaption><h3>Volledig elektrisch</h3><p>De warmtepomp verzorgt verwarming en warm water, met een apart boilervat en buffervat.</p></figcaption></figure>
    </section>

    <section className="w5-quote" id="wp-offerte" aria-labelledby="w5-quote-title">
      <div className="w5-quote-intro"><h2 id="w5-quote-title">Uw informatie.<br /><em>Ons advies.</em></h2><p>Vertel ons wat u weet. Wij bespreken of de opstelling past en de overstap rendabel kan zijn.</p></div>
      <dl className="w5-signals">
        <div><dt>Gasverbruik</dt><dd>Uw jaarverbruik geeft inzicht in uw huidige gebruik.</dd></div>
        <div><dt>Verwarming</dt><dd>Welke ketel, radiatoren of vloerverwarming heeft u?</dd></div>
        <div><dt>Isolatie</dt><dd>Wat weet u over dak, vloer, muren en glas?</dd></div>
      </dl>
      <p className="w5-quote-followup">Ook warmwatergebruik, ruimte, leidingen en elektra tellen mee. Gegevens vragen we bij u na; we meten uw woning hiervoor niet na. Foto’s kunt u meesturen naar <a href="mailto:service@robbraam.com">service@robbraam.com</a>.</p>
    </section>

    <section className="w5-process" aria-labelledby="w5-process-title">
      <div className="w5-process-intro"><h2 id="w5-process-title">Uw warmtepomp.<br /><em>Onze verantwoordelijkheid.</em></h2><p>Van het eerste advies tot de service jaren later: u heeft één aanspreekpunt. Ons eigen team voert het werk uit, zonder onderaannemers.</p></div>
      <ol className="w5-steps">
        <li><h3>Passend advies</h3><p>U krijgt advies over een passende opstelling en of overstappen zinvol is.</p></li>
        <li><h3>Een compleet voorstel</h3><p>U ziet welke toestellen en aanpassingen nodig zijn, inclusief aansluitingen en elektrawerk.</p></li>
        <li><h3>Installatie en uitleg</h3><p>Ons eigen team plaatst de installatie, stelt haar af en laat u zien hoe u de temperatuur regelt.</p></li>
        <li><h3>Onderhoud en service</h3><p>Ook daarna belt u ons. Wij onderhouden en verhelpen storingen aan de installatie die we zelf hebben geplaatst.</p></li>
      </ol>
    </section>

    <section className="w5-care" id="ws-onderhoud" aria-labelledby="w5-care-title">
      <div className="w5-care-intro"><h2 id="w5-care-title">Wij plaatsen het.<br /><em>Wij onderhouden het.</em></h2><p>Eén vertrouwd aanspreekpunt voor onderhoud en service. Met een abonnement krijgt uw installatie jaarlijks een controle.</p><p className="w5-fine">Levensduur hangt af van toestel, gebruik en onderhoud. Garantie en serviceafspraken staan in uw voorstel.</p></div>
      <div className="w5-care-plans"><p className="w5-care-kind">Comfort · jaarlijks onderhoud</p>
        <Link className="w5-plan" href="/abonnement-aanvragen?abonnement=hybride-comfort"><h3>Hybride</h3><span className="w5-plan-from">vanaf</span><strong><small>€</small> 24,08</strong><span className="w5-plan-period">per maand · € 289 per jaar</span><span className="w5-plan-link">Bekijk abonnement <span aria-hidden="true">↗</span></span></Link>
        <Link className="w5-plan" href="/abonnement-aanvragen?abonnement=all-electric-comfort"><h3>Volledig elektrisch</h3><span className="w5-plan-from">vanaf</span><strong><small>€</small> 19,92</strong><span className="w5-plan-period">per maand · € 239 per jaar</span><span className="w5-plan-link">Bekijk abonnement <span aria-hidden="true">↗</span></span></Link>
        <p className="w5-care-terms">24/7 storingsservice, arbeid en voorrijkosten binnen de abonnementsafspraken. Materialen worden bij Comfort apart berekend. <Link href="/onderhoud">Alle voorwaarden</Link>.</p>
      </div>
    </section>

    <section className="w5-brands" aria-labelledby="w5-brands-title">
      <div className="w5-brands-heading"><h2 id="w5-brands-title">Gekozen om te blijven.</h2><p>We kiezen op kwaliteit en levensduur. Want het toestel dat we adviseren, onderhouden we later zelf. Uw woning en opstelling bepalen welk merk past.</p></div>
      <ul className="w5-brand-list" aria-label="Gelijkwaardige warmtepompmerken">{brands.map(([brand, model, logo, url]) => <li key={brand}><span className="w5-brand-logo"><Image unoptimized src={logo} alt={brand} width="180" height="72" loading="lazy" /></span><strong>{model}</strong><a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Bekijk ${model} bij ${brand} (opent in nieuw tabblad)`}>Bekijk bij {brand} <span aria-hidden="true">↗</span></a></li>)}</ul>
    </section>

    <section className="w5-answers" aria-labelledby="w5-answers-title"><h2 id="w5-answers-title">Goed om te weten.</h2><div className="w5-answer-list">{answers.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</div></section>

    <section className="w5-closing" aria-labelledby="w5-closing-title">
      <h2 id="w5-closing-title">Past een warmtepomp bij u?</h2>
      <div>
        <p>Vertel ons over uw woning. Wij denken met u mee, van eerste advies tot jarenlang onderhoud.</p>
        <div className="w5-actions"><Link className="w5-button" href="/offerte-aanvragen?dienst=warmtepomp">Bespreek uw woning ↗</Link><a className="w5-phone" href="tel:+31736222199">073 622 2199</a></div>
        <p className="w5-contact"><a href="mailto:service@robbraam.com">service@robbraam.com</a><a href="mailto:planning@robbraam.com">planning@robbraam.com · onderhoud</a></p>
      </div>
    </section>
  </div>;
}
