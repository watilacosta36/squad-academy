import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-sm border border-graphite-600 bg-graphite-900 px-3 text-sm text-zinc-100 transition-colors hover:border-graphite-500 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20 [color-scheme:dark]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
