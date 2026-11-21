import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        className,
      )}
    >
      {children}
    </span>
  );
}
