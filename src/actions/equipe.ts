"use server";

import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, isNull, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { invitations, roles, utilisateurs } from "@/db/schema";
import { journaliser } from "@/lib/audit";
import { acteur, autoriser } from "@/lib/auth";
import { SITE } from "@/lib/constantes";
import { hacherMotDePasse } from "@/lib/mot-de-passe";
import { estPermission } from "@/lib/permissions";
import {
  erreursDe,
  schemaAcceptationInvitation,
  schemaInvitation,
  schemaMembre,
  schemaRole,
  valeursDe,
  type EtatFormulaire,
} from "@/lib/validations";

const REFUS: EtatFormulaire = { message: "Votre rôle ne vous permet pas cette action." };
const DUREE_INVITATION_MS = 7 * 24 * 60 * 60 * 1000;
const empreinte = (jeton: string) => createHash("sha256").update(jeton).digest("hex");

/* ------------------------------------------------------------------ */
/*  Invitations                                                         */
/* ------------------------------------------------------------------ */

export type EtatInvitation = EtatFormulaire & { lien?: string; email?: string };

export async function inviterMembre(_: EtatInvitation, formData: FormData): Promise<EtatInvitation> {
  const c = await autoriser("equipe.gerer");
  if (!c) return REFUS;

  const parse = schemaInvitation.safeParse(Object.fromEntries(formData));
  if (!parse.success) return { erreurs: erreursDe(parse.error), valeurs: valeursDe(formData) };
  const { email, roleId, competences } = parse.data;

  const role = await db.query.roles.findFirst({ where: eq(roles.id, roleId) });
  if (!role) return { erreurs: { roleId: ["Rôle introuvable"] }, valeurs: valeursDe(formData) };
  // Seul un super-admin peut nommer un autre super-admin
  if (role.systeme && !c.role?.systeme) {
    return { erreurs: { roleId: ["Seul un super-administrateur peut attribuer ce rôle"] }, valeurs: valeursDe(formData) };
  }

  const existant = await db.query.utilisateurs.findFirst({
    where: sql`lower(${utilisateurs.email}) = ${email}`,
    columns: { type: true },
  });
  if (existant?.type === "equipe") {
    return { erreurs: { email: ["Cette personne fait déjà partie de l'équipe"] }, valeurs: valeursDe(formData) };
  }

  const jeton = randomBytes(32).toString("base64url");
  await db.insert(invitations).values({
    email,
    roleId,
    competences,
    jetonHash: empreinte(jeton),
    expireLe: new Date(Date.now() + DUREE_INVITATION_MS),
    invitePar: c.utilisateur.id,
  });
  await journaliser(acteur(c), "equipe.invitation", email, { role: role.nom });

  revalidatePath("/dashboard/equipe");
  return {
    ok: true,
    email,
    lien: `${SITE.url.replace(/\/$/, "")}/invitation/${jeton}`,
    message: `Invitation créée pour ${email}. Envoyez-lui ce lien, valable 7 jours.`,
  };
}

export async function revoquerInvitation(formData: FormData) {
  const c = await autoriser("equipe.gerer");
  if (!c) return;
  const id = Number(formData.get("id"));
  const inv = await db.query.invitations.findFirst({ where: eq(invitations.id, id), columns: { email: true } });
  await db.delete(invitations).where(and(eq(invitations.id, id), isNull(invitations.acceptee)));
  await journaliser(acteur(c), "equipe.invitation_revoquee", inv?.email);
  revalidatePath("/dashboard/equipe");
}

/** Page publique /invitation/[jeton] : le futur membre crée son mot de passe. */
export async function accepterInvitation(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const parse = schemaAcceptationInvitation.safeParse(Object.fromEntries(formData));
  if (!parse.success) return { erreurs: erreursDe(parse.error), valeurs: { nom: String(formData.get("nom") ?? "") } };
  const d = parse.data;

  const inv = await db.query.invitations.findFirst({
    where: and(
      eq(invitations.jetonHash, empreinte(d.jeton)),
      isNull(invitations.acceptee),
      gt(invitations.expireLe, new Date()),
    ),
  });
  if (!inv) return { message: "Cette invitation n'est plus valable. Demandez un nouveau lien à l'administrateur." };

  const motDePasse = await hacherMotDePasse(d.motDePasse);
  const existant = await db.query.utilisateurs.findFirst({
    where: sql`lower(${utilisateurs.email}) = ${inv.email.toLowerCase()}`,
  });

  const membreId = await db.transaction(async (tx) => {
    let idMembre: string;
    if (existant) {
      idMembre = existant.id;
      // Un client existant (connexion Google) devient membre de l'équipe
      await tx
        .update(utilisateurs)
        .set({ type: "equipe", roleId: inv.roleId, competences: inv.competences, nom: d.nom, motDePasse, actif: true, profilComplet: true })
        .where(eq(utilisateurs.id, existant.id));
    } else {
      const [cree] = await tx.insert(utilisateurs).values({
        email: inv.email,
        nom: d.nom,
        type: "equipe",
        roleId: inv.roleId,
        competences: inv.competences,
        motDePasse,
        profilComplet: true,
      }).returning({ id: utilisateurs.id });
      idMembre = cree.id;
    }
    await tx.update(invitations).set({ acceptee: new Date() }).where(eq(invitations.id, inv.id));
    return idMembre;
  });
  await journaliser({ id: membreId, email: inv.email }, "equipe.invitation_acceptee", inv.email);

  redirect(`/connexion?espace=equipe&bienvenue=1&email=${encodeURIComponent(inv.email)}`);
}

