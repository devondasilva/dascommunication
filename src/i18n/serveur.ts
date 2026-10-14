import "server-only";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import type { Devise, Langue } from "@/lib/enums";
import { parametresSite, tauxUsd } from "@/lib/parametres";
import { prixService } from "@/lib/prix";
import {
  COOKIE_DEVISE,
  creerTr,
  deviseParDefaut,
  ENTETE_LANGUE,
  estDevise,
  formaterDateHeureLangue,
  formaterDateLangue,
  formaterPrix,
  lienLocal,
  partiesPrix,
} from "./commun";

/** Langue de la requête en cours (fixée par le proxy selon le préfixe /en). */
export const langueRequete = cache(async (): Promise<Langue> => {
  const h = await headers();
  return h.get(ENTETE_LANGUE) === "en" ? "en" : "fr";
});

/** Devise choisie par le visiteur (cookie), sinon celle de sa langue. */
export const deviseRequete = cache(async (): Promise<Devise> => {
  const choix = (await cookies()).get(COOKIE_DEVISE)?.value;
  return estDevise(choix) ? choix : deviseParDefaut(await langueRequete());
});

/**
 * Tout le nécessaire pour afficher une page dans la langue et la devise
 * du visiteur : tr("fr", "en"), liens localisés, prix convertis, dates.
 */
export const i18n = cache(async () => {
  const [langue, devise, p] = await Promise.all([langueRequete(), deviseRequete(), parametresSite()]);
  const taux = tauxUsd(p);
  return {
    langue,
    devise,
    taux,
    tr: creerTr(langue),
    /** Lien interne dans la langue courante */
    l: (chemin: string) => lienLocal(langue, chemin),
    /** Prix de départ d'un service dans la devise affichée */
    prix: (s: { prixDepart: number; prixUsd: number | null }) => prixService(s, devise, taux),
    fmtPrix: (v: number | null | undefined, d: Devise = devise) => formaterPrix(v, d, langue),
    partiesPrix: (v: number, d: Devise = devise) => partiesPrix(v, d, langue),
    date: (d: Date | string | null | undefined) => formaterDateLangue(d, langue),
    dateHeure: (d: Date) => formaterDateHeureLangue(d, langue),
  };
});

export type ContexteI18n = Awaited<ReturnType<typeof i18n>>;

/**
 * Métadonnées d'une page publique : adresse canonique dans la langue
 * courante et équivalents hreflang (fr, en) pour les moteurs de recherche.
 */
export async function metaLangues(chemin: string) {
  const langue = await langueRequete();
  return {
    canonical: lienLocal(langue, chemin),
    languages: { fr: chemin, en: lienLocal("en", chemin), "x-default": chemin },
  };
}
