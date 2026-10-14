import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { CarteRealisation } from "@/components/site/carte-realisation";
import { cx, LienBouton } from "@/components/ui";
import { CATEGORIES_REALISATION, REALISATIONS, realisationParSlug } from "@/data/realisations";

export function generateStaticParams() {
  return REALISATIONS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/realisations/[slug]">): Promise<Metadata> {
  const r = realisationParSlug((await params).slug);
  if (!r) return {};
  return {
    title: r.titre,
    description: r.description ?? `${CATEGORIES_REALISATION[r.categorie]}${r.client ? ` pour ${r.client}` : ""}.`,
    openGraph: { images: [{ url: r.image.src, width: r.image.largeur, height: r.image.hauteur }] },
  };
}

/** Service du catalogue à proposer selon la catégorie de la réalisation. */
const SERVICE_ASSOCIE: Record<string, string> = {
  logos: "identite-visuelle",
  visuels: "supports-print",
  edition: "supports-print",
  web: "creation-site-web",
};

export default async function PageRealisation({ params }: PageProps<"/realisations/[slug]">) {
  const r = realisationParSlug((await params).slug);
  if (!r) notFound();

  const index = REALISATIONS.indexOf(r);
  const suivante = REALISATIONS[(index + 1) % REALISATIONS.length];
  const memeCategorie = REALISATIONS.filter((x) => x.categorie === r.categorie && x.slug !== r.slug).slice(0, 3);
  const estLogo = r.categorie === "logos";

  const infos = [
    { libelle: "Catégorie", valeur: CATEGORIES_REALISATION[r.categorie] },
    r.client && { libelle: "Client", valeur: r.client },
    r.secteur && { libelle: "Secteur", valeur: r.secteur },
    r.tags.length > 0 && { libelle: "Expertises", valeur: r.tags.join(", ") },
  ].filter(Boolean) as { libelle: string; valeur: string }[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <Link href="/realisations" className="inline-flex items-center gap-1.5 text-sm text-encre-douce hover:text-encre">
        <ArrowLeft aria-hidden className="size-4" /> Toutes les réalisations
      </Link>

      <header className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_280px] md:items-end">
        <div>
          <p className="text-sm text-marque-texte">{CATEGORIES_REALISATION[r.categorie]}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-balance text-encre md:text-6xl">{r.titre}</h1>
          {r.description && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-encre-douce">{r.description}</p>}
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
          "relative mt-12 overflow-hidden rounded-3xl ring-1 ring-bordure",
          estLogo ? "grid place-items-center bg-white py-16" : "bg-fond",
        )}
      >
        <Image
          src={r.image.src}
          alt={r.image.alt}
          width={r.image.largeur}
          height={r.image.hauteur}
          priority
          sizes="(min-width: 1152px) 1104px, 100vw"
          className={estLogo ? "h-auto max-h-[420px] w-auto max-w-[70%]" : "h-auto w-full"}
        />
      </div>

      {r.lien && (
        <a
          href={r.lien}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-marque-texte hover:underline"
        >
          Voir la maquette <ExternalLink aria-hidden className="size-4" />
        </a>
      )}

      {r.galerie && r.galerie.length > 1 && (
        <section aria-labelledby="titre-galerie" className="mt-16">
          <h2 id="titre-galerie" className="text-lg font-semibold text-encre">
            Toutes les pages <span className="font-normal text-encre-muette">({r.galerie.length})</span>
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {r.galerie.map((img) => (
              <li key={img.src}>
                <a href={img.src} target="_blank" rel="noopener noreferrer" className="group block">
                  <div className="overflow-hidden rounded-xl bg-fond ring-1 ring-bordure">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.largeur}
                      height={img.hauteur}
                      sizes="(min-width: 1024px) 270px, (min-width: 640px) 33vw, 50vw"
                      className="h-auto w-full transition duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <p className="mt-2 text-xs text-encre-muette">{img.alt.replace(/^Magazine — /, "")}</p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-20 flex flex-col items-start justify-between gap-6 rounded-3xl bg-encre px-8 py-10 md:flex-row md:items-center md:px-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Un projet similaire ?</h2>
          <p className="mt-1 text-white/70">Décrivez votre besoin, nous revenons vers vous sous 24 h ouvrées.</p>
        </div>
        <Link
          href={`/commander?service=${SERVICE_ASSOCIE[r.categorie]}`}
          className="inline-flex h-12 items-center gap-2 rounded-lg bg-marque px-6 font-medium text-encre transition hover:bg-white"
        >
          Commander <ArrowRight aria-hidden className="size-4" />
        </Link>
      </section>

      {memeCategorie.length > 0 && (
        <section aria-labelledby="titre-autres" className="mt-20">
          <div className="flex items-end justify-between gap-4">
            <h2 id="titre-autres" className="text-2xl font-semibold tracking-tight text-encre">
              Dans la même catégorie
            </h2>
            <LienBouton href={`/realisations/${suivante.slug}`} variante="secondaire" taille="sm">
              Projet suivant <ArrowRight aria-hidden className="size-4" />
            </LienBouton>
          </div>
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
