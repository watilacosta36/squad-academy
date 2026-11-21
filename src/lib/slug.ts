/**
 * Geração de slugs em pt-BR.
 * "Morteiros & Artilharia" -> "morteiros-artilharia"
 */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Candidatos para resolver colisões de slug:
 * tentativa 1 -> "guia", 2 -> "guia-2", 3 -> "guia-3"...
 */
export function slugCandidate(base: string, attempt: number): string {
  const root = base || "conteudo";
  return attempt < 2 ? root : `${root}-${attempt}`;
}

/**
 * Gera um slug livre. `exists` deve retornar `true` quando o candidato
 * já estiver em uso (para updates, ignorar o próprio registro).
 */
export async function uniqueSlug(
  base: string,
  exists: (candidate: string) => Promise<boolean>,
): Promise<string> {
  for (let attempt = 1; attempt <= 50; attempt += 1) {
    const candidate = slugCandidate(base, attempt);

    if (!(await exists(candidate))) {
      return candidate;
    }
  }

  throw new Error("Não foi possível gerar um slug único para este título.");
}

/**
 * Versão normalizada usada na busca (remove acentos e pontuação),
 * mantendo o texto original para exibição.
 */
export function normalizeForSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
