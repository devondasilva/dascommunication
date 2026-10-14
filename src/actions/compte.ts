"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { utilisateurs } from "@/db/schema";
import { creerTr, lienLocal } from "@/i18n/commun";
import { langueRequete } from "@/i18n/serveur";
import { journaliser } from "@/lib/audit";
import { acteur, utilisateurConnecte } from "@/lib/auth";
import { nouveauSecret2fa, verifierCode2fa } from "@/lib/deux-facteurs";
import { hacherMotDePasse, verifierMotDePasse } from "@/lib/mot-de-passe";
import {
  erreursDe,
  schemaChangementMotDePasse,
  schemaProfilClient,
  valeursDe,
  type EtatFormulaire,
} from "@/lib/validations";

const NON_CONNECTE: EtatFormulaire = { message: "Votre session a expiré. Reconnectez-vous." };

/* ------------------------------------------------------------------ */
/*  Profil client                                                       */
/* ------------------------------------------------------------------ */

export async function enregistrerProfil(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const langue = await langueRequete();
  const tr = creerTr(langue);
  const c = await utilisateurConnecte();
  if (!c) return { message: tr(NON_CONNECTE.message!, "Your session has expired. Please sign in again.") };

  const parse = schemaProfilClient.safeParse(Object.fromEntries(formData));
  if (!parse.success) {
    return {
      message: tr("Merci de corriger les champs indiqués.", "Please correct the highlighted fields."),
      erreurs: erreursDe(parse.error, langue),
      valeurs: valeursDe(formData),
    };
  }
  await db
    .update(utilisateurs)
    .set({ ...parse.data, entreprise: parse.data.entreprise ?? null, profilComplet: true })
    .where(eq(utilisateurs.id, c.utilisateur.id));
  revalidatePath("/espace", "layout");
  revalidatePath("/en/espace", "layout");
  // Depuis l'accueil de l'espace (première connexion), on revient avec une confirmation
  if (formData.get("retour") === "accueil") redirect(lienLocal(langue, "/espace?profil=ok"));
  return { ok: true, message: tr("Profil enregistré.", "Profile saved.") };
}

/* ------------------------------------------------------------------ */
/*  Mot de passe (équipe)                                               */
/* ------------------------------------------------------------------ */

export async function changerMotDePasse(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const c = await utilisateurConnecte();
  if (!c || c.utilisateur.type !== "equipe") return NON_CONNECTE;

  const parse = schemaChangementMotDePasse.safeParse(Object.fromEntries(formData));
  if (!parse.success) return { erreurs: erreursDe(parse.error) };

  const u = await db.query.utilisateurs.findFirst({
    where: eq(utilisateurs.id, c.utilisateur.id),
    columns: { motDePasse: true },
  });
  if (!(await verifierMotDePasse(parse.data.actuel, u?.motDePasse))) {
    return { erreurs: { actuel: ["Mot de passe actuel incorrect"] } };
  }
  await db
    .update(utilisateurs)
    .set({ motDePasse: await hacherMotDePasse(parse.data.nouveau) })
    .where(eq(utilisateurs.id, c.utilisateur.id));
  await journaliser(acteur(c), "compte.mot_de_passe_change");
  return { ok: true, message: "Mot de passe modifié." };
}

/* ------------------------------------------------------------------ */
/*  Double authentification (équipe)                                    */
/* ------------------------------------------------------------------ */

const COOKIE_2FA = "das_2fa_en_attente";

/** Étape 1 : génère un secret, conservé dans un cookie httpOnly le temps de la confirmation. */
export async function preparer2fa() {
  const c = await utilisateurConnecte();
  if (!c || c.utilisateur.type !== "equipe") return;
  (await cookies()).set(COOKIE_2FA, nouveauSecret2fa(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/dashboard/profil",
    maxAge: 600,
  });
  revalidatePath("/dashboard/profil");
}

export async function secret2faEnAttente() {
  return (await cookies()).get(COOKIE_2FA)?.value ?? null;
}

/** Étape 2 : l'utilisateur saisit le code affiché par son application pour confirmer. */
export async function activer2fa(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const c = await utilisateurConnecte();
  if (!c || c.utilisateur.type !== "equipe") return NON_CONNECTE;
  const secret = await secret2faEnAttente();
  if (!secret) return { message: "La configuration a expiré. Recommencez." };

  const code = String(formData.get("code") ?? "").replace(/\s/g, "");
  if (!verifierCode2fa(secret, code)) {
    return { erreurs: { code: ["Code incorrect. Vérifiez l'heure de votre téléphone et réessayez."] } };
  }
  await db.update(utilisateurs).set({ secret2fa: secret }).where(eq(utilisateurs.id, c.utilisateur.id));
  (await cookies()).delete({ name: COOKIE_2FA, path: "/dashboard/profil" });
  await journaliser(acteur(c), "compte.2fa_activee");
  revalidatePath("/dashboard/profil");
  redirect("/dashboard/profil?2fa=activee");
}

export async function desactiver2fa(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const c = await utilisateurConnecte();
  if (!c || c.utilisateur.type !== "equipe") return NON_CONNECTE;
  const u = await db.query.utilisateurs.findFirst({
    where: eq(utilisateurs.id, c.utilisateur.id),
    columns: { secret2fa: true },
  });
  const code = String(formData.get("code") ?? "").replace(/\s/g, "");
  if (!u?.secret2fa || !verifierCode2fa(u.secret2fa, code)) {
    return { erreurs: { code: ["Code incorrect"] } };
  }
  await db.update(utilisateurs).set({ secret2fa: null }).where(eq(utilisateurs.id, c.utilisateur.id));
  await journaliser(acteur(c), "compte.2fa_desactivee");
  revalidatePath("/dashboard/profil");
  redirect("/dashboard/profil?2fa=desactivee");
}
