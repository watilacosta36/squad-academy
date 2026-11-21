import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-graphite-700 bg-graphite-900",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b border-graphite-700 px-5 py-4",
        className,
      )}
    >
      <div className="space-y-1">
        <h2 className="font-display text-base uppercase tracking-wide text-zinc-100">
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-zinc-400">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
