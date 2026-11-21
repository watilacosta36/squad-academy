import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { createCategoryAction } from "@/lib/actions/categories";

import { CategoryForm } from "../category-form";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Nova categoria"
        description="Crie uma trilha temática para agrupar artigos e manuais."
      />

      <CategoryForm
        action={createCategoryAction}
        submitLabel="Criar categoria"
      />
    </div>
  );
}
