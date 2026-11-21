import Link from "next/link";

import { ArticleCard } from "@/components/public/article-card";
import { CategoryGrid } from "@/components/public/category-grid";
import { ManualCard } from "@/components/public/manual-card";
import { SearchBar } from "@/components/public/search-bar";
import { SectionHeading } from "@/components/public/section-heading";
import { EmptyState } from "@/components/ui/empty-state";
import {
  ARTICLE_LEVELS,
  LEVEL_DESCRIPTIONS,
  LEVEL_LABELS,
} from "@/lib/constants";
import { listLatestPublishedArticles } from "@/lib/data/articles";
import { listCategories } from "@/lib/data/categories";
import { listTopManuals } from "@/lib/data/manuals";
import { getDashboardStats } from "@/lib/data/stats";
import { formatNumber } from "@/lib/format";
import { routes, withParams } from "@/lib/routes";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, latestArticles, topManuals, stats] = await Promise.all([
    listCategories(),
    listLatestPublishedArticles(6),
    listTopManuals(3),
    getDashboardStats(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-graphite-800">
        <div aria-hidden className="tactical-grid absolute inset-0 opacity-70" />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-graphite-950/30 via-graphite-950/80 to-graphite-950"
        />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-amber-500">
            Briefing tático · pt-BR
          </p>

          <h1 className="mt-4 max-w-3xl font-display text-4xl uppercase leading-[1.02] tracking-tight text-zinc-50 sm:text-5xl">
            Do spawn ao comando,{" "}
            <span className="text-amber-500">sem improviso.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
            Guias rápidos de infantaria, liderança, logística, blindados e fogo
            indireto — além de apostilas em PDF para consultar no meio da
            partida.
          </p>

          <div className="mt-8 max-w-xl">
            <SearchBar id="home-search" />
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-zinc-500">
                Artigos publicados
              </dt>
              <dd className="font-display text-2xl text-zinc-100">
                {formatNumber(stats.publishedArticles)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-zinc-500">
                Manuais em PDF
              </dt>
              <dd className="font-display text-2xl text-zinc-100">
                {formatNumber(stats.publishedManuals)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-zinc-500">
                Downloads
              </dt>
              <dd className="font-display text-2xl text-zinc-100">
                {formatNumber(stats.totalDownloads)}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl space-y-14 px-4 py-14 sm:px-6">
        <section className="space-y-5">
          <SectionHeading
            eyebrow="Trilhas"
            title="Escolha seu campo de operação"
            description="Seis frentes de estudo, do primeiro spawn à coordenação de assets do time."
          />
          <CategoryGrid categories={categories} />
        </section>

        <section className="space-y-5">
          <SectionHeading
            eyebrow="Nível de experiência"
            title="Conteúdo na sua medida"
            description="Cada artigo é marcado pelo nível de bagagem necessário para aproveitar o conteúdo."
          />

          <div className="grid gap-3 sm:grid-cols-3">
            {ARTICLE_LEVELS.map((level) => (
              <Link
                key={level}
                href={withParams(routes.articles, { nivel: level })}
                className="group rounded-md border border-graphite-700 bg-graphite-900 p-5 transition-colors hover:border-amber-500/40 hover:bg-graphite-850"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-amber-500">
                  {LEVEL_LABELS[level]}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {LEVEL_DESCRIPTIONS[level]}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <SectionHeading
            eyebrow="Atualizado"
            title="Últimos artigos"
            href={routes.articles}
          />

          {latestArticles.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum artigo publicado ainda"
              description="Os primeiros guias aparecerão aqui assim que forem publicados."
            />
          )}
        </section>

        <section className="space-y-5">
          <SectionHeading
            eyebrow="Biblioteca"
            title="Manuais mais baixados"
            href={routes.manuals}
            linkLabel="Ver catálogo"
          />

          {topManuals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {topManuals.map((manual) => (
                <ManualCard key={manual.id} manual={manual} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum manual disponível"
              description="Apostilas em PDF serão listadas aqui."
            />
          )}
        </section>
      </div>
    </>
  );
}
