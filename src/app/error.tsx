"use client";

import { useEffect } from "react";
import { Bouton } from "@/components/ui";

export default function Erreur({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-[60dvh] place-items-center px-4 text-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-encre">Une erreur est survenue</h1>
        <p className="mt-2 text-encre-douce">Merci de réessayer. Si le problème persiste, contactez-nous.</p>
        {error.digest && <p className="mt-2 font-mono text-xs text-encre-muette">Code : {error.digest}</p>}
        <Bouton onClick={reset} className="mt-6">
          Réessayer
        </Bouton>
      </div>
    </div>
  );
}
