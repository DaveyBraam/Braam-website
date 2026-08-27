import Link from "next/link";
import { getKnowledgeItemsForService, type KnowledgeService } from "../knowledge-data";
import { KnowledgeCard } from "./KnowledgeCard";

type RelatedKnowledgeProps = {
  service: KnowledgeService;
  eyebrow?: string;
  title?: string;
  intro?: string;
};

export function RelatedKnowledge({
  service,
  eyebrow = "Kennis uit de praktijk",
  title = "Handige tips voor uw installatie.",
  intro = "Lees wat u zelf veilig kunt controleren en wanneer het verstandig is om een monteur in te schakelen.",
}: RelatedKnowledgeProps) {
  const items = getKnowledgeItemsForService(service);

  return (
    <section className="section related-knowledge-section reveal">
      <div className="shell">
        <div className="section-heading split-heading related-knowledge-heading">
          <div><p className="eyebrow"><span /> {eyebrow}</p><h2>{title}</h2></div>
          <div><p>{intro}</p><Link className="text-link" href="/kennisbank">Bekijk de complete kennisbank <span aria-hidden="true">→</span></Link></div>
        </div>
        <div className="knowledge-card-grid knowledge-related-grid">
          {items.map((item) => <KnowledgeCard item={item} compact key={item.slug} />)}
        </div>
      </div>
    </section>
  );
}
