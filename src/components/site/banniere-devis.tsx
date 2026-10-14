import Link from "next/link";
import { Check } from "lucide-react";
import { ImageVisuel } from "@/components/image-visuel";
import { affichesPourMur } from "@/lib/donnees";
import { partiesMontant } from "@/lib/format";
import { parametresSite } from "@/lib/parametres";
import { cx } from "@/components/ui";

/** Disposition en éventail des trois affiches (gauche, droite, centre au premier plan). */
const POSITIONS = [
  { rotation: "-rotate-[9deg]", position: "left-[4%] top-[18%]", z: "z-10" },
  { rotation: "rotate-[7deg]", position: "right-[3%] top-[10%]", z: "z-10" },
  { rotation: "-rotate-1", position: "left-1/2 top-[4%] -translate-x-1/2", z: "z-20" },
];

/**
 * Bannière d'appel au devis : promesse, réassurance et vraies affiches DAS COM.
 * Textes modifiables dans Dashboard → Paramètres ; affiches = visuels mis en avant.
 */
export async function BanniereDevis({ prixMin, className }: { prixMin?: number; className?: string }) {
  const prix = prixMin ? partiesMontant(prixMin) : null;
  const [p, misesEnAvant, toutes] = await Promise.all([parametresSite(), affichesPourMur(3, { misEnAvant: true }), affichesPourMur(3)]);
  const affiches = (misesEnAvant.length === 3 ? misesEnAvant : toutes).map((img, i) => ({ ...img, ...POSITIONS[i] }));
  const argumentsBanniere = p.banniereArguments
    .split("\n")
    .map((a) => a.trim())
    .filter(Boolean);
  return (
    <section
      aria-labelledby="titre-banniere"
      className={cx("relative overflow-hidden rounded-lg bg-encre text-white", className)}
    >
      {/* Formes de fond reprenant la virgule teal du logo */}
      <div aria-hidden className="absolute -right-24 -bottom-40 size-[520px] rounded-full bg-marque/20 blur-2xl" />
      <div aria-hidden className="absolute -top-32 left-1/3 size-[360px] rounded-full bg-nuit/60 blur-3xl" />

      <div className="relative grid gap-10 px-6 py-12 sm:px-10 md:py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:px-14">
        <div className="flex flex-col justify-center">
          {p.banniereAccroche && (
            <p className="mb-5 flex items-center gap-2 text-sm text-marque">
              <span aria-hidden className="size-2 rounded-full bg-marque" />
              {p.banniereAccroche}
            </p>
          )}
          <h2 id="titre-banniere" className="text-4xl leading-[1.02] font-semibold md:text-5xl">
            {p.banniereTitre}
          </h2>

          <ul className="mt-7 space-y-2.5">
            {argumentsBanniere.map((a) => (
              <li key={a} className="flex items-center gap-3 text-white/85">
                <span className="grid size-5 shrink-0 place-items-center rounded-sm bg-marque text-nuit">
                  <Check aria-hidden className="size-3.5" strokeWidth={3} />
                </span>
                {a}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/commander"
              className="inline-flex h-13 items-center rounded-md bg-marque px-7 text-lg font-medium text-nuit transition hover:bg-white"
            >
              Demander mon devis
            </Link>
            {prix && (
              <p className="text-white/70">
                Prestations dès{" "}
                <span className="font-titre text-xl font-bold whitespace-nowrap text-white tabular-nums">
                  {prix.nombre} {prix.devise}
                </span>
              </p>
            )}
          </div>
        </div>

        <div aria-hidden className="relative hidden h-[340px] sm:block lg:h-auto lg:min-h-[360px]">
          {affiches.map((a) => (
            <div
              key={a.url}
              className={cx(
                "absolute w-[42%] max-w-[230px] overflow-hidden rounded-md shadow-[0_30px_60px_-20px_rgb(0_0_0/0.55)] ring-1 ring-white/10",
                a.position,
                a.rotation,
                a.z,
              )}
            >
              <ImageVisuel src={a.url} alt="" width={a.largeur} height={a.hauteur} sizes="230px" className="h-auto w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
