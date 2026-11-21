import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { updateArticleAction } from "@/lib/actions/articles";
import { getArticleById } from "@/lib/data/articles";
import { listCategoryOptions } from "@/lib/data/categories";

import { ArticleForm } from "../../article-form";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [article, categories] = await Promise.all([
    getArticleById(id),
    listCategoryOptions(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Editar artigo"
        description={`Atualizando “${article.title}”.`}
      />

      <ArticleForm
        action={updateArticleAction.bind(null, article.id)}
        submitLabel="Salvar alterações"
        categories={categories}
        defaults={{
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          level: article.level,
          gameVersion: article.gameVersion,
          status: article.status,
          categoryId: article.categoryId,
        }}
      />
    </div>
  );
}
