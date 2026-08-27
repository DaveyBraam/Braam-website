import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KnowledgeCard } from "../../components/KnowledgeCard";
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

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.seoTitle,
    description: article.metaDescription,
    alternates: { canonical: `/kennisbank/${article.slug}` },
    openGraph: {
      type: "article",
      locale: siteConfig.locale,
      url: `/kennisbank/${article.slug}`,
      siteName: siteConfig.shortName,
      title: article.title,
      description: article.metaDescription,
      publishedTime: article.publishedAt,
      modifiedTime: article.modifiedAt,
      images: [{ url: article.ogImage, alt: article.heroImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.metaDescription,
      images: [article.ogImage],
    },
  };
}

function StructuredData({ article }: { article: PublishedKnowledgeArticle }) {
  const category = getKnowledgeCategory(article.category);
  const articleUrl = absoluteUrl(`/kennisbank/${article.slug}`);
  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: [absoluteUrl(article.ogImage)],
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt,
    articleSection: category.label,
    inLanguage: "nl-NL",
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl(article.author.href),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: { "@type": "ImageObject", url: absoluteUrl(siteConfig.logo) },
    },
  };
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Kennisbank", item: absoluteUrl("/kennisbank") },
      { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData).replace(/</g, "\\u003c") }} />
    </>
  );
}

function ArticleCallout({ note }: { note: ArticleNote }) {
  return (
    <aside className={`article-note article-note-${note.tone}`}>
      <span aria-hidden="true">{note.tone === "warning" ? "!" : note.tone === "practice" ? "✓" : "i"}</span>
      <div><strong>{note.title}</strong><p>{note.text}</p></div>
    </aside>
  );
}

