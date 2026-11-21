import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/button";
import { inputClasses } from "@/components/ui/input";

export function SearchBar({
  defaultValue = "",
  id = "search",
  compact = false,
  className,
}: {
  defaultValue?: string;
  id?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <form
      action="/busca"
      method="get"
      role="search"
      className={cn("flex w-full items-center gap-2", className)}
    >
      <div className="relative flex-1">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>

        <label htmlFor={id} className="sr-only">
          Buscar conteúdos
        </label>

        <input
          id={id}
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder="Buscar guias, manuais, callouts…"
          className={cn(
            inputClasses,
            compact ? "h-10 pl-9 text-[13px]" : "h-11 pl-9",
          )}
        />
      </div>

      <button
        type="submit"
        className={buttonClasses(
          "primary",
          compact ? "sm" : "md",
          compact ? "h-10" : "h-11",
        )}
      >
        Buscar
      </button>
    </form>
  );
}
