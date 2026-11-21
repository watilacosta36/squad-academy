import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium uppercase tracking-wider transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-amber-500 text-graphite-950 hover:bg-amber-400",
  secondary:
    "border border-olive-500/60 bg-olive-500/10 text-olive-200 hover:border-olive-400 hover:bg-olive-500/20",
  ghost:
    "border border-transparent text-zinc-300 hover:bg-graphite-800 hover:text-zinc-100",
  danger:
    "border border-red-500/40 bg-red-500/10 text-red-300 hover:border-red-400/60 hover:bg-red-500/20",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[11px]",
  md: "h-10 px-4 text-xs",
  lg: "h-12 px-6 text-sm",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
}
