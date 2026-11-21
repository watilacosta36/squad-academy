import Link from "next/link";

import type { CategoryOverview } from "@/lib/data/categories";
import { categoryPath } from "@/lib/routes";

export function CategoryGrid({
  categories,
}: {
  categories: CategoryOverview[];
}) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={categoryPath(category.slug)}
          className="group relative overflow-hidden rounded-md border border-graphite-700 bg-graphite-900 p-5 transition-colors hover:border-amber-500/40 hover:bg-graphite-850"
        >
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
          />

          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-base uppercase leading-tight tracking-wide text-zinc-100 transition-colors group-hover:text-amber-400">
              {category.name}
            </h3>

            <span className="shrink-0 rounded-sm border border-graphite-600 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-zinc-500">
              {category.articleCount + category.manualCount}
            </span>
          </div>

          {category.description ? (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">
              {category.description}
            </p>
          ) : null}

          <div className="mt-4 flex items-center gap-3 text-[11px] uppercase tracking-wider text-zinc-500">
            <span>{category.articleCount} artigos</span>
            <span aria-hidden>•</span>
            <span>{category.manualCount} PDFs</span>
            <span className="ml-auto text-amber-500 opacity-0 transition-opacity group-hover:opacity-100">
              Abrir →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
