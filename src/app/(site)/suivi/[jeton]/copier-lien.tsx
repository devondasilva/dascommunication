"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { Bouton } from "@/components/ui";
import { useI18n } from "@/i18n/client";

export function CopierLien() {
  const { tr } = useI18n();
  const [copie, setCopie] = useState(false);
  return (
    <Bouton
      variante="secondaire"
      taille="sm"
      onClick={async () => {
        const url = window.location.href.split("?")[0];
        try {
          await navigator.clipboard.writeText(url);
          setCopie(true);
          setTimeout(() => setCopie(false), 2000);
        } catch {
          window.prompt(tr("Copiez ce lien :", "Copy this link:"), url);
        }
      }}
    >
      {copie ? <Check aria-hidden className="size-4" /> : <Link2 aria-hidden className="size-4" />}
      <span aria-live="polite">{copie ? tr("Lien copié", "Link copied") : tr("Copier le lien de suivi", "Copy tracking link")}</span>
    </Bouton>
  );
}
