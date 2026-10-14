import type { Metadata } from "next";
import { LogOut } from "lucide-react";
import { deconnexion } from "@/actions/auth";
import { Navigation, type GroupeNav, type LienNav } from "@/components/dashboard/navigation";
import { exigerEquipe } from "@/lib/auth";
import { SITE } from "@/lib/constantes";
import { compteursMenu } from "@/lib/donnees";
import type { Permission } from "@/lib/permissions";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: `%s · Dashboard ${SITE.nom}` },
  robots: { index: false, follow: false },
};

/** Structure du menu : chaque entrée n'apparaît qu'avec la permission correspondante. */
const MENU: { titre?: string; liens: (LienNav & { permission: Permission })[] }[] = [
  {
    liens: [
      { href: "/dashboard", libelle: "Vue d'ensemble", icone: "accueil", exact: true, permission: "dashboard.voir" },
      { href: "/dashboard/commandes", libelle: "Commandes", icone: "commandes", compteur: "commandesNouvelles", permission: "commandes.voir" },
      { href: "/dashboard/modifications", libelle: "Modifications", icone: "modifications", compteur: "modificationsEnAttente", permission: "modifications.gerer" },
    ],
  },
  {
    titre: "Catalogue et portfolio",
    liens: [
      { href: "/dashboard/services", libelle: "Services", icone: "services", permission: "services.gerer" },
      { href: "/dashboard/tarifs", libelle: "Tarifs", icone: "tarifs", permission: "services.gerer" },
      { href: "/dashboard/realisations", libelle: "Réalisations", icone: "realisations", permission: "realisations.gerer" },
      { href: "/dashboard/clients", libelle: "Clients", icone: "clients", permission: "clients.voir" },
    ],
  },
  {
    titre: "Équipe et sécurité",
    liens: [
      { href: "/dashboard/equipe", libelle: "Équipe", icone: "equipe", permission: "equipe.voir" },
      { href: "/dashboard/roles", libelle: "Rôles et accès", icone: "roles", permission: "roles.gerer" },
      { href: "/dashboard/journal", libelle: "Journal d'audit", icone: "journal", permission: "audit.voir" },
      { href: "/dashboard/parametres", libelle: "Paramètres du site", icone: "parametres", permission: "parametres.gerer" },
    ],
  },
];

export default async function LayoutDashboard({ children }: { children: React.ReactNode }) {
  const c = await exigerEquipe();
  const compteurs = await compteursMenu();

  const groupes: GroupeNav[] = MENU.map((g) => ({
    titre: g.titre,
    liens: g.liens
      .filter((l) => c.peut(l.permission))
      .map((l) => ({ href: l.href, libelle: l.libelle, icone: l.icone, exact: l.exact, compteur: l.compteur })),
  })).filter((g) => g.liens.length > 0);

  return (
    <div className="min-h-dvh bg-fond">
      <Navigation
        groupes={groupes}
        compteurs={compteurs}
        nom={c.utilisateur.nom ?? c.utilisateur.email}
        role={c.role?.nom ?? "Sans rôle"}
        deconnexion={
          <form action={deconnexion}>
            <button
              type="submit"
              className="rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
              aria-label="Se déconnecter"
              title="Se déconnecter"
            >
              <LogOut className="size-4" />
            </button>
          </form>
        }
      />
      <div className="overflow-x-clip lg:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
