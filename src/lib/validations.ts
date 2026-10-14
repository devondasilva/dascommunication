import { z } from "zod";
import {
  CATEGORIES_REALISATION,
  CATEGORIES_SERVICE,
  PRIORITES,
  STATUTS_COMMANDE,
  STATUTS_MODIFICATION,
} from "@/lib/enums";

/** Champ texte optionnel : une chaîne vide devient `undefined`. */
const optionnel = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `${max} caractères maximum`)
    .transform((v) => (v === "" ? undefined : v))
    .optional();

export const schemaCommande = z.object({
  serviceId: z.coerce.number({ message: "Choisissez un service" }).int().positive("Choisissez un service"),
  clientNom: z.string().trim().min(2, "Indiquez votre nom complet").max(120),
  clientEmail: z.email("Adresse e-mail invalide").trim().toLowerCase().max(160),
  clientTelephone: optionnel(30),
  entreprise: optionnel(120),
  brief: z
    .string()
    .trim()
    .min(20, "Décrivez votre projet en quelques phrases (20 caractères minimum)")
    .max(4000, "4 000 caractères maximum"),
  budget: optionnel(60),
  dateSouhaitee: optionnel(20),
  consentement: z.literal("on", { message: "Vous devez accepter d'être recontacté" }),
});

export const schemaRechercheSuivi = z.object({
  reference: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^CMD-\d{4}-\d{4,}$/, "Format attendu : CMD-2026-0001"),
  email: z.email("Adresse e-mail invalide").trim().toLowerCase(),
});

export const schemaDemandeModification = z.object({
  jeton: z.string().min(10),
  description: z
    .string()
    .trim()
    .min(10, "Décrivez la modification souhaitée (10 caractères minimum)")
    .max(3000, "3 000 caractères maximum"),
  priorite: z.enum(PRIORITES).default("normale"),
});

export const schemaConnexion = z.object({
  email: z.email("Adresse e-mail invalide").trim().toLowerCase(),
  motDePasse: z.string().min(1, "Mot de passe requis"),
  redirection: z.string().optional(),
});

export const schemaMajCommande = z.object({
  id: z.coerce.number().int().positive(),
  statut: z.enum(STATUTS_COMMANDE),
  montant: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s  ]/g, ""))
    .refine((v) => v === "" || /^\d+$/.test(v), "Montant invalide (nombre entier)")
    .transform((v) => (v === "" ? null : Number(v))),
  notesInternes: optionnel(4000),
  messageClient: optionnel(1000),
});

export const schemaMajModification = z.object({
  id: z.coerce.number().int().positive(),
  statut: z.enum(STATUTS_MODIFICATION),
  reponse: optionnel(2000),
});

export const schemaService = z.object({
  id: z.coerce.number().int().positive().optional(),
  nom: z.string().trim().min(3, "Nom trop court").max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lettres minuscules, chiffres et tirets uniquement")
    .max(80),
  categorie: z.enum(CATEGORIES_SERVICE),
  resume: z.string().trim().min(10, "Résumé trop court").max(200),
  description: z.string().trim().min(20, "Description trop courte").max(4000),
  livrables: z.string().trim().max(2000).default(""),
  prixDepart: z.coerce.number({ message: "Prix invalide" }).int().min(0, "Prix invalide"),
  delaiJours: z.coerce.number({ message: "Délai invalide" }).int().min(1, "1 jour minimum").max(365),
  ordre: z.coerce.number().int().min(0).default(0),
  actif: z
    .string()
    .optional()
    .transform((v) => v === "on"),
});

/** Résultat standard renvoyé par les Server Actions aux formulaires. */
export type EtatFormulaire = {
  ok?: boolean;
  message?: string;
  erreurs?: Record<string, string[] | undefined>;
  valeurs?: Record<string, string>;
};

export function erreursDe(error: z.ZodError): EtatFormulaire["erreurs"] {
  return z.flattenError(error).fieldErrors as EtatFormulaire["erreurs"];
}

