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
import { CONTENT_STATUSES, STATUS_LABELS } from "@/lib/constants";
import { routes } from "@/lib/routes";

const fileClasses =
  "block w-full cursor-pointer rounded-sm border border-graphite-600 bg-graphite-900 px-3 py-2 text-sm text-zinc-400 file:mr-3 file:rounded-sm file:border-0 file:bg-graphite-700 file:px-3 file:py-1.5 file:text-xs file:font-medium file:uppercase file:tracking-wider file:text-zinc-200 hover:border-graphite-500";

type ManualFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
  categories: Array<{ id: string; name: string }>;
  isEditing?: boolean;
  defaults?: {
    title: string;
    slug: string;
    description: string;
    gameVersion: string;
    status: string;
    categoryId: string;
    pdfUrl: string;
    coverUrl: string | null;
  };
};

export function ManualForm({
  action,
  submitLabel,
  categories,
  isEditing = false,
  defaults,
}: ManualFormProps) {
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
          placeholder="Ex.: Manual de Logística: FOBs, HABs e suprimentos"
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
            placeholder="manual-logistica-fobs"
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
          label="Status"
          htmlFor="status"
          hint="Rascunhos não aparecem no catálogo."
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
        label="Descrição"
        htmlFor="description"
        required
        error={state.fieldErrors?.description?.[0]}
      >
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaults?.description}
          placeholder="O que este material cobre e para quem é indicado."
          required
        />
      </Field>

      <Field
        label={isEditing ? "Substituir PDF" : "Arquivo PDF"}
        htmlFor="pdf"
        required={!isEditing}
        hint={
          isEditing
            ? "Envie um novo arquivo apenas se quiser substituir o atual (máx. 20 MB)."
            : "Obrigatório, até 20 MB."
        }
        error={state.fieldErrors?.pdf?.[0]}
      >
        <input
          id="pdf"
          name="pdf"
          type="file"
          accept="application/pdf,.pdf"
          required={!isEditing}
          className={fileClasses}
        />
        {defaults?.pdfUrl ? (
          <p className="mt-1 truncate text-[11px] text-zinc-500">
            Atual:{" "}
            <a
              href={defaults.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:underline"
            >
              {defaults.pdfUrl}
            </a>
          </p>
        ) : null}
      </Field>

      <Field
        label="Capa (opcional)"
        htmlFor="cover"
        hint="JPG, PNG, WebP ou AVIF até 5 MB."
        error={state.fieldErrors?.cover?.[0]}
      >
        <input
          id="cover"
          name="cover"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className={fileClasses}
        />
        {defaults?.coverUrl ? (
          <p className="mt-1 truncate text-[11px] text-zinc-500">
            Atual:{" "}
            <a
              href={defaults.coverUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:underline"
            >
              {defaults.coverUrl}
            </a>
          </p>
        ) : null}
      </Field>

      <FormMessage state={state} />

      <div className="flex flex-wrap gap-2 pt-1">
        <SubmitButton
          label={submitLabel}
          pendingLabel="Enviando..."
        />
        <Link
          href={routes.adminManuals}
          className={buttonClasses("ghost", "md")}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
