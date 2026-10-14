"use client";

import { useActionState } from "react";
import { rechercherCommande } from "@/actions/public";
import { Alerte, Champ } from "@/components/ui";
import { BoutonEnvoi } from "@/components/ui/bouton-envoi";
import type { EtatFormulaire } from "@/lib/validations";

export function FormulaireRecherche() {
  const [etat, action] = useActionState<EtatFormulaire, FormData>(rechercherCommande, {});
  const v = etat.valeurs ?? {};
  return (
    <form action={action} className="space-y-5" noValidate>
      {etat.message && <Alerte ton="erreur">{etat.message}</Alerte>}
      <Champ
        label="Référence de commande"
        name="reference"
        placeholder="CMD-2026-0001"
        requis
        autoComplete="off"
        className="font-mono uppercase"
        defaultValue={v.reference}
        erreur={etat.erreurs?.reference}
      />
      <Champ
        label="Adresse e-mail"
        name="email"
        type="email"
        requis
        autoComplete="email"
        defaultValue={v.email}
        erreur={etat.erreurs?.email}
      />
      <BoutonEnvoi className="w-full" taille="lg" enCours="Recherche…">
        Accéder à ma commande
      </BoutonEnvoi>
    </form>
  );
}
