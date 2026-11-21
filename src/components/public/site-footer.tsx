import Link from "next/link";

import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { routes } from "@/lib/routes";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-graphite-800 bg-graphite-950">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-2">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-zinc-100">
            Squad <span className="text-amber-500">Academy</span>
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
            {SITE_DESCRIPTION}
          </p>
        </div>

        <nav aria-label="Conteúdo" className="space-y-2 text-sm">
          <p className="text-[11px] uppercase tracking-wider text-zinc-500">
            Conteúdo
          </p>
          <Link
            href={routes.articles}
            className="block text-zinc-400 transition-colors hover:text-amber-400"
          >
            Artigos e guias
          </Link>
          <Link
            href={routes.manuals}
            className="block text-zinc-400 transition-colors hover:text-amber-400"
          >
            Manuais em PDF
          </Link>
          <Link
            href={routes.search}
            className="block text-zinc-400 transition-colors hover:text-amber-400"
          >
            Buscar
          </Link>
        </nav>

        <nav aria-label="Administração" className="space-y-2 text-sm">
          <p className="text-[11px] uppercase tracking-wider text-zinc-500">
            Equipe
          </p>
          <Link
            href={routes.adminLogin}
            className="block text-zinc-400 transition-colors hover:text-amber-400"
          >
            Acesso administrativo
          </Link>
          <p className="text-xs leading-relaxed text-zinc-600">
            Projeto independente, sem afiliação com a Offworld Industries.
          </p>
        </nav>
      </div>

      <div className="border-t border-graphite-800/80 py-4">
        <p className="mx-auto w-full max-w-6xl px-4 text-[11px] uppercase tracking-wider text-zinc-600 sm:px-6">
          © {year} {SITE_NAME} · Conteúdo tático em pt-BR
        </p>
      </div>
    </footer>
  );
}
