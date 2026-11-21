"use server";

import { redirect } from "next/navigation";

import {
  createAdminSession,
  destroyAdminSession,
  verifyCredentials,
} from "../auth";
import { extractFieldErrors, loginSchema } from "../validation";
import { errorState, type ActionState } from "./state";

export async function loginAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email") ?? "",
    password: formData.get("password") ?? "",
  });

  if (!parsed.success) {
    return errorState(
      "Revise os campos abaixo.",
      extractFieldErrors(parsed.error),
    );
  }

  const valid = await verifyCredentials(
    parsed.data.email,
    parsed.data.password,
  );

  if (!valid) {
    return errorState("E-mail ou senha inválidos.");
  }

  await createAdminSession(parsed.data.email);

  // `?redirect=` vem do proxy ao tentar acessar uma rota protegida.
  const requested = formData.get("redirect");
  const target =
    typeof requested === "string" &&
    requested.startsWith("/admin") &&
    !requested.startsWith("/admin/login")
      ? requested
      : "/admin";

  redirect(target);
}

export async function logoutAction(): Promise<void> {
  await destroyAdminSession();
  redirect("/admin/login");
}
