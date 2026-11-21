import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export default function PublicNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
      <p className="font-display text-6xl leading-none text-amber-500">404</p>

      <h1 className="font-display text-2xl uppercase tracking-wide text-zinc-100">
        Setor não encontrado
      </h1>

      <p className="max-w-md text-sm leading-relaxed text-zinc-400">
        O conteúdo pode ter sido despublicado, movido ou nunca existiu. Volte ao
        briefing e escolha outra trilha.
      </p>

      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <Link href={routes.home} className={buttonClasses("primary", "md")}>
          Voltar ao início
        </Link>
        <Link href={routes.articles} className={buttonClasses("ghost", "md")}>
          Ver artigos
        </Link>
        <Link href={routes.manuals} className={buttonClasses("ghost", "md")}>
          Ver manuais
        </Link>
      </div>
    </div>
  );
}
