import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/public/article-card";
import { LevelBadge } from "@/components/public/level-badge";
import { MarkdownContent } from "@/components/public/markdown-content";
import { SectionHeading } from "@/components/public/section-heading";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import {
  getPublishedArticleBySlug,
  listRelatedArticles,
} from "@/lib/data/articles";
import { formatDate } from "@/lib/format";
import { estimateReadingTime } from "@/lib/reading-time";
import { articlePath, categoryPath, routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    return { title: "Artigo não encontrado" };
  }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: articlePath(article.slug) },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt?.toISOString(),
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = await listRelatedArticles(
    article.categoryId,
    article.id,
    3,
  );
  const minutes = estimateReadingTime(article.content);

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
        <Link href={routes.articles} className="hover:text-amber-400">
          Artigos
        </Link>
        <span aria-hidden>/</span>
        <Link
          href={categoryPath(article.category.slug)}
          className="hover:text-amber-400"
        >
          {article.category.name}
        </Link>
      </nav>

      <article className="mx-auto mt-6 max-w-3xl">
        <header className="space-y-4 border-b border-graphite-800 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-graphite-600 bg-graphite-800 text-zinc-300">
              {article.category.name}
            </Badge>
            <LevelBadge level={article.level} />
            <Badge className="border-olive-500/40 bg-olive-500/10 text-olive-200">
              {article.gameVersion}
            </Badge>
          </div>

          <h1 className="font-display text-3xl uppercase leading-tight tracking-tight text-zinc-50 sm:text-4xl">
            {article.title}
          </h1>

          <p className="text-base leading-relaxed text-zinc-400">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-wider text-zinc-500">
            <time dateTime={article.publishedAt?.toISOString()}>
              {formatDate(article.publishedAt)}
            </time>
            <span aria-hidden>•</span>
            <span>{minutes} min de leitura</span>
          </div>
        </header>

        <div className="mt-8">
          <MarkdownContent content={article.content} />
        </div>

        <footer className="mt-12 rounded-md border border-graphite-700 bg-graphite-900 p-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-amber-500">
            Próximo passo
          </p>
          <p className="mt-2 font-display text-lg uppercase text-zinc-100">
            Quer a versão de bolso?
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            Os manuais em PDF reúnem o conteúdo completo para consultar fora do
            jogo.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={categoryPath(article.category.slug)}
              className={buttonClasses("secondary", "sm")}
            >
              Ver trilha {article.category.name}
            </Link>
            <Link
              href={routes.manuals}
              className={buttonClasses("primary", "sm")}
            >
              Abrir manuais
            </Link>
          </div>
        </footer>
      </article>

      {related.length > 0 ? (
        <section className="mt-16 space-y-5">
          <SectionHeading
            eyebrow="Mesma trilha"
            title="Continue estudando"
            href={categoryPath(article.category.slug)}
            linkLabel="Ver trilha"
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
