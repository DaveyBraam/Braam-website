import Link from "next/link";
import { getKnowledgeCategory, type KnowledgeCardData } from "../knowledge-data";

type KnowledgeCardProps = {
  item: KnowledgeCardData;
  compact?: boolean;
};

export function KnowledgeCard({ item, compact = false }: KnowledgeCardProps) {
  const category = getKnowledgeCategory(item.category);
  const className = [
    "knowledge-card",
    item.status === "published" ? "knowledge-card-published" : "knowledge-card-planned",
    compact ? "knowledge-card-compact" : "",
  ].filter(Boolean).join(" ");

  return (
    <article className={className} data-category={item.category}>
      {item.status === "published" ? (
        <Link className="knowledge-card-visual" href={`/kennisbank/${item.slug}`} aria-label={item.cardCta}>
          <img src={item.heroImage} alt={item.heroImageAlt} loading="lazy" />
          <span className="knowledge-card-visual-label">{item.visualLabel}</span>
        </Link>
      ) : (
        <div className="knowledge-card-visual knowledge-card-visual-placeholder" aria-hidden="true">
          <span>{item.visualLabel}</span>
          <i />
        </div>
      )}

      <div className="knowledge-card-body">
        <div className="knowledge-card-meta">
          <span>{category.label}</span>
          {item.status === "published" ? <small>{item.readingTime}</small> : <small>Binnenkort</small>}
        </div>
        <h3>
          {item.status === "published" ? <Link href={`/kennisbank/${item.slug}`}>{item.title}</Link> : item.title}
        </h3>
        <p>{item.excerpt}</p>
        {item.status === "published" ? (
          <Link className="knowledge-card-link" href={`/kennisbank/${item.slug}`} data-track="knowledge-card" data-article={item.slug}>
            {item.cardCta} <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <span className="knowledge-card-coming">Artikel in voorbereiding</span>
        )}
      </div>
    </article>
  );
}
