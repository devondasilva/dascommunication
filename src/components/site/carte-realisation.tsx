import Link from "next/link";
import { ImageVisuel } from "@/components/image-visuel";
import { cx } from "@/components/ui";
import { LIBELLES_REALISATION } from "@/lib/constantes";
import type { CategorieRealisation } from "@/lib/enums";

export type ApercuRealisation = {
  slug: string;
  titre: string;
  categorie: CategorieRealisation;
  client: string | null;
  couverture: { url: string; largeur: number; hauteur: number; alt: string };
};

/**
 * Carte de portfolio pour une mise en page en colonnes (mosaïque) :
 * chaque visuel garde ses proportions d'origine, seuls les logos
 * sont présentés dans un cadre carré.
 */
export function CarteRealisation({ realisation: r, priorite = false }: { realisation: ApercuRealisation; priorite?: boolean }) {
  const estLogo = r.categorie === "logos";
  return (
    <article className="group relative mb-10 break-inside-avoid">
      <div className={cx("overflow-hidden rounded-lg", estLogo ? "grid aspect-square place-items-center bg-fond p-12" : "bg-fond")}>
        <ImageVisuel
          src={r.couverture.url}
          alt={r.couverture.alt || r.titre}
          width={r.couverture.largeur}
          height={r.couverture.hauteur}
          priority={priorite}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className={cx(
            "transition duration-700 ease-sortie group-hover:scale-[1.03]",
            estLogo ? "h-auto max-h-full w-auto max-w-full object-contain" : "h-auto w-full",
          )}
        />
      </div>
      <h3 className="mt-4 text-lg leading-snug font-semibold text-encre">
        <Link href={`/realisations/${r.slug}`} className="after:absolute after:inset-0">
          {r.titre}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-encre-muette">{r.client ?? LIBELLES_REALISATION[r.categorie]}</p>
    </article>
  );
}
