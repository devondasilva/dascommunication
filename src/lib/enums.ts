/**
 * Valeurs autorisées — sans dépendance, importable côté client comme serveur.
 */

export const CATEGORIES_SERVICE = [
  "marketing",
  "design",
  "seo",
  "developpement",
  "evenementiel",
  "contenu",
] as const;
export const STATUTS_COMMANDE = [
  "nouvelle",
  "en_cours",
  "en_revision",
  "livree",
  "annulee",
] as const;
export const STATUTS_MODIFICATION = [
  "en_attente",
  "en_cours",
  "terminee",
  "refusee",
] as const;
export const PRIORITES = ["basse", "normale", "haute"] as const;

export type CategorieService = (typeof CATEGORIES_SERVICE)[number];
export type StatutCommande = (typeof STATUTS_COMMANDE)[number];
export type StatutModification = (typeof STATUTS_MODIFICATION)[number];
export type Priorite = (typeof PRIORITES)[number];

/** client : connexion Google · equipe : membre DAS COM avec un rôle */
export const TYPES_UTILISATEUR = ["client", "equipe"] as const;
export type TypeUtilisateur = (typeof TYPES_UTILISATEUR)[number];

/** Catégories du portfolio (réalisations) */
export const CATEGORIES_REALISATION = ["logos", "web", "visuels", "edition"] as const;
export type CategorieRealisation = (typeof CATEGORIES_REALISATION)[number];
