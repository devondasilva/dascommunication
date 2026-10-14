"use client";

import { useActionState } from "react";
import { passerCommande } from "@/actions/public";
import { BoutonEnvoi } from "@/components/ui/bouton-envoi";
import { Alerte, Champ, PotDeMiel, Selection, ZoneTexte } from "@/components/ui";
import type { EtatFormulaire } from "@/lib/validations";

type OptionService = { id: number; nom: string; categorie: string; prix: string };

export function FormulaireCommande({
  services,
  serviceInitial,
  profil,
}: {
  services: OptionService[];
  serviceInitial?: number;
  /** Coordonnées pré-remplies quand le client est connecté */
  profil?: { nom?: string | null; email?: string; telephone?: string | null; entreprise?: string | null };
}) {
  const [etat, action] = useActionState<EtatFormulaire, FormData>(passerCommande, {});
  const v = etat.valeurs ?? {};
  const e = etat.erreurs ?? {};

  const groupes = Object.entries(
    services.reduce<Record<string, OptionService[]>>((acc, s) => {
      (acc[s.categorie] ??= []).push(s);
      return acc;
    }, {}),
  );

  return (
    <form action={action} className="relative space-y-8" noValidate>
      <PotDeMiel />

      {etat.message && <Alerte ton="erreur">{etat.message}</Alerte>}

      <fieldset className="space-y-5">
        <legend className="text-base font-semibold text-encre">1. Votre besoin</legend>
        <Selection
          label="Service souhaité"
          name="serviceId"
          requis
          defaultValue={v.serviceId ?? (serviceInitial ? String(serviceInitial) : "")}
          erreur={e.serviceId}
        >
          <option value="" disabled>
            Choisissez un service…
          </option>
          {groupes.map(([categorie, liste]) => (
            <optgroup key={categorie} label={categorie}>
              {liste.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nom} — dès {s.prix}
                </option>
              ))}
            </optgroup>
          ))}
        </Selection>

        <ZoneTexte
          label="Décrivez votre projet"
          name="brief"
          requis
          rows={6}
          placeholder="Votre activité, vos objectifs, votre cible, ce que vous avez déjà (logo, site, pages…) et ce que vous attendez de nous."
          defaultValue={v.brief}
          erreur={e.brief}
          aide="Plus votre description est précise, plus notre devis sera juste."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Champ
            label="Budget indicatif"
            name="budget"
            placeholder="ex. 200 000 – 400 000 F CFA"
            defaultValue={v.budget}
            erreur={e.budget}
          />
          <Champ
            label="Date souhaitée"
            name="dateSouhaitee"
            type="date"
            defaultValue={v.dateSouhaitee}
            erreur={e.dateSouhaitee}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-base font-semibold text-encre">2. Vos coordonnées</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Champ
            label="Nom complet"
            name="clientNom"
            requis
            autoComplete="name"
            defaultValue={v.clientNom ?? profil?.nom ?? undefined}
            erreur={e.clientNom}
          />
          <Champ
            label="Entreprise"
            name="entreprise"
            autoComplete="organization"
            defaultValue={v.entreprise ?? profil?.entreprise ?? undefined}
            erreur={e.entreprise}
          />
          <Champ
            label="E-mail"
            name="clientEmail"
            type="email"
            requis
            autoComplete="email"
            defaultValue={v.clientEmail ?? profil?.email}
            erreur={e.clientEmail}
            aide="Il vous servira à retrouver votre commande."
          />
          <Champ
            label="Téléphone / WhatsApp"
            name="clientTelephone"
            type="tel"
            autoComplete="tel"
            defaultValue={v.clientTelephone ?? profil?.telephone ?? undefined}
            erreur={e.clientTelephone}
          />
        </div>
      </fieldset>

      <div className="space-y-2">
        <label className="flex items-start gap-3 text-sm text-encre-douce">
          <input
            type="checkbox"
            name="consentement"
            defaultChecked={v.consentement === "on"}
            className="mt-0.5 size-4 rounded border-bordure accent-encre"
            aria-invalid={e.consentement ? true : undefined}
          />
          J&apos;accepte que mes informations soient utilisées pour traiter ma demande et être recontacté.
        </label>
        {e.consentement?.[0] && <p className="text-sm text-red-700">{e.consentement[0]}</p>}
      </div>

      <BoutonEnvoi taille="lg" className="w-full sm:w-auto" enCours="Envoi de la commande…">
        Envoyer ma commande
      </BoutonEnvoi>
    </form>
  );
}
