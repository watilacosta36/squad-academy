import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteForm } from "@/components/admin/delete-form";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteCategoryAction } from "@/lib/actions/categories";
import { listAdminCategories } from "@/lib/data/categories";
import { routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await listAdminCategories();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categorias"
        description="As trilhas exibidas na home e nos filtros do site."
        action={
          <Link
            href={`${routes.adminCategories}/nova`}
            className={buttonClasses("primary", "sm")}
          >
            Nova categoria
          </Link>
        }
      />

      {categories.length === 0 ? (
        <EmptyState
          title="Nenhuma categoria cadastrada"
          description="Crie a primeira trilha para organizar artigos e manuais."
          action={
            <Link
              href={`${routes.adminCategories}/nova`}
              className={buttonClasses("primary", "sm")}
            >
              Criar categoria
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-md border border-graphite-700 bg-graphite-900">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-graphite-700 text-left text-[11px] uppercase tracking-wider text-zinc-500">
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Conteúdo</th>
                <th className="px-4 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-graphite-800">
              {categories.map((category) => (
                <tr key={category.id} className="align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-200">
                      {category.name}
                    </p>
                    {category.description ? (
                      <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
                        {category.description}
                      </p>
                    ) : null}
                  </td>

                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                    {category.slug}
                  </td>

                  <td className="px-4 py-3 text-xs text-zinc-400">
                    {category.articleCount} artigo(s) · {category.manualCount}{" "}
                    manual(is)
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-start justify-end gap-2">
                      <Link
                        href={`${routes.adminCategories}/${category.id}/editar`}
                        className={buttonClasses("ghost", "sm")}
                      >
                        Editar
                      </Link>

                      <DeleteForm
                        id={category.id}
                        action={deleteCategoryAction}
                        message={`Excluir a categoria "${category.name}"?`}
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
