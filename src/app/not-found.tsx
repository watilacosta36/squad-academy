import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <div className="tactical-grid flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-display text-6xl leading-none text-amber-500">404</p>

      <h1 className="font-display text-2xl uppercase tracking-wide text-zinc-100">
        Página não encontrada
      </h1>

      <p className="max-w-md text-sm leading-relaxed text-zinc-400">
        O endereço acessado não existe ou foi removido.
      </p>

      <Link href={routes.home} className={buttonClasses("primary", "md")}>
        Ir para o início
      </Link>
    </div>
  );
}
