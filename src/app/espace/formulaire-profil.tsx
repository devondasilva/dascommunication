"use client";

import { useActionState } from "react";
import { enregistrerProfil } from "@/actions/compte";
import { Alerte, Champ } from "@/components/ui";
import { BoutonEnvoi } from "@/components/ui/bouton-envoi";
import type { EtatFormulaire } from "@/lib/validations";

type Profil = { nom: string | null; entreprise: string | null; telephone: string | null; pays: string | null };

export function FormulaireProfil({
  profil,
  libelleBouton = "Enregistrer",
  retour,
}: {
  profil: Profil;
  libelleBouton?: string;
  retour?: "accueil";
}) {
  const [etat, action] = useActionState<EtatFormulaire, FormData>(enregistrerProfil, {});
  const v = etat.valeurs ?? {};
  return (
    <form action={action} className="space-y-4" noValidate>
      {retour && <input type="hidden" name="retour" value={retour} />}
      {etat.message && <Alerte ton={etat.ok ? "succes" : "erreur"}>{etat.message}</Alerte>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Champ label="Nom complet" name="nom" autoComplete="name" requis defaultValue={v.nom ?? profil.nom ?? ""} erreur={etat.erreurs?.nom} />
        <Champ
          label="Entreprise ou organisation"
          name="entreprise"
          autoComplete="organization"
          defaultValue={v.entreprise ?? profil.entreprise ?? ""}
          erreur={etat.erreurs?.entreprise}
        />
        <Champ
          label="Téléphone / WhatsApp"
          name="telephone"
          type="tel"
          autoComplete="tel"
          requis
          defaultValue={v.telephone ?? profil.telephone ?? ""}
          erreur={etat.erreurs?.telephone}
        />
        <Champ
          label="Pays"
          name="pays"
          autoComplete="country-name"
          requis
          placeholder="Bénin, États-Unis…"
          defaultValue={v.pays ?? profil.pays ?? ""}
          erreur={etat.erreurs?.pays}
        />
      </div>
      <BoutonEnvoi enCours="Enregistrement…">{libelleBouton}</BoutonEnvoi>
    </form>
  );
}
