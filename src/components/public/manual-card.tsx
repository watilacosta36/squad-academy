import Image from "next/image";
import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import type { ManualListItem } from "@/lib/data/manuals";
import { formatDownloads } from "@/lib/format";
import { manualFileUrl, manualPath } from "@/lib/routes";

export function ManualCard({ manual }: { manual: ManualListItem }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-md border border-graphite-700 bg-graphite-900 transition-colors hover:border-amber-500/40">
      <Link
        href={manualPath(manual.slug)}
        aria-label={`Abrir ${manual.title}`}
        className="relative block aspect-4/3 overflow-hidden border-b border-graphite-700 bg-graphite-850"
      >
        {manual.coverUrl ? (
          <Image
            src={manual.coverUrl}
            alt={`Capa de ${manual.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <span className="tactical-grid flex h-full flex-col items-center justify-center gap-3 text-olive-400">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              className="size-10"
            >
              <path d="M6 2h8l4 4v16H6z" />
              <path d="M14 2v4h4" />
              <path d="M9 12h6M9 16h6" />
            </svg>
            <span className="text-[11px] uppercase tracking-[0.2em]">
              {manual.gameVersion}
            </span>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] uppercase tracking-wider text-zinc-500">
          {manual.category.name} · {manual.gameVersion}
        </p>

        <h3 className="mt-2 font-display text-lg leading-snug text-zinc-100">
          <Link
            href={manualPath(manual.slug)}
            className="transition-colors hover:text-amber-400"
          >
            {manual.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">
          {manual.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
          <Link
            href={manualPath(manual.slug)}
            className={buttonClasses("secondary", "sm")}
          >
            Abrir
          </Link>
          <a
            href={manualFileUrl(manual.slug, "baixar")}
            className={buttonClasses("primary", "sm")}
          >
            Baixar PDF
          </a>
          <span className="ml-auto text-[11px] uppercase tracking-wider text-zinc-500">
            {formatDownloads(manual.downloadsCount)}
          </span>
        </div>
      </div>
    </article>
  );
}
