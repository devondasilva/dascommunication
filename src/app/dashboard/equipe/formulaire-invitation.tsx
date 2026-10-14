"use client";

import { useActionState, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { inviterMembre, type EtatInvitation } from "@/actions/equipe";
import { Alerte, Bouton, Champ, Selection } from "@/components/ui";
import { BoutonEnvoi } from "@/components/ui/bouton-envoi";

export function FormulaireInvitation({ roles }: { roles: { id: number; nom: string }[] }) {
  const [etat, action] = useActionState<EtatInvitation, FormData>(inviterMembre, {});
  const [copie, setCopie] = useState(false);
  const v = etat.ok ? {} : (etat.valeurs ?? {});

  return (
    <div className="space-y-5">
      {etat.ok && etat.lien && (
        <div className="space-y-3 rounded-xl bg-marque-pale p-4">
          <p className="text-sm font-medium text-encre">{etat.message}</p>
          <p className="rounded-lg bg-white px-3 py-2 font-mono text-xs break-all text-encre-douce">{etat.lien}</p>
          <div className="flex flex-wrap gap-2">
            <Bouton
              type="button"
              taille="sm"
              onClick={async () => {
                await navigator.clipboard.writeText(etat.lien!);
                setCopie(true);
                setTimeout(() => setCopie(false), 2000);
              }}
            >
              {copie ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
              <span aria-live="polite">{copie ? "Lien copié" : "Copier le lien"}</span>
            </Bouton>
            <a
              href={`mailto:${etat.email}?subject=${encodeURIComponent("Votre accès à l'espace DAS COM")}&body=${encodeURIComponent(`Bonjour,\n\nVoici votre lien pour rejoindre l'équipe DAS COM et créer votre mot de passe (valable 7 jours) :\n${etat.lien}\n\nÀ très vite !`)}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white px-3 text-sm font-medium text-encre ring-1 ring-bordure hover:bg-fond"
            >
              <Mail aria-hidden className="size-4" /> Envoyer par e-mail
            </a>
          </div>
        </div>
      )}

      <form action={action} className="space-y-4" noValidate>
        {etat.message && !etat.ok && <Alerte ton="erreur">{etat.message}</Alerte>}
        <Champ
          label="E-mail"
          name="email"
          type="email"
          requis
          id="invitation-email"
          defaultValue={v.email}
          erreur={etat.erreurs?.email}
        />
        <Selection label="Rôle" name="roleId" requis id="invitation-role" defaultValue={v.roleId ?? ""} erreur={etat.erreurs?.roleId}>
          <option value="" disabled>
            Choisissez un rôle…
          </option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nom}
            </option>
          ))}
        </Selection>
        <Champ
          label="Compétences"
          name="competences"
          id="invitation-competences"
          placeholder="Design graphique, Motion design, Print"
          aide="Séparées par des virgules."
          defaultValue={v.competences}
        />
        <BoutonEnvoi className="w-full" enCours="Création…">
          Créer l&apos;invitation
        </BoutonEnvoi>
      </form>
    </div>
  );
}
