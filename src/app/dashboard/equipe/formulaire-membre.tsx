"use client";

import { useActionState } from "react";
import { modifierMembre } from "@/actions/equipe";
import { Alerte, Champ, Selection } from "@/components/ui";
import { BoutonEnvoi } from "@/components/ui/bouton-envoi";
import type { EtatFormulaire } from "@/lib/validations";

export function FormulaireMembre({
  membre,
  roles,
}: {
  membre: { id: string; roleId: number | null; competences: string[] };
  roles: { id: number; nom: string }[];
}) {
  const [etat, action] = useActionState<EtatFormulaire, FormData>(modifierMembre, {});
  const id = `membre-${membre.id.slice(0, 8)}`;
  return (
    <form action={action} className="space-y-3" noValidate>
      <input type="hidden" name="id" value={membre.id} />
      {etat.message && <Alerte ton={etat.ok ? "succes" : "erreur"}>{etat.message}</Alerte>}
      <div className="grid gap-3 sm:grid-cols-2">
        <Selection label="Rôle" name="roleId" id={`${id}-role`} defaultValue={membre.roleId ?? ""} erreur={etat.erreurs?.roleId}>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nom}
            </option>
          ))}
        </Selection>
        <Champ label="Compétences" name="competences" id={`${id}-competences`} defaultValue={membre.competences.join(", ")} />
      </div>
      <BoutonEnvoi variante="secondaire" enCours="Enregistrement…">
        Enregistrer
      </BoutonEnvoi>
    </form>
  );
}
