import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { kantoortijden, kantoortijdenZin } from "../site-config";
import "./contact.css";

/* Contact (sinds 8 oktober 2026): licht en zakelijk, mailen voorop.
   Geen formulier op deze pagina, alleen doorverwijzen (Davey): kop met drie
   keuzes (offerteformulier, abonnementsformulier, mail aan service@), bellen
   alleen waar het moet, en langskomen. Achtergrond:
   braam-premium-concept/scrollcraft/builds/contact-v2/BRIEF.md

   Tijden en storingsregeling komen van de eigenaar (7 en 9 oktober 2026):
   kantoor maandag t/m vrijdag, 8.00 tot 17.00 en vrijdag tot 14.00 (site-config);
   buiten kantoortijd alleen bellen bij een storing als u een onderhoudsabonnement
   heeft. Sinds 9 oktober: zonder abonnement soms hulp
   tegen een spoedtarief, bewust zonder bedrag. */

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact met Rob Braam voor offerte, onderhoud, service of planning. Mail het juiste team of bel 073 622 2199.",
};

const plaatsen = ["’s-Hertogenbosch", "Rosmalen", "Vught", "Berlicum", "Vlijmen", "Hedel", "Ammerzoden", "Tilburg"];

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="ct">
        <section className="ct-kop" aria-labelledby="ct-titel">
          <div className="shell ct-kop-raster">
            <div>
              <p className="ct-kruimel"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Contact</span></p>
              <h1 id="ct-titel">Waarmee kunnen we u helpen?</h1>
              <p className="ct-lead">Kies wat u nodig heeft. Voor een offerte of een onderhoudsabonnement gaat u naar het juiste formulier; voor al het andere mailt u ons direct.</p>
            </div>
            <aside className="ct-tijden" aria-label="Bereikbaarheid">
              <p className="ct-tijden-kop">Kantoor</p>
              <dl className="ct-tijden-lijst">
                {kantoortijden.map((r) => <div key={r.dagen}><dt>{r.dagen}</dt><dd>{r.tijden}</dd></div>)}
              </dl>
              <p>Mail kunt u altijd sturen; we lezen hem tijdens kantoortijd.</p>
            </aside>
          </div>

          <div className="shell">
            <ul className="ct-keuzes">
              <li>
                <Link className="ct-keuze ct-keuze--hoofd" href="/offerte-aanvragen">
                  <span className="ct-keuze-voor">Nieuwe installatie of vervanging</span>
                  <strong>Offerte aanvragen</strong>
                  <span className="ct-keuze-actie">Naar het offerteformulier <span aria-hidden="true">→</span></span>
                </Link>
              </li>
              <li>
                <Link className="ct-keuze ct-keuze--hoofd" href="/abonnement-aanvragen">
                  <span className="ct-keuze-voor">Jaarlijks onderhoud geregeld</span>
                  <strong>Onderhoudsabonnement aanvragen</strong>
                  <span className="ct-keuze-actie">Naar het abonnementsformulier <span aria-hidden="true">→</span></span>
                </Link>
              </li>
              <li>
                <a className="ct-keuze" href="mailto:service@robbraam.com?subject=Vraag%20via%20de%20website">
                  <span className="ct-keuze-voor">Geen van beide?</span>
                  <strong>Liever direct contact</strong>
                  <span className="ct-keuze-actie">Mail service@robbraam.com <span aria-hidden="true">↗</span></span>
                </a>
              </li>
            </ul>
            <p className="ct-keuze-onder">Heeft u al onderhoud bij ons en wilt u een afspraak plannen, verzetten of annuleren? Mail dan <a href="mailto:planning@robbraam.com?subject=Onderhoud%20of%20afspraak">planning@robbraam.com</a>. <span className="ct-tijden-kort">Kantoor open {kantoortijdenZin}.</span></p>
          </div>
        </section>

        <section className="ct-bellen" aria-labelledby="ct-bellen-titel">
          <div className="shell ct-bellen-raster">
            <h2 id="ct-bellen-titel">Bellen kan ook.</h2>
            <div className="ct-bellen-blok">
              <h3>Tijdens kantoortijd</h3>
              <p>U bent {kantoortijdenZin} welkom op <a href="tel:+31736222199">073 622 2199</a>. Voor de meeste vragen is mailen sneller, omdat we uw gegevens dan meteen bij de hand hebben.</p>
              <p><Link href="/bel-mij-terug">Liever teruggebeld worden?</Link></p>
            </div>
            <div className="ct-bellen-blok">
              <h3>Storing buiten kantoortijd</h3>
              <p>Heeft u een onderhoudsabonnement bij ons? Dan kunt u bij een storing ook buiten kantoortijd bellen op <a href="tel:+31736222199">073 622 2199</a>. Wij schakelen dan een storingsmonteur in. Zonder abonnement kunt u ook bellen: soms kunnen we u dan helpen, tegen een spoedtarief.</p>
              <p><Link href="/service">Alles over storingen</Link></p>
            </div>
          </div>
        </section>

        <section className="ct-bezoek" aria-labelledby="ct-bezoek-titel">
          <div className="ct-bezoek-beeld">
            <img src="/about/bedrijfspand-braam.webp" alt="Het pand van Rob Braam aan de Jacob van Wassenaerstraat in ’s-Hertogenbosch" loading="lazy" decoding="async" />
          </div>
          <div className="shell ct-bezoek-raster">
            <div className="ct-bezoek-tekst">
              <h2 id="ct-bezoek-titel">Langskomen kan op afspraak.</h2>
              <address>
                <strong>Service &amp; Montagebedrijf Rob Braam</strong>
                <span>Jacob van Wassenaerstraat 10</span>
                <span>5224 GG ’s-Hertogenbosch</span>
              </address>
              <p>Onze ontvangstruimte is op afspraak geopend. Mail ons even via <a href="mailto:service@robbraam.com?subject=Afspraak%20op%20kantoor">service@robbraam.com</a>, dan spreken we een moment af.</p>
              <a className="ct-route" href="https://www.google.com/maps/search/?api=1&query=Jacob+van+Wassenaerstraat+10+5224+GG+%27s-Hertogenbosch" target="_blank" rel="noopener noreferrer">Route plannen <span aria-hidden="true">↗</span></a>
            </div>
            <div className="ct-werkgebied">
              <h3>Werkgebied</h3>
              <p>Ons meeste onderhoud zit in ’s-Hertogenbosch en omgeving. We werken daarnaast op veel adressen in Noord-Brabant en in aangrenzende delen van Gelderland, bijvoorbeeld in:</p>
              <ul>{plaatsen.map((p) => <li key={p}>{p}</li>)}</ul>
              <p className="ct-werkgebied-noot">Staat uw plaats er niet bij? Mail uw postcode en het soort werk naar <a href="mailto:service@robbraam.com?subject=Werkgebied">service@robbraam.com</a>, dan laten we weten wat mogelijk is.</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
