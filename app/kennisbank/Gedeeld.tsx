import Link from "next/link";
import { knowledgeCategories, type KnowledgeCardData, type KnowledgeItem } from "../knowledge-data";
import { artikelHref } from "./basis";

/* Stukken die de kennisbank en de artikelpagina delen, zodat ze er hetzelfde
   uitzien: het hulpblok in de kop en één rij in een lijst met onderwerpen. */

export function DirectHulp() {
  return (
    <aside className="kb-hulp" aria-label="Direct hulp">
      <p className="kb-hulp-kop">Direct hulp nodig?</p>
      <a href="tel:+31736222199"><span>Storing die niet kan wachten</span><strong>073 622 2199</strong></a>
      <a href="tel:08009009" className="kb-hulp-gas"><span>Ruikt u gas? Dag en nacht</span><strong>0800 9009</strong></a>
    </aside>
  );
}

type Onderwerp = KnowledgeCardData | KnowledgeItem;

export function OnderwerpRij({ item }: { item: Onderwerp }) {
  const cat = knowledgeCategories.find((c) => c.slug === item.category)!;
  const live = item.status === "published";
  const leestijd = live && "readingTime" in item ? item.readingTime : null;
  return (
    <li className="kb-artikel" data-status={item.status}>
      <div className="kb-artikel-tekst">
        <p className="kb-artikel-meta">{cat.label}{leestijd ? <> · {leestijd}</> : null}</p>
        <h3>{live ? <Link href={artikelHref(item.slug)}>{item.title}</Link> : item.title}</h3>
        <p>{item.excerpt}</p>
      </div>
      <div className="kb-artikel-actie">
        {live ? (
          <Link className="kb-knop" href={artikelHref(item.slug)} aria-hidden="true" tabIndex={-1}>Lees het artikel</Link>
        ) : (
          <span className="kb-binnenkort">In voorbereiding</span>
        )}
      </div>
    </li>
  );
}
