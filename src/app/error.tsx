"use client";

import { useEffect } from "react";
import { Bouton } from "@/components/ui";
import { useI18n } from "@/i18n/client";

export default function Erreur({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { tr } = useI18n();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-[60dvh] place-items-center px-4 text-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-encre">{tr("Une erreur est survenue", "Something went wrong")}</h1>
        <p className="mt-2 text-encre-douce">
          {tr("Merci de réessayer. Si le problème persiste, contactez-nous.", "Please try again. If the problem persists, contact us.")}
        </p>
        {error.digest && <p className="mt-2 font-mono text-xs text-encre-muette">Code : {error.digest}</p>}
        <Bouton onClick={reset} className="mt-6">
          {tr("Réessayer", "Try again")}
        </Bouton>
      </div>
    </div>
  );
}
