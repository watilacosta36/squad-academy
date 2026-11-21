"use client";

import { useActionState } from "react";

import { ConfirmDeleteButton } from "@/components/ui/confirm-delete-button";
import {
  INITIAL_ACTION_STATE,
  type ActionState,
} from "@/lib/actions/state";

export function DeleteForm({
  id,
  action,
  message,
  label = "Excluir",
}: {
  id: string;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  message: string;
  label?: string;
}) {
  const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="id" value={id} />
      <ConfirmDeleteButton message={message} label={label} />
      {state.status === "error" ? (
        <span className="max-w-56 text-right text-[11px] leading-snug text-red-400">
          {state.message}
        </span>
      ) : null}
    </form>
  );
}
