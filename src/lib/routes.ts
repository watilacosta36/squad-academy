/** Rotas centrais para evitar strings soltas entre componentes. */

export const routes = {
  home: "/",
  articles: "/artigos",
  manuals: "/manuais",
  search: "/busca",
  admin: "/admin",
  adminLogin: "/admin/login",
  adminCategories: "/admin/categorias",
  adminArticles: "/admin/artigos",
  adminManuals: "/admin/manuais",
} as const;

export function articlePath(slug: string): string {
  return `${routes.articles}/${slug}`;
}

export function manualPath(slug: string): string {
  return `${routes.manuals}/${slug}`;
}

export function categoryPath(slug: string): string {
  return `/categorias/${slug}`;
}

export type ManualFileMode = "visualizar" | "baixar";

/**
 * Endpoint que conta o download/visualização e entrega o PDF.
 * Implementado na Fase 5 em `src/app/api/manuais/[slug]/arquivo/route.ts`.
 */
export function manualFileUrl(slug: string, mode: ManualFileMode): string {
  return `/api/manuais/${slug}/arquivo?modo=${mode}`;
}

export function searchPath(query?: string): string {
  const trimmed = query?.trim();

  return trimmed
    ? `${routes.search}?q=${encodeURIComponent(trimmed)}`
    : routes.search;
}

/** Monta `path?params` ignorando valores vazios. */
export function withParams(
  path: string,
  params: Record<string, string | number | null | undefined>,
): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }

  const query = search.toString();
  return query ? `${path}?${query}` : path;
}
