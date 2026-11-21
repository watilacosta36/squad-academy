import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { createArticleAction } from "@/lib/actions/articles";
import { listCategoryOptions } from "@/lib/data/categories";
import { routes } from "@/lib/routes";

import { ArticleForm } from "../article-form";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const categories = await listCategoryOptions();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Novo artigo"
        description="Crie um guia com Markdown, categoria, nível e versão do jogo."
      />

      {categories.length === 0 ? (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-200">
          É necessário ter ao menos uma categoria para criar um artigo.{" "}
          <Link
            href={`${routes.adminCategories}/nova`}
            className="underline underline-offset-2 hover:text-amber-100"
          >
            Criar categoria
          </Link>
          .
        </div>
      ) : (
        <ArticleForm
          action={createArticleAction}
          submitLabel="Criar artigo"
          categories={categories}
        />
      )}
    </div>
  );
}
