import Link from "next/link";
import { BanniereDevis } from "@/components/site/banniere-devis";
import { CarteRealisation } from "@/components/site/carte-realisation";
import { CarteService } from "@/components/site/carte-service";
import { MurAffiches } from "@/components/site/mur-affiches";
import { CATEGORIES_SERVICE } from "@/lib/enums";
import { idsServicesPopulaires, realisationsPubliees, servicesActifs } from "@/lib/donnees";

const ETAPES = [
  { titre: "Vous décrivez votre besoin", texte: "En ligne, en quelques minutes, depuis votre espace client." },
  { titre: "Nous chiffrons", texte: "Un devis précis et un planning sous 24 heures ouvrées." },
  { titre: "Nous créons, vous ajustez", texte: "Vous suivez l'avancement et demandez vos retouches au même endroit." },
  { titre: "Vous recevez vos fichiers", texte: "Des livrables finalisés, prêts à imprimer, publier ou mettre en ligne." },
];

export default async function Accueil() {
  const [services, populaires, misesEnAvant] = await Promise.all([
    servicesActifs(),
    idsServicesPopulaires(),
    realisationsPubliees({ misEnAvant: true }),
  ]);
  const vitrine = misesEnAvant.slice(0, 6);
  // Un service par domaine, en commençant par le plus demandé s'il y en a un
  const vedettes = CATEGORIES_SERVICE.map(
    (cat) =>
      services.find((s) => s.categorie === cat && populaires.has(s.id)) ?? services.find((s) => s.categorie === cat),
  ).filter((s) => s !== undefined);
  const prixMin = services.length ? Math.min(...services.map((s) => s.prixDepart)) : undefined;

  return (
    <>
      {/* ── Ouverture ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pt-12 pb-20 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16 lg:pt-16 lg:pb-28">
          <div className="flex flex-col justify-center">
            <h1 className="text-[clamp(3rem,7.2vw,6.75rem)] leading-[0.9] font-semibold tracking-[-0.045em] text-encre">
              Des marques qu&apos;on remarque. Des événements dont on parle.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-encre-douce md:text-xl">
              DAS COM conçoit votre identité, vos affiches, vos campagnes et vos sites, du Bénin aux États-Unis.
              Demandez un devis en ligne et suivez chaque étape depuis votre espace.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href="/commander"
                className="inline-flex h-14 items-center rounded-md bg-marque px-8 text-lg font-medium text-nuit transition hover:bg-encre hover:text-white"
              >
                Demander un devis
              </Link>
              <Link
                href="/realisations"
                className="text-lg font-medium text-encre underline decoration-marque decoration-2 underline-offset-[6px] hover:decoration-encre"
              >
                Voir nos réalisations
              </Link>
            </div>
          </div>

          <MurAffiches className="h-[440px] sm:h-[560px] lg:h-[680px]" />
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────── */}
      <section aria-labelledby="titre-services" className="bg-fond">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 id="titre-services" className="text-4xl font-semibold text-encre md:text-5xl">
                Nos services, prix affichés
              </h2>
              <p className="mt-4 text-lg text-encre-douce">
                Choisissez une prestation et commandez en ligne. Vous recevez un devis précis sous 24 heures ouvrées.
              </p>
            </div>
            <Link
              href="/services"
              className="font-medium text-encre underline decoration-marque decoration-2 underline-offset-[6px] hover:decoration-encre"
            >
              Voir les {services.length} services
            </Link>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vedettes.map((s) => (
              <CarteService key={s.id} service={s} populaire={populaires.has(s.id)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bannière devis ───────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-8">
        <BanniereDevis prixMin={prixMin} />
      </div>

      {/* ── Réalisations ──────────────────────────────────────── */}
      <section aria-labelledby="titre-realisations">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="titre-realisations" className="max-w-2xl text-4xl font-semibold text-encre md:text-5xl">
              Tournois, galas, conférences, lancements de marque
            </h2>
            <Link
              href="/realisations"
              className="font-medium text-encre underline decoration-marque decoration-2 underline-offset-[6px] hover:decoration-encre"
            >
              Toutes les réalisations
            </Link>
          </div>
          <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {vitrine.map((r, i) => (
              <CarteRealisation key={r.slug} realisation={r} priorite={i < 3} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Méthode ───────────────────────────────────────────── */}
      <section aria-labelledby="titre-methode" className="border-t border-bordure">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-8">
          <h2 id="titre-methode" className="text-4xl font-semibold text-encre md:text-5xl">
            Comment ça se passe
          </h2>
          <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {ETAPES.map((e, i) => (
              <li key={e.titre}>
                <span aria-hidden className="font-titre text-6xl font-bold text-marque">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-encre">{e.titre}</h3>
                <p className="mt-2 leading-relaxed text-encre-douce">{e.texte}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Appel à l'action ──────────────────────────────────── */}
      <section className="px-4 pb-6 sm:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-lg bg-encre px-8 py-16 md:px-16 md:py-20">
          <h2 className="max-w-3xl text-4xl font-semibold text-white md:text-6xl">
            Une marque à lancer, un événement à faire connaître ?
          </h2>
          <p className="mt-5 max-w-xl text-lg text-white/70">
            Décrivez votre projet. Vous recevez un devis sous 24 heures ouvrées et un espace pour suivre chaque étape.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/commander"
              className="inline-flex h-14 items-center rounded-md bg-marque px-8 text-lg font-medium text-nuit transition hover:bg-white"
            >
              Demander un devis
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-14 items-center rounded-md px-8 text-lg font-medium text-white ring-1 ring-white/30 transition hover:ring-white"
            >
              Nous écrire
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
