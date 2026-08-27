import Link from "next/link";
import { CinematicHero } from "./components/CinematicHero";
import { ContactCTA } from "./components/ContactCTA";
import { MobileActionBar } from "./components/MobileActionBar";
import { ProjectGallery } from "./components/ProjectGallery";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { services } from "./data";

const homeSubscriptionBenefits = [
  "Ieder jaar een geplande controle van uw installatie",
  "24/7 storingsservice",
  "Voorrijkosten en arbeidsloon inbegrepen binnen de abonnementsafspraken",
  "Comfort: materiaal apart. Comfort Plus: materiaal binnen de onderhoudsmantel inbegrepen",
  "Jaarlijks of per maand betalen",
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <CinematicHero />

        <div className="service-ticker" aria-label="Warmtepompen, cv-ketels, airconditioning, elektra, onderhoud en service">
          <div className="ticker-track" aria-hidden="true">
            {[0, 1].map((copy) => <span className="ticker-set" key={copy}><b>Warmtepompen</b><i>•</i><b>Cv-ketels</b><i>•</i><b>Airconditioning</b><i>•</i><b>Elektra</b><i>•</i><b>Onderhoud</b><i>•</i><b>Service</b><i>•</i></span>)}
          </div>
        </div>

        <section className="section services-section reveal" id="diensten">
          <div className="shell">
            <div className="section-heading split-heading">
              <div><p className="eyebrow"><span /> Waar kunnen we mee helpen?</p><h2>Van eerste advies<br />tot onderhoud daarna.</h2></div>
              <p>U hoeft niet voor ieder onderdeel een ander bedrijf te zoeken. Ons eigen team verzorgt verwarming, koeling, elektra en het onderhoud daarna.</p>
            </div>
            <div className="service-grid">
              {services.map((service) => (
                <article className="service-card" key={service.title}>
                  <div className="service-number">{service.number}</div>
                  <div><span className="service-tag">{service.tag}</span><h3>{service.title}</h3><p>{service.text}</p><Link href={service.href}>Bekijk {service.title.toLowerCase()} <span aria-hidden="true">→</span></Link></div>
                </article>
              ))}
            </div>
            <div className="service-band">
              <div><span className="band-label">Onderhoud & service</span><h3>Onderhoud en service door ons eigen team.</h3></div>
              <p>Ons meeste onderhoud doen we in &apos;s-Hertogenbosch en omgeving. Vanuit die basis zijn we ook actief op steeds meer adressen in Noord-Brabant en aangrenzende delen van Gelderland.</p>
              <div className="band-links"><Link className="button button-light" href="/onderhoud">Bekijk onderhoud</Link><Link href="/service">Servicevraag <span aria-hidden="true">→</span></Link><Link href="/onderhoud#verhuurders">Meerdere panden? <span aria-hidden="true">→</span></Link></div>
            </div>
          </div>
        </section>

        <section className="home-proof reveal">
          <div className="shell proof-grid">
            <div><strong>1.900</strong><span>vaste onderhoudscontracten<br />door Braam beheerd</span></div>
            <div><strong>Eigen team</strong><span>voor installatie,<br />elektra en service</span></div>
            <div><strong>CO-VRIJ</strong><span>gecertificeerd bedrijf<br />en vakbekwame monteurs</span></div>
            <div><strong>Vaste gezichten</strong><span>persoonlijk contact voor én<br />na de oplevering</span></div>
          </div>
        </section>

        <section className="section home-subscriptions reveal">
          <div className="shell">
            <div className="section-heading split-heading"><div><p className="eyebrow"><span /> 1.900 vaste onderhoudscontracten</p><h2>Onderhoud geregeld<br />vanaf een maandbedrag.</h2></div><p>Bekijk eerst welk toestel u heeft. Daarna vergelijkt u Comfort en Comfort Plus. De maandprijs staat voorop, de jaarprijs blijft duidelijk zichtbaar voordat u aanvraagt.</p></div>
            <div className="subscription-proof-strip"><span aria-hidden="true">✓</span><p><strong>Jaarlijks door Braam ingepland.</strong> Een abonnement is een doorlopend servicepakket met jaarlijkse controle en afgesproken service bij storingen, niet een losse betaling per bezoek.</p><Link href="/onderhoud#abonnementen">Lees hoe het abonnement werkt →</Link></div>
            <div className="home-price-row">
              <Link href="/onderhoud">
                <span>Cv-ketel</span>
                <p className="home-plan-description">Kies Comfort of Comfort Plus voor jaarlijks onderhoud aan uw cv-ketel.</p>
                <strong><small>€</small>11,58</strong><em>Comfort vanaf, per maand</em>
                <p className="home-annual-price">Jaarprijs € 139 · ook jaarlijks betalen mogelijk</p>
                <p className="home-monthly-price">Comfort Plus: € 19,92 per maand</p>
                <ul className="home-plan-benefits">{homeSubscriptionBenefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
                <b>Vergelijk cv-ketelabonnementen →</b>
              </Link>
              <Link className="featured" href="/onderhoud">
                <span>Hybride warmtepomp + cv-ketel</span>
                <p className="home-plan-description">Kies Comfort of Comfort Plus voor beide toestellen.</p>
                <strong><small>€</small>24,08</strong><em>Comfort vanaf, per maand</em>
                <p className="home-annual-price">Jaarprijs € 289 · ook jaarlijks betalen mogelijk</p>
                <p className="home-monthly-price">Comfort Plus: € 35,75 per maand</p>
                <ul className="home-plan-benefits">{homeSubscriptionBenefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
                <b>Vergelijk hybride abonnementen →</b>
              </Link>
              <Link href="/onderhoud">
                <span>All-electric warmtepomp</span>
                <p className="home-plan-description">Kies Comfort of Comfort Plus voor uw warmtepomp zonder cv-ketel.</p>
                <strong><small>€</small>19,92</strong><em>Comfort vanaf, per maand</em>
                <p className="home-annual-price">Jaarprijs € 239 · ook jaarlijks betalen mogelijk</p>
                <p className="home-monthly-price">Comfort Plus: € 31,58 per maand</p>
                <ul className="home-plan-benefits">{homeSubscriptionBenefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
                <b>Vergelijk warmtepompabonnementen →</b>
              </Link>
            </div>
            <div className="ventilation-strip"><span aria-hidden="true">+</span><p><small>Extra bij het ketel- of combinatieabonnement</small><strong>Mechanische ventilatiebox mee laten schoonmaken?</strong> Voor € 37,50 extra per jaar nemen we deze mee tijdens het geplande onderhoud.</p><Link href="/onderhoud">Bekijk de abonnementen →</Link></div>
          </div>
        </section>

        <section className="projects-section reveal">
          <div className="shell">
            <div className="projects-heading"><div><p className="eyebrow"><span /> Zo werken wij</p><h2>Echt installatiewerk<br />bij klanten in de regio.</h2></div><div><p>Geen stockbeelden, maar foto&apos;s van ons eigen werk. U ziet zowel geplaatste installaties als het vakwerk tijdens montage en inregeling.</p><Link className="text-link" href="/projecten">Bekijk alle praktijkfoto&apos;s <span aria-hidden="true">→</span></Link></div></div>
            <ProjectGallery />
          </div>
        </section>

        <section className="certificate-summary reveal">
          <div className="shell certificate-summary-grid">
            <div className="mini-shield" aria-hidden="true"><span>CO</span><small>VRIJ</small></div>
            <div><p className="eyebrow eyebrow-light"><span /> De Gasketelwet</p><h2>Aan een cv-ketel<br />mag niet iedereen werken.</h2></div>
            <div><p>Sinds 1 april 2023 moet het bedrijf gecertificeerd zijn en moet de monteur aantoonbaar vakbekwaam zijn. Bij Braam zijn beide op orde. Op de cv-ketelpagina leggen we uit waar u als klant op kunt letten.</p><Link className="certificate-link" href="/cv-ketels">Zo herkent u veilig werk <span aria-hidden="true">→</span></Link></div>
          </div>
        </section>

        <section className="reviews-section reveal">
          <div className="shell reviews-grid">
            <div className="reviews-intro"><p className="eyebrow"><span /> Ervaringen van klanten</p><h2>Klanten die ons werk<br />al jaren kennen.</h2><p>Wij willen groeien door goed werk te leveren en bereikbaar te blijven. De ervaring van bestaande klanten zegt daarom meer dan een grote verkooppraat.</p><Link className="text-link" href="/projecten">Bekijk meer werk en ervaringen <span aria-hidden="true">→</span></Link></div>
            <div className="review-stack"><blockquote><span className="quote-mark" aria-hidden="true">“</span><p>Vakkundig en met mooi strakke leiding gemonteerd.</p><div className="review-author"><strong>Kemme</strong><small>Warmtepomp & airco</small></div></blockquote><blockquote><span className="quote-mark" aria-hidden="true">“</span><p>Al toch 20 jaar zeer tevreden klant.</p><div className="review-author"><strong>Han Engels</strong><small>Onderhoud & service</small></div></blockquote></div>
          </div>
        </section>

        <section className="region-section reveal">
          <div className="shell region-grid">
            <div className="region-map" aria-hidden="true"><div className="map-ring ring-a" /><div className="map-ring ring-b" /><div className="map-pin pin-one"><i /><span>&apos;s-Hertogenbosch</span></div><div className="map-pin pin-two"><i /><span>Rosmalen</span></div><div className="map-pin pin-three"><i /><span>Vught</span></div><div className="map-pin pin-four"><i /><span>Hedel</span></div></div>
            <div className="region-copy"><p className="eyebrow"><span /> Werkgebied</p><h2>Vanuit &apos;s-Hertogenbosch<br />actief in een brede regio.</h2><p>Het grootste deel van ons onderhoud doen we in &apos;s-Hertogenbosch en de directe omgeving. Daarnaast werken we op veel adressen in Noord-Brabant en in aangrenzende delen van Gelderland. Plaatsnamen zijn daarom geen harde grens: geef uw postcode en het soort werkzaamheden door, dan laten we weten wat op uw adres mogelijk is.</p><Link className="text-link" href="/contact">Vraag naar uw postcode <span aria-hidden="true">→</span></Link></div>
          </div>
        </section>

        <ContactCTA title="Een vraag over uw woning of installatie?" text="Bel ons gerust of stuur een aanvraag. We luisteren eerst naar uw situatie en vertellen daarna eerlijk wat we voor u kunnen doen." primaryLabel="Vraag advies of een offerte aan" primaryHref="/offerte-aanvragen" />
      </main>
      <MobileActionBar href="/offerte-aanvragen" label="Offerte aanvragen" />
      <SiteFooter />
    </>
  );
}
