import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { updateCategoryAction } from "@/lib/actions/categories";
import { getCategoryById } from "@/lib/data/categories";

import { CategoryForm } from "../../category-form";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Editar categoria"
        description={`Atualizando “${category.name}”.`}
      />

      <CategoryForm
        action={updateCategoryAction.bind(null, category.id)}
        submitLabel="Salvar alterações"
        defaults={{
          name: category.name,
          slug: category.slug,
          description: category.description,
        }}
      />
    </div>
  );
}
