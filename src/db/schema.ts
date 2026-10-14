import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import {
  CATEGORIES_REALISATION,
  CATEGORIES_SERVICE,
  PRIORITES,
  STATUTS_COMMANDE,
  STATUTS_MODIFICATION,
  TYPES_UTILISATEUR,
} from "@/lib/enums";

export * from "@/lib/enums";

const horodatage = (nom: string) => timestamp(nom, { withTimezone: true, mode: "date" }).notNull().defaultNow();

/* ================================================================== */
/*  Comptes, rôles et sécurité                                          */
/* ================================================================== */

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nom: text("nom").notNull(),
  description: text("description").notNull().default(""),
  /** Clés du catalogue src/lib/permissions.ts */
  permissions: text("permissions").array().notNull().default(sql`'{}'::text[]`),
  /** Rôle système (super-admin) : non supprimable, toutes permissions */
  systeme: boolean("systeme").notNull().default(false),
  creeLe: horodatage("cree_le"),
});

/**
 * Utilisateurs : clients (connexion Google) et membres de l'équipe
 * (e-mail + mot de passe, 2FA facultative).
 */
export const utilisateurs = pgTable(
  "utilisateurs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    nom: text("nom"),
    image: text("image"),
    type: text("type", { enum: TYPES_UTILISATEUR }).notNull().default("client"),
    roleId: integer("role_id").references(() => roles.id, { onDelete: "set null" }),
    /** Compétences déclarées (équipe) : design, SEO, vidéo… */
    competences: text("competences").array().notNull().default(sql`'{}'::text[]`),
    googleId: text("google_id"),
    /** Empreinte scrypt du mot de passe (équipe uniquement) */
    motDePasse: text("mot_de_passe"),
    /** Secret TOTP de la double authentification, une fois activée */
    secret2fa: text("secret_2fa"),
    actif: boolean("actif").notNull().default(true),
    // Profil client
    entreprise: text("entreprise"),
    telephone: text("telephone"),
    pays: text("pays"),
    profilComplet: boolean("profil_complet").notNull().default(false),
    derniereConnexion: timestamp("derniere_connexion", { withTimezone: true, mode: "date" }),
    creeLe: horodatage("cree_le"),
  },
  (t) => [
    uniqueIndex("utilisateurs_email_idx").on(sql`lower(${t.email})`),
    uniqueIndex("utilisateurs_google_idx").on(t.googleId),
    index("utilisateurs_type_idx").on(t.type),
  ],
);

/** Invitations envoyées aux futurs membres de l'équipe. */
export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  roleId: integer("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade" }),
  competences: text("competences").array().notNull().default(sql`'{}'::text[]`),
  /** Empreinte SHA-256 du jeton (le jeton en clair n'est jamais stocké) */
  jetonHash: text("jeton_hash").notNull().unique(),
  expireLe: timestamp("expire_le", { withTimezone: true, mode: "date" }).notNull(),
  acceptee: timestamp("acceptee_le", { withTimezone: true, mode: "date" }),
  invitePar: uuid("invite_par").references(() => utilisateurs.id, { onDelete: "set null" }),
  creeLe: horodatage("cree_le"),
});

/** Journal d'audit : qui a fait quoi, quand. */
export const journalAudit = pgTable(
  "journal_audit",
  {
    id: serial("id").primaryKey(),
    acteurId: uuid("acteur_id").references(() => utilisateurs.id, { onDelete: "set null" }),
    acteurEmail: text("acteur_email"),
    action: text("action").notNull(),
    cible: text("cible"),
    details: jsonb("details").$type<Record<string, unknown>>(),
    creeLe: horodatage("cree_le"),
  },
  (t) => [index("journal_cree_le_idx").on(t.creeLe), index("journal_action_idx").on(t.action)],
);

/* ================================================================== */
/*  Catalogue et commandes                                              */
/* ================================================================== */

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nom: text("nom").notNull(),
  categorie: text("categorie", { enum: CATEGORIES_SERVICE }).notNull(),
  resume: text("resume").notNull(),
  description: text("description").notNull(),
  /** Liste des livrables, une ligne par élément */
  livrables: text("livrables").notNull().default(""),
  /** Prix « à partir de », en unité de la devise (ex. F CFA) */
  prixDepart: integer("prix_depart").notNull(),
  delaiJours: integer("delai_jours").notNull(),
  actif: boolean("actif").notNull().default(true),
  ordre: integer("ordre").notNull().default(0),
  creeLe: horodatage("cree_le"),
});

export const commandes = pgTable(
  "commandes",
  {
    id: serial("id").primaryKey(),
    /** Référence lisible communiquée au client, ex. CMD-2026-0042 */
    reference: text("reference").notNull().unique(),
    /** Jeton secret pour le lien de suivi client */
    jetonSuivi: text("jeton_suivi").notNull().unique(),
    /** Compte client (si la commande a été passée connecté) */
    clientId: uuid("client_id").references(() => utilisateurs.id, { onDelete: "set null" }),
    serviceId: integer("service_id").references(() => services.id, { onDelete: "set null" }),
    /** Copie du nom du service au moment de la commande */
    serviceNom: text("service_nom").notNull(),
    clientNom: text("client_nom").notNull(),
    clientEmail: text("client_email").notNull(),
    clientTelephone: text("client_telephone"),
    entreprise: text("entreprise"),
    brief: text("brief").notNull(),
    budget: text("budget"),
    dateSouhaitee: text("date_souhaitee"),
    statut: text("statut", { enum: STATUTS_COMMANDE }).notNull().default("nouvelle"),
    /** Montant facturé, fixé par l'équipe */
    montant: integer("montant"),
    notesInternes: text("notes_internes"),
    creeLe: horodatage("cree_le"),
    majLe: horodatage("maj_le"),
  },
  (t) => [
    index("commandes_statut_idx").on(t.statut),
    index("commandes_cree_le_idx").on(t.creeLe),
    index("commandes_email_idx").on(sql`lower(${t.clientEmail})`),
    index("commandes_client_idx").on(t.clientId),
  ],
);

