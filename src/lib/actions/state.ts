/**
 * Estado compartilhado entre os formulários do /admin e suas Server Actions.
 * Este arquivo NÃO tem `"use server"` justamente para poder exportar
 * constantes e tipo usados por componentes client.
 */

export type ActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export const INITIAL_ACTION_STATE: ActionState = { status: "idle" };

export function errorState(
  message: string,
  fieldErrors?: Record<string, string[]>,
): ActionState {
  return { status: "error", message, fieldErrors };
}

export function successState(message: string): ActionState {
  return { status: "success", message };
}
