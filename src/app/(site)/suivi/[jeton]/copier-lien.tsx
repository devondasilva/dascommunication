"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { Bouton } from "@/components/ui";

export function CopierLien() {
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
          window.prompt("Copiez ce lien :", url);
        }
      }}
    >
      {copie ? <Check aria-hidden className="size-4" /> : <Link2 aria-hidden className="size-4" />}
      <span aria-live="polite">{copie ? "Lien copié" : "Copier le lien de suivi"}</span>
    </Bouton>
  );
}