export const modifications = pgTable(
  "modifications",
  {
    id: serial("id").primaryKey(),
    commandeId: integer("commande_id")
      .notNull()
      .references(() => commandes.id, { onDelete: "cascade" }),
    description: text("description").notNull(),
    priorite: text("priorite", { enum: PRIORITES }).notNull().default("normale"),
    statut: text("statut", { enum: STATUTS_MODIFICATION }).notNull().default("en_attente"),
    /** Réponse visible par le client */
    reponse: text("reponse"),
    creeLe: horodatage("cree_le"),
    majLe: horodatage("maj_le"),
  },
  (t) => [index("modifications_commande_idx").on(t.commandeId), index("modifications_statut_idx").on(t.statut)],
);

export const activites = pgTable(
  "activites",
  {
    id: serial("id").primaryKey(),
    commandeId: integer("commande_id")
      .notNull()
      .references(() => commandes.id, { onDelete: "cascade" }),
    message: text("message").notNull(),
    /** Affiché dans l'espace de suivi du client */
    visibleClient: boolean("visible_client").notNull().default(true),
    creeLe: horodatage("cree_le"),
  },
  (t) => [index("activites_commande_idx").on(t.commandeId)],
);

/* ================================================================== */
/*  Portfolio : réalisations et leurs visuels                           */
/* ================================================================== */

export const realisations = pgTable(
  "realisations",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    titre: text("titre").notNull(),
    categorie: text("categorie", { enum: CATEGORIES_REALISATION }).notNull(),
    description: text("description"),
    client: text("client"),
    secteur: text("secteur"),
    /** Lien externe (maquette Figma, site en ligne…) */
    lien: text("lien"),
    tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
    /** Affichée sur l'accueil */
    misEnAvant: boolean("mis_en_avant").notNull().default(false),
    /** Visible sur le site public */
    publie: boolean("publie").notNull().default(true),
    ordre: integer("ordre").notNull().default(0),
    creeLe: horodatage("cree_le"),
    majLe: horodatage("maj_le"),
  },
  (t) => [index("realisations_categorie_idx").on(t.categorie), index("realisations_ordre_idx").on(t.ordre)],
);

/** Visuels d'une réalisation ; le premier (ordre le plus petit) sert de couverture. */
export const visuels = pgTable(
  "visuels",
  {
    id: serial("id").primaryKey(),
    realisationId: integer("realisation_id")
      .notNull()
      .references(() => realisations.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    largeur: integer("largeur").notNull(),
    hauteur: integer("hauteur").notNull(),
    alt: text("alt").notNull().default(""),
    ordre: integer("ordre").notNull().default(0),
    /** Vrai pour les fichiers envoyés depuis le dashboard (supprimables du stockage) */
    televerse: boolean("televerse").notNull().default(false),
    creeLe: horodatage("cree_le"),
  },
  (t) => [index("visuels_realisation_idx").on(t.realisationId, t.ordre)],
);

/* ================================================================== */
/*  Paramètres du site (coordonnées, bannière…) modifiables             */
/* ================================================================== */

export const parametres = pgTable("parametres", {
  cle: text("cle").primaryKey(),
  valeur: text("valeur").notNull(),
  majLe: horodatage("maj_le"),
});

/* ================================================================== */
/*  Relations                                                           */
/* ================================================================== */

export const rolesRelations = relations(roles, ({ many }) => ({
  utilisateurs: many(utilisateurs),
}));

export const utilisateursRelations = relations(utilisateurs, ({ one, many }) => ({
  role: one(roles, { fields: [utilisateurs.roleId], references: [roles.id] }),
  commandes: many(commandes),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  role: one(roles, { fields: [invitations.roleId], references: [roles.id] }),
  auteur: one(utilisateurs, { fields: [invitations.invitePar], references: [utilisateurs.id] }),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  commandes: many(commandes),
}));

export const commandesRelations = relations(commandes, ({ one, many }) => ({
  service: one(services, { fields: [commandes.serviceId], references: [services.id] }),
  client: one(utilisateurs, { fields: [commandes.clientId], references: [utilisateurs.id] }),
  modifications: many(modifications),
  activites: many(activites),
}));

export const modificationsRelations = relations(modifications, ({ one }) => ({
  commande: one(commandes, { fields: [modifications.commandeId], references: [commandes.id] }),
}));

export const activitesRelations = relations(activites, ({ one }) => ({
  commande: one(commandes, { fields: [activites.commandeId], references: [commandes.id] }),
}));

export const realisationsRelations = relations(realisations, ({ many }) => ({
  visuels: many(visuels),
}));

export const visuelsRelations = relations(visuels, ({ one }) => ({
  realisation: one(realisations, { fields: [visuels.realisationId], references: [realisations.id] }),
}));

export type Realisation = typeof realisations.$inferSelect;
export type Visuel = typeof visuels.$inferSelect;
export type Role = typeof roles.$inferSelect;
export type Utilisateur = typeof utilisateurs.$inferSelect;
export type Invitation = typeof invitations.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Commande = typeof commandes.$inferSelect;
export type Modification = typeof modifications.$inferSelect;
export type Activite = typeof activites.$inferSelect;
