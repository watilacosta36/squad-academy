import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/public/article-card";
import { ManualCard } from "@/components/public/manual-card";
import { SectionHeading } from "@/components/public/section-heading";
import { EmptyState } from "@/components/ui/empty-state";
import { listPublishedArticles } from "@/lib/data/articles";
import { getCategoryBySlug } from "@/lib/data/categories";
import { listPublishedManuals } from "@/lib/data/manuals";
import { routes, withParams } from "@/lib/routes";

export const dynamic = "force-dynamic";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Trilha não encontrada" };
  }

  return {
    title: `${category.name} — trilha`,
    description:
      category.description ??
      `Artigos e manuais de ${category.name} no Squad Academy.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [articles, manuals] = await Promise.all([
    listPublishedArticles({ categorySlug: category.slug, pageSize: 6 }),
    listPublishedManuals({ categorySlug: category.slug, pageSize: 6 }),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <nav
        aria-label="Trilha de navegação"
        className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500"
      >
        <Link href={routes.home} className="hover:text-amber-400">
          Início
        </Link>
        <span aria-hidden>/</span>
        <span className="text-zinc-300">Trilhas</span>
      </nav>

      <header className="mt-6 border-b border-graphite-800 pb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-amber-500">
          Trilha
        </p>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-tight text-zinc-50 sm:text-4xl">
          {category.name}
        </h1>
        {category.description ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
            {category.description}
          </p>
        ) : null}
        <p className="mt-4 text-[11px] uppercase tracking-wider text-zinc-500">
          {articles.total} {articles.total === 1 ? "artigo" : "artigos"} ·{" "}
          {manuals.total} {manuals.total === 1 ? "manual" : "manuais"}
        </p>
      </header>

      <div className="mt-10 space-y-14">
        <section className="space-y-5">
          <SectionHeading
            eyebrow="Leitura"
            title="Artigos da trilha"
            href={withParams(routes.articles, { categoria: category.slug })}
            linkLabel="Ver todos"
          />

          {articles.items.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {articles.items.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum artigo nesta trilha ainda"
              description="Os próximos guias desta categoria aparecerão aqui."
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
        </section>

        <section className="space-y-5">
          <SectionHeading
            eyebrow="Biblioteca"
            title="Manuais da trilha"
            href={withParams(routes.manuals, { categoria: category.slug })}
            linkLabel="Ver todos"
          />

          {manuals.items.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {manuals.items.map((manual) => (
                <ManualCard key={manual.id} manual={manual} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum manual nesta trilha"
              description="Apostilas em PDF desta categoria serão publicadas em breve."
            />
          )}
        </section>
      </div>
    </div>
  );
}
