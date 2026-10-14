"use client";

import { useActionState } from "react";
import { demanderModification } from "@/actions/public";
import { Alerte, PotDeMiel, Selection, ZoneTexte } from "@/components/ui";
import { BoutonEnvoi } from "@/components/ui/bouton-envoi";
import { useI18n } from "@/i18n/client";
import type { EtatFormulaire } from "@/lib/validations";

export function FormulaireModification({ jeton }: { jeton: string }) {
  const { tr } = useI18n();
  const [etat, action] = useActionState<EtatFormulaire, FormData>(demanderModification, {});
  // Après un envoi réussi, le formulaire est vidé (pas de valeurs renvoyées)
  const v = etat.ok ? {} : (etat.valeurs ?? {});

  return (
    <form action={action} className="relative space-y-4" noValidate>
      <PotDeMiel />
      <input type="hidden" name="jeton" value={jeton} />
      {etat.message && <Alerte ton={etat.ok ? "succes" : "erreur"}>{etat.message}</Alerte>}

      <ZoneTexte
        label={tr("Modification souhaitée", "Requested change")}
        name="description"
        requis
        rows={4}
        placeholder={tr(
          "ex. Remplacer la photo de couverture, agrandir le logo, corriger le numéro de téléphone…",
          "e.g. Replace the cover photo, make the logo bigger, fix the phone number…",
        )}
        defaultValue={v.description}
        erreur={etat.erreurs?.description}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="sm:w-48">
          <Selection label={tr("Priorité", "Priority")} name="priorite" defaultValue={v.priorite ?? "normale"}>
            <option value="basse">{tr("Basse", "Low")}</option>
            <option value="normale">{tr("Normale", "Normal")}</option>
            <option value="haute">{tr("Haute", "High")}</option>
          </Selection>
        </div>
        <BoutonEnvoi enCours={tr("Envoi…", "Sending…")}>{tr("Envoyer la demande", "Send request")}</BoutonEnvoi>
      </div>
    </form>
  );
}
