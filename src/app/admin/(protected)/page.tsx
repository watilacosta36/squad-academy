import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { LevelBadge } from "@/components/public/level-badge";
import { buttonClasses } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  getDashboardStats,
  listRecentArticles,
  listRecentManuals,
} from "@/lib/data/stats";
import { formatDate, formatNumber } from "@/lib/format";
import { articlePath, manualPath, routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-md border border-graphite-700 bg-graphite-900 p-4">
      <p className="text-[11px] uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="mt-1 font-display text-3xl leading-none text-zinc-100">
        {value}
      </p>
      {hint ? <p className="mt-2 text-[11px] text-zinc-500">{hint}</p> : null}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [stats, recentArticles, recentManuals] = await Promise.all([
    getDashboardStats(),
    listRecentArticles(5),
    listRecentManuals(4),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Painel"
        description="Visão geral do conteúdo publicado e do acervo de PDFs."
        action={
          <div className="flex flex-wrap gap-2">
            <Link
              href={`${routes.adminArticles}/novo`}
              className={buttonClasses("primary", "sm")}
            >
              Novo artigo
            </Link>
            <Link
              href={`${routes.adminManuals}/novo`}
              className={buttonClasses("secondary", "sm")}
            >
              Novo manual
            </Link>
            <Link
              href={`${routes.adminCategories}/nova`}
              className={buttonClasses("ghost", "sm")}
            >
              Nova categoria
            </Link>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Artigos publicados"
          value={formatNumber(stats.publishedArticles)}
          hint={`${stats.draftArticles} rascunho(s)`}
        />
        <Stat label="Total de artigos" value={formatNumber(stats.articles)} />
        <Stat
          label="Manuais publicados"
          value={formatNumber(stats.publishedManuals)}
          hint={`${stats.manuals} no acervo`}
        />
        <Stat
          label="Downloads de PDFs"
          value={formatNumber(stats.totalDownloads)}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Artigos recentes"
            description="Últimas alterações editoriais."
            action={
              <Link
                href={routes.adminArticles}
                className="text-[11px] uppercase tracking-wider text-amber-500 hover:text-amber-400"
              >
                Gerenciar →
              </Link>
            }
          />

          {recentArticles.length > 0 ? (
            <ul className="divide-y divide-graphite-800">
              {recentArticles.map((article) => (
                <li
                  key={article.id}
                  className="flex flex-wrap items-center gap-2 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={articlePath(article.slug)}
                      className="block truncate text-sm text-zinc-200 hover:text-amber-400"
                    >
                      {article.title}
                    </Link>
                    <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                      {article.category.name} ·{" "}
                      {formatDate(article.updatedAt)}
                    </p>
                  </div>
                  <LevelBadge level={article.level} />
                  <StatusBadge status={article.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-6 text-sm text-zinc-500">
              Nenhum artigo cadastrado ainda.
            </p>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Manuais recentes"
            description="Acervo de PDFs e downloads."
            action={
              <Link
                href={routes.adminManuals}
                className="text-[11px] uppercase tracking-wider text-amber-500 hover:text-amber-400"
              >
                Gerenciar →
              </Link>
            }
          />

          {recentManuals.length > 0 ? (
            <ul className="divide-y divide-graphite-800">
              {recentManuals.map((manual) => (
                <li
                  key={manual.id}
                  className="flex flex-wrap items-center gap-2 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={manualPath(manual.slug)}
                      className="block truncate text-sm text-zinc-200 hover:text-amber-400"
                    >
                      {manual.title}
                    </Link>
                    <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                      {manual.category.name} · {manual.gameVersion} ·{" "}
                      {manual.downloadsCount} download(s)
                    </p>
                  </div>
                  <StatusBadge status={manual.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-6 text-sm text-zinc-500">
              Nenhum manual cadastrado ainda.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
