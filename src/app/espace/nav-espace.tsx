"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/components/ui";

const LIENS = [
  { href: "/espace", libelle: "Mes projets" },
  { href: "/espace/profil", libelle: "Mon profil" },
];

export function NavEspace() {
  const chemin = usePathname();
  return (
    <nav aria-label="Mon espace" className="flex gap-5">
      {LIENS.map((l) => {
        const actif = chemin === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={actif ? "page" : undefined}
            className={cx(
              "border-b-2 py-5 text-sm transition-colors",
              actif ? "border-encre font-medium text-encre" : "border-transparent text-encre-douce hover:text-encre",
            )}
          >
            {l.libelle}
          </Link>
        );
      })}
    </nav>
  );
}
