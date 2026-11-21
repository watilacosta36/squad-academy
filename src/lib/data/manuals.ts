import type { Prisma } from "../../generated/prisma/client";
import { MANUALS_PAGE_SIZE } from "../constants";
import { prisma } from "../db";

export type ManualListFilters = {
  categorySlug?: string;
  query?: string;
  page?: number;
  pageSize?: number;
};

export type ManualListItem = Prisma.ManualGetPayload<{
  include: { category: true };
}>;

export type PaginatedManuals = {
  items: ManualListItem[];
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

export async function listPublishedManuals(
  filters: ManualListFilters = {},
): Promise<PaginatedManuals> {
  const page = normalizePage(filters.page);
  const pageSize = Math.min(
    Math.max(filters.pageSize ?? MANUALS_PAGE_SIZE, 1),
    50,
  );
  const query = filters.query?.trim();

  const where: Prisma.ManualWhereInput = {
    status: "PUBLISHED",
    ...(filters.categorySlug ? { category: { slug: filters.categorySlug } } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { category: { name: { contains: query } } },
          ],
        }
      : {}),
  };

  const [total, items] = await Promise.all([
    prisma.manual.count({ where }),
    prisma.manual.findMany({
      where,
      include: { category: true },
      orderBy: [{ createdAt: "desc" }],
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

export async function listTopManuals(limit = 3) {
  return prisma.manual.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true },
    orderBy: [{ downloadsCount: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export async function getPublishedManualBySlug(slug: string) {
  return prisma.manual.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { category: true },
  });
}

export async function getPublishedManualSlugs() {
  return prisma.manual.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });
}

/**
 * Incrementa o contador de downloads/visualizações e devolve os dados do PDF.
 * Retorna `null` quando o manual não existe ou não está publicado.
 */
export async function incrementManualDownloads(
  slug: string,
): Promise<{ pdfUrl: string; title: string } | null> {
  const manual = await prisma.manual.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { id: true, pdfUrl: true, title: true },
  });

  if (!manual) {
    return null;
  }

  await prisma.manual.update({
    where: { id: manual.id },
    data: { downloadsCount: { increment: 1 } },
  });

  return { pdfUrl: manual.pdfUrl, title: manual.title };
}

/* -------------------------------------------------------------------------- */
/* Admin                                                                      */
/* -------------------------------------------------------------------------- */

export async function listAdminManuals() {
  return prisma.manual.findMany({
    include: { category: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getManualById(id: string) {
  return prisma.manual.findUnique({
    where: { id },
    include: { category: true },
  });
}
