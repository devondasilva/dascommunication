import type { Metadata } from "next";
import Link from "next/link";
import { cx, EtatVide } from "@/components/ui";
import { CATEGORIES_SERVICE, type CategorieService } from "@/lib/enums";
import { LIBELLES_CATEGORIE } from "@/lib/constantes";
import { servicesActifs } from "@/lib/donnees";
import { formaterMontant } from "@/lib/format";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Marketing digital, design graphique, SEO, sites et applications, communication événementielle, contenus et vidéo : prix de départ et délais.",
};

export default async function PageServices({ searchParams }: PageProps<"/services">) {
  const { categorie } = await searchParams;
  const filtre = CATEGORIES_SERVICE.includes(categorie as CategorieService) ? (categorie as CategorieService) : undefined;

  const tous = await servicesActifs();
  const groupes = CATEGORIES_SERVICE.filter((c) => !filtre || c === filtre)
    .map((c) => ({ cat: c, liste: tous.filter((s) => s.categorie === c) }))
    .filter((g) => g.liste.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 md:py-24">
      <h1 className="text-[clamp(3rem,7vw,6rem)] leading-[0.92] font-semibold tracking-[-0.045em] text-encre">Services</h1>
      <p className="mt-6 max-w-2xl text-lg text-encre-douce md:text-xl">
        Le prix indiqué est un point de départ. Vous recevez un devis précis après un premier échange, sans
        engagement.
      </p>

      <nav aria-label="Filtrer par domaine" className="mt-12 flex flex-wrap gap-2">
        {[undefined, ...CATEGORIES_SERVICE].map((c) => {
          const actif = c === filtre;
          return (
            <Link
              key={c ?? "tous"}
              href={c ? `/services?categorie=${c}` : "/services"}
              aria-current={actif ? "page" : undefined}
              scroll={false}
              className={cx(
                "rounded-full px-4 py-2 text-sm transition-colors",
                actif ? "bg-encre text-white" : "bg-fond text-encre-douce hover:text-encre",
              )}
            >
              {c ? LIBELLES_CATEGORIE[c] : "Tous les services"}
            </Link>
          );
        })}
      </nav>

      {groupes.length === 0 ? (
        <EtatVide titre="Aucun service dans ce domaine pour l'instant" texte="Consultez les autres domaines ou écrivez-nous." />
      ) : (
        <div className="mt-16 space-y-20">
          {groupes.map(({ cat, liste }) => (
            <section key={cat} aria-labelledby={`domaine-${cat}`} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
              <h2 id={`domaine-${cat}`} className="text-3xl font-semibold text-encre lg:sticky lg:top-28 lg:self-start">
                {LIBELLES_CATEGORIE[cat]}
              </h2>
              <ul className="border-t border-encre/15">
                {liste.map((s) => (
                  <li key={s.id} className="border-b border-encre/15">
                    <Link
                      href={`/services/${s.slug}`}
                      className="group grid gap-2 py-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8"
                    >
                      <div>
                        <h3 className="text-2xl font-semibold text-encre decoration-marque decoration-2 underline-offset-4 group-hover:underline">
                          {s.nom}
                        </h3>
                        <p className="mt-2 max-w-xl text-encre-douce">{s.resume}</p>
                      </div>
                      <div className="text-sm text-encre-muette sm:text-right">
                        <p className="font-medium text-encre tabular-nums">dès {formaterMontant(s.prixDepart)}</p>
                        <p className="mt-1">{s.delaiJours} jours environ</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
