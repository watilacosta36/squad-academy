import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-graphite-600 bg-graphite-900/40 px-6 py-14 text-center",
        className,
      )}
    >
      <span className="grid size-10 place-items-center rounded-sm border border-graphite-600 text-zinc-500">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="size-5"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </span>

      <div className="space-y-1">
        <p className="font-display text-base uppercase tracking-wide text-zinc-200">
          {title}
        </p>
        {description ? (
          <p className="max-w-md text-sm text-zinc-400">{description}</p>
        ) : null}
      </div>

      {action}
    </div>
  );
}
