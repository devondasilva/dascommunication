import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ImageVisuel } from "@/components/image-visuel";
import { CarteRealisation } from "@/components/site/carte-realisation";
import { cx } from "@/components/ui";
import { LIBELLES_REALISATION } from "@/lib/constantes";
import { realisationPublieeParSlug, realisationsPubliees } from "@/lib/donnees";
import type { CategorieRealisation } from "@/lib/enums";

export async function generateMetadata({ params }: PageProps<"/realisations/[slug]">): Promise<Metadata> {
  const r = await realisationPublieeParSlug((await params).slug);
  if (!r) return { title: "Réalisation introuvable" };
  const couverture = r.visuels[0];
  return {
    title: r.titre,
    description: r.description ?? `${LIBELLES_REALISATION[r.categorie]}${r.client ? ` pour ${r.client}` : ""}.`,
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
  const r = await realisationPublieeParSlug((await params).slug);
  if (!r || r.visuels.length === 0) notFound();

  const [principal, ...declinaisons] = r.visuels;
  const memeCategorie = (await realisationsPubliees({ categorie: r.categorie })).filter((x) => x.slug !== r.slug).slice(0, 3);
  const estLogo = r.categorie === "logos";

  const infos = [
    { libelle: "Catégorie", valeur: LIBELLES_REALISATION[r.categorie] },
    r.client && { libelle: "Client", valeur: r.client },
    r.secteur && { libelle: "Secteur", valeur: r.secteur },
    r.tags.length > 0 && { libelle: "Expertises", valeur: r.tags.join(", ") },
  ].filter(Boolean) as { libelle: string; valeur: string }[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 md:py-16">
      <Link href="/realisations" className="inline-flex items-center gap-1.5 text-sm text-encre-douce hover:text-encre">
        <ArrowLeft aria-hidden className="size-4" /> Toutes les réalisations
      </Link>

      <header className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_280px] md:items-end">
        <div>
          <p className="text-sm text-marque-texte">{LIBELLES_REALISATION[r.categorie]}</p>
          <h1 className="mt-2 text-4xl font-semibold text-encre md:text-6xl">{r.titre}</h1>
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
          "relative mt-12 overflow-hidden rounded-lg ring-1 ring-bordure",
          estLogo ? "grid place-items-center bg-white py-16" : "bg-fond",
        )}
      >
        <ImageVisuel
          src={principal.url}
          alt={principal.alt || r.titre}
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
          Voir le projet en ligne <ExternalLink aria-hidden className="size-4" />
        </a>
      )}

      {declinaisons.length > 0 && (
        <section aria-labelledby="titre-declinaisons" className="mt-16">
          <h2 id="titre-declinaisons" className="text-2xl font-semibold text-encre">
            {r.categorie === "edition" ? "Toutes les pages" : "Déclinaisons"}{" "}
            <span className="font-normal text-encre-muette">({declinaisons.length})</span>
          </h2>
          <ul className="mt-6 columns-2 gap-4 sm:columns-3 lg:columns-4">
            {declinaisons.map((img) => (
              <li key={img.id} className="mb-4 break-inside-avoid">
                <a href={img.url} target="_blank" rel="noopener noreferrer" className="group block">
                  <div className="overflow-hidden rounded-md bg-fond ring-1 ring-bordure">
                    <ImageVisuel
                      src={img.url}
                      alt={img.alt || r.titre}
                      width={img.largeur}
                      height={img.hauteur}
                      sizes="(min-width: 1024px) 300px, (min-width: 640px) 33vw, 50vw"
                      className="h-auto w-full transition duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  {img.alt && img.alt !== r.titre && <p className="mt-2 text-xs text-encre-muette">{img.alt}</p>}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-20 flex flex-col items-start justify-between gap-6 rounded-lg bg-encre px-8 py-10 md:flex-row md:items-center md:px-10">
        <div>
          <h2 className="text-2xl font-semibold text-white md:text-3xl">Un projet similaire ?</h2>
          <p className="mt-1 text-white/70">Décrivez votre besoin, nous revenons vers vous sous 24 heures ouvrées.</p>
        </div>
        <Link
          href={`/commander?service=${SERVICE_ASSOCIE[r.categorie]}`}
          className="inline-flex h-12 items-center rounded-md bg-marque px-6 font-medium text-nuit transition hover:bg-white"
        >
          Demander un devis
        </Link>
      </section>

      {memeCategorie.length > 0 && (
        <section aria-labelledby="titre-autres" className="mt-20">
          <h2 id="titre-autres" className="text-2xl font-semibold text-encre">
            Dans la même catégorie
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
