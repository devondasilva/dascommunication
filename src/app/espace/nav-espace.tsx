"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/components/ui";
import { useI18n } from "@/i18n/client";
import { sansPrefixe } from "@/i18n/commun";

export function NavEspace() {
  const { tr, l } = useI18n();
  const chemin = sansPrefixe(usePathname());
  const liens = [
    { href: "/espace", libelle: tr("Mes projets", "My projects") },
    { href: "/espace/profil", libelle: tr("Mon profil", "My profile") },
  ];
  return (
    <nav aria-label={tr("Mon espace", "My account")} className="flex gap-5">
      {liens.map((lien) => {
        const actif = chemin === lien.href;
        return (
          <Link
            key={lien.href}
            href={l(lien.href)}
            aria-current={actif ? "page" : undefined}
            className={cx(
              "border-b-2 py-5 text-sm transition-colors",
              actif ? "border-encre font-medium text-encre" : "border-transparent text-encre-douce hover:text-encre",
            )}
          >
            {lien.libelle}
          </Link>
        );
      })}
    </nav>
  );
}
