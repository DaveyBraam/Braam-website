import type { Metadata } from "next";
import Link from "next/link";
import { KnowledgeExplorer } from "../components/KnowledgeExplorer";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { getKnowledgeCards, knowledgeCategories } from "../knowledge-data";
import { siteConfig } from "../site-config";

export const metadata: Metadata = {
  title: "Kennisbank voor cv, onderhoud, storingen en elektra",
  description: "Praktische kennis van Rob Braam over cv-ketels, onderhoud, storingen, verwarming, elektra, airco en energiezuinig gebruik.",
  alternates: { canonical: "/kennisbank" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/kennisbank",
    siteName: siteConfig.shortName,
    title: "Kennisbank | Braam Service & Montage",
    description: "Praktische uitleg voor uw woning, gebaseerd op ervaring uit installatie, onderhoud en service.",
  },
};

export default function KennisbankPage() {
  const knowledgeCards = getKnowledgeCards();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="knowledge-hero">
          <div className="shell breadcrumb breadcrumb-dark"><Link href="/">Home</Link><span>/</span><strong>Kennisbank</strong></div>
          <div className="shell knowledge-hero-grid">
            <div className="knowledge-hero-copy">
              <p className="eyebrow eyebrow-light"><span /> Kennisbank van Rob Braam</p>
              <h1>Praktische kennis voor uw woning.<br /><em>Helder uitgelegd.</em></h1>
              <p>Antwoorden op vragen die ons serviceteam in de praktijk vaak krijgt. U leest wat u zelf veilig kunt controleren, welke signalen belangrijk zijn en wanneer een vakman nodig is.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#alle-onderwerpen">Vind uw onderwerp <span aria-hidden="true">↓</span></a>
                <Link className="knowledge-hero-service-link" href="/service">Direct een storing of servicevraag? <span aria-hidden="true">→</span></Link>
              </div>
            </div>

            <div className="knowledge-hero-visual" aria-label="Onderwerpen in de kennisbank">
              <div className="knowledge-orbit" aria-hidden="true"><i /><i /><i /></div>
              <div className="knowledge-gauge" aria-hidden="true"><span>1,5</span><small>bar</small><i /></div>
              <div className="knowledge-hero-panel">
                <span>Van vraag naar duidelijk antwoord</span>
                <ol>
                  <li><b>01</b><div><strong>Zelf controleren</strong><small>Veilige, concrete stappen</small></div></li>
                  <li><b>02</b><div><strong>Signalen begrijpen</strong><small>Zonder onnodig jargon</small></div></li>
                  <li><b>03</b><div><strong>Op tijd hulp vragen</strong><small>Met een passende vervolgstap</small></div></li>
                </ol>
              </div>
            </div>
          </div>
          <div className="shell knowledge-principles" aria-label="Uitgangspunten van de kennisbank">
            <div><span aria-hidden="true">✓</span><p><strong>Praktisch</strong><small>geschreven vanuit dagelijks installatiewerk</small></p></div>
            <div><span aria-hidden="true">✓</span><p><strong>Veilig</strong><small>duidelijk over wat u niet zelf moet doen</small></p></div>
            <div><span aria-hidden="true">✓</span><p><strong>Gericht</strong><small>met een logische stap naar onderhoud of service</small></p></div>
          </div>
        </section>

        <section className="section knowledge-categories-section reveal">
          <div className="shell">
            <div className="section-heading split-heading">
              <div><p className="eyebrow"><span /> Zes duidelijke thema&apos;s</p><h2>Geen losse blogberichten.<br />Wel kennis die u terugvindt.</h2></div>
              <p>Elk artikel hoort bij een vast onderwerp en wordt gekoppeld aan de relevante dienst. Zo ontstaat stap voor stap een overzichtelijke kennisbank in plaats van een lange, ongestructureerde nieuwsfeed.</p>
            </div>
            <div className="knowledge-category-grid">
              {knowledgeCategories.map((category) => (
                <article key={category.slug}>
                  <span>{category.shortLabel}</span>
                  <div><h3>{category.label}</h3><p>{category.description}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section knowledge-library-section reveal" id="alle-onderwerpen">
          <div className="shell">
            <div className="section-heading split-heading knowledge-library-heading">
              <div><p className="eyebrow"><span /> Zoeken en filteren</p><h2>Vind antwoord op uw vraag.</h2></div>
              <p>Het eerste complete artikel staat live. De overige kaarten laten zien welke onderwerpen in deze structuur kunnen volgen; ze openen pas zodra de inhoud volledig is gecontroleerd en gepubliceerd.</p>
            </div>
            <KnowledgeExplorer items={knowledgeCards} />
          </div>
        </section>

        <section className="knowledge-help-strip reveal">
          <div className="shell knowledge-help-inner">
            <div><p className="eyebrow eyebrow-light"><span /> Komt u er niet uit?</p><h2>Een artikel helpt bij de eerste controle. Uw installatie blijft maatwerk.</h2></div>
            <div><p>Blijft een storing terugkomen, ziet u lekkage of voelt een handeling niet vertrouwd? Stop dan en laat iemand uit ons serviceteam meekijken.</p><Link className="button button-light" href="/service" data-track="knowledge-service-cta">Ga naar storing & service <span aria-hidden="true">→</span></Link></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
