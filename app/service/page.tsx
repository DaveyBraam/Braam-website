import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import "./service.css";

/* Storing en service (9 oktober 2026): de route voor wie nu een probleem heeft,
   dus bellen voorop en mailen pas onderaan. Zelfde lichte, zakelijke opbouw als
   /contact. Bereikbaarheid van de eigenaar: kantoor 8.00 tot 17.00; buiten
   kantoortijd kunnen abonnees bellen bij een storing; zonder abonnement soms
   hulp tegen een spoedtarief (bewust zonder bedrag). */

export const metadata: Metadata = {
  title: "Storing en service",
  description: "Storing aan uw cv-ketel of warmtepomp? Bel 073 622 2199. Kantoor open van 8.00 tot 17.00; met een onderhoudsabonnement ook buiten kantoortijd.",
};

const meesturen = [
  { titel: "Uw adres en telefoonnummer", tekst: "Dan weten we om welke installatie het gaat en hoe we u kunnen bereiken." },
  { titel: "Merk, type en storingscode", tekst: "Deze gegevens staan meestal op het toestel of in het display." },
  { titel: "Foto’s van het toestel en de situatie", tekst: "Een overzichtsfoto en een close-up van het display of de lekkage helpen ons bij de eerste beoordeling." },
];

export default function ServicePage() {
  return (
    <>
      <SiteHeader />
      <main className="sv">
        <section className="sv-kop" aria-labelledby="sv-titel">
          <div className="shell sv-kop-raster">
            <div>
              <p className="sv-kruimel"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Storing en service</span></p>
              <h1 id="sv-titel">Storing? Bel ons direct.</h1>
              <p className="sv-lead">U hoeft niet zelf uit te zoeken wat er kapot is. Bel ons, dan kijken we samen wat er nodig is.</p>
              <a className="sv-bel" href="tel:+31736222199">
                <span>Bel</span>
                <strong>073 622 2199</strong>
              </a>
              <p className="sv-bel-tip">Houd het merk, het type en de storingscode bij de hand als dat lukt.</p>
            </div>
            <aside className="sv-tijden" aria-label="Bereikbaarheid">
              <p className="sv-tijden-kop">Kantoor</p>
              <p className="sv-tijden-uren">8.00 tot 17.00</p>
              <p>Is het later? <a href="#buiten-kantoortijd">Zo helpen we u buiten kantoortijd</a>.</p>
            </aside>
          </div>
        </section>

        <section className="sv-buiten" id="buiten-kantoortijd" aria-labelledby="sv-buiten-titel">
          <div className="shell sv-buiten-raster">
            <h2 id="sv-buiten-titel">Buiten kantoortijd.</h2>
            <div className="sv-blok">
              <h3>Met een onderhoudsabonnement</h3>
              <p>Bel bij een storing ook buiten kantoortijd <a href="tel:+31736222199">073 622 2199</a>. Wij schakelen dan een storingsmonteur in.</p>
              <p><Link href="/onderhoud">Over onze onderhoudsabonnementen</Link></p>
            </div>
            <div className="sv-blok">
              <h3>Zonder abonnement</h3>
              <p>Bel gerust. Soms kunnen we u ook buiten kantoortijd helpen; daarvoor geldt een spoedtarief. Lukt het die dag niet meer, dan bent u vanaf 8.00 uur weer welkom.</p>
              <p><Link href="/kennisbank#wat-ziet-u">Kijk wat u zelf alvast kunt doen</Link></p>
            </div>
          </div>
        </section>

        <section className="sv-gevaar" aria-labelledby="sv-gevaar-titel">
          <div className="shell sv-gevaar-raster">
            <h2 id="sv-gevaar-titel">Ruikt u gas of vermoedt u koolmonoxide?</h2>
            <div>
              <p>Neem geen risico. Vermijd vonken en open vuur en ga naar buiten als dat veilig kan. Ruikt u gas? Bel gratis het Nationaal Storingsnummer gas en stroom. Dit nummer is dag en nacht bereikbaar. Bij direct gevaar belt u 112.</p>
              <div className="sv-gevaar-acties">
                <a className="sv-gevaar-gas" href="tel:08009009">Gaslucht: bel 0800 9009</a>
                <a className="sv-gevaar-112" href="tel:112">Direct gevaar: bel 112</a>
              </div>
            </div>
          </div>
        </section>

        <section className="sv-mail" aria-labelledby="sv-mail-titel">
          <div className="shell sv-mail-raster">
            <div>
              <h2 id="sv-mail-titel">Niet dringend? Mail ons.</h2>
              <p className="sv-mail-lead">Mail kunt u altijd sturen; we lezen hem tijdens kantoortijd.</p>
              <ul className="sv-adressen">
                <li>
                  <a href="mailto:service@robbraam.com?subject=Servicevraag">
                    <span>Storing, servicevraag of nieuw werk</span>
                    <strong>service@robbraam.com</strong>
                  </a>
                </li>
                <li>
                  <a href="mailto:planning@robbraam.com?subject=Afspraak%20plannen%20of%20wijzigen">
                    <span>Afspraak plannen, verzetten of annuleren</span>
                    <strong>planning@robbraam.com</strong>
                  </a>
                </li>
              </ul>
            </div>
            <div className="sv-meesturen">
              <h3>Hiermee kunnen we sneller beginnen</h3>
              <ul>
                {meesturen.map((punt) => (
                  <li key={punt.titel}><strong>{punt.titel}</strong><p>{punt.tekst}</p></li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
