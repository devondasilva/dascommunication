"use client";

import { useActionState } from "react";
import { mettreAJourCommande } from "@/actions/admin";
import { Alerte, Champ, Selection, ZoneTexte } from "@/components/ui";
import { BoutonEnvoi } from "@/components/ui/bouton-envoi";
import type { Commande } from "@/db/schema";
import { STATUTS_COMMANDE } from "@/lib/enums";
import { STATUT_COMMANDE } from "@/lib/constantes";
import type { EtatFormulaire } from "@/lib/validations";

export function FormulaireCommandeAdmin({ commande, montants = true }: { commande: Commande; montants?: boolean }) {
  const [etat, action] = useActionState<EtatFormulaire, FormData>(mettreAJourCommande, {});
  const v = etat.ok ? {} : (etat.valeurs ?? {});

  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="id" value={commande.id} />
      {etat.message && <Alerte ton={etat.ok ? "succes" : "erreur"}>{etat.message}</Alerte>}

      <Selection label="Statut" name="statut" defaultValue={v.statut ?? commande.statut} key={`s-${commande.statut}`}>
        {STATUTS_COMMANDE.map((s) => (
          <option key={s} value={s}>
            {STATUT_COMMANDE[s].libelle}
          </option>
        ))}
      </Selection>

      {montants && (
      <Champ
        label={`Montant facturé (${commande.devise === "USD" ? "dollars US" : "F CFA"})`}
        name="montant"
        inputMode="numeric"
        placeholder={commande.devise === "USD" ? "ex. 450" : "ex. 250000"}
        defaultValue={v.montant ?? (commande.montant != null ? String(commande.montant) : "")}
        key={`m-${commande.montant}`}
        erreur={etat.erreurs?.montant}
        aide="Visible par le client dans son espace de suivi."
      />
      )}

      <ZoneTexte
        label="Message au client"
        name="messageClient"
        rows={2}
        placeholder="ex. Première version envoyée par e-mail."
        defaultValue={v.messageClient}
        erreur={etat.erreurs?.messageClient}
        aide={
          commande.langue === "en"
            ? "Client anglophone : écrivez votre message en anglais. Ajouté à l'historique visible par le client."
            : "Optionnel — ajouté à l'historique visible par le client."
        }
      />

      <ZoneTexte
        label="Notes internes"
        name="notesInternes"
        rows={3}
        defaultValue={v.notesInternes ?? commande.notesInternes ?? ""}
        key={`n-${commande.majLe.getTime()}`}
        erreur={etat.erreurs?.notesInternes}
        aide="Jamais visibles par le client."
      />

      <BoutonEnvoi className="w-full" enCours="Enregistrement…">
        Enregistrer
      </BoutonEnvoi>
    </form>
  );
}
