/**
 * Catalogue des permissions de l'application (source unique de vérité).
 * Chaque rôle de l'équipe est une liste de ces clés, modifiable dans le dashboard.
 * Fichier sans dépendance : importable côté client comme côté serveur.
 */

export const PERMISSIONS = {
  "dashboard.voir": { groupe: "Général", libelle: "Voir la vue d'ensemble" },

  "commandes.voir": { groupe: "Commandes", libelle: "Voir les commandes" },
  "commandes.gerer": { groupe: "Commandes", libelle: "Modifier le statut, le montant et les notes" },
  "commandes.supprimer": { groupe: "Commandes", libelle: "Supprimer une commande" },
  "modifications.gerer": { groupe: "Commandes", libelle: "Répondre aux demandes de modification" },

  "finances.voir": { groupe: "Finances", libelle: "Voir les montants et le chiffre d'affaires" },

  "services.gerer": { groupe: "Catalogue", libelle: "Créer et modifier les services et les tarifs" },
  "realisations.gerer": { groupe: "Catalogue", libelle: "Ajouter et modifier les réalisations (visuels)" },

  "clients.voir": { groupe: "Clients", libelle: "Voir la liste des clients" },

  "equipe.voir": { groupe: "Équipe", libelle: "Voir les membres de l'équipe" },
  "equipe.gerer": { groupe: "Équipe", libelle: "Inviter, désactiver et changer le rôle des membres" },
  "roles.gerer": { groupe: "Équipe", libelle: "Créer et modifier les rôles" },

  "audit.voir": { groupe: "Sécurité", libelle: "Consulter le journal d'audit" },
  "parametres.gerer": { groupe: "Sécurité", libelle: "Modifier les paramètres du site (coordonnées, bannière)" },
} as const;

export type Permission = keyof typeof PERMISSIONS;

export const TOUTES_LES_PERMISSIONS = Object.keys(PERMISSIONS) as Permission[];

export function estPermission(v: string): v is Permission {
  return v in PERMISSIONS;
}

/** Permissions regroupées par domaine, pour l'affichage de la matrice des rôles. */
export function permissionsParGroupe() {
  const groupes = new Map<string, { cle: Permission; libelle: string }[]>();
  for (const cle of TOUTES_LES_PERMISSIONS) {
    const { groupe, libelle } = PERMISSIONS[cle];
    if (!groupes.has(groupe)) groupes.set(groupe, []);
    groupes.get(groupe)!.push({ cle, libelle });
  }
  return [...groupes.entries()];
}

/**
 * Rôles créés au premier démarrage. Le super-admin est un rôle système :
 * il a toujours toutes les permissions et ne peut pas être supprimé.
 */
export const ROLES_PAR_DEFAUT: { slug: string; nom: string; description: string; permissions: Permission[]; systeme?: boolean }[] = [
  {
    slug: "super-admin",
    nom: "Super-administrateur",
    description: "Accès complet, y compris l'équipe, les rôles et la sécurité.",
    permissions: TOUTES_LES_PERMISSIONS,
    systeme: true,
  },
  {
    slug: "chef-de-projet",
    nom: "Chef de projet",
    description: "Pilote les commandes de bout en bout et coordonne l'équipe.",
    permissions: ["dashboard.voir", "commandes.voir", "commandes.gerer", "modifications.gerer", "finances.voir", "clients.voir", "equipe.voir", "realisations.gerer"],
  },
  {
    slug: "commercial",
    nom: "Commercial",
    description: "Suit les prospects et fixe les montants des commandes.",
    permissions: ["dashboard.voir", "commandes.voir", "commandes.gerer", "finances.voir", "clients.voir", "services.gerer"],
  },
  {
    slug: "comptable",
    nom: "Comptable",
    description: "Accès aux montants et au chiffre d'affaires.",
    permissions: ["dashboard.voir", "commandes.voir", "finances.voir", "clients.voir"],
  },
  {
    slug: "designer",
    nom: "Designer graphique",
    description: "Traite les commandes de création, les modifications et publie ses réalisations.",
    permissions: ["commandes.voir", "modifications.gerer", "realisations.gerer"],
  },
  {
    slug: "community-manager",
    nom: "Community manager",
    description: "Traite les commandes réseaux sociaux, répond aux clients et publie des réalisations.",
    permissions: ["commandes.voir", "modifications.gerer", "realisations.gerer"],
  },
  {
    slug: "developpeur",
    nom: "Développeur",
    description: "Traite les commandes de sites et d'applications.",
    permissions: ["commandes.voir", "modifications.gerer"],
  },
  {
    slug: "expert-seo",
    nom: "Expert SEO",
    description: "Traite les commandes de référencement.",
    permissions: ["commandes.voir", "modifications.gerer"],
  },
  {
    slug: "redacteur",
    nom: "Rédacteur",
    description: "Traite les commandes de contenus.",
    permissions: ["commandes.voir", "modifications.gerer"],
  },
];
