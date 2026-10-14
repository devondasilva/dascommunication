import Image from "next/image";
import { REALISATIONS } from "@/data/realisations";
import { cx } from "@/components/ui";

/**
 * Mur de vraies affiches DAS COM qui défilent lentement en trois colonnes.
 * Purement décoratif (aria-hidden) ; l'animation s'arrête si l'utilisateur
 * a demandé à réduire les animations.
 */
const affiches = REALISATIONS.filter((r) => r.categorie === "visuels" && r.image.hauteur >= r.image.largeur * 0.95).map(
  (r) => r.image,
);

const colonnes = [0, 1, 2].map((i) => affiches.filter((_, j) => j % 3 === i));
const vitesses = ["motion-safe:defile-lent", "motion-safe:defile-rapide", "motion-safe:defile-moyen"];

export function MurAffiches({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cx("masque-vertical grid grid-cols-3 gap-3 overflow-hidden sm:gap-4", className)}>
      {colonnes.map((col, i) => (
        <div key={i} className={cx("flex flex-col gap-3 sm:gap-4", vitesses[i], i === 1 && "-mt-24")}>
          {/* Liste doublée : le défilement boucle sans saut */}
          {[...col, ...col].map((img, k) => (
            <div key={`${img.src}-${k}`} className="overflow-hidden rounded-md bg-fond shadow-[0_1px_0_rgb(28_32_102/0.06)]">
              <Image
                src={img.src}
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
