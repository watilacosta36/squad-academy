import type { Metadata } from "next";
import Link from "next/link";

import { SITE_NAME } from "@/lib/constants";
import { routes } from "@/lib/routes";
import { type RawSearchParams, readParam } from "@/lib/search-params";

import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Entrar no painel",
  robots: { index: false, follow: false },
};

function safeRedirect(value: string | undefined): string {
  if (!value || !value.startsWith("/admin") || value.startsWith("/admin/login")) {
    return routes.admin;
  }

  return value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;

  return (
    <div className="tactical-grid flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-md border border-graphite-700 bg-graphite-900/95 p-6 shadow-2xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-amber-500">
          {SITE_NAME}
        </p>

        <h1 className="mt-2 font-display text-2xl uppercase tracking-wide text-zinc-100">
          Painel administrativo
        </h1>

        <p className="mt-2 text-sm text-zinc-400">
          Entre com as credenciais de administrador definidas no ambiente.
        </p>

        <div className="mt-6">
          <LoginForm redirectTo={safeRedirect(readParam(params, "redirect"))} />
        </div>

        <Link
          href={routes.home}
          className="mt-6 block text-center text-[11px] uppercase tracking-wider text-zinc-500 transition-colors hover:text-amber-400"
        >
          ← Voltar ao site
        </Link>
      </div>
    </div>
  );
}
