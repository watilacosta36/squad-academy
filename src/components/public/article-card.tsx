import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { ArticleListItem } from "@/lib/data/articles";
import { formatDate } from "@/lib/format";
import { estimateReadingTime } from "@/lib/reading-time";
import { articlePath } from "@/lib/routes";

import { LevelBadge } from "./level-badge";

export function ArticleCard({ article }: { article: ArticleListItem }) {
  const minutes = estimateReadingTime(article.content);

  return (
    <article className="group relative flex h-full flex-col rounded-md border border-graphite-700 bg-graphite-900 p-5 transition-colors hover:border-amber-500/40 hover:bg-graphite-850">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="border-graphite-600 bg-graphite-800 text-zinc-400">
          {article.category.name}
        </Badge>
        <LevelBadge level={article.level} />
      </div>

      <h3 className="mt-3 font-display text-lg leading-snug tracking-tight text-zinc-100">
        <Link
          href={articlePath(article.slug)}
          className="transition-colors after:absolute after:inset-0 group-hover:text-amber-400"
        >
          {article.title}
        </Link>
      </h3>

      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">
        {article.excerpt}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-4 text-[11px] uppercase tracking-wider text-zinc-500">
        <time dateTime={article.publishedAt?.toISOString()}>
          {formatDate(article.publishedAt)}
        </time>
        <span aria-hidden>•</span>
        <span>{minutes} min de leitura</span>
        <span aria-hidden>•</span>
        <span>{article.gameVersion}</span>
      </div>
    </article>
  );
}
