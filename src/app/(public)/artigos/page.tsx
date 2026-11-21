import type { Metadata } from "next";
import Link from "next/link";

import { ArticleCard } from "@/components/public/article-card";
import { FilterChips } from "@/components/public/filter-chips";
import { Pagination } from "@/components/public/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { ARTICLE_LEVELS, LEVEL_LABELS } from "@/lib/constants";
import { listPublishedArticles } from "@/lib/data/articles";
import { listCategories } from "@/lib/data/categories";
import { routes, withParams } from "@/lib/routes";
import { type RawSearchParams, readPage, readParam } from "@/lib/search-params";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artigos e guias",
  description:
    "Guias rápidos de Squad organizados por categoria e nível: infantaria, liderança, logística, blindados, morteiros e mapas.",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const categorySlug = readParam(params, "categoria");
  const level = readParam(params, "nivel");
  const query = readParam(params, "q");
  const page = readPage(params);

  const [categories, result] = await Promise.all([
    listCategories(),
    listPublishedArticles({
      categorySlug,
      level,
      query,
      page,
      pageSize: 9,
    }),
  ]);

  const activeCategory = categories.find(
    (category) => category.slug === categorySlug,
  );

  const levelChips = [
    {
      label: "Todos",
      href: withParams(routes.articles, { categoria: categorySlug, q: query }),
      active: !level,
    },
    ...ARTICLE_LEVELS.map((item) => ({
      label: LEVEL_LABELS[item],
      href: withParams(routes.articles, {
        categoria: categorySlug,
        q: query,
        nivel: item,
      }),
      active: level === item,
    })),
  ];

  const categoryChips = [
    {
      label: "Todas",
      href: withParams(routes.articles, { nivel: level, q: query }),
      active: !categorySlug,
    },
    ...categories.map((category) => ({
      label: category.name,
      href: withParams(routes.articles, {
        nivel: level,
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
          Blog tático
        </p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-tight text-zinc-50 sm:text-4xl">
          Artigos & guias
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
          {activeCategory
            ? `Trilha ${activeCategory.name}: ${activeCategory.description ?? "conteúdos selecionados."}`
            : "Mecânicas, funções e decisões explicadas em português, com nível de exigência e versão do jogo."}
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <FilterChips label="Nível" items={levelChips} />
          <FilterChips label="Categoria" items={categoryChips} />
        </aside>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              {result.total}{" "}
              {result.total === 1 ? "artigo encontrado" : "artigos encontrados"}
            </p>

            {query ? (
              <Link
                href={withParams(routes.articles, {
                  categoria: categorySlug,
                  nivel: level,
                })}
                className="text-xs uppercase tracking-wider text-amber-500 hover:text-amber-400"
              >
                Busca: “{query}” · limpar
              </Link>
            ) : null}
          </div>

          {result.items.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {result.items.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum artigo encontrado"
              description="Ajuste os filtros ou tente outro termo de busca."
              action={
                <Link
                  href={routes.articles}
                  className="text-xs uppercase tracking-wider text-amber-500 hover:text-amber-400"
                >
                  Ver todos os artigos
                </Link>
              }
            />
          )}

          <Pagination
            page={result.page}
            pageCount={result.pageCount}
            makeHref={(target) =>
              withParams(routes.articles, {
                categoria: categorySlug,
                nivel: level,
                q: query,
                page: target,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
