import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { getPublishedManualBySlug } from "@/lib/data/manuals";
import { formatDownloads } from "@/lib/format";
import { categoryPath, manualFileUrl, manualPath, routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

type ManualPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ManualPageProps): Promise<Metadata> {
  const { slug } = await params;
  const manual = await getPublishedManualBySlug(slug);

  if (!manual) {
    return { title: "Manual não encontrado" };
  }

  return {
    title: manual.title,
    description: manual.description,
    alternates: { canonical: manualPath(manual.slug) },
    openGraph: {
      type: "article",
      title: manual.title,
      description: manual.description,
    },
  };
}

export default async function ManualPage({ params }: ManualPageProps) {
  const { slug } = await params;
  const manual = await getPublishedManualBySlug(slug);

  if (!manual) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <nav
        aria-label="Trilha de navegação"
        className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500"
      >
        <Link href={routes.home} className="hover:text-amber-400">
          Início
        </Link>
        <span aria-hidden>/</span>
        <Link href={routes.manuals} className="hover:text-amber-400">
          Manuais
        </Link>
        <span aria-hidden>/</span>
        <Link
          href={categoryPath(manual.category.slug)}
          className="hover:text-amber-400"
        >
          {manual.category.name}
        </Link>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,320px)_1fr]">
        <div className="overflow-hidden rounded-md border border-graphite-700 bg-graphite-900">
          <div className="relative aspect-4/3">
            {manual.coverUrl ? (
              <Image
                src={manual.coverUrl}
                alt={`Capa de ${manual.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover"
                priority
              />
            ) : (
              <span className="tactical-grid flex h-full flex-col items-center justify-center gap-3 text-olive-400">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  className="size-14"
                >
                  <path d="M6 2h8l4 4v16H6z" />
                  <path d="M14 2v4h4" />
                  <path d="M9 12h6M9 16h6" />
                </svg>
                <span className="text-[11px] uppercase tracking-[0.25em]">
                  {manual.gameVersion}
                </span>
              </span>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-3 border-t border-graphite-700 px-4 py-3 text-[11px] uppercase tracking-wider">
            <div>
              <dt className="text-zinc-500">Versão</dt>
              <dd className="mt-0.5 text-zinc-200">{manual.gameVersion}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Downloads</dt>
              <dd className="mt-0.5 text-zinc-200">
                {formatDownloads(manual.downloadsCount)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-graphite-600 bg-graphite-800 text-zinc-300">
              {manual.category.name}
            </Badge>
            <Badge className="border-olive-500/40 bg-olive-500/10 text-olive-200">
              PDF
            </Badge>
          </div>

          <h1 className="font-display text-3xl uppercase leading-tight tracking-tight text-zinc-50 sm:text-4xl">
            {manual.title}
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-zinc-400">
            {manual.description}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={manualFileUrl(manual.slug, "visualizar")}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("primary", "lg")}
            >
              Visualizar PDF
            </a>
            <a
              href={manualFileUrl(manual.slug, "baixar")}
              className={buttonClasses("secondary", "lg")}
            >
              Baixar PDF
            </a>
          </div>

          <p className="text-xs leading-relaxed text-zinc-500">
            O contador de downloads é atualizado a cada abertura ou download do
            arquivo.
          </p>

          <div className="rounded-md border border-graphite-700 bg-graphite-900 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-amber-500">
              Conteúdo relacionado
            </p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              <Link
                href={categoryPath(manual.category.slug)}
                className="text-zinc-300 hover:text-amber-400"
              >
                Trilha {manual.category.name} →
              </Link>
              <Link
                href={routes.manuals}
                className="text-zinc-300 hover:text-amber-400"
              >
                Catálogo de manuais →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
