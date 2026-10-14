"use client";

import { useActionState } from "react";
import { enregistrerRole } from "@/actions/equipe";
import { Alerte, Champ, LienBouton } from "@/components/ui";
import { BoutonEnvoi } from "@/components/ui/bouton-envoi";
import { permissionsParGroupe } from "@/lib/permissions";
import type { EtatFormulaire } from "@/lib/validations";

type RoleEdite = { id: number; nom: string; description: string; permissions: string[]; systeme: boolean };

export function FormulaireRole({ role }: { role?: RoleEdite }) {
  const [etat, action] = useActionState<EtatFormulaire, FormData>(enregistrerRole, {});
  const verrouille = role?.systeme ?? false;
  const coches = new Set(role?.permissions ?? []);

  return (
    <form action={action} className="space-y-8" noValidate>
      {role && <input type="hidden" name="id" value={role.id} />}
      {etat.message && <Alerte ton="erreur">{etat.message}</Alerte>}
      {verrouille && (
        <Alerte ton="info">Le super-administrateur a toujours toutes les permissions. Ce rôle ne peut pas être modifié.</Alerte>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Champ
          label="Nom du rôle"
          name="nom"
          requis
          disabled={verrouille}
          placeholder="ex. Photographe"
          defaultValue={etat.valeurs?.nom ?? role?.nom}
          erreur={etat.erreurs?.nom}
        />
        <Champ
          label="Description"
          name="description"
          disabled={verrouille}
          placeholder="Ce que fait ce rôle, en une phrase"
          defaultValue={etat.valeurs?.description ?? role?.description}
          erreur={etat.erreurs?.description}
        />
      </div>

      <fieldset disabled={verrouille}>
        <legend className="text-base font-semibold text-encre">Accès accordés</legend>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {permissionsParGroupe().map(([groupe, perms]) => (
            <div key={groupe} className="rounded-xl bg-fond p-4">
              <p className="text-sm font-medium text-encre">{groupe}</p>
              <ul className="mt-3 space-y-2.5">
                {perms.map((p) => (
                  <li key={p.cle}>
                    <label className="flex items-start gap-3 text-sm text-encre-douce">
                      <input
                        type="checkbox"
                        name="permissions"
                        value={p.cle}
                        defaultChecked={verrouille || coches.has(p.cle)}
                        className="mt-0.5 size-4 shrink-0 accent-encre"
                      />
                      {p.libelle}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </fieldset>

      {!verrouille && (
        <div className="flex gap-3 border-t border-bordure pt-6">
          <BoutonEnvoi enCours="Enregistrement…">{role ? "Enregistrer le rôle" : "Créer le rôle"}</BoutonEnvoi>
          <LienBouton href="/dashboard/roles" variante="fantome">
            Annuler
          </LienBouton>
        </div>
      )}
    </form>
  );
}
