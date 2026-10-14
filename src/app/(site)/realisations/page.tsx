import type { Metadata } from "next";
import Link from "next/link";
import { CarteRealisation } from "@/components/site/carte-realisation";
import { cx, LienBouton } from "@/components/ui";
import { categorieRealisation } from "@/i18n/libelles";
import { i18n, metaLangues } from "@/i18n/serveur";
import { compteRealisationsParCategorie, realisationsPubliees } from "@/lib/donnees";
import { CATEGORIES_REALISATION, type CategorieRealisation } from "@/lib/enums";

export async function generateMetadata(): Promise<Metadata> {
  const { tr } = await i18n();
  return {
    title: tr("Réalisations", "Our work"),
    description: tr(
      "Logos, identités visuelles, sites et applications, supports et édition : une sélection de nos projets.",
      "Logos, brand identities, websites and apps, print and publishing: a selection of our projects.",
    ),
    alternates: await metaLangues("/realisations"),
  };
}

export default async function PageRealisations({ searchParams }: PageProps<"/realisations">) {
  const { categorie } = await searchParams;
  const filtre = CATEGORIES_REALISATION.includes(categorie as CategorieRealisation)
    ? (categorie as CategorieRealisation)
    : undefined;
  const [liste, compte, { langue, tr, l }] = await Promise.all([
    realisationsPubliees({ categorie: filtre }),
    compteRealisationsParCategorie(),
    i18n(),
  ]);
  const total = Object.values(compte).reduce((a, n) => a + (n ?? 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 md:py-20">
      <h1 className="text-5xl font-semibold tracking-tight text-encre md:text-7xl">{tr("Réalisations", "Our work")}</h1>
      <p className="mt-5 max-w-xl text-lg text-encre-douce">
        {tr(
          "Identités de marque, sites et applications, supports imprimés et édition : une sélection de projets menés pour nos clients.",
          "Brand identities, websites and apps, print and publishing: a selection of projects we delivered for our clients.",
        )}
      </p>

      <nav aria-label={tr("Filtrer par catégorie", "Filter by category")} className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-b border-bordure">
        {[undefined, ...CATEGORIES_REALISATION].map((c) => {
          const actif = c === filtre;
          const n = c ? (compte[c] ?? 0) : total;
          return (
            <Link
              key={c ?? "tout"}
              href={l(c ? `/realisations?categorie=${c}` : "/realisations")}
              aria-current={actif ? "page" : undefined}
              scroll={false}
              className={cx(
                "-mb-px flex items-center gap-1.5 border-b-2 pb-3 text-sm transition-colors",
                actif ? "border-encre font-medium text-encre" : "border-transparent text-encre-douce hover:text-encre",
              )}
            >
              {c ? categorieRealisation(c, langue) : tr("Tout", "All")}
              <span className="text-xs tabular-nums text-encre-muette">{n}</span>
            </Link>
          );
        })}
      </nav>

      {liste.length === 0 ? (
        <p className="mt-12 text-encre-muette">
          {tr("Aucune réalisation publiée dans cette catégorie pour le moment.", "No published work in this category yet.")}
        </p>
      ) : (
        <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {liste.map((r, i) => (
            <CarteRealisation key={r.slug} realisation={r} priorite={i < 3} />
          ))}
        </div>
      )}

      <div className="mt-24 flex flex-col items-start justify-between gap-6 border-t border-bordure pt-12 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-encre">
            {tr("Votre projet pourrait être le prochain.", "Your project could be next.")}
          </h2>
          <p className="mt-2 text-encre-douce">
            {tr(
              "Décrivez-le en quelques lignes, nous vous répondons sous 24 h ouvrées.",
              "Describe it in a few lines and we will reply within one business day.",
            )}
          </p>
        </div>
        <LienBouton href={l("/commander")} taille="lg">
          {tr("Démarrer un projet", "Start a project")}
        </LienBouton>
      </div>
    </div>
  );
}
