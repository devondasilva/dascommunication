import type { Devise } from "./enums";

/** Taux par défaut : nombre de F CFA pour 1 dollar (modifiable dans Paramètres du site). */
export const TAUX_USD_PAR_DEFAUT = 600;

/** Arrondi commercial d'un prix converti en dollars : 5 $ sous 100 $, 10 $ sous 1 000 $, puis 50 $. */
export function arrondirUsd(n: number) {
  const pas = n < 100 ? 5 : n < 1000 ? 10 : 50;
  return Math.max(pas, Math.round(n / pas) * pas);
}

/** Conversion d'un montant en F CFA vers les dollars, arrondi. */
export const convertirEnUsd = (xof: number, taux: number) => arrondirUsd(xof / taux);

/**
 * Prix de départ d'un service dans la devise affichée :
 * le prix en dollars saisi dans Tarifs, sinon la conversion automatique.
 */
export function prixService(s: { prixDepart: number; prixUsd: number | null }, devise: Devise, taux: number) {
  if (devise === "XOF") return s.prixDepart;
  return s.prixUsd ?? convertirEnUsd(s.prixDepart, taux);
}

/** Montant ramené en F CFA (pour additionner des commandes dans des devises différentes). */
export const versXof = (montant: number, devise: Devise, taux: number) =>
  devise === "USD" ? Math.round(montant * taux) : montant;
