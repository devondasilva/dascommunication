"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import type { ComponentProps } from "react";
import { Bouton } from "./index";

/** Bouton de soumission qui affiche un indicateur pendant l'envoi. */
export function BoutonEnvoi({
  children,
  enCours = "Envoi…",
  ...props
}: ComponentProps<typeof Bouton> & { enCours?: string }) {
  const { pending } = useFormStatus();
  return (
    <Bouton type="submit" disabled={pending} aria-disabled={pending} {...props}>
      {pending ? (
        <>
          <LoaderCircle aria-hidden className="size-4 animate-spin" />
          {enCours}
        </>
      ) : (
        children
      )}
    </Bouton>
  );
}

/** Bouton qui demande confirmation avant une action destructive. */
export function BoutonConfirmation({
  message,
  children,
  ...props
}: ComponentProps<typeof Bouton> & { message: string }) {
  const { pending } = useFormStatus();
  return (
    <Bouton
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      {...props}
    >
      {children}
    </Bouton>
  );
}
