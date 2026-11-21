import { prisma } from "../db";

export type DashboardStats = {
  articles: number;
  publishedArticles: number;
  draftArticles: number;
  manuals: number;
  publishedManuals: number;
  totalDownloads: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    articles,
    publishedArticles,
    draftArticles,
    manuals,
    publishedManuals,
    downloads,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.article.count({ where: { status: "DRAFT" } }),
    prisma.manual.count(),
    prisma.manual.count({ where: { status: "PUBLISHED" } }),
    prisma.manual.aggregate({ _sum: { downloadsCount: true } }),
  ]);

  return {
    articles,
    publishedArticles,
    draftArticles,
    manuals,
    publishedManuals,
    totalDownloads: downloads._sum.downloadsCount ?? 0,
  };
}

export async function listRecentArticles(limit = 5) {
  return prisma.article.findMany({
    include: { category: true },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
}

export async function listRecentManuals(limit = 5) {
  return prisma.manual.findMany({
    include: { category: true },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
}
