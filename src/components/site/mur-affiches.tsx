import { ImageVisuel } from "@/components/image-visuel";
import { cx } from "@/components/ui";
import { affichesPourMur } from "@/lib/donnees";

const vitesses = ["motion-safe:defile-lent", "motion-safe:defile-rapide", "motion-safe:defile-moyen"];

/**
 * Mur de vraies affiches DAS COM (catégorie « Visuels & supports », format portrait)
 * qui défilent lentement en trois colonnes. Alimenté depuis le dashboard.
 * Purement décoratif (aria-hidden) ; l'animation s'arrête si l'utilisateur
 * a demandé à réduire les animations.
 */
export async function MurAffiches({ className }: { className?: string }) {
  const affiches = await affichesPourMur(18);
  if (affiches.length < 3) return null;
  const colonnes = [0, 1, 2].map((i) => affiches.filter((_, j) => j % 3 === i));

  return (
    <div aria-hidden className={cx("masque-vertical grid grid-cols-3 gap-3 overflow-hidden sm:gap-4", className)}>
      {colonnes.map((col, i) => (
        <div key={i} className={cx("flex flex-col gap-3 sm:gap-4", vitesses[i], i === 1 && "-mt-24")}>
          {/* Liste doublée : le défilement boucle sans saut */}
          {[...col, ...col].map((img, k) => (
            <div key={`${img.url}-${k}`} className="overflow-hidden rounded-md bg-fond shadow-[0_1px_0_rgb(28_32_102/0.06)]">
              <ImageVisuel
                src={img.url}
                alt=""
                width={img.largeur}
                height={img.hauteur}
                sizes="(min-width: 1024px) 14vw, 30vw"
                priority={k < 2}
                className="h-auto w-full"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
