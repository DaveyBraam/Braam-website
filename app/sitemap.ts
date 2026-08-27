import type { MetadataRoute } from "next";
import { getPublishedArticles } from "./knowledge-data";
import { absoluteUrl } from "./site-config";

const staticRoutes = [
  "",
  "/warmtepompen",
  "/cv-ketels",
  "/airco",
  "/elektra",
  "/onderhoud",
  "/service",
  "/projecten",
  "/veelgestelde-vragen",
  "/over-ons",
  "/contact",
  "/privacy",
  "/kennisbank",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUpdatedAt = new Date("2026-08-13T08:00:00+02:00");
  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route || "/"),
    lastModified: siteUpdatedAt,
  }));
  const articles: MetadataRoute.Sitemap = getPublishedArticles().map((article) => ({
    url: absoluteUrl(`/kennisbank/${article.slug}`),
    lastModified: new Date(article.modifiedAt),
  }));

  return [...pages, ...articles];
}
