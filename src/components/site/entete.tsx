"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cx } from "@/components/ui";
import { Logo } from "./logo";

const LIENS = [
  { href: "/services", libelle: "Services" },
  { href: "/realisations", libelle: "Réalisations" },
  { href: "/a-propos", libelle: "L'agence" },
  { href: "/contact", libelle: "Contact" },
];

export function Entete() {
  const chemin = usePathname();
  const [ouvert, setOuvert] = useState(false);
  const [cheminPrecedent, setCheminPrecedent] = useState(chemin);
  if (chemin !== cheminPrecedent) {
    setCheminPrecedent(chemin);
    setOuvert(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-8">
        <Logo />

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {LIENS.map((l) => {
              const actif = chemin.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={actif ? "page" : undefined}
                    className={cx(
                      "rounded-md px-4 py-2 text-[15px] transition-colors",
                      actif ? "bg-fond font-medium text-encre" : "text-encre-douce hover:text-encre",
                    )}
                  >
                    {l.libelle}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/espace" className="rounded-md px-4 py-2 text-[15px] text-encre-douce hover:text-encre">
            Mon espace
          </Link>
          <Link
            href="/commander"
            className="rounded-md bg-marque px-5 py-2.5 text-[15px] font-medium text-nuit transition hover:bg-encre hover:text-white"
          >
            Demander un devis
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOuvert((o) => !o)}
          className="-mr-2 rounded-lg p-2 text-encre lg:hidden"
          aria-expanded={ouvert}
          aria-controls="menu-mobile"
          aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {ouvert ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {ouvert && (
        <nav id="menu-mobile" aria-label="Navigation mobile" className="border-t border-bordure bg-white lg:hidden">
          <ul className="mx-auto max-w-7xl px-4 py-4">
            {[...LIENS, { href: "/espace", libelle: "Mon espace" }, { href: "/suivi", libelle: "Suivre une commande" }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block py-3 font-titre text-2xl font-semibold text-encre">
                  {l.libelle}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <Link
                href="/commander"
                className="flex h-12 items-center justify-center rounded-md bg-marque font-medium text-nuit"
              >
                Demander un devis
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
