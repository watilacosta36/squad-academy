import Link from "next/link";

export function Pagination({
  page,
  pageCount,
  makeHref,
}: {
  page: number;
  pageCount: number;
  makeHref: (page: number) => string;
}) {
  if (pageCount <= 1) {
    return null;
  }

  const previous = page > 1 ? page - 1 : null;
  const next = page < pageCount ? page + 1 : null;
  const base =
    "rounded-sm px-3 py-2 text-[11px] font-medium uppercase tracking-wider transition-colors";

  return (
    <nav
      aria-label="Paginação"
      className="flex items-center justify-between gap-3 border-t border-graphite-800 pt-5"
    >
      {previous ? (
        <Link
          href={makeHref(previous)}
          className={`${base} border border-graphite-600 text-zinc-300 hover:border-amber-500/50 hover:text-amber-400`}
        >
          ← Anterior
        </Link>
      ) : (
        <span className={`${base} border border-graphite-800 text-zinc-600`}>
          ← Anterior
        </span>
      )}

      <span className="text-[11px] uppercase tracking-wider text-zinc-500">
        Página {page} de {pageCount}
      </span>

      {next ? (
        <Link
          href={makeHref(next)}
          className={`${base} border border-graphite-600 text-zinc-300 hover:border-amber-500/50 hover:text-amber-400`}
        >
          Próxima →
        </Link>
      ) : (
        <span className={`${base} border border-graphite-800 text-zinc-600`}>
          Próxima →
        </span>
      )}
    </nav>
  );
}
