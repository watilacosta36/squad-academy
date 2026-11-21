import { z } from "zod";

import { ARTICLE_LEVELS, CONTENT_STATUSES } from "./constants";
/** Campo de slug opcional: vazio vira `undefined` para o slug ser gerado. */
const optionalSlug = z
  .string()
  .trim()
  .max(80, "O slug deve ter no máximo 80 caracteres.")
  .optional()
  .transform((value) => (value ? value : undefined));

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : undefined));

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe ao menos 2 caracteres.")
    .max(80, "Máximo de 80 caracteres."),
  slug: optionalSlug,
  description: optionalText(500),
});

export const articleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(6, "O título precisa de ao menos 6 caracteres.")
    .max(140, "Máximo de 140 caracteres."),
  slug: optionalSlug,
  excerpt: z
    .string()
    .trim()
    .min(20, "O resumo precisa de ao menos 20 caracteres.")
    .max(320, "Máximo de 320 caracteres."),
  content: z
    .string()
    .trim()
    .min(50, "O conteúdo precisa de ao menos 50 caracteres."),
  level: z.enum(ARTICLE_LEVELS),
  gameVersion: z
    .string()
    .trim()
    .min(1, "Informe a versão do jogo.")
    .max(40, "Máximo de 40 caracteres."),
  status: z.enum(CONTENT_STATUSES),
  categoryId: z.string().trim().min(1, "Selecione uma categoria."),
});

export const manualSchema = z.object({
  title: z
    .string()
    .trim()
    .min(6, "O título precisa de ao menos 6 caracteres.")
    .max(140, "Máximo de 140 caracteres."),
  slug: optionalSlug,
  description: z
    .string()
    .trim()
    .min(20, "A descrição precisa de ao menos 20 caracteres.")
    .max(600, "Máximo de 600 caracteres."),
  gameVersion: z
    .string()
    .trim()
    .min(1, "Informe a versão do jogo.")
    .max(40, "Máximo de 40 caracteres."),
  status: z.enum(CONTENT_STATUSES),
  categoryId: z.string().trim().min(1, "Selecione uma categoria."),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe a senha."),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type ArticleInput = z.infer<typeof articleSchema>;
export type ManualInput = z.infer<typeof manualSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Converte os campos de texto de um `FormData` em objeto plano para o zod.
 * Arquivos (File) são tratados separadamente pelas actions de upload.
 */
export function formDataToObject(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      values[key] = value;
    }
  }

  return values;
}

/** Normaliza os erros de validação para o formato exibido nos formulários. */
export function extractFieldErrors(
  error: z.ZodError,
): Record<string, string[]> {
  const normalized: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field !== "string") {
      continue;
    }

    normalized[field] = [...(normalized[field] ?? []), issue.message];
  }

  return normalized;
}
