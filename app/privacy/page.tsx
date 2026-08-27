import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Privacyverklaring | Rob Braam",
  description:
    "Lees hoe Service & Montagebedrijf Rob Braam persoonsgegevens gebruikt, beveiligt en bewaart.",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="privacy-page">
        <section className="privacy-hero">
          <div className="shell">
            <div className="breadcrumb breadcrumb-dark">
              <Link href="/">Home</Link><span>/</span><strong>Privacyverklaring</strong>
            </div>
            <div className="privacy-hero-grid">
              <div>
                <p className="eyebrow eyebrow-light"><span /> Helder over uw gegevens</p>
                <h1>Privacy zonder<br /><em>kleine lettertjes.</em></h1>
                <p>We gebruiken alleen de gegevens die nodig zijn om uw vraag, aanvraag of opdracht goed af te handelen. Op deze pagina leest u welke gegevens dat zijn en welke keuzes en rechten u heeft.</p>
              </div>
              <aside className="privacy-hero-card" aria-label="Privacy in het kort">
                <span className="privacy-card-label">In het kort</span>
                <ul>
                  <li><i>01</i><span>We verkopen uw persoonsgegevens niet.</span></li>
                  <li><i>02</i><span>Een aanvraag zonder opdracht verwijderen we zodra die volledig is afgehandeld.</span></li>
                  <li><i>03</i><span>U kunt altijd vragen welke gegevens we van u hebben.</span></li>
                </ul>
                <a href="mailto:service@robbraam.com?subject=Privacyvraag">Privacyvraag stellen <span aria-hidden="true">↗</span></a>
              </aside>
            </div>
          </div>
        </section>

        <section className="privacy-content-section">
          <div className="shell privacy-layout">
            <aside className="privacy-index" aria-label="Inhoud privacyverklaring">
              <span>Privacyverklaring</span>
              <nav>
                <a href="#wie-zijn-wij">Wie zijn wij?</a>
                <a href="#gegevens">Welke gegevens?</a>
                <a href="#doelen">Waarom gebruiken we ze?</a>
                <a href="#delen">Met wie delen we ze?</a>
                <a href="#bewaren">Hoe lang bewaren we ze?</a>
                <a href="#cookies">Cookies en website</a>
                <a href="#rechten">Uw rechten</a>
              </nav>
              <small>Laatst bijgewerkt<br /><strong>11 augustus 2026</strong></small>
            </aside>

            <article className="privacy-article">
              <div className="privacy-intro">
                <p>Deze privacyverklaring geldt voor de website en formulieren van Braam en voor contact met ons via e-mail, telefoon of op locatie.</p>
              </div>

              <section id="wie-zijn-wij">
                <span className="legal-number">01</span>
                <h2>Wie is verantwoordelijk?</h2>
                <p>Service & Montagebedrijf Rob Braam is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in deze verklaring.</p>
                <div className="privacy-company-card">
                  <strong>Service & Montagebedrijf Rob Braam</strong>
                  <span>Jacob van Wassenaerstraat 10</span>
                  <span>5224 GG &apos;s-Hertogenbosch</span>
                  <span>KvK 17122994 · Btw-id NL813301579B01</span>
                  <a href="mailto:service@robbraam.com">service@robbraam.com</a>
                  <a href="tel:+31736222199">073 622 2199</a>
                </div>
              </section>

              <section id="gegevens">
                <span className="legal-number">02</span>
                <h2>Welke gegevens verwerken we?</h2>
                <p>Welke gegevens we verwerken hangt af van uw contact met ons. Het kan gaan om:</p>
                <ul>
                  <li>naam, adres, woonplaats, e-mailadres en telefoonnummer;</li>
                  <li>uw vraag, bericht, afspraak, offerte- of serviceaanvraag;</li>
                  <li>gegevens over uw woning of installatie, zoals merk, type, bouwjaar, aantal installaties en door u meegestuurde foto&apos;s;</li>
                  <li>de gekozen onderhouds- of abonnementsvorm;</li>
                  <li>offertes, overeenkomsten, werkbonnen, onderhouds- en servicehistorie, facturen en betalingsgegevens;</li>
                  <li>technische gegevens die nodig zijn om de website veilig en goed te laten werken, zoals IP-adres, apparaat- en browsergegevens en technische loggegevens.</li>
                </ul>
                <p>We vragen u geen bijzondere persoonsgegevens in een vrij tekstveld of bijlage te zetten, tenzij dat voor uw vraag echt noodzakelijk is.</p>
              </section>

              <section id="doelen">
                <span className="legal-number">03</span>
                <h2>Waarom gebruiken we uw gegevens?</h2>
                <p>We gebruiken persoonsgegevens alleen voor de volgende doelen en op een passende AVG-grondslag:</p>
                <div className="privacy-purpose-grid">
                  <div><strong>Vraag of aanvraag</strong><p>Om uw bericht te beantwoorden, een afspraak of offerte voor te bereiden en uw onderhouds- of abonnementsaanvraag te beoordelen. Dit is nodig om op uw verzoek stappen te zetten vóór een eventuele overeenkomst.</p></div>
                  <div><strong>Opdracht en service</strong><p>Om werkzaamheden, onderhoud, garantie en service uit te voeren en hierover met u te communiceren.</p></div>
                  <div><strong>Administratie</strong><p>Om offertes, opdrachten, facturen en betalingen te verwerken en aan onze wettelijke administratieplicht te voldoen.</p></div>
                  <div><strong>Veilige bedrijfsvoering</strong><p>Om de website en onze systemen te beveiligen, misbruik te voorkomen en noodzakelijke bedrijfsinformatie te beheren. Dit doen we op basis van ons gerechtvaardigd belang.</p></div>
                </div>
                <p>Als we voor een ander, optioneel doel toestemming nodig hebben, vragen we die apart. U kunt zo&apos;n toestemming altijd weer intrekken.</p>
              </section>

              <section id="delen">
                <span className="legal-number">04</span>
                <h2>Met wie delen we gegevens?</h2>
                <p>We delen persoonsgegevens niet voor handels- of advertentiedoeleinden en verkopen ze niet. Alleen medewerkers die de gegevens voor hun werk nodig hebben, krijgen toegang.</p>
                <p>Voor de uitvoering kunnen dienstverleners gegevens verwerken, bijvoorbeeld voor websitehosting en beveiliging, e-mail en IT, administratie en boekhouding. Ook kunnen we gegevens verstrekken als een wettelijke verplichting dat vereist.</p>
                <div className="privacy-provider-note">
                  <strong>Over de aanvraagformulieren</strong>
                  <p>Het offerteformulier en terugbelverzoeken over nieuw werk, storingen of technische vragen worden via FormSubmit doorgestuurd naar <a href="mailto:service@robbraam.com">service@robbraam.com</a>. Kiest u in het offerteformulier of terugbelformulier voor onderhoud, of gebruikt u het abonnementsformulier of het formulier voor een eenmalige onderhoudsbeurt, dan wordt de aanvraag doorgestuurd naar <a href="mailto:planning@robbraam.com">planning@robbraam.com</a>. FormSubmit verwerkt de ingevulde gegevens om het bericht per e-mail bij ons af te leveren. Lees ook de <a href="https://formsubmit.co/privacy.pdf" target="_blank" rel="noreferrer">privacyinformatie van FormSubmit <span aria-hidden="true">↗</span></a>.</p>
                </div>
                <p>Wanneer een technische dienstverlener gegevens buiten de Europese Economische Ruimte verwerkt, mag dat alleen met een geldige wettelijke basis en passende waarborgen volgens de AVG.</p>
              </section>

              <section id="bewaren">
                <span className="legal-number">05</span>
                <h2>Hoe lang bewaren we gegevens?</h2>
                <ul>
                  <li><strong>Aanvraag zonder opdracht:</strong> alleen totdat de aanvraag volledig is afgehandeld. Daarna verwijderen we de aanvraag.</li>
                  <li><strong>Klant-, project- en servicegegevens:</strong> zolang dat nodig is voor de opdracht, servicehistorie, garantie of het behandelen van een mogelijke aanspraak.</li>
                  <li><strong>Administratie en facturen:</strong> in beginsel zeven jaar vanwege de fiscale bewaarplicht. Voor bepaalde gegevens en facturen over onroerende zaken kan een termijn van tien jaar gelden.</li>
                  <li><strong>Technische beveiligingsgegevens:</strong> niet langer dan nodig voor het functioneren en beveiligen van de website en systemen.</li>
                </ul>
                <p>Als gegevens voor meerdere doelen nodig zijn, geldt de langste noodzakelijke of wettelijk verplichte termijn.</p>
              </section>

              <section id="cookies">
                <span className="legal-number">06</span>
                <h2>Cookies en websitegebruik</h2>
                <p>Op dit moment gebruiken we geen marketingcookies, advertentiepixels of bezoekersprofielen. De website kan wel strikt noodzakelijke technische middelen gebruiken om pagina&apos;s veilig te laden en formulieren te laten werken.</p>
                <p>Voegen we later bijvoorbeeld bezoekersstatistieken of marketingtechniek toe, dan passen we deze verklaring aan en vragen we vooraf toestemming wanneer dat wettelijk nodig is.</p>
              </section>

              <section id="beveiliging">
                <span className="legal-number">07</span>
                <h2>Hoe beveiligen we uw gegevens?</h2>
                <p>We nemen passende technische en organisatorische maatregelen om persoonsgegevens te beschermen tegen verlies, onbevoegde toegang, misbruik of ongewenste wijziging. Toegang is beperkt tot de mensen en dienstverleners die de gegevens nodig hebben.</p>
                <p>Denkt u dat persoonsgegevens toch niet goed zijn beveiligd? Meld dit dan zo snel mogelijk via <a href="mailto:service@robbraam.com?subject=Melding%20beveiliging%20persoonsgegevens">service@robbraam.com</a>.</p>
              </section>

              <section id="rechten">
                <span className="legal-number">08</span>
                <h2>Welke rechten heeft u?</h2>
                <p>U kunt ons vragen om:</p>
                <ul>
                  <li>inzage in de persoonsgegevens die we van u verwerken;</li>
                  <li>onjuiste gegevens te corrigeren of aan te vullen;</li>
                  <li>gegevens te verwijderen of de verwerking te beperken, voor zover de wet dat toelaat;</li>
                  <li>bezwaar te maken tegen verwerking op basis van een gerechtvaardigd belang;</li>
                  <li>uw gegevens over te dragen wanneer het recht op dataportabiliteit geldt;</li>
                  <li>een eerder gegeven toestemming in te trekken.</li>
                </ul>
                <p>Stuur uw verzoek of klacht naar <a href="mailto:service@robbraam.com?subject=Privacyverzoek">service@robbraam.com</a>. Om te voorkomen dat gegevens bij de verkeerde persoon terechtkomen, kunnen we u vragen uw identiteit op een passende manier te bevestigen. We reageren in beginsel binnen één maand.</p>
                <p>Komt u er met ons niet uit, dan kunt u een klacht indienen bij de <a href="https://www.autoriteitpersoonsgegevens.nl/een-tip-of-klacht-indienen-bij-de-ap" target="_blank" rel="noreferrer">Autoriteit Persoonsgegevens <span aria-hidden="true">↗</span></a>.</p>
              </section>

              <section id="besluitvorming">
                <span className="legal-number">09</span>
                <h2>Geen automatische besluiten</h2>
                <p>We nemen geen besluiten met belangrijke gevolgen voor u die uitsluitend door een computer worden genomen. Een offerte, opdracht of abonnementsaanvraag wordt door een medewerker van Braam beoordeeld.</p>
              </section>

              <section id="wijzigingen">
                <span className="legal-number">10</span>
                <h2>Wijzigingen</h2>
                <p>Onze werkwijze of de website kan veranderen. Daarom kunnen we deze privacyverklaring aanpassen. De meest recente versie staat altijd op deze pagina met de datum van de laatste wijziging.</p>
              </section>

              <div className="privacy-contact-block">
                <div><span>Privacy, juridische berichten en klachten</span><strong>We helpen u graag rechtstreeks.</strong></div>
                <a className="button button-primary" href="mailto:service@robbraam.com?subject=Privacyvraag">Mail service@robbraam.com <span aria-hidden="true">↗</span></a>
              </div>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
