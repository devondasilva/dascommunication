import Image from "next/image";
import Link from "next/link";
import { CATEGORIES_REALISATION, type Realisation } from "@/data/realisations";
import { cx } from "@/components/ui";

/**
 * Carte de portfolio pour une mise en page en colonnes (mosaïque) :
 * chaque visuel garde ses proportions d'origine, seuls les logos
 * sont présentés dans un cadre carré.
 */
export function CarteRealisation({ realisation: r, priorite = false }: { realisation: Realisation; priorite?: boolean }) {
  const estLogo = r.categorie === "logos";
  return (
    <article className="group relative mb-10 break-inside-avoid">
      <div className={cx("overflow-hidden rounded-3xl", estLogo ? "grid aspect-square place-items-center bg-fond p-12" : "bg-fond")}>
        <Image
          src={r.image.src}
          alt={r.image.alt}
          width={r.image.largeur}
          height={r.image.hauteur}
          priority={priorite}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className={cx(
            "transition duration-700 ease-sortie group-hover:scale-[1.03]",
            estLogo ? "h-auto max-h-full w-auto max-w-full object-contain" : "h-auto w-full",
          )}
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="text-lg leading-snug font-semibold text-encre">
          <Link href={`/realisations/${r.slug}`} className="after:absolute after:inset-0">
            {r.titre}
          </Link>
        </h3>
      </div>
      <p className="mt-1 text-sm text-encre-muette">{r.client ?? CATEGORIES_REALISATION[r.categorie]}</p>
    </article>
  );
}
