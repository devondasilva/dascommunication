import type { Metadata } from "next";
import Link from "next/link";
import { BanniereDevis } from "@/components/site/banniere-devis";
import { CarteService, ICONES_CATEGORIE } from "@/components/site/carte-service";
import { cx, EtatVide } from "@/components/ui";
import { CATEGORIES_SERVICE, type CategorieService } from "@/lib/enums";
import { categorieService } from "@/i18n/libelles";
import { i18n, metaLangues } from "@/i18n/serveur";
import { idsServicesPopulaires, servicesActifs } from "@/lib/donnees";

export async function generateMetadata(): Promise<Metadata> {
  const { tr } = await i18n();
  return {
    title: tr("Services et tarifs", "Services and pricing"),
    description: tr(
      "Marketing digital, design graphique, SEO, sites et applications, communication événementielle, contenus et vidéo : prix de départ, délais et commande en ligne.",
      "Digital marketing, graphic design, SEO, websites and apps, event communication, content and video: starting prices, timelines and online ordering.",
    ),
    alternates: await metaLangues("/services"),
  };
}

export default async function PageServices({ searchParams }: PageProps<"/services">) {
  const { categorie } = await searchParams;
  const filtre = CATEGORIES_SERVICE.includes(categorie as CategorieService) ? (categorie as CategorieService) : undefined;

  const [tous, populaires, { langue, tr, l, prix }] = await Promise.all([servicesActifs(), idsServicesPopulaires(), i18n()]);
  const groupes = CATEGORIES_SERVICE.filter((c) => !filtre || c === filtre)
    .map((c) => ({ cat: c, liste: tous.filter((s) => s.categorie === c) }))
    .filter((g) => g.liste.length > 0);
  const prixMin = tous.length ? Math.min(...tous.map(prix)) : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 md:py-16">
      <BanniereDevis prixMin={prixMin} />

      <div className="mt-20 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-[clamp(2.75rem,6vw,5rem)] leading-[0.95] font-semibold tracking-[-0.04em] text-encre">
            {tr("Services et tarifs", "Services and pricing")}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-encre-douce">
            {tr(
              "Le prix affiché est un point de départ. Votre devis précis arrive après un premier échange, sans engagement.",
              "The price shown is a starting point. Your detailed quote follows a first conversation, with no obligation.",
            )}
          </p>
        </div>
      </div>

      <nav aria-label={tr("Filtrer par domaine", "Filter by field")} className="sticky top-18 z-30 -mx-4 mt-10 overflow-x-auto bg-white/95 px-4 py-3 backdrop-blur-lg sm:mx-0 sm:px-0">
        <ul className="flex gap-2">
          {[undefined, ...CATEGORIES_SERVICE].map((c) => {
            const actif = c === filtre;
            const Icone = c ? ICONES_CATEGORIE[c] : null;
            const n = c ? tous.filter((s) => s.categorie === c).length : tous.length;
            return (
              <li key={c ?? "tous"} className="shrink-0">
                <Link
                  href={l(c ? `/services?categorie=${c}` : "/services")}
                  aria-current={actif ? "page" : undefined}
                  scroll={false}
                  className={cx(
                    "flex h-10 items-center gap-2 rounded-md px-4 text-sm whitespace-nowrap transition-colors",
                    actif ? "bg-encre text-white" : "bg-fond text-encre-douce hover:bg-marque-pale hover:text-encre",
                  )}
                >
                  {Icone && <Icone aria-hidden className="size-4" />}
                  {c ? categorieService(c, langue) : tr("Tous", "All")}
                  <span className={cx("text-xs tabular-nums", actif ? "text-white/60" : "text-encre-muette")}>{n}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {groupes.length === 0 ? (
        <EtatVide
          titre={tr("Aucun service dans ce domaine pour l'instant", "No services in this field yet")}
          texte={tr("Consultez les autres domaines ou écrivez-nous.", "Browse the other fields or get in touch.")}
        />
      ) : (
        <div className="mt-12 space-y-20">
          {groupes.map(({ cat, liste }) => (
            <section key={cat} aria-labelledby={`domaine-${cat}`} className="scroll-mt-36">
              <h2 id={`domaine-${cat}`} className="text-3xl font-semibold text-encre">
                {categorieService(cat, langue)}
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
