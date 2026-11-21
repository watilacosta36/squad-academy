import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";
import { getPublishedArticleSlugs } from "@/lib/data/articles";
import { listCategories } from "@/lib/data/categories";
import { getPublishedManualSlugs } from "@/lib/data/manuals";
import { articlePath, categoryPath, manualPath, routes } from "@/lib/routes";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = [
    routes.home,
    routes.articles,
    routes.manuals,
    routes.search,
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === routes.home ? 1 : 0.7,
  }));

  try {
    const [categories, articles, manuals] = await Promise.all([
      listCategories(),
      getPublishedArticleSlugs(),
      getPublishedManualSlugs(),
    ]);

    return [
      ...staticEntries,
      ...categories.map((category) => ({
        url: `${SITE_URL}${categoryPath(category.slug)}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...articles.map((article) => ({
        url: `${SITE_URL}${articlePath(article.slug)}`,
        lastModified: article.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...manuals.map((manual) => ({
        url: `${SITE_URL}${manualPath(manual.slug)}`,
        lastModified: manual.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch (error) {
    // Banco indisponível durante o build: publica ao menos as rotas estáticas.
    console.error("Falha ao gerar sitemap dinâmico:", error);
    return staticEntries;
  }
}
