"use client";

import Image from "next/image";
import Link from "next/link";
import { cx } from "@/components/ui";
import { useI18n } from "@/i18n/client";
import { SITE } from "@/lib/constantes";
import logo from "../../../public/marque/logo.png";
import logoBlanc from "../../../public/marque/logo-blanc.png";

/** Logo DAS COM — version couleur sur fond clair, version blanche sur fond foncé. */
export function Logo({ clair = false, href, className }: { clair?: boolean; href?: string; className?: string }) {
  const { tr, l } = useI18n();
  return (
    <Link
      href={href ?? l("/")}
      className={cx("inline-flex shrink-0 items-center", className)}
      aria-label={`${SITE.nom} — ${tr("accueil", "home")}`}
    >
      <Image src={clair ? logoBlanc : logo} alt={SITE.nom} priority className="h-9 w-auto" sizes="120px" />
    </Link>
  );
}
