import type { ActionState } from "@/lib/actions/state";
import { cn } from "@/lib/cn";

/** Faixa de feedback das Server Actions (erro/sucesso). */
export function FormMessage({ state }: { state: ActionState }) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  return (
    <p
      role="status"
      className={cn(
        "rounded-sm border px-3 py-2 text-sm",
        state.status === "error"
          ? "border-red-500/30 bg-red-500/10 text-red-300"
          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      )}
    >
      {state.message}
    </p>
  );
}
