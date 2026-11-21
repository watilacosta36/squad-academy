"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "../db";
import { slugify, uniqueSlug } from "../slug";
import {
  categorySchema,
  extractFieldErrors,
  formDataToObject,
} from "../validation";
import { errorState, type ActionState } from "./state";

function revalidateCategoryPaths(): void {
  revalidatePath("/");
  revalidatePath("/admin/categorias");
}

async function resolveCategorySlug(
  base: string,
  ignoreId?: string,
): Promise<string> {
  return uniqueSlug(slugify(base), async (candidate) => {
    const found = await prisma.category.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    return Boolean(found && found.id !== ignoreId);
  });
}

export async function createCategoryAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = categorySchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return errorState(
      "Revise os campos abaixo.",
      extractFieldErrors(parsed.error),
    );
  }

  const { name, description } = parsed.data;
  const slug = await resolveCategorySlug(parsed.data.slug ?? name);

  await prisma.category.create({
    data: { name, slug, description: description ?? null },
  });

  revalidateCategoryPaths();
  redirect("/admin/categorias");
}

export async function updateCategoryAction(
  id: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const existing = await prisma.category.findUnique({ where: { id } });

  if (!existing) {
    return errorState("Categoria não encontrada.");
  }

  const parsed = categorySchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return errorState(
      "Revise os campos abaixo.",
      extractFieldErrors(parsed.error),
    );
  }

  const { name, description } = parsed.data;
  const slug = await resolveCategorySlug(parsed.data.slug ?? name, id);

  await prisma.category.update({
    where: { id },
    data: { name, slug, description: description ?? null },
  });

  revalidateCategoryPaths();
  redirect("/admin/categorias");
}

export async function deleteCategoryAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    return errorState("Categoria inválida.");
  }

  const [articles, manuals] = await Promise.all([
    prisma.article.count({ where: { categoryId: id } }),
    prisma.manual.count({ where: { categoryId: id } }),
  ]);

  if (articles + manuals > 0) {
    return errorState(
      "Esta categoria ainda possui artigos ou manuais vinculados. Mova ou exclua esse conteúdo antes.",
    );
  }

  await prisma.category.delete({ where: { id } });

  revalidateCategoryPaths();
  redirect("/admin/categorias");
}
