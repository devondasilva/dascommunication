import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/constantes";
import { cx } from "@/components/ui";
import logo from "../../../public/marque/logo.png";
import logoBlanc from "../../../public/marque/logo-blanc.png";

/** Logo DAS COM — version couleur sur fond clair, version blanche sur fond foncé. */
export function Logo({ clair = false, href = "/", className }: { clair?: boolean; href?: string; className?: string }) {
  return (
    <Link href={href} className={cx("inline-flex shrink-0 items-center", className)} aria-label={`${SITE.nom} — accueil`}>
      <Image
        src={clair ? logoBlanc : logo}
        alt={SITE.nom}
        priority
        className="h-9 w-auto"
        sizes="120px"
      />
    </Link>
  );
}
