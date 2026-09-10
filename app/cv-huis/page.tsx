import type { Metadata } from "next";
import { CvHuis3D } from "../components/CvHuis3D";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

/* Werkroute om de 3D-scene op te bouwen en het scrollen bij te sturen. Staat
   los van /cv-ketels, zodat de pagina die live staat ongemoeid blijft tot de
   reis goed voelt. Niet in de sitemap en niet voor zoekmachines. */
export const metadata: Metadata = {
  title: "Werkroute — het huis in 3D",
  robots: { index: false, follow: false },
};

export default function CvHuisPage() {
  return <><SiteHeader /><main className="dienst">
    <CvHuis3D />
    <section className="section reveal">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><h2>Hier gaat de pagina verder.</h2></div>
          <p>Dit blok staat er alleen om te zien hoe de scene overgaat in het handboek eronder.</p>
        </div>
      </div>
    </section>
  </main><SiteFooter /></>;
}
