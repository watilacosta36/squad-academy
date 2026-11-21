import Link from "next/link";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "Ver todos",
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-graphite-800 pb-4">
      <div className="space-y-1">
        {eyebrow ? (
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-amber-500">
            {eyebrow}
          </p>
        ) : null}

        <h2 className="font-display text-xl uppercase tracking-wide text-zinc-100 sm:text-2xl">
          {title}
        </h2>

        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>

      {action ??
        (href ? (
          <Link
            href={href}
            className="text-xs font-medium uppercase tracking-wider text-zinc-400 transition-colors hover:text-amber-400"
          >
            {linkLabel} →
          </Link>
        ) : null)}
    </div>
  );
}
