/**
 * Constantes compartilhadas entre servidor e cliente.
 * Níveis e status são strings no banco (SQLite não possui enum) e são
 * validados por `src/lib/validation.ts`.
 */

export const SITE_NAME = "Squad Academy";
export const SITE_DESCRIPTION =
  "Portal tático em português com guias, apostilas e manuais para dominar Squad.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Níveis de experiência do conteúdo. */
export const ARTICLE_LEVELS = ["RECRUTA", "VETERANO", "COMANDANTE"] as const;
export type ArticleLevel = (typeof ARTICLE_LEVELS)[number];

export const LEVEL_LABELS: Record<ArticleLevel, string> = {
  RECRUTA: "Recruta",
  VETERANO: "Veterano",
  COMANDANTE: "Comandante",
};

export const LEVEL_DESCRIPTIONS: Record<ArticleLevel, string> = {
  RECRUTA: "O essencial para quem acabou de chegar ao front.",
  VETERANO: "Mecânicas, funções e coordenação de esquadra.",
  COMANDANTE: "Decisões de time, assets e liderança de alto nível.",
};

export const LEVEL_BADGE_CLASSES: Record<ArticleLevel, string> = {
  RECRUTA: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  VETERANO: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  COMANDANTE: "border-orange-500/40 bg-orange-500/10 text-orange-200",
};

/** Status editorial de artigos e manuais. */
export const CONTENT_STATUSES = ["DRAFT", "PUBLISHED"] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const STATUS_LABELS: Record<ContentStatus, string> = {
  DRAFT: "Rascunho",
  PUBLISHED: "Publicado",
};

export const STATUS_BADGE_CLASSES: Record<ContentStatus, string> = {
  DRAFT: "border-zinc-600 bg-zinc-800/60 text-zinc-300",
  PUBLISHED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
};

/** Tamanhos de página das listagens públicas. */
export const ARTICLES_PAGE_SIZE = 9;
export const MANUALS_PAGE_SIZE = 9;
export const READING_WORDS_PER_MINUTE = 200;
