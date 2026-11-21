"use client";

import Link from "next/link";
import { useActionState } from "react";

import { FormMessage } from "@/components/admin/form-message";
import { SubmitButton } from "@/components/admin/submit-button";
import { buttonClasses } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { INITIAL_ACTION_STATE, type ActionState } from "@/lib/actions/state";
import {
  ARTICLE_LEVELS,
  CONTENT_STATUSES,
  LEVEL_LABELS,
  STATUS_LABELS,
} from "@/lib/constants";
import { routes } from "@/lib/routes";

type ArticleFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
  categories: Array<{ id: string; name: string }>;
  defaults?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    level: string;
    gameVersion: string;
    status: string;
    categoryId: string;
  };
};

export function ArticleForm({
  action,
  submitLabel,
  categories,
  defaults,
}: ArticleFormProps) {
  const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-md border border-graphite-700 bg-graphite-900 p-5"
    >
      <Field
        label="Título"
        htmlFor="title"
        required
        error={state.fieldErrors?.title?.[0]}
      >
        <Input
          id="title"
          name="title"
          defaultValue={defaults?.title}
          placeholder="Ex.: FOBs na prática: HAB, rádio e o erro clássico do spawn"
          required
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Slug"
          htmlFor="slug"
          hint="Opcional. Gerado a partir do título quando vazio."
          error={state.fieldErrors?.slug?.[0]}
        >
          <Input
            id="slug"
            name="slug"
            defaultValue={defaults?.slug}
            placeholder="fobs-na-pratica"
          />
        </Field>

        <Field
          label="Versão do jogo"
          htmlFor="gameVersion"
          required
          error={state.fieldErrors?.gameVersion?.[0]}
        >
          <Input
            id="gameVersion"
            name="gameVersion"
            defaultValue={defaults?.gameVersion ?? "Update 8.2"}
            placeholder="Update 8.2"
            required
          />
        </Field>

        <Field
          label="Categoria"
          htmlFor="categoryId"
          required
          error={state.fieldErrors?.categoryId?.[0]}
        >
          <Select
            id="categoryId"
            name="categoryId"
            defaultValue={defaults?.categoryId ?? ""}
            required
          >
            <option value="" disabled>
              Selecione…
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Nível"
          htmlFor="level"
          required
          error={state.fieldErrors?.level?.[0]}
        >
          <Select
            id="level"
            name="level"
            defaultValue={defaults?.level ?? "RECRUTA"}
            required
          >
            {ARTICLE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {LEVEL_LABELS[level]}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Status"
          htmlFor="status"
          hint="Rascunhos não aparecem no site."
          error={state.fieldErrors?.status?.[0]}
        >
          <Select
            id="status"
            name="status"
            defaultValue={defaults?.status ?? "DRAFT"}
          >
            {CONTENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field
        label="Resumo"
        htmlFor="excerpt"
        required
        hint="Aparece nos cards e na busca (20–320 caracteres)."
        error={state.fieldErrors?.excerpt?.[0]}
      >
        <Textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          defaultValue={defaults?.excerpt}
          placeholder="Uma frase direta sobre o que o leitor vai aprender."
          required
        />
      </Field>

      <Field
        label="Conteúdo (Markdown)"
        htmlFor="content"
        required
        hint="Aceita Markdown: títulos, listas, negrito, tabelas (GFM) e citações."
        error={state.fieldErrors?.content?.[0]}
      >
        <Textarea
          id="content"
          name="content"
          rows={18}
          defaultValue={defaults?.content}
          className="font-mono text-[13px] leading-relaxed"
          placeholder={"## Título da seção\n\nTexto do guia…"}
          required
        />
      </Field>

      <FormMessage state={state} />

      <div className="flex flex-wrap gap-2 pt-1">
        <SubmitButton label={submitLabel} />
        <Link
          href={routes.adminArticles}
          className={buttonClasses("ghost", "md")}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
