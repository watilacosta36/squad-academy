import type { Metadata } from "next";
import Link from "next/link";

import { ArticleCard } from "@/components/public/article-card";
import { ManualCard } from "@/components/public/manual-card";
import { SearchBar } from "@/components/public/search-bar";
import { SectionHeading } from "@/components/public/section-heading";
import { EmptyState } from "@/components/ui/empty-state";
import { listPublishedArticles } from "@/lib/data/articles";
import { listCategories } from "@/lib/data/categories";
import { listPublishedManuals } from "@/lib/data/manuals";
import { categoryPath, routes, withParams } from "@/lib/routes";
import { type RawSearchParams, readParam } from "@/lib/search-params";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Busca",
  description: "Busque artigos, guias e manuais em PDF do Squad Academy.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const query = readParam(params, "q");

  const [categories, articles, manuals] = await Promise.all([
    listCategories(),
    query
      ? listPublishedArticles({ query, pageSize: 6 })
      : Promise.resolve(null),
    query
      ? listPublishedManuals({ query, pageSize: 6 })
      : Promise.resolve(null),
  ]);

  const total = (articles?.total ?? 0) + (manuals?.total ?? 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <header className="border-b border-graphite-800 pb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-amber-500">
          Reconhecimento
        </p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-tight text-zinc-50 sm:text-4xl">
          Busca
        </h1>

        <div className="mt-8 max-w-2xl">
          <SearchBar id="search-page" defaultValue={query ?? ""} />
        </div>
      </header>

      {!query ? (
        <div className="mt-8 space-y-6">
          <p className="text-sm text-zinc-400">
            Digite um termo acima ou comece por uma trilha:
          </p>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={categoryPath(category.slug)}
                className="rounded-sm border border-graphite-600 bg-graphite-900 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-400 transition-colors hover:border-amber-500/50 hover:text-amber-300"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-12">
          <p className="text-xs uppercase tracking-wider text-zinc-500">
            {total} {total === 1 ? "resultado" : "resultados"} para “{query}”
          </p>

          {total === 0 ? (
            <EmptyState
              title="Nada encontrado"
              description={`Não localizamos conteúdo para “${query}”. Tente termos mais curtos, como “FOB”, “HAB” ou “blindado”.`}
              action={
                <Link
                  href={routes.articles}
                  className="text-xs uppercase tracking-wider text-amber-500 hover:text-amber-400"
                >
                  Navegar pelos artigos
                </Link>
              }
            />
          ) : (
            <>
              {articles && articles.items.length > 0 ? (
                <section className="space-y-5">
                  <SectionHeading
                    eyebrow={`${articles.total} em artigos`}
                    title="Artigos"
                    href={withParams(routes.articles, { q: query })}
                  />

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {articles.items.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </section>
              ) : null}

              {manuals && manuals.items.length > 0 ? (
                <section className="space-y-5">
                  <SectionHeading
                    eyebrow={`${manuals.total} em manuais`}
                    title="Manuais em PDF"
                    href={withParams(routes.manuals, { q: query })}
                  />

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {manuals.items.map((manual) => (
                      <ManualCard key={manual.id} manual={manual} />
                    ))}
                  </div>
                </section>
              ) : null}
            </>
          )}
        </div>
      )}
    </div>
  );
}
