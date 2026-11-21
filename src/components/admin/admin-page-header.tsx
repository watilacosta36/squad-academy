import type { ReactNode } from "react";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-graphite-800 pb-4">
      <div className="space-y-1">
        <h1 className="font-display text-2xl uppercase tracking-wide text-zinc-100">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-zinc-400">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
