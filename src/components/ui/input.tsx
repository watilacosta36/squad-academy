import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export const inputClasses =
  "h-10 w-full rounded-sm border border-graphite-600 bg-graphite-900 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors hover:border-graphite-500 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClasses, className)} {...props} />;
}
