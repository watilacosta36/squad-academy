"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

const items = [
  { href: routes.admin, label: "Painel", exact: true },
  { href: routes.adminCategories, label: "Categorias" },
  { href: routes.adminArticles, label: "Artigos" },
  { href: routes.adminManuals, label: "Manuais" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Painel administrativo" className="space-y-0.5">
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "block rounded-sm px-2 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors",
              active
                ? "bg-amber-500/10 text-amber-300"
                : "text-zinc-400 hover:bg-graphite-800 hover:text-zinc-100",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