/* ------------------------------------------------------------------ */
/*  Membres                                                             */
/* ------------------------------------------------------------------ */

/** Empêche de retirer le dernier super-administrateur actif. */
async function resteUnSuperAdmin(sauf: string) {
  const [{ n }] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(utilisateurs)
    .innerJoin(roles, eq(utilisateurs.roleId, roles.id))
    .where(and(eq(roles.systeme, true), eq(utilisateurs.actif, true), eq(utilisateurs.type, "equipe"), ne(utilisateurs.id, sauf)));
  return n > 0;
}

export async function modifierMembre(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const c = await autoriser("equipe.gerer");
  if (!c) return REFUS;

  const parse = schemaMembre.safeParse(Object.fromEntries(formData));
  if (!parse.success) return { erreurs: erreursDe(parse.error) };
  const { id, roleId, competences } = parse.data;

  const [membre, nouveauRole] = await Promise.all([
    db.query.utilisateurs.findFirst({ where: eq(utilisateurs.id, id), with: { role: true } }),
    db.query.roles.findFirst({ where: eq(roles.id, roleId) }),
  ]);
  if (!membre || membre.type !== "equipe" || !nouveauRole) return { message: "Membre ou rôle introuvable." };

  const toucheSuperAdmin = nouveauRole.systeme || membre.role?.systeme;
  if (toucheSuperAdmin && !c.role?.systeme) {
    return { message: "Seul un super-administrateur peut attribuer ou retirer ce rôle." };
  }
  if (membre.role?.systeme && !nouveauRole.systeme && !(await resteUnSuperAdmin(id))) {
    return { message: "Impossible : il doit rester au moins un super-administrateur." };
  }

  await db.update(utilisateurs).set({ roleId, competences }).where(eq(utilisateurs.id, id));
  await journaliser(acteur(c), "equipe.membre_modifie", membre.email, {
    role: membre.role?.nom !== nouveauRole.nom ? [membre.role?.nom, nouveauRole.nom] : undefined,
    competences,
  });
  revalidatePath("/dashboard/equipe");
  return { ok: true, message: "Membre mis à jour." };
}

export async function basculerActivationMembre(formData: FormData) {
  const c = await autoriser("equipe.gerer");
  if (!c) return;
  const id = String(formData.get("id"));
  if (id === c.utilisateur.id) return; // on ne se désactive pas soi-même

  const membre = await db.query.utilisateurs.findFirst({ where: eq(utilisateurs.id, id), with: { role: true } });
  if (!membre || membre.type !== "equipe") return;
  if (membre.role?.systeme && !c.role?.systeme) return;
  if (membre.actif && membre.role?.systeme && !(await resteUnSuperAdmin(id))) return;

  await db.update(utilisateurs).set({ actif: !membre.actif }).where(eq(utilisateurs.id, id));
  await journaliser(acteur(c), membre.actif ? "equipe.membre_desactive" : "equipe.membre_reactive", membre.email);
  revalidatePath("/dashboard/equipe");
}

/* ------------------------------------------------------------------ */
/*  Rôles                                                               */
/* ------------------------------------------------------------------ */

export async function enregistrerRole(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const c = await autoriser("roles.gerer");
  if (!c) return REFUS;

  const parse = schemaRole.safeParse(Object.fromEntries(formData));
  if (!parse.success) return { erreurs: erreursDe(parse.error), valeurs: valeursDe(formData) };
  const { id, nom, description } = parse.data;
  const permissions = formData.getAll("permissions").map(String).filter(estPermission);

  if (id) {
    const role = await db.query.roles.findFirst({ where: eq(roles.id, id) });
    if (!role) return { message: "Rôle introuvable." };
    if (role.systeme) return { message: "Le rôle super-administrateur ne peut pas être modifié." };
    await db.update(roles).set({ nom, description, permissions }).where(eq(roles.id, id));
    await journaliser(acteur(c), "role.modifie", nom, {
      ajoutees: permissions.filter((p) => !role.permissions.includes(p)),
      retirees: role.permissions.filter((p) => !permissions.includes(p as never)),
    });
  } else {
    const slugBase = nom
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const slug = `${slugBase}-${randomBytes(2).toString("hex")}`;
    await db.insert(roles).values({ slug, nom, description, permissions });
    await journaliser(acteur(c), "role.cree", nom, { permissions });
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/roles");
}

export async function supprimerRole(formData: FormData) {
  const c = await autoriser("roles.gerer");
  if (!c) redirect("/dashboard/acces-refuse");
  const id = Number(formData.get("id"));
  const role = await db.query.roles.findFirst({ where: eq(roles.id, id) });
  if (!role || role.systeme) redirect("/dashboard/roles");

  const [{ n }] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(utilisateurs)
    .where(eq(utilisateurs.roleId, id));
  if (n > 0) redirect(`/dashboard/roles/${id}?erreur=utilise`);

  await db.delete(roles).where(eq(roles.id, id));
  await journaliser(acteur(c), "role.supprime", role.nom);
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/roles");
}
