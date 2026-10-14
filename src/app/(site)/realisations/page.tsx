import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CarteRealisation } from "@/components/site/carte-realisation";
import { cx, LienBouton } from "@/components/ui";
import { CATEGORIES_REALISATION, REALISATIONS, type CategorieRealisation } from "@/data/realisations";

export const metadata: Metadata = {
  title: "Réalisations",
  description: "Logos, identités visuelles, sites et applications, supports et édition : une sélection de nos projets.",
};

const CLES = Object.keys(CATEGORIES_REALISATION) as CategorieRealisation[];

export default async function PageRealisations({ searchParams }: PageProps<"/realisations">) {
  const { categorie } = await searchParams;
  const filtre = CLES.includes(categorie as CategorieRealisation) ? (categorie as CategorieRealisation) : undefined;
  const liste = filtre ? REALISATIONS.filter((r) => r.categorie === filtre) : REALISATIONS;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
      <h1 className="text-5xl font-semibold tracking-tight text-encre md:text-7xl">Réalisations</h1>
      <p className="mt-5 max-w-xl text-lg text-encre-douce">
        Identités de marque, sites et applications, supports imprimés et édition : une sélection de projets menés
        pour nos clients.
      </p>

      <nav aria-label="Filtrer par catégorie" className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-b border-bordure">
        {[undefined, ...CLES].map((c) => {
          const actif = c === filtre;
          const n = c ? REALISATIONS.filter((r) => r.categorie === c).length : REALISATIONS.length;
          return (
            <Link
              key={c ?? "tout"}
              href={c ? `/realisations?categorie=${c}` : "/realisations"}
              aria-current={actif ? "page" : undefined}
              scroll={false}
              className={cx(
                "-mb-px flex items-center gap-1.5 border-b-2 pb-3 text-sm transition-colors",
                actif ? "border-encre font-medium text-encre" : "border-transparent text-encre-douce hover:text-encre",
              )}
            >
              {c ? CATEGORIES_REALISATION[c] : "Tout"}
              <span className="text-xs tabular-nums text-encre-muette">{n}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3">
        {liste.map((r, i) => (
          <CarteRealisation key={r.slug} realisation={r} priorite={i < 3} />
        ))}
      </div>

      <div className="mt-24 flex flex-col items-start justify-between gap-6 border-t border-bordure pt-12 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-encre">Votre projet pourrait être le prochain.</h2>
          <p className="mt-2 text-encre-douce">Décrivez-le en quelques lignes, nous vous répondons sous 24 h ouvrées.</p>
        </div>
        <LienBouton href="/commander" taille="lg">
          Démarrer un projet <ArrowRight aria-hidden className="size-4" />
        </LienBouton>
      </div>
    </div>
  );
}
