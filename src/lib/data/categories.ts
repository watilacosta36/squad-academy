import { prisma } from "../db";

export type CategoryOverview = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  articleCount: number;
  manualCount: number;
};

export async function listCategories(): Promise<CategoryOverview[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          articles: { where: { status: "PUBLISHED" } },
          manuals: { where: { status: "PUBLISHED" } },
        },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    articleCount: category._count.articles,
    manualCount: category._count.manuals,
  }));
}

export async function listCategoryOptions() {
  return prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

/** Lista do /admin: inclui contagens de rascunhos. */
export async function listAdminCategories(): Promise<CategoryOverview[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { articles: true, manuals: true },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    articleCount: category._count.articles,
    manualCount: category._count.manuals,
  }));
}
