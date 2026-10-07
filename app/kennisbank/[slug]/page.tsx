import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import {
  getArticleBySlug,
  getKnowledgeCategory,
  getPublishedArticles,
  getRelatedKnowledgeItems,
  type ArticleNote,
  type PublishedKnowledgeArticle,
} from "../../knowledge-data";
import { absoluteUrl, siteConfig } from "../../site-config";
import { KENNISBANK } from "../basis";
import { DirectHulp, OnderwerpRij } from "../Gedeeld";
import "../kennisbank.css";

/* De artikelpagina in de stijl van de kennisbank (7 oktober 2026): dezelfde
   kop, papier, haarlijnen, grote letters en openklappende vragen, zodat
   kennisbank en artikel één geheel zijn. Alle inhoud komt uit
   knowledge-data.ts. De foto van de ketel staat er bewust niet op (geen
   verzonnen toestellen); hij blijft wel het deelplaatje. */

type ArtikelProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedArticles().map((artikel) => ({ slug: artikel.slug }));
}

export async function generateMetadata({ params }: ArtikelProps): Promise<Metadata> {
  const { slug } = await params;
  const artikel = getArticleBySlug(slug);
  if (!artikel) return {};
  return {
    title: artikel.seoTitle,
    description: artikel.metaDescription,
    alternates: { canonical: `/kennisbank/${artikel.slug}` },
    openGraph: {
      type: "article",
      locale: siteConfig.locale,
      url: `/kennisbank/${artikel.slug}`,
      siteName: siteConfig.shortName,
      title: artikel.title,
      description: artikel.metaDescription,
      publishedTime: artikel.publishedAt,
      modifiedTime: artikel.modifiedAt,
      images: [{ url: artikel.ogImage, alt: artikel.heroImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: artikel.title,
      description: artikel.metaDescription,
      images: [artikel.ogImage],
    },
  };
}

/* Gestructureerde gegevens voor zoekmachines: artikel en broodkruimelpad. */
function GestructureerdeGegevens({ artikel }: { artikel: PublishedKnowledgeArticle }) {
  const categorie = getKnowledgeCategory(artikel.category);
  const url = absoluteUrl(`/kennisbank/${artikel.slug}`);
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: artikel.title,
      description: artikel.description,
      image: [absoluteUrl(artikel.ogImage)],
      datePublished: artikel.publishedAt,
      dateModified: artikel.modifiedAt,
      articleSection: categorie.label,
      inLanguage: "nl-NL",
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: { "@type": "Organization", name: siteConfig.name, url: absoluteUrl(artikel.author.href) },
      publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url, logo: { "@type": "ImageObject", url: absoluteUrl(siteConfig.logo) } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Kennisbank", item: absoluteUrl("/kennisbank") },
        { "@type": "ListItem", position: 3, name: artikel.title, item: url },
      ],
    },
  ];
  return <>{data.map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, "\\u003c") }} />)}</>;
}

const notitieTeken: Record<ArticleNote["tone"], string> = { practice: "✓", info: "i", warning: "!" };

/* Alleen echte afvinklijsten krijgen vinkjes. Een lijst met signalen ("u ziet
   water bij de ketel") krijgt stippen: een vinkje leest als "in orde". */
const afvinkDelen = new Set(["na-het-bijvullen"]);

function Notitie({ note }: { note: ArticleNote }) {
  return (
    <aside className="kb-notitie" data-toon={note.tone}>
      <span className="kb-notitie-teken" aria-hidden="true">{notitieTeken[note.tone]}</span>
      <div><p className="kb-notitie-titel">{note.title}</p><p>{note.text}</p></div>
    </aside>
  );
}

