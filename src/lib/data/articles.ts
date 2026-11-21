import type { Prisma } from "../../generated/prisma/client";
import { ARTICLE_LEVELS, ARTICLES_PAGE_SIZE, type ArticleLevel } from "../constants";
import { prisma } from "../db";

export type ArticleListFilters = {
  categorySlug?: string;
  level?: string;
  query?: string;
  page?: number;
  pageSize?: number;
};

export type ArticleListItem = Prisma.ArticleGetPayload<{
  include: { category: true };
}>;

export type PaginatedArticles = {
  items: ArticleListItem[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
};

function normalizePage(value: number | undefined): number {
  if (!value || Number.isNaN(value) || value < 1) {
    return 1;
  }

  return Math.floor(value);
}

function normalizeLevel(level: string | undefined): ArticleLevel | undefined {
  if (!level) {
    return undefined;
  }

  return ARTICLE_LEVELS.includes(level as ArticleLevel)
    ? (level as ArticleLevel)
    : undefined;
}

export async function listPublishedArticles(
  filters: ArticleListFilters = {},
): Promise<PaginatedArticles> {
  const page = normalizePage(filters.page);
  const pageSize = Math.min(
    Math.max(filters.pageSize ?? ARTICLES_PAGE_SIZE, 1),
    50,
  );
  const level = normalizeLevel(filters.level);
  const query = filters.query?.trim();

  const where: Prisma.ArticleWhereInput = {
    status: "PUBLISHED",
    ...(filters.categorySlug ? { category: { slug: filters.categorySlug } } : {}),
    ...(level ? { level } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query } },
            { excerpt: { contains: query } },
            { category: { name: { contains: query } } },
          ],
        }
      : {}),
  };

  const [total, items] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      include: { category: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function listLatestPublishedArticles(limit = 6) {
  return prisma.article.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export async function getPublishedArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { category: true },
  });
}

export async function getPublishedArticleSlugs() {
  return prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });
}

export async function listRelatedArticles(
  categoryId: string,
  excludeId: string,
  limit = 3,
) {
  return prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      categoryId,
      id: { not: excludeId },
    },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

/* -------------------------------------------------------------------------- */
/* Admin                                                                      */
/* -------------------------------------------------------------------------- */

export async function listAdminArticles() {
  return prisma.article.findMany({
    include: { category: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getArticleById(id: string) {
  return prisma.article.findUnique({
    where: { id },
    include: { category: true },
  });
}
