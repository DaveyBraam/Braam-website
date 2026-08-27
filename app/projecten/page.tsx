import type { Metadata } from "next";
import Link from "next/link";
import { ContactCTA } from "../components/ContactCTA";
import { PageHero } from "../components/PageHero";
import { ProjectGallery } from "../components/ProjectGallery";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = { title: "Projecten in de regio | Rob Braam", description: "Bekijk echte warmtepomp-, cv-ketel- en installatieprojecten van Rob Braam in de regio rond 's-Hertogenbosch." };

export default function ProjectenPage() {
  return <><SiteHeader /><main>
    <PageHero eyebrow="Projecten" title="Dit werk hebben we zelf gemaakt." accent="Bij klanten in de regio." intro="Op deze pagina ziet u echte installaties van Braam: van buitenunit tot complete techniekruimte. Een deel van de foto’s is bewust tijdens montage en inregeling gemaakt, zodat u ook het installatiewerk achter de toestellen ziet." image="/projects/installaties/installatie-02.webp" imageAlt="Warmtepomp-buitenunit geplaatst op een plat dak door Rob Braam" primaryLabel="Vertel ons over uw project" badge="Echt werk van ons eigen team" />
    <section className="projects-section projects-page reveal"><div className="shell"><div className="section-heading split-heading"><div><p className="eyebrow"><span /> Werk uit de praktijk</p><h2>Installatiewerk<br />van dichtbij.</h2></div><p>Deze foto’s zijn gemaakt bij echte projecten. Bij beelden tijdens montage ziet u soms nog vulslangen, gereedschap of afwerkmateriaal. Na het inregelen lopen we de installatie na en leveren we het werk op.</p></div><ProjectGallery expanded /></div></section>
    <section className="section case-notes reveal"><div className="shell case-grid"><article><span>Warmtepomp</span><h3>Complete binnenopstelling</h3><p>Toestellen en vaten worden praktisch ingepast, met aandacht voor leidingroutes en bereikbaarheid voor later onderhoud.</p><Link href="/warmtepompen">Bekijk ons warmtepompadvies →</Link></article><article><span>Buitenopstelling</span><h3>Warmtepomp op het dak</h3><p>Bij een buitenunit letten we op vrije luchtstroom, geluid, bereikbaarheid en een passende route voor leidingen en elektra.</p><Link href="/warmtepompen">Vraag naar de mogelijkheden →</Link></article><article><span>Cv-ketel</span><h3>Vervanging en leidingwerk</h3><p>Bij vervanging kijken we niet alleen naar de nieuwe ketel, maar ook naar aansluitingen, rookgasafvoer en veilig inregelen.</p><Link href="/cv-ketels">Bekijk cv-ketelinstallatie →</Link></article></div></section>
    <section className="reviews-section reveal"><div className="shell reviews-grid"><div className="reviews-intro"><p className="eyebrow"><span /> Klanten over ons</p><h2>Goed werk begint ook<br />met prettig contact.</h2><p>We werken vaak in een bewoonde woning. Daarom vinden we duidelijk afspreken, netjes werken en uitleg geven net zo normaal als een installatie die technisch goed functioneert.</p></div><div className="review-stack"><blockquote><span className="quote-mark">“</span><p>Vakkundig en met mooi strakke leiding gemonteerd.</p><div className="review-author"><strong>Kemme</strong><small>Warmtepomp & airco</small></div></blockquote><blockquote><span className="quote-mark">“</span><p>Al toch 20 jaar zeer tevreden klant.</p><div className="review-author"><strong>Han Engels</strong><small>Onderhoud & service</small></div></blockquote></div></div></section>
    <ContactCTA title="Heeft u een vergelijkbaar plan voor uw woning?" text="Stuur ons een korte omschrijving en eventueel foto&apos;s. We bekijken wat mogelijk is en nemen persoonlijk contact met u op." />
  </main><SiteFooter /></>;
}
