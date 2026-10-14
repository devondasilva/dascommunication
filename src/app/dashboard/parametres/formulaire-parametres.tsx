"use client";

import { useActionState } from "react";
import { enregistrerParametres } from "@/actions/parametres";
import { Alerte, Carte, Champ, ZoneTexte } from "@/components/ui";
import { BoutonEnvoi } from "@/components/ui/bouton-envoi";
import type { Parametres } from "@/lib/parametres";
import type { EtatFormulaire } from "@/lib/validations";

export function FormulaireParametres({ parametres: p }: { parametres: Parametres }) {
  const [etat, action] = useActionState<EtatFormulaire, FormData>(enregistrerParametres, {});
  const v = (cle: keyof Parametres) => etat.valeurs?.[cle] ?? p[cle];
  const e = etat.erreurs ?? {};

  return (
    <form action={action} className="space-y-6" noValidate>
      {etat.message && <Alerte ton={etat.ok ? "succes" : "erreur"}>{etat.message}</Alerte>}

      <Carte className="space-y-4 p-6">
        <h2 className="text-lg font-semibold text-encre">Coordonnées</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Champ label="E-mail de contact" name="email" type="email" requis defaultValue={v("email")} erreur={e.email} />
          <Champ label="Téléphone" name="telephone" type="tel" placeholder="+229 …" defaultValue={v("telephone")} erreur={e.telephone} />
          <Champ
            label="WhatsApp"
            name="whatsapp"
            type="tel"
            placeholder="+229 …"
            aide="Affiche un bouton WhatsApp sur la page Contact."
            defaultValue={v("whatsapp")}
            erreur={e.whatsapp}
          />
          <Champ label="Présence" name="presence" placeholder="Maryland, Virginie et Bénin" defaultValue={v("presence")} erreur={e.presence} />
        </div>
      </Carte>

      <Carte className="space-y-4 p-6">
        <h2 className="text-lg font-semibold text-encre">Réseaux sociaux</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Champ label="LinkedIn" name="linkedin" type="url" placeholder="https://…" defaultValue={v("linkedin")} erreur={e.linkedin} />
          <Champ label="Instagram" name="instagram" type="url" placeholder="https://…" defaultValue={v("instagram")} erreur={e.instagram} />
          <Champ label="Facebook" name="facebook" type="url" placeholder="https://…" defaultValue={v("facebook")} erreur={e.facebook} />
        </div>
        <p className="text-xs text-encre-muette">Laissez un champ vide pour masquer le réseau correspondant.</p>
      </Carte>

      <Carte className="space-y-4 p-6">
        <h2 className="text-lg font-semibold text-encre">Bannière « devis »</h2>
        <p className="-mt-2 text-sm text-encre-muette">Affichée sur l&apos;accueil et en haut de la page Services.</p>
        <Champ label="Accroche" name="banniereAccroche" defaultValue={v("banniereAccroche")} erreur={e.banniereAccroche} />
        <Champ label="Titre" name="banniereTitre" requis defaultValue={v("banniereTitre")} erreur={e.banniereTitre} />
        <ZoneTexte
          label="Arguments"
          name="banniereArguments"
          rows={3}
          aide="Un argument par ligne (3 conseillés)."
          defaultValue={v("banniereArguments")}
          erreur={e.banniereArguments}
        />
      </Carte>

      <BoutonEnvoi enCours="Enregistrement…">Enregistrer les paramètres</BoutonEnvoi>
    </form>
  );
}
