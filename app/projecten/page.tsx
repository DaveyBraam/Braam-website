import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { Fotoboek } from "./Fotoboek";
import { Kop } from "./Kop";
import { Werkwijze } from "./Werkwijze";
import "./projecten.css";

/* Projecten (sinds 7 oktober 2026): een rustig fotoboek van eigen werk.
   Kop met een stapel afdrukken, de werkwijze als piek, alle foto's, twee klanten,
   en een slot. Foto's toevoegen gaat in fotos.ts. Achtergrond:
   braam-premium-concept/scrollcraft/builds/projecten-v2/BRIEF.md */

export const metadata: Metadata = {
  title: "Projecten in de regio | Rob Braam",
  description: "Bekijk echte warmtepomp-, cv-ketel- en installatieprojecten van Rob Braam in de regio rond 's-Hertogenbosch.",
};

export default function ProjectenPage() {
  return (
    <>
      <SiteHeader />
      <main className="pj">
        <Kop />
        <Werkwijze />
        <Fotoboek />

        <section className="pj-klanten" aria-labelledby="pj-klanten-titel">
          <div className="shell pj-klanten-raster">
            <h2 id="pj-klanten-titel">Goed werk begint ook met prettig contact.</h2>
            <p className="pj-klanten-intro">We werken vaak in een bewoonde woning. Daarom vinden we duidelijk afspreken, netjes werken en uitleg geven net zo normaal als een installatie die technisch goed functioneert.</p>
            <figure className="pj-review">
              <blockquote><p>Vakkundig en met mooi strakke leiding gemonteerd.</p></blockquote>
              <figcaption><strong>Kemme</strong> · Warmtepomp &amp; airco</figcaption>
            </figure>
            <figure className="pj-review">
              <blockquote><p>Al toch 20 jaar zeer tevreden klant.</p></blockquote>
              <figcaption><strong>Han Engels</strong> · Onderhoud &amp; service</figcaption>
            </figure>
          </div>
        </section>

        <section className="pj-slot" aria-labelledby="pj-slot-titel">
          <div className="shell pj-slot-raster">
            <div className="pj-slot-leeg" aria-hidden="true"><span>Uw installatie</span></div>
            <div className="pj-slot-tekst">
              <p className="pj-label pj-label--slot"><span>Uw project · Nog te plannen</span></p>
              <h2 id="pj-slot-titel">Heeft u een vergelijkbaar plan voor uw woning?</h2>
              <p>Stuur ons een korte omschrijving en eventueel foto’s. We bekijken wat mogelijk is en nemen persoonlijk contact met u op.</p>
              <div className="pj-acties">
                <Link className="button button-primary" href="/offerte-aanvragen">Vertel ons over uw project <span aria-hidden="true">↗</span></Link>
                <a className="pj-bel" href="tel:+31736222199"><small>Liever even bellen?</small><strong>073 622 2199</strong></a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
