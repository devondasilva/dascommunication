"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BadgeEuro,
  ExternalLink,
  Images,
  LayoutDashboard,
  Menu,
  MessageSquareDiff,
  Package,
  ScrollText,
  Settings,
  ShieldCheck,
  ShoppingBag,
  UserCircle,
  Users,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { cx } from "@/components/ui";
import { Logo } from "@/components/site/logo";

type Compteurs = { commandesNouvelles: number; modificationsEnAttente: number };

export type LienNav = {
  href: string;
  libelle: string;
  icone: keyof typeof ICONES;
  exact?: boolean;
  compteur?: keyof Compteurs;
};
export type GroupeNav = { titre?: string; liens: LienNav[] };

const ICONES: Record<string, LucideIcon> = {
  accueil: LayoutDashboard,
  commandes: ShoppingBag,
  modifications: MessageSquareDiff,
  services: Package,
  tarifs: BadgeEuro,
  realisations: Images,
  parametres: Settings,
  clients: UsersRound,
  equipe: Users,
  roles: ShieldCheck,
  journal: ScrollText,
};

function Liens({ groupes, compteurs }: { groupes: GroupeNav[]; compteurs: Compteurs }) {
  const chemin = usePathname();
  return (
    <div className="space-y-6">
      {groupes.map((g, i) => (
        <div key={g.titre ?? i}>
          {g.titre && <p className="mb-1.5 px-2.5 text-xs text-white/45">{g.titre}</p>}
          <ul className="space-y-0.5">
            {g.liens.map(({ href, libelle, icone, exact, compteur }) => {
              const Icone = ICONES[icone];
              const actif = exact ? chemin === href : chemin.startsWith(href);
              const n = compteur ? compteurs[compteur] : 0;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={actif ? "page" : undefined}
                    className={cx(
                      "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm transition-colors",
                      actif ? "bg-white/12 font-medium text-white" : "text-white/70 hover:bg-white/6 hover:text-white",
                    )}
                  >
                    <Icone aria-hidden className={cx("size-4", actif && "text-marque")} />
                    <span className="flex-1">{libelle}</span>
                    {n > 0 && (
                      <span className="rounded-full bg-marque px-1.5 py-px text-[11px] font-semibold tabular-nums text-nuit">
                        {n}
                        <span className="sr-only"> en attente</span>
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Navigation({
  groupes,
  compteurs,
  nom,
  role,
  deconnexion,
}: {
  groupes: GroupeNav[];
  compteurs: Compteurs;
  nom: string;
  role: string;
  deconnexion: React.ReactNode;
}) {
  const chemin = usePathname();
  const [ouvert, setOuvert] = useState(false);
  const [cheminPrecedent, setCheminPrecedent] = useState(chemin);
  if (chemin !== cheminPrecedent) {
    setCheminPrecedent(chemin);
    setOuvert(false);
  }

  const contenu = (
    <div className="flex h-full flex-col">
      <div className="px-2.5">
        <Logo href="/dashboard" clair />
      </div>
      <nav aria-label="Dashboard" className="mt-9 flex-1 overflow-y-auto">
        <Liens groupes={groupes} compteurs={compteurs} />
      </nav>
      <div className="space-y-1 border-t border-white/10 pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm text-white/70 hover:text-white"
        >
          <ExternalLink aria-hidden className="size-4" /> Voir le site
        </Link>
        <div className="flex items-center gap-2 rounded-lg px-2.5 pt-2">
          <Link href="/dashboard/profil" className="flex min-w-0 flex-1 items-center gap-2.5 group">
            <UserCircle aria-hidden className="size-7 shrink-0 text-white/50 group-hover:text-white" />
            <span className="min-w-0">
              <span className="block truncate text-sm text-white">{nom}</span>
              <span className="block truncate text-xs text-white/50">{role}</span>
            </span>
          </Link>
          {deconnexion}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between bg-nuit px-4 lg:hidden">
        <Logo href="/dashboard" clair />
        <button
          type="button"
          onClick={() => setOuvert(true)}
          className="-mr-2 rounded-lg p-2 text-white"
          aria-label="Ouvrir le menu"
          aria-expanded={ouvert}
        >
          <Menu className="size-5" />
        </button>
      </div>

      {ouvert && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="absolute inset-0 bg-nuit/50" aria-label="Fermer le menu" onClick={() => setOuvert(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-nuit p-4">
            <button
              type="button"
              onClick={() => setOuvert(false)}
              className="absolute top-4 right-3 rounded-lg p-1.5 text-white"
              aria-label="Fermer le menu"
            >
              <X className="size-5" />
            </button>
            {contenu}
          </div>
        </div>
      )}

      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-nuit p-4 lg:block">{contenu}</aside>
    </>
  );
}
