import type { Metadata } from "next";
import Link from "next/link";
import { BanniereDevis } from "@/components/site/banniere-devis";
import { CarteService, ICONES_CATEGORIE } from "@/components/site/carte-service";
import { cx, EtatVide } from "@/components/ui";
import { CATEGORIES_SERVICE, type CategorieService } from "@/lib/enums";
import { LIBELLES_CATEGORIE } from "@/lib/constantes";
import { idsServicesPopulaires, servicesActifs } from "@/lib/donnees";

export const metadata: Metadata = {
  title: "Services et tarifs",
  description:
    "Marketing digital, design graphique, SEO, sites et applications, communication événementielle, contenus et vidéo : prix de départ, délais et commande en ligne.",
};

export default async function PageServices({ searchParams }: PageProps<"/services">) {
  const { categorie } = await searchParams;
  const filtre = CATEGORIES_SERVICE.includes(categorie as CategorieService) ? (categorie as CategorieService) : undefined;

  const [tous, populaires] = await Promise.all([servicesActifs(), idsServicesPopulaires()]);
  const groupes = CATEGORIES_SERVICE.filter((c) => !filtre || c === filtre)
    .map((c) => ({ cat: c, liste: tous.filter((s) => s.categorie === c) }))
    .filter((g) => g.liste.length > 0);
  const prixMin = tous.length ? Math.min(...tous.map((s) => s.prixDepart)) : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 md:py-16">
      <BanniereDevis prixMin={prixMin} />

      <div className="mt-20 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-[clamp(2.75rem,6vw,5rem)] leading-[0.95] font-semibold tracking-[-0.04em] text-encre">
            Services et tarifs
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-encre-douce">
            Le prix affiché est un point de départ. Votre devis précis arrive après un premier échange, sans
            engagement.
          </p>
        </div>
      </div>

      <nav aria-label="Filtrer par domaine" className="sticky top-18 z-30 -mx-4 mt-10 overflow-x-auto bg-white/95 px-4 py-3 backdrop-blur-lg sm:mx-0 sm:px-0">
        <ul className="flex gap-2">
          {[undefined, ...CATEGORIES_SERVICE].map((c) => {
            const actif = c === filtre;
            const Icone = c ? ICONES_CATEGORIE[c] : null;
            const n = c ? tous.filter((s) => s.categorie === c).length : tous.length;
            return (
              <li key={c ?? "tous"} className="shrink-0">
                <Link
                  href={c ? `/services?categorie=${c}` : "/services"}
                  aria-current={actif ? "page" : undefined}
                  scroll={false}
                  className={cx(
                    "flex h-10 items-center gap-2 rounded-md px-4 text-sm whitespace-nowrap transition-colors",
                    actif ? "bg-encre text-white" : "bg-fond text-encre-douce hover:bg-marque-pale hover:text-encre",
                  )}
                >
                  {Icone && <Icone aria-hidden className="size-4" />}
                  {c ? LIBELLES_CATEGORIE[c] : "Tous"}
                  <span className={cx("text-xs tabular-nums", actif ? "text-white/60" : "text-encre-muette")}>{n}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {groupes.length === 0 ? (
        <EtatVide titre="Aucun service dans ce domaine pour l'instant" texte="Consultez les autres domaines ou écrivez-nous." />
      ) : (
        <div className="mt-12 space-y-20">
          {groupes.map(({ cat, liste }) => (
            <section key={cat} aria-labelledby={`domaine-${cat}`} className="scroll-mt-36">
              <h2 id={`domaine-${cat}`} className="text-3xl font-semibold text-encre">
                {LIBELLES_CATEGORIE[cat]}
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {liste.map((s) => (
                  <CarteService key={s.id} service={s} populaire={populaires.has(s.id)} afficherDomaine={false} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
