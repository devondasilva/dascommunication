"use client";

import { useActionState } from "react";
import { demanderModification } from "@/actions/public";
import { Alerte, PotDeMiel, Selection, ZoneTexte } from "@/components/ui";
import { BoutonEnvoi } from "@/components/ui/bouton-envoi";
import type { EtatFormulaire } from "@/lib/validations";

export function FormulaireModification({ jeton }: { jeton: string }) {
  const [etat, action] = useActionState<EtatFormulaire, FormData>(demanderModification, {});
  // Après un envoi réussi, le formulaire est vidé (pas de valeurs renvoyées)
  const v = etat.ok ? {} : (etat.valeurs ?? {});

  return (
    <form action={action} className="relative space-y-4" noValidate>
      <PotDeMiel />
      <input type="hidden" name="jeton" value={jeton} />
      {etat.message && <Alerte ton={etat.ok ? "succes" : "erreur"}>{etat.message}</Alerte>}

      <ZoneTexte
        label="Modification souhaitée"
        name="description"
        requis
        rows={4}
        placeholder="ex. Remplacer la photo de couverture, agrandir le logo, corriger le numéro de téléphone…"
        defaultValue={v.description}
        erreur={etat.erreurs?.description}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="sm:w-48">
          <Selection label="Priorité" name="priorite" defaultValue={v.priorite ?? "normale"}>
            <option value="basse">Basse</option>
            <option value="normale">Normale</option>
            <option value="haute">Haute</option>
          </Selection>
        </div>
        <BoutonEnvoi enCours="Envoi…">Envoyer la demande</BoutonEnvoi>
      </div>
    </form>
  );
}
