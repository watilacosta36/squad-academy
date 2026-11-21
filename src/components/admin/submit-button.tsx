"use client";

import { useFormStatus } from "react-dom";

import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button";

export function SubmitButton({
  label,
  pendingLabel = "Salvando...",
  variant = "primary",
  size = "md",
  className,
}: {
  label: string;
  pendingLabel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={className}
      disabled={pending}
    >
      {pending ? pendingLabel : label}
    </Button>
  );
}
