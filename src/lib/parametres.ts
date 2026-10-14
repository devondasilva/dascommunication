import "server-only";
import { connection } from "next/server";
import { cache } from "react";
import { db } from "@/db";
import { parametres } from "@/db/schema";
import { SITE } from "./constantes";
import { TAUX_USD_PAR_DEFAUT } from "./prix";

/**
 * Paramètres du site modifiables depuis le dashboard (Paramètres).
 * Toute clé absente de la base retombe sur sa valeur par défaut.
 */
export const PARAMETRES_PAR_DEFAUT = {
  email: SITE.email,
  telephone: SITE.telephone,
  whatsapp: "",
  presence: "Maryland, Virginie et Bénin",
  presenceEn: "Maryland, Virginia and Benin",
  linkedin: SITE.reseaux.linkedin,
  instagram: SITE.reseaux.instagram,
  facebook: SITE.reseaux.facebook,
  banniereAccroche: "Réponse sous 24 heures ouvrées",
  banniereTitre: "Votre projet chiffré en 24 heures, gratuitement.",
  banniereArguments:
    "Devis gratuit et sans engagement\nPrix de départ affichés pour chaque service\nSuivi de votre projet en ligne",
  banniereAccrocheEn: "Reply within one business day",
  banniereTitreEn: "Your project priced within 24 hours, free of charge.",
  banniereArgumentsEn: "Free, no-obligation quote\nStarting prices shown for every service\nTrack your project online",
  /** Nombre de F CFA pour 1 dollar, pour convertir les prix sans montant en dollars saisi */
  tauxUsd: String(TAUX_USD_PAR_DEFAUT),
};

export type CleParametre = keyof typeof PARAMETRES_PAR_DEFAUT;
export type Parametres = Record<CleParametre, string>;
export const CLES_PARAMETRES = Object.keys(PARAMETRES_PAR_DEFAUT) as CleParametre[];

export const parametresSite = cache(async (): Promise<Parametres> => {
  await connection();
  const lignes = await db.select().from(parametres);
  const valeurs: Parametres = { ...PARAMETRES_PAR_DEFAUT };
  for (const l of lignes) {
    if (l.cle in valeurs) valeurs[l.cle as CleParametre] = l.valeur;
  }
  return valeurs;
});

/** Taux de conversion F CFA → dollar en vigueur. */
export const tauxUsd = (p: Parametres) => {
  const n = Number(p.tauxUsd.replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : TAUX_USD_PAR_DEFAUT;
};
