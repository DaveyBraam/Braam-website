import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "../SiteFooter";
import { SiteHeader } from "../SiteHeader";
import { AanvraagRoute } from "./AanvraagRoute";
import "../../aanvraag.css";

/* Eén opbouw voor alle aanvraagformulieren: een korte warme kop zonder foto,
   daaronder het formulier op papier met de route van de aanvraag ernaast.
   De formulieren zelf (velden, verzending, mailadressen) blijven ongewijzigd. */

type Kruimel = { label: string; href?: string };

export type AanvraagPaginaProps = {
  kruimels: Kruimel[];
  titel: string;
  accent: string;
  intro: string;
  /** Kopje boven de lijst rechts in de kop. */
  puntenLabel: string;
  punten: string[];
  /** Waar de aanvraag binnenkomt, bijvoorbeeld planning@robbraam.com. */
  email: string;
  /** De stappen die Braam na het versturen zet; ze staan gedimd in de route. */
  daarna: string[];
  formulierId?: string;
  children: ReactNode;
};

export function AanvraagPagina({ kruimels, titel, accent, intro, puntenLabel, punten, email, daarna, formulierId, children }: AanvraagPaginaProps) {
  return <>
    <SiteHeader />
    <main className="av">
      <section className="av-kop" aria-labelledby="av-titel">
        <div className="shell av-kop-raster">
          <div className="av-kop-tekst">
            <p className="av-kruimel">
              <Link href="/">Home</Link>
              {kruimels.map((k) => <span key={k.label}><span aria-hidden="true">/</span>{k.href ? <Link href={k.href}>{k.label}</Link> : <span>{k.label}</span>}</span>)}
            </p>
            <h1 id="av-titel">{titel}<em>{accent}</em></h1>
            <p className="av-intro">{intro}</p>
          </div>
          <div className="av-kop-zijde">
            <p className="av-kop-label">{puntenLabel}</p>
            <ul className="av-punten">
              {punten.map((p) => <li key={p}>{p}</li>)}
            </ul>
            <div className="av-kop-contact">
              <a href="tel:+31736222199"><small>Liever even overleggen?</small><strong>073 622 2199</strong></a>
              <a href={`mailto:${email}`}><small>Of mail</small><strong>{email}</strong></a>
            </div>
          </div>
        </div>
      </section>

      <section className="av-werk" id={formulierId}>
        <div className="shell av-werk-raster">
          <div className="av-formulier" data-av-formulier>{children}</div>
          <AanvraagRoute daarna={daarna} />
        </div>
        {/* Op de telefoon staat de route als strook bovenin; wat er na het
            versturen gebeurt komt dan onder het formulier. */}
        <div className="shell av-daarna-los">
          <p>Daarna is Braam aan zet</p>
          <ol>{daarna.map((stap) => <li key={stap}>{stap}</li>)}</ol>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
