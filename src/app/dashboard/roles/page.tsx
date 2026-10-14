import Link from "next/link";
import { Lock, Plus } from "lucide-react";
import { EntetePage } from "@/components/dashboard/entete-page";
import { Carte, LienBouton } from "@/components/ui";
import { exigerEquipe } from "@/lib/auth";
import { tousLesRoles } from "@/lib/donnees";
import { pluriel } from "@/lib/format";
import { PERMISSIONS, TOUTES_LES_PERMISSIONS, estPermission } from "@/lib/permissions";

export const metadata = { title: "Rôles et accès" };

export default async function PageRoles() {
  await exigerEquipe("roles.gerer");
  const roles = await tousLesRoles();

  return (
    <>
      <EntetePage
        titre="Rôles et accès"
        description="Un rôle regroupe les modules accessibles. Chaque membre de l'équipe reçoit un rôle selon son métier."
        actions={
          <LienBouton href="/dashboard/roles/nouveau" taille="sm">
            <Plus aria-hidden className="size-4" /> Nouveau rôle
          </LienBouton>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((r) => {
          const perms = r.systeme ? TOUTES_LES_PERMISSIONS : r.permissions.filter(estPermission);
          return (
            <Carte key={r.id} className="relative p-5 transition hover:ring-encre/25">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-encre">
                  <Link href={`/dashboard/roles/${r.id}`} className="after:absolute after:inset-0">
                    {r.nom}
                  </Link>
                </h2>
                {r.systeme && (
                  <span className="flex items-center gap-1 text-xs text-encre-muette">
                    <Lock aria-hidden className="size-3.5" /> Rôle système
                  </span>
                )}
              </div>
              {r.description && <p className="mt-1 text-sm text-encre-douce">{r.description}</p>}
              <p className="mt-4 text-sm text-encre">
                {r.systeme ? "Toutes les permissions" : pluriel(perms.length, "permission")}
                <span className="text-encre-muette">, {pluriel(r.nbMembres, "membre")}</span>
              </p>
              {!r.systeme && perms.length > 0 && (
                <p className="mt-2 line-clamp-2 text-xs text-encre-muette">
                  {perms.map((p) => PERMISSIONS[p].libelle).join(", ")}
                </p>
              )}
            </Carte>
          );
        })}
      </div>
    </>
  );
}
