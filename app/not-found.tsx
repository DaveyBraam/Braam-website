import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import "./service/service.css";

/* Niet gevonden: dezelfde lichte opbouw als /service en /contact, met de drie
   routes van de homepage, zodat niemand op een kale pagina strandt. */

export const metadata: Metadata = {
  title: "Pagina niet gevonden",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="sv sv-nietgevonden">
        <section className="sv-kop" aria-labelledby="nf-titel">
          <div className="shell">
            <h1 id="nf-titel">Deze pagina bestaat niet (meer).</h1>
            <p className="sv-lead">Misschien is de pagina verhuisd. Kies hieronder waar u voor komt, of ga naar de <Link href="/">homepage</Link>.</p>
            <ul className="sv-adressen nf-routes">
              <li><a href="tel:+31736222199"><span>Mijn verwarming doet het niet</span><strong>Bel 073 622 2199</strong></a></li>
              <li><Link href="/offerte-aanvragen"><span>Iets nieuws laten plaatsen</span><strong>Offerte aanvragen</strong></Link></li>
              <li><Link href="/onderhoud"><span>Onderhoud regelen</span><strong>Onderhoud en abonnementen</strong></Link></li>
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
