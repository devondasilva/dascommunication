import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ImageVisuel } from "@/components/image-visuel";
import { CarteRealisation } from "@/components/site/carte-realisation";
import { cx } from "@/components/ui";
import { texteRealisation } from "@/i18n/contenu";
import { categorieRealisation, traduireTag } from "@/i18n/libelles";
import { i18n, metaLangues } from "@/i18n/serveur";
import { realisationPublieeParSlug, realisationsPubliees } from "@/lib/donnees";
import type { CategorieRealisation } from "@/lib/enums";

export async function generateMetadata({ params }: PageProps<"/realisations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [r, { langue, tr }] = await Promise.all([realisationPublieeParSlug(slug), i18n()]);
  if (!r) return { title: tr("Réalisation introuvable", "Project not found") };
  const texte = texteRealisation(r, langue);
  const couverture = r.visuels[0];
  return {
    title: texte.titre,
    description:
      texte.description ?? `${categorieRealisation(r.categorie, langue)}${r.client ? ` ${tr("pour", "for")} ${r.client}` : ""}.`,
    alternates: await metaLangues(`/realisations/${slug}`),
    openGraph: couverture ? { images: [{ url: couverture.url, width: couverture.largeur, height: couverture.hauteur }] } : undefined,
  };
}

/** Service du catalogue à proposer selon la catégorie de la réalisation. */
const SERVICE_ASSOCIE: Record<CategorieRealisation, string> = {
  logos: "identite-visuelle",
  visuels: "supports-print",
  edition: "supports-print",
  web: "creation-site-web",
};

export default async function PageRealisation({ params }: PageProps<"/realisations/[slug]">) {
  const [r, { langue, tr, l }] = await Promise.all([realisationPublieeParSlug((await params).slug), i18n()]);
  if (!r || r.visuels.length === 0) notFound();
  const texte = texteRealisation(r, langue);
  // Les textes alternatifs saisis sont en français : en anglais, on décrit l'image par le titre
  const altVisuel = (alt: string) => (langue === "en" ? texte.titre : alt || texte.titre);

  const [principal, ...declinaisons] = r.visuels;
  const memeCategorie = (await realisationsPubliees({ categorie: r.categorie })).filter((x) => x.slug !== r.slug).slice(0, 3);
  const estLogo = r.categorie === "logos";

  const infos = [
    { libelle: tr("Catégorie", "Category"), valeur: categorieRealisation(r.categorie, langue) },
    r.client && { libelle: "Client", valeur: r.client },
    texte.secteur && { libelle: tr("Secteur", "Industry"), valeur: texte.secteur },
    r.tags.length > 0 && { libelle: tr("Expertises", "Expertise"), valeur: r.tags.map((t) => traduireTag(t, langue)).join(", ") },
  ].filter(Boolean) as { libelle: string; valeur: string }[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 md:py-16">
      <Link href={l("/realisations")} className="inline-flex items-center gap-1.5 text-sm text-encre-douce hover:text-encre">
        <ArrowLeft aria-hidden className="size-4" /> {tr("Toutes les réalisations", "All our work")}
      </Link>

      <header className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_280px] md:items-end">
        <div>
          <p className="text-sm text-marque-texte">{categorieRealisation(r.categorie, langue)}</p>
          <h1 className="mt-2 text-4xl font-semibold text-encre md:text-6xl">{texte.titre}</h1>
          {texte.description && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-encre-douce">{texte.description}</p>}
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm md:grid-cols-1">
          {infos.map((i) => (
            <div key={i.libelle}>
              <dt className="text-encre-muette">{i.libelle}</dt>
              <dd className="mt-0.5 font-medium text-encre">{i.valeur}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div
        className={cx(
          "relative mt-12 overflow-hidden rounded-lg ring-1 ring-bordure",
          estLogo ? "grid place-items-center bg-white py-16" : "bg-fond",
        )}
      >
        <ImageVisuel
          src={principal.url}
          alt={altVisuel(principal.alt)}
          width={principal.largeur}
          height={principal.hauteur}
          priority
          sizes="(min-width: 1280px) 1216px, 100vw"
          className={estLogo ? "h-auto max-h-[420px] w-auto max-w-[70%]" : "mx-auto h-auto max-h-[85vh] w-auto max-w-full"}
        />
      </div>

      {r.lien && (
        <a
          href={r.lien}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-marque-texte hover:underline"
        >
          {tr("Voir le projet en ligne", "View the live project")} <ExternalLink aria-hidden className="size-4" />
        </a>
      )}

      {declinaisons.length > 0 && (
        <section aria-labelledby="titre-declinaisons" className="mt-16">
          <h2 id="titre-declinaisons" className="text-2xl font-semibold text-encre">
            {r.categorie === "edition" ? tr("Toutes les pages", "All pages") : tr("Déclinaisons", "Variations")}{" "}
            <span className="font-normal text-encre-muette">({declinaisons.length})</span>
          </h2>
          <ul className="mt-6 columns-2 gap-4 sm:columns-3 lg:columns-4">
            {declinaisons.map((img) => (
              <li key={img.id} className="mb-4 break-inside-avoid">
                <a href={img.url} target="_blank" rel="noopener noreferrer" className="group block">
                  <div className="overflow-hidden rounded-md bg-fond ring-1 ring-bordure">
                    <ImageVisuel
                      src={img.url}
                      alt={altVisuel(img.alt)}
                      width={img.largeur}
                      height={img.hauteur}
                      sizes="(min-width: 1024px) 300px, (min-width: 640px) 33vw, 50vw"
                      className="h-auto w-full transition duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  {langue === "fr" && img.alt && img.alt !== r.titre && (
                    <p className="mt-2 text-xs text-encre-muette">{img.alt}</p>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-20 flex flex-col items-start justify-between gap-6 rounded-lg bg-encre px-8 py-10 md:flex-row md:items-center md:px-10">
        <div>
          <h2 className="text-2xl font-semibold text-white md:text-3xl">{tr("Un projet similaire ?", "A similar project?")}</h2>
          <p className="mt-1 text-white/70">
            {tr(
              "Décrivez votre besoin, nous revenons vers vous sous 24 heures ouvrées.",
              "Tell us what you need and we will get back to you within one business day.",
            )}
          </p>
        </div>
        <Link
          href={l(`/commander?service=${SERVICE_ASSOCIE[r.categorie]}`)}
          className="inline-flex h-12 items-center rounded-md bg-marque px-6 font-medium text-nuit transition hover:bg-white"
        >
          {tr("Demander un devis", "Get a quote")}
        </Link>
      </section>

      {memeCategorie.length > 0 && (
        <section aria-labelledby="titre-autres" className="mt-20">
          <h2 id="titre-autres" className="text-2xl font-semibold text-encre">
            {tr("Dans la même catégorie", "More in this category")}
          </h2>
          <div className="mt-8 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {memeCategorie.map((x) => (
              <CarteRealisation key={x.slug} realisation={x} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
