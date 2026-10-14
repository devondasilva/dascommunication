"use client";

import { useActionState } from "react";
import { accepterInvitation } from "@/actions/equipe";
import { Alerte, Champ } from "@/components/ui";
import { BoutonEnvoi } from "@/components/ui/bouton-envoi";
import type { EtatFormulaire } from "@/lib/validations";

export function FormulaireInvitation({ jeton }: { jeton: string }) {
  const [etat, action] = useActionState<EtatFormulaire, FormData>(accepterInvitation, {});
  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="jeton" value={jeton} />
      {etat.message && <Alerte ton="erreur">{etat.message}</Alerte>}
      <Champ label="Nom complet" name="nom" autoComplete="name" requis defaultValue={etat.valeurs?.nom} erreur={etat.erreurs?.nom} />
      <Champ
        label="Mot de passe"
        name="motDePasse"
        type="password"
        autoComplete="new-password"
        requis
        aide="10 caractères minimum, avec au moins une lettre et un chiffre."
        erreur={etat.erreurs?.motDePasse}
      />
      <Champ
        label="Confirmez le mot de passe"
        name="confirmation"
        type="password"
        autoComplete="new-password"
        requis
        erreur={etat.erreurs?.confirmation}
      />
      <BoutonEnvoi className="w-full" taille="lg" enCours="Activation…">
        Activer mon compte
      </BoutonEnvoi>
    </form>
  );
}
