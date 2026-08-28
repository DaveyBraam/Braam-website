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

        {/* Three visitors arrive here with different urgency: a failed boiler, a
            purchase being considered, and maintenance to arrange. Each states the
            situation in the visitor's own words and offers one action. */}
        <section className="routes" aria-label="Waarvoor komt u?">
          <div className="shell routes-grid">
            <a className="route route-urgent" href="tel:+31736222199">
              <h2>Mijn verwarming doet het niet</h2>
              <p>Bel ons, dan weet u meteen waar u aan toe bent.</p>
              <strong>073 622 2199</strong>
            </a>

            <Link className="route" href="/offerte-aanvragen">
              <h2>Ik denk aan een warmtepomp of nieuwe ketel</h2>
              <p>Vertel wat u heeft en wat u wilt. U hoort wat er mogelijk is en wat het kost.</p>
              <strong>Offerte aanvragen<span aria-hidden="true">→</span></strong>
            </Link>

            <Link className="route" href="/onderhoud">
              <h2>Ik wil onderhoud regelen</h2>
              <p>Eenmalig of met een abonnement, vanaf €&nbsp;139 per jaar.</p>
              <strong>Bekijk onderhoud<span aria-hidden="true">→</span></strong>
            </Link>
          </div>
        </section>

        <section className="section services-section reveal" id="diensten">
          <div className="shell">
            <div className="section-heading split-heading">
              <div><h2>Van eerste advies<br />tot onderhoud daarna.</h2></div>
              <p>U hoeft niet voor ieder onderdeel een ander bedrijf te zoeken. Ons eigen team verzorgt verwarming, koeling, elektra en het onderhoud daarna.</p>
            </div>
            <div className="service-grid">
              {services.map((service) => (
                <article className="service-card" key={service.title}>
                  <div><span className="service-tag">{service.tag}</span><h3>{service.title}</h3><p>{service.text}</p><Link href={service.href}>Bekijk {service.title.toLowerCase()} <span aria-hidden="true">→</span></Link></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="certificate-summary reveal">
          <div className="shell certificate-summary-grid">
            <div className="mini-shield" aria-hidden="true"><span>CO</span><small>VRIJ</small></div>
            <div><h2>Aan een cv-ketel<br />mag niet iedereen werken.</h2></div>
            <div><p>Sinds 1 april 2023 moet het bedrijf gecertificeerd zijn en moet de monteur aantoonbaar vakbekwaam zijn. Bij Braam zijn beide op orde. Op de cv-ketelpagina leggen we uit waar u als klant op kunt letten.</p><Link className="certificate-link" href="/cv-ketels">Zo herkent u veilig werk <span aria-hidden="true">→</span></Link></div>
          </div>
        </section>

        <section className="projects-section reveal">
          <div className="shell">
            <div className="projects-heading"><div><h2>Echt installatiewerk<br />bij klanten in de regio.</h2></div><div><p>Geen stockbeelden, maar foto&apos;s van ons eigen werk. U ziet zowel geplaatste installaties als het vakwerk tijdens montage en inregeling.</p><Link className="text-link" href="/projecten">Bekijk alle praktijkfoto&apos;s <span aria-hidden="true">→</span></Link></div></div>
            <ProjectGallery />
          </div>
        </section>

        <section className="people reveal">
          <div className="shell people-grid">
            <figure className="people-photo">
              <img src="/about/team-rob-braam.jpg" alt="Twee monteurs van Braam bij hun bedrijfsbussen" width="2560" height="1708" loading="lazy" decoding="async" />
            </figure>
            <div className="people-copy">
              <h2>Dit zijn de mensen<br />die bij u langskomen.</h2>
              <p>Geen onderaannemers en geen wisselende gezichten. Wie uw installatie plaatst, komt hem daarna ook onderhouden &mdash; en kent uw woning dus al voordat er iets misgaat.</p>
              <blockquote className="people-quote">
                <p>Al toch 20 jaar zeer tevreden klant.</p>
                <cite>Han Engels<span>Onderhoud &amp; service</span></cite>
              </blockquote>
              <Link className="text-link" href="/over-ons">Maak kennis met het team <span aria-hidden="true">&rarr;</span></Link>
            </div>
          </div>
        </section>

        <section className="section home-subscriptions reveal">
          <div className="shell">
            <div className="section-heading split-heading"><div><h2>Wat onderhoud kost,<br />leest u hier.</h2></div><p>U hoeft geen offerte aan te vragen om een prijs te weten. Kies uw toestel, vergelijk Comfort en Comfort Plus, en zie meteen wat u per maand of per jaar betaalt.</p></div>
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

        <section className="region-section reveal">
          <div className="shell region-grid">
            <div className="region-map" aria-hidden="true"><div className="map-ring ring-a" /><div className="map-ring ring-b" /><div className="map-pin pin-one"><i /><span>&apos;s-Hertogenbosch</span></div><div className="map-pin pin-two"><i /><span>Rosmalen</span></div><div className="map-pin pin-three"><i /><span>Vught</span></div><div className="map-pin pin-four"><i /><span>Hedel</span></div></div>
            <div className="region-copy"><h2>Vanuit &apos;s-Hertogenbosch<br />actief in een brede regio.</h2><p>Het grootste deel van ons onderhoud doen we in &apos;s-Hertogenbosch en de directe omgeving. Daarnaast werken we op veel adressen in Noord-Brabant en in aangrenzende delen van Gelderland. Plaatsnamen zijn daarom geen harde grens: geef uw postcode en het soort werkzaamheden door, dan laten we weten wat op uw adres mogelijk is.</p><Link className="text-link" href="/contact">Vraag naar uw postcode <span aria-hidden="true">→</span></Link></div>
          </div>
        </section>

        <ContactCTA title="Een vraag over uw woning of installatie?" text="Bel ons gerust of stuur een aanvraag. We luisteren eerst naar uw situatie en vertellen daarna eerlijk wat we voor u kunnen doen." primaryLabel="Vraag advies of een offerte aan" primaryHref="/offerte-aanvragen" />
      </main>
      <MobileActionBar href="/offerte-aanvragen" label="Offerte aanvragen" />
      <SiteFooter />
    </>
  );
}
