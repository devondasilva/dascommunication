/** Libellés traduits des valeurs fixes (catégories, statuts…). */
import {
  LIBELLES_CATEGORIE,
  LIBELLES_REALISATION,
  PRIORITE,
  STATUT_COMMANDE,
  STATUT_MODIFICATION,
} from "@/lib/constantes";
import type {
  CategorieRealisation,
  CategorieService,
  Langue,
  Priorite,
  StatutCommande,
  StatutModification,
} from "@/lib/enums";

const CATEGORIE_SERVICE_EN: Record<CategorieService, string> = {
  marketing: "Digital marketing",
  design: "Graphic design",
  seo: "SEO",
  developpement: "Web & apps",
  evenementiel: "Event communication",
  contenu: "Content & video",
};

const CATEGORIE_REALISATION_EN: Record<CategorieRealisation, string> = {
  logos: "Logos",
  web: "Web & apps",
  visuels: "Visuals & print",
  edition: "Publishing",
};

const STATUT_COMMANDE_EN: Record<StatutCommande, { libelle: string; description: string }> = {
  nouvelle: { libelle: "New", description: "Order received, waiting to be picked up" },
  en_cours: { libelle: "In progress", description: "Our team is working on your project" },
  en_revision: { libelle: "In revision", description: "Adjustments are under way" },
  livree: { libelle: "Delivered", description: "Project completed and delivered" },
  annulee: { libelle: "Cancelled", description: "Order cancelled" },
};

const STATUT_MODIFICATION_EN: Record<StatutModification, string> = {
  en_attente: "Pending",
  en_cours: "In progress",
  terminee: "Done",
  refusee: "Declined",
};

const PRIORITE_EN: Record<Priorite, string> = { basse: "Low", normale: "Normal", haute: "High" };

export const categorieService = (c: CategorieService, l: Langue) =>
  l === "en" ? CATEGORIE_SERVICE_EN[c] : LIBELLES_CATEGORIE[c];

export const categorieRealisation = (c: CategorieRealisation, l: Langue) =>
  l === "en" ? CATEGORIE_REALISATION_EN[c] : LIBELLES_REALISATION[c];

export const statutCommande = (s: StatutCommande, l: Langue) => ({
  ton: STATUT_COMMANDE[s].ton,
  libelle: l === "en" ? STATUT_COMMANDE_EN[s].libelle : STATUT_COMMANDE[s].libelle,
  description: l === "en" ? STATUT_COMMANDE_EN[s].description : STATUT_COMMANDE[s].description,
});

export const statutModification = (s: StatutModification, l: Langue) => ({
  ton: STATUT_MODIFICATION[s].ton,
  libelle: l === "en" ? STATUT_MODIFICATION_EN[s] : STATUT_MODIFICATION[s].libelle,
});

export const priorite = (p: Priorite, l: Langue) => (l === "en" ? PRIORITE_EN[p] : PRIORITE[p].libelle);

/** Mots-clés courants du portfolio. Un mot-clé absent de la liste est affiché tel quel. */
const TAGS_EN: Record<string, string> = {
  Affiche: "Poster",
  Associatif: "Non-profit",
  Art: "Art",
  Bannière: "Banner",
  Campagne: "Campaign",
  "Cartes de visite": "Business cards",
  Catalogue: "Catalogue",
  Édition: "Publishing",
  Éducation: "Education",
  Événementiel: "Events",
  Identité: "Identity",
  Invitation: "Invitation",
  "Mise en page": "Layout",
  Marque: "Brand",
  Mode: "Fashion",
  "Réseaux sociaux": "Social media",
  Restauration: "Food & hospitality",
  Tourisme: "Tourism",
};

export const traduireTag = (t: string, l: Langue) => (l === "en" ? (TAGS_EN[t] ?? t) : t);

/** Messages d'historique écrits automatiquement par l'application. */
const ACTIVITES_EN: Record<string, string> = {
  "Commande reçue": "Order received",
  "Demande de modification envoyée": "Change request sent",
  "Prise en charge de votre commande": "Your order has been picked up",
};

export function traduireActivite(message: string, l: Langue) {
  if (l === "fr") return message;
  if (ACTIVITES_EN[message]) return ACTIVITES_EN[message];
  const statut = /^Statut : (.+)$/.exec(message)?.[1];
  if (statut) {
    const cle = (Object.keys(STATUT_COMMANDE) as StatutCommande[]).find((s) => STATUT_COMMANDE[s].libelle === statut);
    if (cle) return `Status: ${STATUT_COMMANDE_EN[cle].libelle}`;
  }
  const modif = /^Demande de modification : (.+)$/.exec(message)?.[1];
  if (modif) {
    const cle = (Object.keys(STATUT_MODIFICATION) as StatutModification[]).find(
      (s) => STATUT_MODIFICATION[s].libelle.toLowerCase() === modif,
    );
    if (cle) return `Change request: ${STATUT_MODIFICATION_EN[cle].toLowerCase()}`;
  }
  const montant = /^Montant fixé à (.+)$/.exec(message)?.[1];
  if (montant) return `Amount set to ${montant}`;
  return message;
}
