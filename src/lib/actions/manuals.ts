"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "../db";
import { slugify, uniqueSlug } from "../slug";
import {
  deleteUpload,
  isUploadFile,
  saveUpload,
  StorageError,
} from "../storage";
import {
  extractFieldErrors,
  formDataToObject,
  manualSchema,
} from "../validation";
import { errorState, type ActionState } from "./state";

function revalidateManualPaths(...slugs: Array<string | undefined>): void {
  revalidatePath("/");
  revalidatePath("/manuais");
  revalidatePath("/admin/manuais");

  for (const slug of slugs) {
    if (slug) {
      revalidatePath(`/manuais/${slug}`);
    }
  }
}

async function resolveManualSlug(
  base: string,
  ignoreId?: string,
): Promise<string> {
  return uniqueSlug(slugify(base), async (candidate) => {
    const found = await prisma.manual.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    return Boolean(found && found.id !== ignoreId);
  });
}

function storageErrorMessage(error: unknown): string {
  return error instanceof StorageError
    ? error.message
    : "Não foi possível salvar o arquivo enviado.";
}

function getFileEntry(
  formData: FormData,
  field: string,
): File | null {
  const entry = formData.get(field);
  return isUploadFile(entry) && entry.size > 0 ? entry : null;
}

export async function createManualAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = manualSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return errorState(
      "Revise os campos abaixo.",
      extractFieldErrors(parsed.error),
    );
  }

  const pdfFile = getFileEntry(formData, "pdf");

  if (!pdfFile) {
    return errorState("Selecione o arquivo PDF do manual.", {
      pdf: ["O arquivo PDF é obrigatório."],
    });
  }

  let pdfUrl: string;

  try {
    pdfUrl = await saveUpload(pdfFile, "pdfs");
  } catch (error) {
    const message = storageErrorMessage(error);
    return errorState(message, { pdf: [message] });
  }

  let coverUrl: string | null = null;
  const coverFile = getFileEntry(formData, "cover");

  if (coverFile) {
    try {
      coverUrl = await saveUpload(coverFile, "covers");
    } catch (error) {
      await deleteUpload(pdfUrl);
      const message = storageErrorMessage(error);
      return errorState(message, { cover: [message] });
    }
  }

  const data = parsed.data;
  const slug = await resolveManualSlug(data.slug ?? data.title);

  try {
    await prisma.manual.create({
      data: { ...data, slug, pdfUrl, coverUrl },
    });
  } catch (error) {
    await deleteUpload(pdfUrl);
    await deleteUpload(coverUrl);
    console.error("Falha ao criar manual:", error);
    return errorState("Não foi possível salvar o manual. Tente novamente.");
  }

  revalidateManualPaths(slug);
  redirect("/admin/manuais");
}

export async function updateManualAction(
  id: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const existing = await prisma.manual.findUnique({ where: { id } });

  if (!existing) {
    return errorState("Manual não encontrado.");
  }

  const parsed = manualSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return errorState(
      "Revise os campos abaixo.",
      extractFieldErrors(parsed.error),
    );
  }

  let pdfUrl = existing.pdfUrl;
  let uploadedPdf: string | null = null;
  const pdfFile = getFileEntry(formData, "pdf");

  if (pdfFile) {
    try {
      uploadedPdf = await saveUpload(pdfFile, "pdfs");
      pdfUrl = uploadedPdf;
    } catch (error) {
      const message = storageErrorMessage(error);
      return errorState(message, { pdf: [message] });
    }
  }

  let coverUrl = existing.coverUrl;
  let uploadedCover: string | null = null;
  const coverFile = getFileEntry(formData, "cover");

  if (coverFile) {
    try {
      uploadedCover = await saveUpload(coverFile, "covers");
      coverUrl = uploadedCover;
    } catch (error) {
      await deleteUpload(uploadedPdf);
      const message = storageErrorMessage(error);
      return errorState(message, { cover: [message] });
    }
  }

  const data = parsed.data;
  const slug = await resolveManualSlug(data.slug ?? data.title, id);

  try {
    await prisma.manual.update({
      where: { id },
      data: { ...data, slug, pdfUrl, coverUrl },
    });
  } catch (error) {
    await deleteUpload(uploadedPdf);
    await deleteUpload(uploadedCover);
    console.error("Falha ao atualizar manual:", error);
    return errorState("Não foi possível salvar o manual. Tente novamente.");
  }

  // Só remove os arquivos antigos após o banco confirmar a troca.
  if (uploadedPdf) {
    await deleteUpload(existing.pdfUrl);
  }
  if (uploadedCover) {
    await deleteUpload(existing.coverUrl);
  }

  revalidateManualPaths(existing.slug, slug);
  redirect("/admin/manuais");
}

export async function deleteManualAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    return errorState("Manual inválido.");
  }

  const existing = await prisma.manual.findUnique({ where: { id } });

  if (!existing) {
    return errorState("Manual não encontrado.");
  }

  await prisma.manual.delete({ where: { id } });

  await deleteUpload(existing.pdfUrl);
  await deleteUpload(existing.coverUrl);

  revalidateManualPaths(existing.slug);
  redirect("/admin/manuais");
}
