import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-sm border border-graphite-600 bg-graphite-900 px-3 py-2 text-sm leading-relaxed text-zinc-100 placeholder:text-zinc-500 transition-colors hover:border-graphite-500 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20",
        className,
      )}
      {...props}
    />
  );
}
