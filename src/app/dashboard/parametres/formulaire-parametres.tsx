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
          <div className="sm:col-start-2">
            <Champ
              label="Présence (anglais)"
              name="presenceEn"
              lang="en"
              placeholder="Maryland, Virginia and Benin"
              defaultValue={v("presenceEn")}
              erreur={e.presenceEn}
            />
          </div>
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
        <p className="-mt-2 text-sm text-encre-muette">
          Affichée sur l&apos;accueil et en haut de la page Services, en français et sur le site anglais.
        </p>
        <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
          <p className="text-xs font-semibold tracking-wide text-encre-muette uppercase">Français</p>
          <p className="hidden text-xs font-semibold tracking-wide text-encre-muette uppercase md:block">English</p>
          <Champ label="Accroche" name="banniereAccroche" defaultValue={v("banniereAccroche")} erreur={e.banniereAccroche} />
          <Champ label="Tagline" name="banniereAccrocheEn" lang="en" defaultValue={v("banniereAccrocheEn")} erreur={e.banniereAccrocheEn} />
          <Champ label="Titre" name="banniereTitre" requis defaultValue={v("banniereTitre")} erreur={e.banniereTitre} />
          <Champ label="Title" name="banniereTitreEn" lang="en" defaultValue={v("banniereTitreEn")} erreur={e.banniereTitreEn} />
          <ZoneTexte
            label="Arguments"
            name="banniereArguments"
            rows={3}
            aide="Un argument par ligne (3 conseillés)."
            defaultValue={v("banniereArguments")}
            erreur={e.banniereArguments}
          />
          <ZoneTexte
            label="Selling points"
            name="banniereArgumentsEn"
            lang="en"
            rows={3}
            aide="One per line. Empty = French text."
            defaultValue={v("banniereArgumentsEn")}
            erreur={e.banniereArgumentsEn}
          />
        </div>
      </Carte>

      <Carte id="devises" className="scroll-mt-24 space-y-4 p-6">
        <h2 className="text-lg font-semibold text-encre">Prix en dollars</h2>
        <p className="-mt-2 text-sm text-encre-muette">
          Les visiteurs choisissent d&apos;afficher les prix en F CFA ou en dollars (dollars par défaut sur le site anglais).
          Pour les services sans prix en dollars saisi dans Tarifs, le prix est converti avec ce taux puis arrondi.
        </p>
        <div className="max-w-xs">
          <Champ
            label="Taux de conversion"
            name="tauxUsd"
            inputMode="decimal"
            requis
            aide="Nombre de F CFA pour 1 dollar US."
            defaultValue={v("tauxUsd")}
            erreur={e.tauxUsd}
          />
        </div>
      </Carte>

      <BoutonEnvoi enCours="Enregistrement…">Enregistrer les paramètres</BoutonEnvoi>
    </form>
  );
}
