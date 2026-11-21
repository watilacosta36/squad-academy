import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteForm } from "@/components/admin/delete-form";
import { StatusBadge } from "@/components/admin/status-badge";
import { LevelBadge } from "@/components/public/level-badge";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteArticleAction } from "@/lib/actions/articles";
import { listAdminArticles } from "@/lib/data/articles";
import { formatDate } from "@/lib/format";
import { articlePath, routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const articles = await listAdminArticles();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Artigos"
        description="Guias e textos táticos publicados no blog."
        action={
          <Link
            href={`${routes.adminArticles}/novo`}
            className={buttonClasses("primary", "sm")}
          >
            Novo artigo
          </Link>
        }
      />

      {articles.length === 0 ? (
        <EmptyState
          title="Nenhum artigo cadastrado"
          description="Escreva o primeiro guia para o portal."
          action={
            <Link
              href={`${routes.adminArticles}/novo`}
              className={buttonClasses("primary", "sm")}
            >
              Criar artigo
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-md border border-graphite-700 bg-graphite-900">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-graphite-700 text-left text-[11px] uppercase tracking-wider text-zinc-500">
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Nível</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Atualizado</th>
                <th className="px-4 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-graphite-800">
              {articles.map((article) => (
                <tr key={article.id} className="align-middle">
                  <td className="max-w-[320px] px-4 py-3">
                    <p className="truncate font-medium text-zinc-200">
                      {article.title}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-zinc-500">
                      /{article.slug}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-xs text-zinc-400">
                    {article.category.name}
                  </td>

                  <td className="px-4 py-3">
                    <LevelBadge level={article.level} />
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={article.status} />
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-500">
                    {formatDate(article.updatedAt)}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-start justify-end gap-2">
                      {article.status === "PUBLISHED" ? (
                        <Link
                          href={articlePath(article.slug)}
                          className={buttonClasses("ghost", "sm")}
                        >
                          Ver
                        </Link>
                      ) : null}

                      <Link
                        href={`${routes.adminArticles}/${article.id}/editar`}
                        className={buttonClasses("secondary", "sm")}
                      >
                        Editar
                      </Link>

                      <DeleteForm
                        id={article.id}
                        action={deleteArticleAction}
                        message={`Excluir o artigo "${article.title}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
