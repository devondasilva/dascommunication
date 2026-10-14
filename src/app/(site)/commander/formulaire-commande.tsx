"use client";

import { useActionState } from "react";
import { passerCommande } from "@/actions/public";
import { BoutonEnvoi } from "@/components/ui/bouton-envoi";
import { Alerte, Champ, PotDeMiel, Selection, ZoneTexte } from "@/components/ui";
import { useI18n } from "@/i18n/client";
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
  const { tr, devise } = useI18n();
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
        <legend className="text-base font-semibold text-encre">{tr("1. Votre besoin", "1. Your project")}</legend>
        <Selection
          label={tr("Service souhaité", "Service")}
          name="serviceId"
          requis
          defaultValue={v.serviceId ?? (serviceInitial ? String(serviceInitial) : "")}
          erreur={e.serviceId}
        >
          <option value="" disabled>
            {tr("Choisissez un service…", "Choose a service…")}
          </option>
          {groupes.map(([categorie, liste]) => (
            <optgroup key={categorie} label={categorie}>
              {liste.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nom} — {tr("dès", "from")} {s.prix}
                </option>
              ))}
            </optgroup>
          ))}
        </Selection>

        <ZoneTexte
          label={tr("Décrivez votre projet", "Describe your project")}
          name="brief"
          requis
          rows={6}
          placeholder={tr(
            "Votre activité, vos objectifs, votre cible, ce que vous avez déjà (logo, site, pages…) et ce que vous attendez de nous.",
            "Your business, your goals, your audience, what you already have (logo, website, pages…) and what you expect from us.",
          )}
          defaultValue={v.brief}
          erreur={e.brief}
          aide={tr(
            "Plus votre description est précise, plus notre devis sera juste.",
            "The more precise your description, the more accurate our quote.",
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Champ
            label={tr("Budget indicatif", "Estimated budget")}
            name="budget"
            placeholder={
              devise === "USD" ? tr("ex. 400 – 800 $", "e.g. $400 – $800") : tr("ex. 200 000 – 400 000 F CFA", "e.g. 200,000 – 400,000 CFA francs")
            }
            defaultValue={v.budget}
            erreur={e.budget}
          />
          <Champ
            label={tr("Date souhaitée", "Preferred date")}
            name="dateSouhaitee"
            type="date"
            defaultValue={v.dateSouhaitee}
            erreur={e.dateSouhaitee}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-base font-semibold text-encre">{tr("2. Vos coordonnées", "2. Your details")}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Champ
            label={tr("Nom complet", "Full name")}
            name="clientNom"
            requis
            autoComplete="name"
            defaultValue={v.clientNom ?? profil?.nom ?? undefined}
            erreur={e.clientNom}
          />
          <Champ
            label={tr("Entreprise", "Company")}
            name="entreprise"
            autoComplete="organization"
            defaultValue={v.entreprise ?? profil?.entreprise ?? undefined}
            erreur={e.entreprise}
          />
          <Champ
            label={tr("E-mail", "Email")}
            name="clientEmail"
            type="email"
            requis
            autoComplete="email"
            defaultValue={v.clientEmail ?? profil?.email}
            erreur={e.clientEmail}
            aide={tr("Il vous servira à retrouver votre commande.", "You will use it to find your order.")}
          />
          <Champ
            label={tr("Téléphone / WhatsApp", "Phone / WhatsApp")}
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
          {tr(
            "J'accepte que mes informations soient utilisées pour traiter ma demande et être recontacté.",
            "I agree that my information may be used to process my request and to contact me.",
          )}
        </label>
        {e.consentement?.[0] && <p className="text-sm text-red-700">{e.consentement[0]}</p>}
      </div>

      <BoutonEnvoi taille="lg" className="w-full sm:w-auto" enCours={tr("Envoi de la commande…", "Sending your order…")}>
        {tr("Envoyer ma commande", "Send my order")}
      </BoutonEnvoi>
    </form>
  );
}
