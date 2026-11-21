import Link from "next/link";

import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { routes } from "@/lib/routes";

import { SearchBar } from "./search-bar";

export function SiteHeader() {
  const navLink =
    "rounded-sm px-3 py-2 text-xs font-medium uppercase tracking-wider text-zinc-400 transition-colors hover:bg-graphite-800 hover:text-zinc-100";

  return (
    <header className="sticky top-0 z-40 border-b border-graphite-800 bg-graphite-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link
          href={routes.home}
          aria-label={`${SITE_NAME} — página inicial`}
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="grid size-9 place-items-center rounded-sm border border-amber-500/40 bg-amber-500/10 text-amber-400">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-5"
            >
              <circle cx="12" cy="12" r="7" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </span>

          <span className="font-display text-sm font-semibold uppercase leading-[1.05] tracking-[0.22em] text-zinc-100">
            Squad
            <br />
            <span className="text-amber-500">Academy</span>
          </span>
        </Link>

        <nav aria-label="Navegação principal" className="ml-2 flex items-center">
          <Link href={routes.articles} className={navLink}>
            Artigos
          </Link>
          <Link href={routes.manuals} className={navLink}>
            Manuais
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <SearchBar
            id="header-search"
            compact
            className="hidden max-w-xs md:flex"
          />

          <Link
            href={routes.search}
            className="text-[11px] uppercase tracking-wider text-zinc-500 transition-colors hover:text-amber-400 md:hidden"
          >
            Buscar
          </Link>

          <Link
            href={routes.admin}
            className="hidden text-[11px] uppercase tracking-wider text-zinc-500 transition-colors hover:text-amber-400 sm:inline"
          >
            Admin
          </Link>
        </div>
      </div>

      <p className="sr-only">{SITE_DESCRIPTION}</p>
    </header>
  );
}
