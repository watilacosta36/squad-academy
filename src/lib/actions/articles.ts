"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "../db";
import { slugify, uniqueSlug } from "../slug";
import {
  articleSchema,
  extractFieldErrors,
  formDataToObject,
} from "../validation";
import { errorState, type ActionState } from "./state";

function revalidateArticlePaths(...slugs: Array<string | undefined>): void {
  revalidatePath("/");
  revalidatePath("/artigos");
  revalidatePath("/admin/artigos");

  for (const slug of slugs) {
    if (slug) {
      revalidatePath(`/artigos/${slug}`);
    }
  }
}

async function resolveArticleSlug(
  base: string,
  ignoreId?: string,
): Promise<string> {
  return uniqueSlug(slugify(base), async (candidate) => {
    const found = await prisma.article.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    return Boolean(found && found.id !== ignoreId);
  });
}

export async function createArticleAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = articleSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return errorState(
      "Revise os campos abaixo.",
      extractFieldErrors(parsed.error),
    );
  }

  const data = parsed.data;
  const slug = await resolveArticleSlug(data.slug ?? data.title);

  await prisma.article.create({
    data: {
      ...data,
      slug,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidateArticlePaths(slug);
  redirect("/admin/artigos");
}

export async function updateArticleAction(
  id: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const existing = await prisma.article.findUnique({ where: { id } });

  if (!existing) {
    return errorState("Artigo não encontrado.");
  }

  const parsed = articleSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return errorState(
      "Revise os campos abaixo.",
      extractFieldErrors(parsed.error),
    );
  }

  const data = parsed.data;
  const slug = await resolveArticleSlug(data.slug ?? data.title, id);

  const publishedAt =
    data.status === "PUBLISHED"
      ? (existing.publishedAt ?? new Date())
      : null;

  await prisma.article.update({
    where: { id },
    data: { ...data, slug, publishedAt },
  });

  revalidateArticlePaths(existing.slug, slug);
  redirect("/admin/artigos");
}

export async function deleteArticleAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    return errorState("Artigo inválido.");
  }

  const existing = await prisma.article.findUnique({
    where: { id },
    select: { slug: true },
  });

  if (!existing) {
    return errorState("Artigo não encontrado.");
  }

  await prisma.article.delete({ where: { id } });

  revalidateArticlePaths(existing.slug);
  redirect("/admin/artigos");
}
