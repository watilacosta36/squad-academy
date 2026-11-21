import Link from "next/link";

import { logoutAction } from "@/lib/actions/auth";
import { routes } from "@/lib/routes";

import { AdminNav } from "./admin-nav";

export function AdminSidebar({ email }: { email: string }) {
  return (
    <aside className="w-full shrink-0 lg:w-52">
      <div className="rounded-md border border-graphite-700 bg-graphite-900 p-3">
        <p className="px-2 pb-2 font-display text-[11px] uppercase tracking-[0.25em] text-amber-500">
          Admin
        </p>

        <AdminNav />

        <div className="mt-3 space-y-1.5 border-t border-graphite-700 pt-3">
          <p className="truncate px-2 text-[11px] text-zinc-500" title={email}>
            {email}
          </p>

          <Link
            href={routes.home}
            className="block px-2 text-[11px] uppercase tracking-wider text-zinc-400 hover:text-amber-400"
          >
            Ver site
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="px-2 text-left text-[11px] uppercase tracking-wider text-zinc-400 hover:text-red-300"
            >
              Sair
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
