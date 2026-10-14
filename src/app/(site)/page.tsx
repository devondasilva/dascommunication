import type { Metadata } from "next";
import Link from "next/link";
import { BanniereDevis } from "@/components/site/banniere-devis";
import { CarteRealisation } from "@/components/site/carte-realisation";
import { CarteService } from "@/components/site/carte-service";
import { MurAffiches } from "@/components/site/mur-affiches";
import { CATEGORIES_SERVICE } from "@/lib/enums";
import { i18n, metaLangues } from "@/i18n/serveur";
import { idsServicesPopulaires, realisationsPubliees, servicesActifs } from "@/lib/donnees";

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: await metaLangues("/") };
}

export default async function Accueil() {
  const [services, populaires, misesEnAvant, { tr, l, prix }] = await Promise.all([
    servicesActifs(),
    idsServicesPopulaires(),
    realisationsPubliees({ misEnAvant: true }),
    i18n(),
  ]);
  const etapes = [
    {
      titre: tr("Vous décrivez votre besoin", "You describe your needs"),
      texte: tr("En ligne, en quelques minutes, depuis votre espace client.", "Online, in a few minutes, from your client area."),
    },
    {
      titre: tr("Nous chiffrons", "We send a quote"),
      texte: tr("Un devis précis et un planning sous 24 heures ouvrées.", "A detailed quote and timeline within one business day."),
    },
    {
      titre: tr("Nous créons, vous ajustez", "We create, you refine"),
      texte: tr(
        "Vous suivez l'avancement et demandez vos retouches au même endroit.",
        "Follow progress and request changes, all in one place.",
      ),
    },
    {
      titre: tr("Vous recevez vos fichiers", "You get your files"),
      texte: tr(
        "Des livrables finalisés, prêts à imprimer, publier ou mettre en ligne.",
        "Final deliverables, ready to print, post or publish.",
      ),
    },
  ];
  const vitrine = misesEnAvant.slice(0, 6);
  // Un service par domaine, en commençant par le plus demandé s'il y en a un
  const vedettes = CATEGORIES_SERVICE.map(
    (cat) =>
      services.find((s) => s.categorie === cat && populaires.has(s.id)) ?? services.find((s) => s.categorie === cat),
  ).filter((s) => s !== undefined);
  const prixMin = services.length ? Math.min(...services.map(prix)) : undefined;

  return (
    <>
      {/* ── Ouverture ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pt-12 pb-20 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16 lg:pt-16 lg:pb-28">
          <div className="flex flex-col justify-center">
            <h1 className="text-[clamp(3rem,7.2vw,6.75rem)] leading-[0.9] font-semibold tracking-[-0.045em] text-encre">
              {tr("Des marques qu'on remarque. Des événements dont on parle.", "Brands people notice. Events people talk about.")}
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-encre-douce md:text-xl">
              {tr(
                "DAS COM conçoit votre identité, vos affiches, vos campagnes et vos sites, du Bénin aux États-Unis. Demandez un devis en ligne et suivez chaque étape depuis votre espace.",
                "DAS COM designs your brand identity, posters, campaigns and websites, from Benin to the United States. Request a quote online and follow every step from your client area.",
              )}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href={l("/commander")}
                className="inline-flex h-14 items-center rounded-md bg-marque px-8 text-lg font-medium text-nuit transition hover:bg-encre hover:text-white"
              >
                {tr("Demander un devis", "Get a quote")}
              </Link>
              <Link
                href={l("/realisations")}
                className="text-lg font-medium text-encre underline decoration-marque decoration-2 underline-offset-[6px] hover:decoration-encre"
              >
                {tr("Voir nos réalisations", "See our work")}
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
                {tr("Nos services, prix affichés", "Our services, upfront prices")}
              </h2>
              <p className="mt-4 text-lg text-encre-douce">
                {tr(
                  "Choisissez une prestation et commandez en ligne. Vous recevez un devis précis sous 24 heures ouvrées.",
                  "Pick a service and order online. You receive a detailed quote within one business day.",
                )}
              </p>
            </div>
            <Link
              href={l("/services")}
              className="font-medium text-encre underline decoration-marque decoration-2 underline-offset-[6px] hover:decoration-encre"
            >
              {tr(`Voir les ${services.length} services`, `See all ${services.length} services`)}
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
              {tr("Tournois, galas, conférences, lancements de marque", "Tournaments, galas, conferences, brand launches")}
            </h2>
            <Link
              href={l("/realisations")}
              className="font-medium text-encre underline decoration-marque decoration-2 underline-offset-[6px] hover:decoration-encre"
            >
              {tr("Toutes les réalisations", "All our work")}
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
            {tr("Comment ça se passe", "How it works")}
          </h2>
          <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {etapes.map((e, i) => (
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
            {tr("Une marque à lancer, un événement à faire connaître ?", "A brand to launch, an event to promote?")}
          </h2>
          <p className="mt-5 max-w-xl text-lg text-white/70">
            {tr(
              "Décrivez votre projet. Vous recevez un devis sous 24 heures ouvrées et un espace pour suivre chaque étape.",
              "Tell us about your project. You get a quote within one business day and a space to follow every step.",
            )}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={l("/commander")}
              className="inline-flex h-14 items-center rounded-md bg-marque px-8 text-lg font-medium text-nuit transition hover:bg-white"
            >
              {tr("Demander un devis", "Get a quote")}
            </Link>
            <Link
              href={l("/contact")}
              className="inline-flex h-14 items-center rounded-md px-8 text-lg font-medium text-white ring-1 ring-white/30 transition hover:ring-white"
            >
              {tr("Nous écrire", "Contact us")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
