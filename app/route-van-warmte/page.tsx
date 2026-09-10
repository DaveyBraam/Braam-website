import type { Metadata } from "next";
import { RouteVanWarmte } from "../components/RouteVanWarmte";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

/* Werkroute voor de nieuwe introductie van de cv-ketelpagina. Staat los van
   /cv-ketels en /cv-huis, zodat de pagina die live staat ongemoeid blijft. */
export const metadata: Metadata = {
  title: "De route van warmte — werkroute",
  robots: { index: false, follow: false },
};

export default function RoutePage() {
  return <><SiteHeader /><main className="dienst">
    <RouteVanWarmte />
    <section className="section reveal">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Hier gaat de pagina verder.</h2></div>
          <p>Dit blok staat er alleen om te zien hoe de doorsnede overgaat in het handboek eronder.</p>
        </div>
      </div>
    </section>
  </main><SiteFooter /></>;
}
