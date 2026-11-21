import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { updateManualAction } from "@/lib/actions/manuals";
import { listCategoryOptions } from "@/lib/data/categories";
import { getManualById } from "@/lib/data/manuals";

import { ManualForm } from "../../manual-form";

export const dynamic = "force-dynamic";

export default async function EditManualPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [manual, categories] = await Promise.all([
    getManualById(id),
    listCategoryOptions(),
  ]);

  if (!manual) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Editar manual"
        description={`Atualizando “${manual.title}”.`}
      />

      <ManualForm
        action={updateManualAction.bind(null, manual.id)}
        submitLabel="Salvar alterações"
        categories={categories}
        isEditing
        defaults={{
          title: manual.title,
          slug: manual.slug,
          description: manual.description,
          gameVersion: manual.gameVersion,
          status: manual.status,
          categoryId: manual.categoryId,
          pdfUrl: manual.pdfUrl,
          coverUrl: manual.coverUrl,
        }}
      />
    </div>
  );
}
