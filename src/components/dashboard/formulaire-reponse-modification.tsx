"use client";

import { useActionState } from "react";
import { mettreAJourModification } from "@/actions/admin";
import { Alerte, Selection, ZoneTexte } from "@/components/ui";
import { BoutonEnvoi } from "@/components/ui/bouton-envoi";
import type { Modification } from "@/db/schema";
import { STATUTS_MODIFICATION } from "@/lib/enums";
import { STATUT_MODIFICATION } from "@/lib/constantes";
import type { EtatFormulaire } from "@/lib/validations";

export function FormulaireReponseModification({ modification }: { modification: Modification }) {
  const [etat, action] = useActionState<EtatFormulaire, FormData>(mettreAJourModification, {});
  const v = etat.ok ? {} : (etat.valeurs ?? {});
  const id = `modif-${modification.id}`;

  return (
    <form action={action} className="space-y-3" noValidate>
      <input type="hidden" name="id" value={modification.id} />
      {etat.message && <Alerte ton={etat.ok ? "succes" : "erreur"}>{etat.message}</Alerte>}
      <ZoneTexte
        label="Réponse au client"
        name="reponse"
        id={`${id}-reponse`}
        rows={2}
        placeholder="ex. C'est noté, nouvelle version d'ici vendredi."
        defaultValue={v.reponse ?? modification.reponse ?? ""}
        key={`r-${modification.majLe.getTime()}`}
        erreur={etat.erreurs?.reponse}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="sm:w-44">
          <Selection
            label="Statut"
            name="statut"
            id={`${id}-statut`}
            defaultValue={v.statut ?? modification.statut}
            key={`s-${modification.statut}`}
          >
            {STATUTS_MODIFICATION.map((s) => (
              <option key={s} value={s}>
                {STATUT_MODIFICATION[s].libelle}
              </option>
            ))}
          </Selection>
        </div>
        <BoutonEnvoi taille="md" variante="secondaire" enCours="Enregistrement…">
          Enregistrer
        </BoutonEnvoi>
      </div>
    </form>
  );
}
