import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { reviewsApp } from "../site-config";
import "../leesstijl.css";

/* Privacyverklaring (oktober 2026): van het oude premium-sjabloon (labels van
   9px, links op 2,9:1) naar de lichte leesstijl van /contact en /service
   (app/leesstijl.css). De tekst zelf is niet veranderd. */

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description:
    "Lees hoe Service & Montagebedrijf Rob Braam persoonsgegevens gebruikt, beveiligt en bewaart.",
};

const inhoud = [
  ["wie-zijn-wij", "Wie zijn wij?"],
  ["gegevens", "Welke gegevens?"],
  ["doelen", "Waarom gebruiken we ze?"],
  ["delen", "Met wie delen we ze?"],
  ["bewaren", "Hoe lang bewaren we ze?"],
  ["reviews", "Reviews"],
  ["cookies", "Cookies en website"],
  ["beveiliging", "Beveiliging"],
  ["rechten", "Uw rechten"],
] as const;

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="ls">
        <section className="ls-kop" aria-labelledby="ls-titel">
          <div className="shell ls-kop-raster">
            <div>
              <p className="ls-kruimel"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Privacyverklaring</span></p>
              <h1 id="ls-titel">Privacy zonder kleine lettertjes.</h1>
              <p className="ls-lead">We gebruiken alleen de gegevens die nodig zijn om uw vraag, aanvraag of opdracht goed af te handelen. Op deze pagina leest u welke gegevens dat zijn en welke keuzes en rechten u heeft.</p>
            </div>
            <aside className="ls-index" aria-label="Privacy in het kort">
              <p className="ls-index-kop">In het kort</p>
              <ul className="ls-kort">
                <li>We verkopen uw persoonsgegevens niet.</li>
                <li>Een aanvraag zonder opdracht verwijderen we zodra die volledig is afgehandeld.</li>
                <li>U kunt altijd vragen welke gegevens we van u hebben.</li>
              </ul>
              <p><a href="mailto:service@robbraam.com?subject=Privacyvraag">Privacyvraag stellen</a></p>
            </aside>
          </div>
        </section>

        <section className="ls-blok ls-blok--tekst">
          <div className="shell ls-tekst-raster">
            <nav className="ls-zijnav" aria-label="Inhoud privacyverklaring">
              <p className="ls-index-kop">Inhoud</p>
              <ul>{inhoud.map(([id, titel]) => <li key={id}><a href={`#${id}`}>{titel}</a></li>)}</ul>
              <p className="ls-datum">Laatst bijgewerkt<br /><strong>16 oktober 2026</strong></p>
            </nav>

            <article className="ls-artikel">
              <p className="ls-artikel-intro">Deze privacyverklaring geldt voor de website en formulieren van Braam en voor contact met ons via e-mail, telefoon of op locatie.</p>

              <section id="wie-zijn-wij">
                <h2>Wie is verantwoordelijk?</h2>
                <p>Service & Montagebedrijf Rob Braam is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in deze verklaring.</p>
                <div className="ls-adres">
                  <strong>Service & Montagebedrijf Rob Braam</strong>
                  <span>Jacob van Wassenaerstraat 10</span>
                  <span>5224 GG &apos;s-Hertogenbosch</span>
                  <span>KvK 17122994 · Btw-id NL813301579B01</span>
                  <a href="mailto:service@robbraam.com">service@robbraam.com</a>
                  <a href="tel:+31736222199">073 622 2199</a>
                </div>
              </section>

              <section id="gegevens">
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
                <h2>Waarom gebruiken we uw gegevens?</h2>
                <p>We gebruiken persoonsgegevens alleen voor de volgende doelen en op een passende AVG-grondslag:</p>
                <div className="ls-doelen">
                  <div><strong>Vraag of aanvraag</strong><p>Om uw bericht te beantwoorden, een afspraak of offerte voor te bereiden en uw onderhouds- of abonnementsaanvraag te beoordelen. Dit is nodig om op uw verzoek stappen te zetten vóór een eventuele overeenkomst.</p></div>
                  <div><strong>Opdracht en service</strong><p>Om werkzaamheden, onderhoud, garantie en service uit te voeren en hierover met u te communiceren.</p></div>
                  <div><strong>Administratie</strong><p>Om offertes, opdrachten, facturen en betalingen te verwerken en aan onze wettelijke administratieplicht te voldoen.</p></div>
                  <div><strong>Veilige bedrijfsvoering</strong><p>Om de website en onze systemen te beveiligen, misbruik te voorkomen en noodzakelijke bedrijfsinformatie te beheren. Dit doen we op basis van ons gerechtvaardigd belang.</p></div>
                </div>
                <p>Als we voor een ander, optioneel doel toestemming nodig hebben, vragen we die apart. U kunt zo&apos;n toestemming altijd weer intrekken.</p>
              </section>

              <section id="delen">
                <h2>Met wie delen we gegevens?</h2>
                <p>We delen persoonsgegevens niet voor handels- of advertentiedoeleinden en verkopen ze niet. Alleen medewerkers die de gegevens voor hun werk nodig hebben, krijgen toegang.</p>
                <p>Voor de uitvoering kunnen dienstverleners gegevens verwerken, bijvoorbeeld voor websitehosting en beveiliging, e-mail en IT, administratie en boekhouding. Ook kunnen we gegevens verstrekken als een wettelijke verplichting dat vereist.</p>
                <div className="ls-kader">
                  <strong>Over de aanvraagformulieren</strong>
                  <p>Wat u in een aanvraagformulier invult, verstuurt onze website rechtstreeks naar onze eigen zakelijke mailboxen bij Microsoft 365. Er zit geen andere doorstuurdienst tussen. Het offerteformulier en terugbelverzoeken over nieuw werk, storingen of technische vragen komen binnen bij <a href="mailto:service@robbraam.com">service@robbraam.com</a>. Kiest u in het offerteformulier of terugbelformulier voor onderhoud, of gebruikt u het abonnementsformulier of het formulier voor een eenmalige onderhoudsbeurt, dan komt de aanvraag binnen bij <a href="mailto:planning@robbraam.com">planning@robbraam.com</a>.</p>
                  <p>Heeft u een e-mailadres ingevuld, dan sturen we u vanuit dezelfde mailomgeving één bevestiging met een kopie van uw aanvraag. Microsoft verwerkt deze e-mail voor ons als verwerker, net als onze andere zakelijke e-mail. Onze website draait bij Cloudflare; het formulier gaat via die website naar Microsoft 365.</p>
                  <p>Om de formulieren tegen spam te beschermen gebruiken we Cloudflare Turnstile. Dat controleert bij het versturen of er een mens achter het formulier zit, zonder puzzel en zonder advertentiecookies. Lees ook de <a href="https://www.cloudflare.com/turnstile-privacy-policy/" target="_blank" rel="noreferrer">privacyinformatie van Turnstile <span aria-hidden="true">↗</span></a>.</p>
                </div>
                <p>Wanneer een technische dienstverlener gegevens buiten de Europese Economische Ruimte verwerkt, mag dat alleen met een geldige wettelijke basis en passende waarborgen volgens de AVG.</p>
              </section>

              <section id="bewaren">
                <h2>Hoe lang bewaren we gegevens?</h2>
                <ul>
                  <li><strong>Aanvraag zonder opdracht:</strong> alleen totdat de aanvraag volledig is afgehandeld. Daarna verwijderen we de aanvraag.</li>
                  <li><strong>Klant-, project- en servicegegevens:</strong> zolang dat nodig is voor de opdracht, servicehistorie, garantie of het behandelen van een mogelijke aanspraak.</li>
                  <li><strong>Administratie en facturen:</strong> in beginsel zeven jaar vanwege de fiscale bewaarplicht. Voor bepaalde gegevens en facturen over onroerende zaken kan een termijn van tien jaar gelden.</li>
                  <li><strong>Technische beveiligingsgegevens:</strong> niet langer dan nodig voor het functioneren en beveiligen van de website en systemen.</li>
                </ul>
                <p>Als gegevens voor meerdere doelen nodig zijn, geldt de langste noodzakelijke of wettelijk verplichte termijn.</p>
              </section>

              <section id="reviews">
                <h2>Reviews</h2>
                <p>Na een bezoek kunnen we u eenmalig per e-mail vragen hoe het ging. U kunt ook zonder uitnodiging uw ervaring delen via onze website. Daarvoor gebruiken we onze eigen reviewomgeving, die net als deze website bij Cloudflare draait. De uitnodiging versturen we via Microsoft 365.</p>
                <ul>
                  <li><strong>Bij een uitnodiging:</strong> uw voornaam en e-mailadres, en de postcode en het huisnummer van het bezoek. Die adresgegevens gebruiken we alleen intern, om uw beoordeling aan het juiste bezoek te koppelen. Uw e-mailadres gebruiken we alleen voor deze ene uitnodiging en wissen we na 45 dagen.</li>
                  <li><strong>Uw beoordeling:</strong> het aantal sterren, uw toelichting en uw antwoorden. Wat u ons per onderdeel of over een vervelende ervaring vertelt, lezen alleen wij.</li>
                  <li><strong>Als u om contact vraagt:</strong> uw telefoonnummer of e-mailadres, alleen daarvoor. We wissen die twee weken nadat uw vraag is afgehandeld, en uiterlijk na 90 dagen.</li>
                </ul>
                <p>Uw beoordeling komt alleen op onze website als u daar apart toestemming voor geeft en wij hem hebben nagekeken. Dan tonen we uw voornaam en woonplaats zoals u die zelf invult, of alleen uw woonplaats. Uw achternaam, adres en e-mailadres komen nooit op de website. We bewaren wanneer u toestemming gaf, zodat we dat kunnen laten zien.</p>
                <p>Met de persoonlijke link uit uw e-mail kunt u uw toestemming op elk moment intrekken; dan verdwijnt de beoordeling direct van de website. Via dezelfde link kunt u ook alles laten verwijderen. U kunt ons daarvoor ook bellen op <a href="tel:+31736222199">073 622 2199</a>. Meer leest u in de <a href={`${reviewsApp}/privacy`} target="_blank" rel="noreferrer">privacyuitleg bij de reviews <span aria-hidden="true">↗</span></a>.</p>
              </section>

              <section id="cookies">
                <h2>Cookies en websitegebruik</h2>
                <p>Op dit moment gebruiken we geen marketingcookies, advertentiepixels of bezoekersprofielen. De website kan wel strikt noodzakelijke technische middelen gebruiken om pagina&apos;s veilig te laden en formulieren te laten werken.</p>
                <p>Voegen we later bijvoorbeeld bezoekersstatistieken of marketingtechniek toe, dan passen we deze verklaring aan en vragen we vooraf toestemming wanneer dat wettelijk nodig is.</p>
              </section>

              <section id="beveiliging">
                <h2>Hoe beveiligen we uw gegevens?</h2>
                <p>We nemen passende technische en organisatorische maatregelen om persoonsgegevens te beschermen tegen verlies, onbevoegde toegang, misbruik of ongewenste wijziging. Toegang is beperkt tot de mensen en dienstverleners die de gegevens nodig hebben.</p>
                <p>Denkt u dat persoonsgegevens toch niet goed zijn beveiligd? Meld dit dan zo snel mogelijk via <a href="mailto:service@robbraam.com?subject=Melding%20beveiliging%20persoonsgegevens">service@robbraam.com</a>.</p>
              </section>

              <section id="rechten">
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
                <h2>Geen automatische besluiten</h2>
                <p>We nemen geen besluiten met belangrijke gevolgen voor u die uitsluitend door een computer worden genomen. Een offerte, opdracht of abonnementsaanvraag wordt door een medewerker van Braam beoordeeld.</p>
              </section>

              <section id="wijzigingen">
                <h2>Wijzigingen</h2>
                <p>Onze werkwijze of de website kan veranderen. Daarom kunnen we deze privacyverklaring aanpassen. De meest recente versie staat altijd op deze pagina met de datum van de laatste wijziging.</p>
              </section>

            </article>
          </div>
        </section>

        <section className="ls-slot" aria-labelledby="ls-slot-titel">
          <div className="shell ls-slot-raster">
            <h2 id="ls-slot-titel">Privacy, juridische berichten en klachten</h2>
            <div>
              <p>We helpen u graag rechtstreeks.</p>
              <div className="ls-slot-acties">
                <a className="ls-knop" href="mailto:service@robbraam.com?subject=Privacyvraag">Mail service@robbraam.com</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
