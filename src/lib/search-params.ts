export type RawSearchParams = Record<string, string | string[] | undefined>;

/** Lê o primeiro valor de um searchParam (aceita `?a=1&a=2`). */
export function readParam(
  params: RawSearchParams,
  key: string,
): string | undefined {
  const value = params[key];
  const first = Array.isArray(value) ? value[0] : value;
  const trimmed = first?.trim();

  return trimmed ? trimmed : undefined;
}

/** Normaliza o parâmetro `page` (mínimo 1). */
export function readPage(params: RawSearchParams): number {
  const raw = readParam(params, "page");
  const page = raw ? Number.parseInt(raw, 10) : 1;

  return Number.isFinite(page) && page > 0 ? page : 1;
}
