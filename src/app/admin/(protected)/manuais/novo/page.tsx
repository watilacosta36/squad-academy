import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { createManualAction } from "@/lib/actions/manuals";
import { listCategoryOptions } from "@/lib/data/categories";
import { routes } from "@/lib/routes";

import { ManualForm } from "../manual-form";

export const dynamic = "force-dynamic";

export default async function NewManualPage() {
  const categories = await listCategoryOptions();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Novo manual"
        description="Envie um PDF, uma capa opcional e os dados de catálogo."
      />

      {categories.length === 0 ? (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-200">
          É necessário ter ao menos uma categoria para cadastrar um manual.{" "}
          <Link
            href={`${routes.adminCategories}/nova`}
            className="underline underline-offset-2 hover:text-amber-100"
          >
            Criar categoria
          </Link>
          .
        </div>
      ) : (
        <ManualForm
          action={createManualAction}
          submitLabel="Enviar manual"
          categories={categories}
        />
      )}
    </div>
  );
}
