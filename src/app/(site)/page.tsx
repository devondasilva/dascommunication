import Link from "next/link";
import { CarteRealisation } from "@/components/site/carte-realisation";
import { MurAffiches } from "@/components/site/mur-affiches";
import { realisationsMisesEnAvant } from "@/data/realisations";
import { CATEGORIES_SERVICE } from "@/lib/enums";
import { LIBELLES_CATEGORIE } from "@/lib/constantes";
import { servicesActifs } from "@/lib/donnees";
import { formaterMontant } from "@/lib/format";

const ETAPES = [
  { titre: "Vous décrivez votre besoin", texte: "En ligne, en quelques minutes, depuis votre espace client." },
  { titre: "Nous chiffrons", texte: "Un devis précis et un planning sous 24 heures ouvrées." },
  { titre: "Nous créons, vous ajustez", texte: "Vous suivez l'avancement et demandez vos retouches au même endroit." },
  { titre: "Vous recevez vos fichiers", texte: "Des livrables finalisés, prêts à imprimer, publier ou mettre en ligne." },
];

export default async function Accueil() {
  const services = await servicesActifs();
  const vitrine = realisationsMisesEnAvant().slice(0, 6);
  const domaines = CATEGORIES_SERVICE.map((cat) => {
    const liste = services.filter((s) => s.categorie === cat);
    return { cat, liste, prixMin: liste.length ? Math.min(...liste.map((s) => s.prixDepart)) : null };
  }).filter((d) => d.liste.length > 0);

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
                className="inline-flex h-14 items-center rounded-full bg-marque px-8 text-lg font-medium text-nuit transition hover:bg-encre hover:text-white"
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

      {/* ── Domaines d'expertise ──────────────────────────────── */}
      <section aria-labelledby="titre-services" className="bg-fond">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <h2 id="titre-services" className="text-4xl font-semibold text-encre md:text-5xl">
              Ce que nous faisons
            </h2>
            <p className="max-w-xl self-end text-lg text-encre-douce">
              Une seule équipe pour votre image, votre visibilité et vos outils digitaux. Chaque prestation a un prix
              de départ et un délai annoncés.
            </p>
          </div>

          <ul className="mt-14 border-t border-encre/15">
            {domaines.map(({ cat, liste, prixMin }) => (
              <li key={cat} className="border-b border-encre/15">
                <Link
                  href={`/services?categorie=${cat}`}
                  className="group grid gap-3 py-8 transition-colors md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_auto] md:items-baseline md:gap-10"
                >
                  <span className="font-titre text-3xl font-semibold tracking-tight text-encre transition-transform duration-300 ease-sortie group-hover:translate-x-2 md:text-4xl">
                    {LIBELLES_CATEGORIE[cat]}
                  </span>
                  <span className="text-encre-douce">{liste.map((s) => s.nom).join(", ")}</span>
                  {prixMin != null && (
                    <span className="text-sm whitespace-nowrap text-encre-muette tabular-nums">
                      dès {formaterMontant(prixMin)}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

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
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-encre px-8 py-16 md:px-16 md:py-20">
          <h2 className="max-w-3xl text-4xl font-semibold text-white md:text-6xl">
            Une marque à lancer, un événement à faire connaître ?
          </h2>
          <p className="mt-5 max-w-xl text-lg text-white/70">
            Décrivez votre projet. Vous recevez un devis sous 24 heures ouvrées et un espace pour suivre chaque étape.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/commander"
              className="inline-flex h-14 items-center rounded-full bg-marque px-8 text-lg font-medium text-nuit transition hover:bg-white"
            >
              Demander un devis
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-14 items-center rounded-full px-8 text-lg font-medium text-white ring-1 ring-white/30 transition hover:ring-white"
            >
              Nous écrire
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
