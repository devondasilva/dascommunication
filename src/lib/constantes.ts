import type {
  CategorieService,
  Priorite,
  StatutCommande,
  StatutModification,
} from "@/lib/enums";

export const SITE = {
  nom: process.env.NEXT_PUBLIC_SITE_NAME ?? "DAS Communication",
  slogan: "Toujours plus créatif",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "dascom2004@gmail.com",
  telephone: process.env.NEXT_PUBLIC_CONTACT_TELEPHONE ?? "",
  devise: process.env.NEXT_PUBLIC_DEVISE ?? "XOF",
  presence: ["Maryland", "Virginia", "Bénin"],
  reseaux: {
    linkedin: "https://www.linkedin.com/in/honore-da-silva-b02561194",
    instagram: "https://www.instagram.com/devondasilva5",
    facebook: "https://www.facebook.com/devon.dasilva.37",
  },
};

export const LIBELLES_CATEGORIE: Record<CategorieService, string> = {
  marketing: "Marketing digital",
  design: "Design graphique",
  seo: "SEO",
  developpement: "Web & applications",
  evenementiel: "Communication événementielle",
  contenu: "Contenus & vidéo",
};

/** Ton visuel d'un statut — chaque statut a aussi une icône et un libellé (jamais la couleur seule). */
export type Ton = "info" | "progres" | "attention" | "succes" | "neutre" | "danger";

export const STATUT_COMMANDE: Record<StatutCommande, { libelle: string; ton: Ton; description: string }> = {
  nouvelle: { libelle: "Nouvelle", ton: "info", description: "Commande reçue, en attente de prise en charge" },
  en_cours: { libelle: "En cours", ton: "progres", description: "Notre équipe travaille sur votre projet" },
  en_revision: { libelle: "En révision", ton: "attention", description: "Des ajustements sont en cours" },
  livree: { libelle: "Livrée", ton: "succes", description: "Projet terminé et livré" },
  annulee: { libelle: "Annulée", ton: "neutre", description: "Commande annulée" },
};

export const STATUT_MODIFICATION: Record<StatutModification, { libelle: string; ton: Ton }> = {
  en_attente: { libelle: "En attente", ton: "attention" },
  en_cours: { libelle: "En cours", ton: "progres" },
  terminee: { libelle: "Terminée", ton: "succes" },
  refusee: { libelle: "Refusée", ton: "danger" },
};

export const PRIORITE: Record<Priorite, { libelle: string; ton: Ton }> = {
  basse: { libelle: "Basse", ton: "neutre" },
  normale: { libelle: "Normale", ton: "info" },
  haute: { libelle: "Haute", ton: "danger" },
};
