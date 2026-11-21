import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { del, put } from "@vercel/blob";

/**
 * Abstração de armazenamento de PDFs e capas.
 *
 * - `STORAGE_PROVIDER=local` (padrão): grava em `public/uploads/` e devolve
 *   caminhos públicos `/uploads/...` (persistidos por volume no Docker).
 * - `STORAGE_PROVIDER=vercel-blob`: usa o Vercel Blob e devolve a URL pública.
 */

export type StorageProvider = "local" | "vercel-blob";
export type UploadFolder = "pdfs" | "covers";

const UPLOADS_ROOT = path.resolve(process.cwd(), "public", "uploads");

const MAX_BYTES: Record<UploadFolder, number> = {
  pdfs: 20 * 1024 * 1024,
  covers: 5 * 1024 * 1024,
};

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

export function getStorageProvider(): StorageProvider {
  return process.env.STORAGE_PROVIDER === "vercel-blob"
    ? "vercel-blob"
    : "local";
}

export function getMaxUploadMb(folder: UploadFolder): number {
  return Math.round(MAX_BYTES[folder] / 1024 / 1024);
}

/** Valida tipo e tamanho antes de qualquer escrita. */
export function assertValidUpload(file: File, folder: UploadFolder): void {
  if (!file || file.size === 0) {
    throw new StorageError("O arquivo enviado está vazio.");
  }

  if (file.size > MAX_BYTES[folder]) {
    throw new StorageError(
      `Arquivo muito grande. O limite é ${getMaxUploadMb(folder)} MB.`,
    );
  }

  if (folder === "pdfs") {
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      throw new StorageError("Envie um arquivo no formato PDF.");
    }

    return;
  }

  const type = file.type.toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.has(type)) {
    throw new StorageError(
      "Envie uma imagem JPG, PNG, WebP ou AVIF como capa.",
    );
  }
}

/** Salva o arquivo e devolve a URL pública correspondente. */
export async function saveUpload(
  file: File,
  folder: UploadFolder,
): Promise<string> {
  assertValidUpload(file, folder);

  const extension =
    path.extname(file.name).toLowerCase() ||
    (folder === "pdfs" ? ".pdf" : ".jpg");
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}${extension}`;

  if (getStorageProvider() === "vercel-blob") {
    const blob = await put(`${folder}/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || undefined,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return blob.url;
  }

  const directory = path.join(UPLOADS_ROOT, folder);
  await mkdir(directory, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(directory, filename), buffer);

  return `/uploads/${folder}/${filename}`;
}

/** Remove um arquivo gerenciado (ignora URLs externas e arquivos ausentes). */
export async function deleteUpload(url: string | null | undefined): Promise<void> {
  if (!url) {
    return;
  }

  try {
    if (url.startsWith("/uploads/")) {
      const target = path.resolve(UPLOADS_ROOT, url.replace(/^\/uploads\//, ""));

      // Nunca remove nada fora de public/uploads.
      if (!target.startsWith(`${UPLOADS_ROOT}${path.sep}`)) {
        return;
      }

      await unlink(target);
      return;
    }

    if (/^https?:\/\//.test(url) && process.env.BLOB_READ_WRITE_TOKEN) {
      await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return;
    }

    console.error("Falha ao remover arquivo do storage:", url, error);
  }
}

/** Aceita `File` vindo de `FormData` (compatível com undici/Node e browser). */
export function isUploadFile(value: FormDataEntryValue | null): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    "size" in value &&
    typeof (value as File).size === "number"
  );
}

/**
 * Lê um arquivo local gerenciado pelo storage (`/uploads/...`).
 * Retorna `null` para URLs externas (ex.: Vercel Blob) ou arquivo ausente.
 */
export async function readUpload(
  url: string,
): Promise<Uint8Array | null> {
  if (!url.startsWith("/uploads/")) {
    return null;
  }

  const target = path.resolve(UPLOADS_ROOT, url.replace(/^\/uploads\//, ""));

  if (!target.startsWith(`${UPLOADS_ROOT}${path.sep}`)) {
    return null;
  }

  try {
    const buffer = await readFile(target);
    return new Uint8Array(buffer);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("Falha ao ler arquivo do storage:", url, error);
    }

    return null;
  }
}
