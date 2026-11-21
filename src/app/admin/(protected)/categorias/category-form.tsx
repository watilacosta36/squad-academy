"use client";

import Link from "next/link";
import { useActionState } from "react";

import { FormMessage } from "@/components/admin/form-message";
import { SubmitButton } from "@/components/admin/submit-button";
import { buttonClasses } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { INITIAL_ACTION_STATE, type ActionState } from "@/lib/actions/state";
import { routes } from "@/lib/routes";

type CategoryFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
  defaults?: {
    name: string;
    slug: string;
    description: string | null;
  };
};

export function CategoryForm({
  action,
  submitLabel,
  defaults,
}: CategoryFormProps) {
  const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

  return (
    <form
      action={formAction}
      className="max-w-2xl space-y-4 rounded-md border border-graphite-700 bg-graphite-900 p-5"
    >
      <Field
        label="Nome"
        htmlFor="name"
        required
        error={state.fieldErrors?.name?.[0]}
      >
        <Input
          id="name"
          name="name"
          defaultValue={defaults?.name}
          placeholder="Ex.: Morteiros & Artilharia"
          required
        />
      </Field>

      <Field
        label="Slug"
        htmlFor="slug"
        hint="Opcional. Em branco, geramos a partir do nome."
        error={state.fieldErrors?.slug?.[0]}
      >
        <Input
          id="slug"
          name="slug"
          defaultValue={defaults?.slug}
          placeholder="morteiros-artilharia"
        />
      </Field>

      <Field
        label="Descrição"
        htmlFor="description"
        error={state.fieldErrors?.description?.[0]}
      >
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaults?.description ?? ""}
          placeholder="O que o jogador encontra nesta trilha?"
        />
      </Field>

      <FormMessage state={state} />

      <div className="flex flex-wrap gap-2 pt-1">
        <SubmitButton label={submitLabel} />
        <Link
          href={routes.adminCategories}
          className={buttonClasses("ghost", "md")}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
