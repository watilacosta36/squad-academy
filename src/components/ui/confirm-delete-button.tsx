"use client";

import type { ButtonHTMLAttributes } from "react";

import { buttonClasses, type ButtonSize } from "./button";

type ConfirmDeleteButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  message: string;
  size?: ButtonSize;
  label?: string;
};

/** Botão de submit com confirmação nativa antes de disparar a Server Action. */
export function ConfirmDeleteButton({
  message,
  size = "sm",
  label = "Excluir",
  className,
  ...props
}: ConfirmDeleteButtonProps) {
  return (
    <button
      type="submit"
      className={buttonClasses("danger", size, className)}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
      {...props}
    >
      {label}
    </button>
  );
}
