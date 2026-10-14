import Link from "next/link";
import { EyeOff, ImageOff, Plus, Star } from "lucide-react";
import { basculerRealisation } from "@/actions/realisations";
import { EntetePage } from "@/components/dashboard/entete-page";
import { ImageVisuel } from "@/components/image-visuel";
import { Carte, cx, EtatVide, LienBouton } from "@/components/ui";
import { exigerEquipe } from "@/lib/auth";
import { LIBELLES_REALISATION } from "@/lib/constantes";
import { toutesLesRealisations } from "@/lib/donnees";
import { CATEGORIES_REALISATION, type CategorieRealisation } from "@/lib/enums";
import { pluriel } from "@/lib/format";

export const metadata = { title: "Réalisations" };

export default async function PageRealisationsAdmin({ searchParams }: PageProps<"/dashboard/realisations">) {
  await exigerEquipe("realisations.gerer");
  const sp = await searchParams;
  const categorie = CATEGORIES_REALISATION.includes(sp.categorie as CategorieRealisation)
    ? (sp.categorie as CategorieRealisation)
    : undefined;

  const [liste, toutes] = await Promise.all([toutesLesRealisations(categorie), toutesLesRealisations()]);
  const compte = (c?: CategorieRealisation) => (c ? toutes.filter((r) => r.categorie === c).length : toutes.length);

  return (
    <>
      <EntetePage
        titre="Réalisations"
        description="Les projets affichés dans le portfolio du site. Ajoutez vos visuels catégorie par catégorie."
        actions={
          <LienBouton href={`/dashboard/realisations/nouveau${categorie ? `?categorie=${categorie}` : ""}`} taille="sm">
            <Plus aria-hidden className="size-4" /> Nouvelle réalisation
          </LienBouton>
        }
      />

      <nav aria-label="Filtrer par catégorie" className="flex flex-wrap gap-1.5">
        {[undefined, ...CATEGORIES_REALISATION].map((c) => {
          const actif = c === categorie;
          return (
            <Link
              key={c ?? "toutes"}
              href={c ? `/dashboard/realisations?categorie=${c}` : "/dashboard/realisations"}
              aria-current={actif ? "page" : undefined}
              className={cx(
                "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm transition-colors",
                actif ? "bg-encre text-white" : "bg-white text-encre-douce ring-1 ring-bordure hover:text-encre",
              )}
            >
              {c ? LIBELLES_REALISATION[c] : "Toutes"}
              <span className={cx("text-xs tabular-nums", actif ? "text-white/60" : "text-encre-muette")}>{compte(c)}</span>
            </Link>
          );
        })}
      </nav>

      {liste.length === 0 ? (
        <Carte className="mt-5">
          <EtatVide
            titre="Aucune réalisation dans cette catégorie"
            texte="Créez une réalisation, puis ajoutez-y vos visuels."
            action={
              <LienBouton href={`/dashboard/realisations/nouveau${categorie ? `?categorie=${categorie}` : ""}`}>
                Nouvelle réalisation
              </LienBouton>
            }
          />
        </Carte>
      ) : (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {liste.map((r) => (
            <li key={r.id}>
              <Carte className={cx("relative overflow-hidden rounded-md", !r.publie && "opacity-75")}>
                <div className="relative aspect-[4/3] bg-fond">
                  {r.couverture ? (
                    <ImageVisuel
                      src={r.couverture.url}
                      alt={r.couverture.alt}
                      fill
                      sizes="(min-width: 1280px) 260px, (min-width: 640px) 45vw, 100vw"
                      className={r.categorie === "logos" ? "object-contain p-6" : "object-cover"}
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-sm text-encre-muette">
                      <span className="flex flex-col items-center gap-1">
                        <ImageOff aria-hidden className="size-6" /> Aucun visuel
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {!r.publie && (
                      <span className="flex items-center gap-1 rounded-sm bg-encre/85 px-1.5 py-0.5 text-xs text-white">
                        <EyeOff aria-hidden className="size-3" /> Masquée
                      </span>
                    )}
                    {r.misEnAvant && (
                      <span className="flex items-center gap-1 rounded-sm bg-marque px-1.5 py-0.5 text-xs text-nuit">
                        <Star aria-hidden className="size-3" /> Accueil
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-encre-muette">
                    {LIBELLES_REALISATION[r.categorie]}, {pluriel(r.nbVisuels, "visuel")}
                    {!r.titreEn && <span className="text-amber-800">, anglais à compléter</span>}
                  </p>
                  <h2 className="mt-1 line-clamp-2 font-medium text-encre">
                    <Link href={`/dashboard/realisations/${r.id}`} className="after:absolute after:inset-0 hover:underline">
                      {r.titre}
                    </Link>
                  </h2>
                  <div className="relative z-10 mt-3 flex gap-2">
                    <form action={basculerRealisation}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="champ" value="publie" />
                      <button type="submit" className="rounded-sm px-2 py-1 text-xs text-encre-douce ring-1 ring-bordure hover:bg-fond">
                        {r.publie ? "Masquer" : "Publier"}
                      </button>
                    </form>
                    <form action={basculerRealisation}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="champ" value="misEnAvant" />
                      <button type="submit" className="rounded-sm px-2 py-1 text-xs text-encre-douce ring-1 ring-bordure hover:bg-fond">
                        {r.misEnAvant ? "Retirer de l'accueil" : "Mettre sur l'accueil"}
                      </button>
                    </form>
                  </div>
                </div>
              </Carte>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
