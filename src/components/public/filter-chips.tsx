import Link from "next/link";

import { cn } from "@/lib/cn";

export type FilterChip = {
  label: string;
  href: string;
  active?: boolean;
};

export function FilterChips({
  label,
  items,
  className,
}: {
  label: string;
  items: FilterChip[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-[11px] uppercase tracking-wider text-zinc-500">{label}</p>

      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <Link
            key={`${item.label}-${item.href}`}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={cn(
              "rounded-sm border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors",
              item.active
                ? "border-amber-500/60 bg-amber-500/10 text-amber-300"
                : "border-graphite-600 bg-graphite-900 text-zinc-400 hover:border-graphite-500 hover:text-zinc-200",
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
