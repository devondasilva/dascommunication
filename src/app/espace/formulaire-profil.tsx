"use client";

import { useActionState } from "react";
import { enregistrerProfil } from "@/actions/compte";
import { Alerte, Champ } from "@/components/ui";
import { BoutonEnvoi } from "@/components/ui/bouton-envoi";
import { useI18n } from "@/i18n/client";
import type { EtatFormulaire } from "@/lib/validations";

type Profil = { nom: string | null; entreprise: string | null; telephone: string | null; pays: string | null };

export function FormulaireProfil({
  profil,
  libelleBouton,
  retour,
}: {
  profil: Profil;
  libelleBouton?: string;
  retour?: "accueil";
}) {
  const { tr } = useI18n();
  const [etat, action] = useActionState<EtatFormulaire, FormData>(enregistrerProfil, {});
  const v = etat.valeurs ?? {};
  return (
    <form action={action} className="space-y-4" noValidate>
      {retour && <input type="hidden" name="retour" value={retour} />}
      {etat.message && <Alerte ton={etat.ok ? "succes" : "erreur"}>{etat.message}</Alerte>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Champ label={tr("Nom complet", "Full name")} name="nom" autoComplete="name" requis defaultValue={v.nom ?? profil.nom ?? ""} erreur={etat.erreurs?.nom} />
        <Champ
          label={tr("Entreprise ou organisation", "Company or organisation")}
          name="entreprise"
          autoComplete="organization"
          defaultValue={v.entreprise ?? profil.entreprise ?? ""}
          erreur={etat.erreurs?.entreprise}
        />
        <Champ
          label={tr("Téléphone / WhatsApp", "Phone / WhatsApp")}
          name="telephone"
          type="tel"
          autoComplete="tel"
          requis
          defaultValue={v.telephone ?? profil.telephone ?? ""}
          erreur={etat.erreurs?.telephone}
        />
        <Champ
          label={tr("Pays", "Country")}
          name="pays"
          autoComplete="country-name"
          requis
          placeholder={tr("Bénin, États-Unis…", "United States, Benin…")}
          defaultValue={v.pays ?? profil.pays ?? ""}
          erreur={etat.erreurs?.pays}
        />
      </div>
      <BoutonEnvoi enCours={tr("Enregistrement…", "Saving…")}>{libelleBouton ?? tr("Enregistrer", "Save")}</BoutonEnvoi>
    </form>
  );
}
