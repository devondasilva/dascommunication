import "server-only";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/auth";
import { db } from "@/db";
import { utilisateurs, type Role, type Utilisateur } from "@/db/schema";
import { estPermission, TOUTES_LES_PERMISSIONS, type Permission } from "./permissions";

export type Connecte = {
  utilisateur: Omit<Utilisateur, "motDePasse" | "secret2fa"> & { a2fa: boolean };
  role: Role | null;
  permissions: Set<Permission>;
  peut: (p: Permission) => boolean;
};

/**
 * Utilisateur connecté, relu en base à chaque requête :
 * un compte désactivé ou un rôle modifié prend effet immédiatement.
 */
export const utilisateurConnecte = cache(async (): Promise<Connecte | null> => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  const u = await db.query.utilisateurs.findFirst({
    where: eq(utilisateurs.id, id),
    with: { role: true },
  });
  if (!u || !u.actif) return null;

  const { motDePasse: _m, secret2fa, role, ...reste } = u;
  void _m;
  const permissions = new Set<Permission>(
    u.type !== "equipe" || !role
      ? []
      : role.systeme
        ? TOUTES_LES_PERMISSIONS
        : role.permissions.filter(estPermission),
  );
  return {
    utilisateur: { ...reste, a2fa: Boolean(secret2fa) },
    role: role ?? null,
    permissions,
    peut: (p) => permissions.has(p),
  };
});

/** Pages du dashboard : membre de l'équipe actif, avec la permission demandée. */
export async function exigerEquipe(permission?: Permission) {
  const c = await utilisateurConnecte();
  if (!c) redirect("/connexion?espace=equipe");
  if (c.utilisateur.type !== "equipe") redirect("/espace");
  if (permission && !c.peut(permission)) redirect("/dashboard/acces-refuse");
  return c;
}

/** Server Actions : renvoie l'utilisateur, ou null si la permission manque. */
export async function autoriser(permission: Permission) {
  const c = await utilisateurConnecte();
  if (!c || c.utilisateur.type !== "equipe" || !c.peut(permission)) return null;
  return c;
}

/** Portail client (et équipe, qui peut aussi le consulter). */
export async function exigerConnexion() {
  const c = await utilisateurConnecte();
  if (!c) redirect("/connexion");
  return c;
}

export const acteur = (c: Connecte) => ({ id: c.utilisateur.id, email: c.utilisateur.email });
