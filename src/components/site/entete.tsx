"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cx } from "@/components/ui";
import { useI18n } from "@/i18n/client";
import { sansPrefixe } from "@/i18n/commun";
import { Logo } from "./logo";
import { ReglagesRegion, ReglagesRegionListe } from "./reglages-region";

export function Entete() {
  const { tr, l } = useI18n();
  const chemin = sansPrefixe(usePathname());
  const [ouvert, setOuvert] = useState(false);
  const [cheminPrecedent, setCheminPrecedent] = useState(chemin);
  if (chemin !== cheminPrecedent) {
    setCheminPrecedent(chemin);
    setOuvert(false);
  }

  const liens = [
    { href: "/services", libelle: "Services" },
    { href: "/realisations", libelle: tr("Réalisations", "Work") },
    { href: "/a-propos", libelle: tr("L'agence", "About") },
    { href: "/contact", libelle: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-8">
        <Logo href={l("/")} />

        <nav aria-label={tr("Navigation principale", "Main navigation")} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {liens.map((lien) => {
              const actif = chemin.startsWith(lien.href);
              return (
                <li key={lien.href}>
                  <Link
                    href={l(lien.href)}
                    aria-current={actif ? "page" : undefined}
                    className={cx(
                      "rounded-md px-4 py-2 text-[15px] transition-colors",
                      actif ? "bg-fond font-medium text-encre" : "text-encre-douce hover:text-encre",
                    )}
                  >
                    {lien.libelle}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          <ReglagesRegion />
          <Link href={l("/espace")} className="rounded-md px-3 py-2 text-[15px] text-encre-douce hover:text-encre">
            {tr("Mon espace", "My account")}
          </Link>
          <Link
            href={l("/commander")}
            className="ml-1 rounded-md bg-marque px-5 py-2.5 text-[15px] font-medium text-nuit transition hover:bg-encre hover:text-white"
          >
            {tr("Demander un devis", "Get a quote")}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOuvert((o) => !o)}
          className="-mr-2 rounded-lg p-2 text-encre lg:hidden"
          aria-expanded={ouvert}
          aria-controls="menu-mobile"
          aria-label={ouvert ? tr("Fermer le menu", "Close menu") : tr("Ouvrir le menu", "Open menu")}
        >
          {ouvert ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {ouvert && (
        <nav
          id="menu-mobile"
          aria-label={tr("Navigation mobile", "Mobile navigation")}
          className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-bordure bg-white lg:hidden"
        >
          <ul className="mx-auto max-w-7xl px-4 py-4">
            {[
              ...liens,
              { href: "/espace", libelle: tr("Mon espace", "My account") },
              { href: "/suivi", libelle: tr("Suivre une commande", "Track an order") },
            ].map((lien) => (
              <li key={lien.href}>
                <Link href={l(lien.href)} className="block py-3 font-titre text-2xl font-semibold text-encre">
                  {lien.libelle}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <Link
                href={l("/commander")}
                className="flex h-12 items-center justify-center rounded-md bg-marque font-medium text-nuit"
              >
                {tr("Demander un devis", "Get a quote")}
              </Link>
            </li>
            <li className="mt-6 border-t border-bordure pt-6">
              <ReglagesRegionListe />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
