"use client";

import { useMemo, useState } from "react";
import { knowledgeCategories, type KnowledgeCardData, type KnowledgeCategorySlug } from "../knowledge-data";
import { KnowledgeCard } from "./KnowledgeCard";

type CategoryFilter = "all" | KnowledgeCategorySlug;

export function KnowledgeExplorer({ items }: { items: KnowledgeCardData[] }) {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("nl");
    return items.filter((item) => {
      const itemCategory = knowledgeCategories.find((entry) => entry.slug === item.category)!;
      const matchesCategory = category === "all" || item.category === category;
      const matchesQuery = !normalizedQuery || `${item.title} ${item.excerpt} ${itemCategory.label}`.toLocaleLowerCase("nl").includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, items, query]);

  return (
    <div className="knowledge-explorer">
      <div className="knowledge-tools" aria-label="Kennisbank doorzoeken en filteren">
        <label className="knowledge-search">
          <span className="sr-only">Zoek in de kennisbank</span>
          <i aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Zoek bijvoorbeeld op waterdruk, storing of onderhoud"
          />
        </label>
        <div className="knowledge-filters" aria-label="Filter op onderwerp">
          <button type="button" className={category === "all" ? "is-active" : ""} onClick={() => setCategory("all")} aria-pressed={category === "all"}>Alles</button>
          {knowledgeCategories.map((entry) => (
            <button key={entry.slug} type="button" className={category === entry.slug ? "is-active" : ""} onClick={() => setCategory(entry.slug)} aria-pressed={category === entry.slug}>
              {entry.label}
            </button>
          ))}
        </div>
      </div>

      <p className="knowledge-result-count" aria-live="polite">
        {filteredItems.length === 1 ? "1 onderwerp gevonden" : `${filteredItems.length} onderwerpen gevonden`}
      </p>

      {filteredItems.length > 0 ? (
        <div className="knowledge-card-grid">
          {filteredItems.map((item) => <KnowledgeCard item={item} key={item.slug} />)}
        </div>
      ) : (
        <div className="knowledge-empty">
          <strong>Geen onderwerp gevonden.</strong>
          <p>Probeer een andere zoekterm of bekijk alle categorieën.</p>
          <button type="button" onClick={() => { setCategory("all"); setQuery(""); }}>Wis de filters</button>
        </div>
      )}
    </div>
  );
}