export default async function KnowledgeArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const category = getKnowledgeCategory(article.category);
  const relatedItems = getRelatedKnowledgeItems(article);

  return (
    <>
      <StructuredData article={article} />
      <SiteHeader />
      <main>
        <article>
          <header className="article-hero">
            <div className="shell article-breadcrumb" aria-label="Broodkruimelpad">
              <Link href="/">Home</Link><span>/</span><Link href="/kennisbank">Kennisbank</Link><span>/</span><strong>{article.title}</strong>
            </div>
            <div className="shell article-hero-grid">
              <div className="article-hero-copy">
                <p className="eyebrow eyebrow-light"><span /> {category.label}</p>
                <h1>{article.title}</h1>
                <p className="article-hero-lead">{article.description}</p>
                <div className="article-byline">
                  <div className="article-author-mark" aria-hidden="true">RB</div>
                  <p><strong>{article.author.name}</strong><span>{article.author.role}</span></p>
                  <div className="article-publish-meta"><time dateTime={article.publishedAt}>{article.displayDate}</time><span>·</span><span>{article.readingTime}</span></div>
                </div>
              </div>
              <figure className="article-hero-image">
                <img src={article.heroImage} alt={article.heroImageAlt} width="1664" height="936" fetchPriority="high" />
                <figcaption><span aria-hidden="true">✓</span> Merkneutraal stappenplan</figcaption>
              </figure>
            </div>
          </header>

          <div className="shell article-layout">
            <aside className="article-sidebar">
              <nav aria-label="Inhoud van dit artikel">
                <strong>Direct naar</strong>
                {article.sections.map((section, index) => <a href={`#${section.id}`} key={section.id}><span>{String(index + 1).padStart(2, "0")}</span>{section.heading}</a>)}
                <a href="#veelgestelde-vragen"><span>{String(article.sections.length + 1).padStart(2, "0")}</span>Veelgestelde vragen</a>
              </nav>
              <div className="article-sidebar-help">
                <span>Druk blijft dalen?</span>
                <strong>Blijf niet telkens bijvullen.</strong>
                <Link href="/service" data-track="article-sidebar-service" data-article={article.slug}>Naar storing & service <i aria-hidden="true">→</i></Link>
              </div>
            </aside>

            <div className="article-content">
              <section className="article-quick-answer" aria-labelledby="kort-antwoord">
                <div><span aria-hidden="true">01</span><p>Het korte antwoord</p></div>
                <h2 id="kort-antwoord">Vul een afgekoelde installatie rustig bij tot de druk uit de handleiding.</h2>
                <p>{article.quickAnswer}</p>
                <dl>
                  {article.keyFacts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
                </dl>
              </section>

              <section className="article-section article-supplies" aria-labelledby="nodig">
                <p className="article-section-kicker">Voor u begint</p>
                <h2 id="nodig">Dit heeft u nodig.</h2>
                <ul>{article.supplies.map((supply) => <li key={supply}><span aria-hidden="true">✓</span>{supply}</li>)}</ul>
              </section>

              {article.sections.map((section) => (
                <section className="article-section" id={section.id} key={section.id}>
                  <h2>{section.heading}</h2>
                  {section.lead && <p className="article-section-lead">{section.lead}</p>}
                  {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.bullets && <ul className="article-bullet-list">{section.bullets.map((bullet) => <li key={bullet}><span aria-hidden="true">✓</span>{bullet}</li>)}</ul>}
                  {section.steps && <ol className="article-steps">{section.steps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>}
                  {section.note && <ArticleCallout note={section.note} />}
                </section>
              ))}

              <section className="article-section article-faq" id="veelgestelde-vragen">
                <p className="article-section-kicker">Veelgestelde vragen</p>
                <h2>Korte antwoorden over bijvullen en waterdruk.</h2>
                <div>{article.faqs.map((faq) => <details key={faq.question}><summary><strong>{faq.question}</strong><span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div>
              </section>

              <section className="article-service-links" aria-labelledby="verder-helpen">
                <p className="article-section-kicker">Verder op de website</p>
                <h2 id="verder-helpen">De juiste vervolgstap voor uw situatie.</h2>
                <div>{article.serviceLinks.map((serviceLink) => <Link href={serviceLink.href} key={serviceLink.href} data-track="article-internal-link" data-article={article.slug}><strong>{serviceLink.label}</strong><p>{serviceLink.description}</p><span aria-hidden="true">→</span></Link>)}</div>
              </section>

              <section className="article-sources" aria-labelledby="bronnen">
                <h2 id="bronnen">Gebruikte bronnen</h2>
                <p>Dit artikel is geschreven vanuit onze praktijk en gecontroleerd aan de hand van actuele informatie van de ketelmerken die wij onderhouden. De handleiding van uw eigen toestel blijft altijd leidend.</p>
                <ul>{article.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label} <span aria-hidden="true">↗</span></a></li>)}</ul>
              </section>

              <aside className="article-expert-box">
                <div className="article-expert-mark" aria-hidden="true">RB</div>
                <div><span>Gecontroleerd door</span><h2>{article.author.name}</h2><p>Service & Montagebedrijf Rob Braam werkt vanuit &apos;s-Hertogenbosch met een eigen serviceteam. Onze CO-certificering loopt via CO-Keur en Braam staat geregistreerd bij InstallQ.</p><Link href={article.author.href}>Maak kennis met ons bedrijf <span aria-hidden="true">→</span></Link></div>
              </aside>
            </div>
          </div>

          <section className="section article-related-section reveal">
            <div className="shell">
              <div className="section-heading split-heading"><div><p className="eyebrow"><span /> Aansluitend lezen</p><h2>Meer over uw cv-installatie.</h2></div><p>Deze onderwerpen worden pas klikbaar wanneer de volledige uitleg inhoudelijk is gecontroleerd. Zo voorkomen we korte pagina&apos;s die vooral voor zoekmachines zijn gemaakt.</p></div>
              <div className="knowledge-card-grid knowledge-related-grid">{relatedItems.map((item) => <KnowledgeCard item={item} compact key={item.slug} />)}</div>
              <Link className="text-link article-all-link" href="/kennisbank">Bekijk alle onderwerpen in de kennisbank <span aria-hidden="true">→</span></Link>
            </div>
          </section>

          <section className="article-conversion reveal">
            <div className="shell article-conversion-inner">
              <div><p className="eyebrow eyebrow-light"><span /> {article.cta.eyebrow}</p><h2>{article.cta.title}</h2><p>{article.cta.text}</p></div>
              <div><Link className="button button-light" href={article.cta.primaryHref} data-track="article-primary-cta" data-article={article.slug}>{article.cta.primaryLabel} <span aria-hidden="true">→</span></Link><Link href={article.cta.secondaryHref} data-track="article-secondary-cta" data-article={article.slug}>{article.cta.secondaryLabel} <span aria-hidden="true">→</span></Link></div>
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
