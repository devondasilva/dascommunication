import "server-only";
import { connection } from "next/server";
import { cache } from "react";
import { db } from "@/db";
import { parametres } from "@/db/schema";
import { SITE } from "./constantes";

/**
 * Paramètres du site modifiables depuis le dashboard (Paramètres).
 * Toute clé absente de la base retombe sur sa valeur par défaut.
 */
export const PARAMETRES_PAR_DEFAUT = {
  email: SITE.email,
  telephone: SITE.telephone,
  whatsapp: "",
  presence: "Maryland, Virginie et Bénin",
  linkedin: SITE.reseaux.linkedin,
  instagram: SITE.reseaux.instagram,
  facebook: SITE.reseaux.facebook,
  banniereAccroche: "Réponse sous 24 heures ouvrées",
  banniereTitre: "Votre projet chiffré en 24 heures, gratuitement.",
  banniereArguments:
    "Devis gratuit et sans engagement\nPrix de départ affichés pour chaque service\nSuivi de votre projet en ligne",
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
