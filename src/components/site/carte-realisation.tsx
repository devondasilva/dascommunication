import Link from "next/link";
import { ImageVisuel } from "@/components/image-visuel";
import { cx } from "@/components/ui";
import { texteRealisation } from "@/i18n/contenu";
import { categorieRealisation } from "@/i18n/libelles";
import { i18n } from "@/i18n/serveur";
import type { CategorieRealisation } from "@/lib/enums";

export type ApercuRealisation = {
  slug: string;
  titre: string;
  titreEn: string | null;
  categorie: CategorieRealisation;
  client: string | null;
  couverture: { url: string; largeur: number; hauteur: number; alt: string };
};

/**
 * Carte de portfolio pour une mise en page en colonnes (mosaïque) :
 * chaque visuel garde ses proportions d'origine, seuls les logos
 * sont présentés dans un cadre carré.
 */
export async function CarteRealisation({ realisation: r, priorite = false }: { realisation: ApercuRealisation; priorite?: boolean }) {
  const { langue, l } = await i18n();
  const { titre } = texteRealisation(r, langue);
  const estLogo = r.categorie === "logos";
  return (
    <article className="group relative mb-10 break-inside-avoid">
      <div className={cx("overflow-hidden rounded-lg", estLogo ? "grid aspect-square place-items-center bg-fond p-12" : "bg-fond")}>
        <ImageVisuel
          src={r.couverture.url}
          alt={langue === "en" ? titre : r.couverture.alt || titre}
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
        <Link href={l(`/realisations/${r.slug}`)} className="after:absolute after:inset-0">
          {titre}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-encre-muette">{r.client ?? categorieRealisation(r.categorie, langue)}</p>
    </article>
  );
}
