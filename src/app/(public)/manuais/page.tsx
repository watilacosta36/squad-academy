import type { Metadata } from "next";
import Link from "next/link";

import { FilterChips } from "@/components/public/filter-chips";
import { ManualCard } from "@/components/public/manual-card";
import { Pagination } from "@/components/public/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { listCategories } from "@/lib/data/categories";
import { listPublishedManuals } from "@/lib/data/manuals";
import { routes, withParams } from "@/lib/routes";
import { type RawSearchParams, readPage, readParam } from "@/lib/search-params";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manuais e apostilas em PDF",
  description:
    "Apostilas em PDF de Squad: liderança, logística, blindados e fogo indireto, com contador de downloads e versão do jogo.",
};

export default async function ManualsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const categorySlug = readParam(params, "categoria");
  const query = readParam(params, "q");
  const page = readPage(params);

  const [categories, result] = await Promise.all([
    listCategories(),
    listPublishedManuals({ categorySlug, query, page, pageSize: 9 }),
  ]);

  const categoryChips = [
    {
      label: "Todas",
      href: withParams(routes.manuals, { q: query }),
      active: !categorySlug,
    },
    ...categories.map((category) => ({
      label: category.name,
      href: withParams(routes.manuals, {
        q: query,
        categoria: category.slug,
      }),
      active: categorySlug === category.slug,
    })),
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <header className="border-b border-graphite-800 pb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-amber-500">
          Biblioteca
        </p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-tight text-zinc-50 sm:text-4xl">
          Manuais & apostilas
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
          PDFs para abrir no navegador ou baixar antes de entrar na partida.
          Cada arquivo indica a versão do Squad de referência.
        </p>
      </header>

      <div className="mt-8 space-y-6">
        <FilterChips label="Categoria" items={categoryChips} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-wider text-zinc-500">
            {result.total}{" "}
            {result.total === 1 ? "manual disponível" : "manuais disponíveis"}
          </p>

          {query ? (
            <Link
              href={withParams(routes.manuals, { categoria: categorySlug })}
              className="text-xs uppercase tracking-wider text-amber-500 hover:text-amber-400"
            >
              Busca: “{query}” · limpar
            </Link>
          ) : null}
        </div>

        {result.items.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {result.items.map((manual) => (
              <ManualCard key={manual.id} manual={manual} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhum manual encontrado"
            description="Ajuste a categoria ou tente outro termo de busca."
            action={
              <Link
                href={routes.manuals}
                className="text-xs uppercase tracking-wider text-amber-500 hover:text-amber-400"
              >
                Ver catálogo completo
              </Link>
            }
          />
        )}

        <Pagination
          page={result.page}
          pageCount={result.pageCount}
          makeHref={(target) =>
            withParams(routes.manuals, {
              categoria: categorySlug,
              q: query,
              page: target,
            })
          }
        />
      </div>
    </div>
  );
}
