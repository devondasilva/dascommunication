"use client";

import { useActionState } from "react";
import { rechercherCommande } from "@/actions/public";
import { Alerte, Champ } from "@/components/ui";
import { BoutonEnvoi } from "@/components/ui/bouton-envoi";
import { useI18n } from "@/i18n/client";
import type { EtatFormulaire } from "@/lib/validations";

export function FormulaireRecherche() {
  const { tr } = useI18n();
  const [etat, action] = useActionState<EtatFormulaire, FormData>(rechercherCommande, {});
  const v = etat.valeurs ?? {};
  return (
    <form action={action} className="space-y-5" noValidate>
      {etat.message && <Alerte ton="erreur">{etat.message}</Alerte>}
      <Champ
        label={tr("Référence de commande", "Order reference")}
        name="reference"
        placeholder="CMD-2026-0001"
        requis
        autoComplete="off"
        className="font-mono uppercase"
        defaultValue={v.reference}
        erreur={etat.erreurs?.reference}
      />
      <Champ
        label={tr("Adresse e-mail", "Email address")}
        name="email"
        type="email"
        requis
        autoComplete="email"
        defaultValue={v.email}
        erreur={etat.erreurs?.email}
      />
      <BoutonEnvoi className="w-full" taille="lg" enCours={tr("Recherche…", "Searching…")}>
        {tr("Accéder à ma commande", "Open my order")}
      </BoutonEnvoi>
    </form>
  );
}