/** Conserve les saisies pour réafficher le formulaire en cas d'erreur. */
export function valeursDe(formData: FormData): Record<string, string> {
  const v: Record<string, string> = {};
  formData.forEach((val, cle) => {
    if (typeof val === "string" && !cle.startsWith("$")) v[cle] = val;
  });
  return v;
}

/* ------------------------------------------------------------------ */
/*  Comptes, équipe et rôles                                            */
/* ------------------------------------------------------------------ */

const listeCompetences = z
  .string()
  .optional()
  .transform((v) =>
    (v ?? "")
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)
      .slice(0, 12),
  );

export const schemaInvitation = z.object({
  email: z.email("Adresse e-mail invalide").trim().toLowerCase(),
  roleId: z.coerce.number({ message: "Choisissez un rôle" }).int().positive("Choisissez un rôle"),
  competences: listeCompetences,
});

export const schemaAcceptationInvitation = z
  .object({
    jeton: z.string().min(20),
    nom: z.string().trim().min(2, "Indiquez votre nom complet").max(120),
    motDePasse: z
      .string()
      .min(10, "10 caractères minimum")
      .regex(/[A-Za-zÀ-ÿ]/, "Au moins une lettre")
      .regex(/\d/, "Au moins un chiffre"),
    confirmation: z.string(),
  })
  .refine((d) => d.motDePasse === d.confirmation, {
    path: ["confirmation"],
    message: "Les deux mots de passe ne correspondent pas",
  });

export const schemaMembre = z.object({
  id: z.uuid(),
  roleId: z.coerce.number().int().positive("Choisissez un rôle"),
  competences: listeCompetences,
});

export const schemaRole = z.object({
  id: z.coerce.number().int().positive().optional(),
  nom: z.string().trim().min(2, "Nom trop court").max(60),
  description: z.string().trim().max(200).default(""),
});

export const schemaProfilClient = z.object({
  nom: z.string().trim().min(2, "Indiquez votre nom complet").max(120),
  entreprise: optionnel(120),
  telephone: z.string().trim().min(6, "Indiquez un numéro de téléphone ou WhatsApp").max(30),
  pays: z.string().trim().min(2, "Indiquez votre pays").max(60),
});

export const schemaChangementMotDePasse = z
  .object({
    actuel: z.string().min(1, "Indiquez votre mot de passe actuel"),
    nouveau: z
      .string()
      .min(10, "10 caractères minimum")
      .regex(/[A-Za-zÀ-ÿ]/, "Au moins une lettre")
      .regex(/\d/, "Au moins un chiffre"),
    confirmation: z.string(),
  })
  .refine((d) => d.nouveau === d.confirmation, {
    path: ["confirmation"],
    message: "Les deux mots de passe ne correspondent pas",
  });

/* ------------------------------------------------------------------ */
/*  Portfolio et paramètres                                             */
/* ------------------------------------------------------------------ */

export const schemaRealisation = z.object({
  id: z.coerce.number().int().positive().optional(),
  titre: z.string().trim().min(2, "Titre trop court").max(140),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lettres minuscules, chiffres et tirets uniquement")
    .max(80),
  categorie: z.enum(CATEGORIES_REALISATION, { message: "Choisissez une catégorie" }),
  client: optionnel(120),
  secteur: optionnel(120),
  description: optionnel(2000),
  lien: z
    .string()
    .trim()
    .transform((v) => (v === "" ? undefined : v))
    .pipe(z.url("Lien invalide (doit commencer par https://)").optional())
    .optional(),
  tags: z
    .string()
    .optional()
    .transform((v) =>
      (v ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 10),
    ),
  ordre: z.coerce.number().int().min(0).default(0),
  misEnAvant: z
    .string()
    .optional()
    .transform((v) => v === "on"),
  publie: z
    .string()
    .optional()
    .transform((v) => v === "on"),
});

/** Prix et délai d'un service, saisis dans l'écran « Tarifs ». */
export const schemaTarif = z.object({
  prix: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s  ]/g, ""))
    .refine((v) => /^\d+$/.test(v), "Prix invalide")
    .transform(Number),
  delai: z.coerce.number({ message: "Délai invalide" }).int().min(1, "1 jour minimum").max(365),
});
