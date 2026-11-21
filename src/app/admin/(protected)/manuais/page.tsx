import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteForm } from "@/components/admin/delete-form";
import { StatusBadge } from "@/components/admin/status-badge";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteManualAction } from "@/lib/actions/manuals";
import { listAdminManuals } from "@/lib/data/manuals";
import { formatDate } from "@/lib/format";
import { manualPath, routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

export default async function AdminManualsPage() {
  const manuals = await listAdminManuals();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Manuais"
        description="Apostilas em PDF disponíveis para leitura e download."
        action={
          <Link
            href={`${routes.adminManuals}/novo`}
            className={buttonClasses("primary", "sm")}
          >
            Novo manual
          </Link>
        }
      />

      {manuals.length === 0 ? (
        <EmptyState
          title="Nenhum manual cadastrado"
          description="Envie a primeira apostila em PDF para o acervo."
          action={
            <Link
              href={`${routes.adminManuals}/novo`}
              className={buttonClasses("primary", "sm")}
            >
              Enviar manual
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-md border border-graphite-700 bg-graphite-900">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-graphite-700 text-left text-[11px] uppercase tracking-wider text-zinc-500">
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Versão</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Downloads</th>
                <th className="px-4 py-3 font-medium">Atualizado</th>
                <th className="px-4 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-graphite-800">
              {manuals.map((manual) => (
                <tr key={manual.id} className="align-middle">
                  <td className="max-w-[300px] px-4 py-3">
                    <p className="truncate font-medium text-zinc-200">
                      {manual.title}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-zinc-500">
                      /{manual.slug}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-xs text-zinc-400">
                    {manual.category.name}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-400">
                    {manual.gameVersion}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={manual.status} />
                  </td>

                  <td className="px-4 py-3 text-xs text-zinc-400">
                    {manual.downloadsCount}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-500">
                    {formatDate(manual.updatedAt)}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-start justify-end gap-2">
                      <a
                        href={manual.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonClasses("ghost", "sm")}
                      >
                        PDF
                      </a>

                      {manual.status === "PUBLISHED" ? (
                        <Link
                          href={manualPath(manual.slug)}
                          className={buttonClasses("ghost", "sm")}
                        >
                          Ver
                        </Link>
                      ) : null}

                      <Link
                        href={`${routes.adminManuals}/${manual.id}/editar`}
                        className={buttonClasses("secondary", "sm")}
                      >
                        Editar
                      </Link>

                      <DeleteForm
                        id={manual.id}
                        action={deleteManualAction}
                        message={`Excluir o manual "${manual.title}" e seus arquivos?`}
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
