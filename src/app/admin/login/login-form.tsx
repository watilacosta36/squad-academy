"use client";

import { useActionState } from "react";

import { FormMessage } from "@/components/admin/form-message";
import { SubmitButton } from "@/components/admin/submit-button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/lib/actions/auth";
import { INITIAL_ACTION_STATE } from "@/lib/actions/state";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction] = useActionState(
    loginAction,
    INITIAL_ACTION_STATE,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirect" value={redirectTo} />

      <Field
        label="E-mail"
        htmlFor="email"
        required
        error={state.fieldErrors?.email?.[0]}
      >
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="admin@squadacademy.com.br"
          required
          autoFocus
        />
      </Field>

      <Field
        label="Senha"
        htmlFor="password"
        required
        error={state.fieldErrors?.password?.[0]}
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </Field>

      <FormMessage state={state} />

      <SubmitButton
        label="Entrar"
        pendingLabel="Entrando..."
        className="w-full"
      />
    </form>
  );
}