export default async function ArtikelPagina({ params }: ArtikelProps) {
  const { slug } = await params;
  const artikel = getArticleBySlug(slug);
  if (!artikel) notFound();

  const categorie = getKnowledgeCategory(artikel.category);
  const verwant = getRelatedKnowledgeItems(artikel);
  const inhoud = [
    { id: "kort-antwoord", label: "Het korte antwoord" },
    { id: "nodig", label: "Dit heeft u nodig" },
    ...artikel.sections.map((s) => ({ id: s.id, label: s.heading })),
    { id: "veelgestelde-vragen", label: "Veelgestelde vragen" },
  ];

  return (
    <>
      <GestructureerdeGegevens artikel={artikel} />
      <SiteHeader />
      <main className="kb kb-artikelpagina">
        <article>
          <header className="kb-kop" aria-labelledby="kb-artikel-titel">
            <div className="shell kb-kop-raster">
              <div>
                <p className="kb-kruimel" aria-label="Broodkruimelpad">
                  <Link href="/">Home</Link><span aria-hidden="true">/</span>
                  <Link href={KENNISBANK}>Kennisbank</Link><span aria-hidden="true">/</span>
                  <span>{categorie.label}</span>
                </p>
                <h1 id="kb-artikel-titel">{artikel.title}</h1>
                <p className="kb-intro">{artikel.description}</p>
                <p className="kb-byline">
                  Geschreven door het {artikel.author.name} · <time dateTime={artikel.publishedAt}>{artikel.displayDate}</time> · {artikel.readingTime}
                </p>
              </div>
              <DirectHulp />
            </div>
          </header>

          <div className="shell kb-artikel-raster">
            {/* Op een groot scherm staat de inhoud vast naast de tekst; op de
                telefoon is het een lijst die u openklapt. */}
            <nav className="kb-inhoud" aria-label="Op deze pagina">
              <p className="kb-inhoud-kop">Op deze pagina</p>
              <ol>{inhoud.map((d) => <li key={d.id}><a href={`#${d.id}`}>{d.label}</a></li>)}</ol>
            </nav>
            <details className="kb-inhoud-klap">
              <summary>Op deze pagina<span className="kb-plus" aria-hidden="true" /></summary>
              <nav aria-label="Op deze pagina">
                <ol>{inhoud.map((d) => <li key={d.id}><a href={`#${d.id}`}>{d.label}</a></li>)}</ol>
              </nav>
            </details>

            <div className="kb-artikel-tekst-kolom">
              <section className="kb-kort" id="kort-antwoord" aria-labelledby="kb-kort-titel">
                <h2 id="kb-kort-titel">Het korte antwoord</h2>
                <p>{artikel.quickAnswer}</p>
                <dl>
                  {artikel.keyFacts.map((f) => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
                </dl>
              </section>

              <section className="kb-deel" id="nodig" aria-labelledby="kb-nodig-titel">
                <h2 id="kb-nodig-titel">Dit heeft u nodig</h2>
                <ul className="kb-vinklijst">{artikel.supplies.map((s) => <li key={s}>{s}</li>)}</ul>
              </section>

              {artikel.sections.map((deel) => (
                <section className="kb-deel" id={deel.id} key={deel.id} aria-labelledby={`${deel.id}-kop`}>
                  <h2 id={`${deel.id}-kop`}>{deel.heading}</h2>
                  {deel.lead ? <p className="kb-deel-lead">{deel.lead}</p> : null}
                  {deel.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                  {deel.bullets ? <ul className={afvinkDelen.has(deel.id) ? "kb-vinklijst" : "kb-vinklijst kb-stiplijst"}>{deel.bullets.map((b) => <li key={b}>{b}</li>)}</ul> : null}
                  {deel.steps ? (
                    <ol className="kb-stappen">
                      {deel.steps.map((stap, i) => (
                        <li key={stap.title}>
                          <span className="kb-stap-nummer" aria-hidden="true">{i + 1}</span>
                          <div><h3>{stap.title}</h3><p>{stap.text}</p></div>
                        </li>
                      ))}
                    </ol>
                  ) : null}
                  {deel.note ? <Notitie note={deel.note} /> : null}
                </section>
              ))}

              <section className="kb-deel" id="veelgestelde-vragen" aria-labelledby="kb-faq-titel">
                <h2 id="kb-faq-titel">Veelgestelde vragen</h2>
                <div className="kb-klachtenlijst kb-faq">
                  {artikel.faqs.map((faq) => (
                    <details className="kb-klacht" key={faq.question}>
                      <summary><h3>{faq.question}</h3><span className="kb-plus" aria-hidden="true" /></summary>
                      <div className="kb-antwoord kb-antwoord-enkel"><p>{faq.answer}</p></div>
                    </details>
                  ))}
                </div>
              </section>

              <section className="kb-deel" aria-labelledby="kb-verder-titel">
                <h2 id="kb-verder-titel">Verder op de website</h2>
                <ul className="kb-verder">
                  {artikel.serviceLinks.map((l) => (
                    <li key={l.href}><Link href={l.href}><strong>{l.label}</strong><span>{l.description}</span></Link></li>
                  ))}
                </ul>
              </section>

              <section className="kb-deel kb-bronnen" aria-labelledby="kb-bronnen-titel">
                <h2 id="kb-bronnen-titel">Gebruikte bronnen</h2>
                <p>Dit artikel is geschreven vanuit onze praktijk en gecontroleerd aan de hand van actuele informatie van de ketelmerken die wij onderhouden. De handleiding van uw eigen toestel blijft altijd leidend.</p>
                <ul>{artikel.sources.map((b) => <li key={b.href}><a href={b.href} target="_blank" rel="noreferrer">{b.label}<span className="sr-only"> (opent een andere website)</span></a></li>)}</ul>
              </section>

              <aside className="kb-door" aria-label="Gecontroleerd door">
                <p className="kb-door-label">Gecontroleerd door</p>
                <p className="kb-door-naam">{artikel.author.name}</p>
                <p>Service &amp; Montagebedrijf Rob Braam werkt vanuit &apos;s-Hertogenbosch met een eigen serviceteam. Onze CO-certificering loopt via CO-Keur en Braam staat geregistreerd bij InstallQ.</p>
                <Link className="kb-tekstlink" href={artikel.author.href}>Maak kennis met ons bedrijf<span aria-hidden="true"> →</span></Link>
              </aside>
            </div>
          </div>

          {verwant.length > 0 ? (
            <section className="kb-onderwerpen kb-verwant" aria-labelledby="kb-verwant-titel">
              <div className="shell">
                <h2 id="kb-verwant-titel">Aansluitend lezen</h2>
                <p className="kb-sectie-intro">Deze onderwerpen worden pas klikbaar als de volledige uitleg is gecontroleerd.</p>
                <ul className="kb-artikelen">{verwant.map((item) => <OnderwerpRij item={item} key={item.slug} />)}</ul>
                <p className="kb-alle"><Link className="kb-tekstlink" href={KENNISBANK}>Terug naar de kennisbank<span aria-hidden="true"> →</span></Link></p>
              </div>
            </section>
          ) : null}

          <section className="kb-contact" aria-labelledby="kb-cta-titel">
            <div className="shell kb-contact-raster">
              <div>
                <p className="kb-cta-label">{artikel.cta.eyebrow}</p>
                <h2 id="kb-cta-titel">{artikel.cta.title}</h2>
                <p>{artikel.cta.text}</p>
                <div className="kb-cta-knoppen">
                  <Link className="kb-knop kb-knop-licht" href={artikel.cta.primaryHref}>{artikel.cta.primaryLabel}</Link>
                  <Link className="kb-tekstlink" href={artikel.cta.secondaryHref}>{artikel.cta.secondaryLabel}<span aria-hidden="true"> →</span></Link>
                </div>
              </div>
              <div className="kb-contact-wegen">
                <a href="tel:+31736222199"><span>Bel ons serviceteam</span><strong>073 622 2199</strong></a>
                <a href="mailto:service@robbraam.com?subject=Vraag%20over%20bijvullen"><span>Of mail</span><strong>service@robbraam.com</strong></a>
              </div>
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
