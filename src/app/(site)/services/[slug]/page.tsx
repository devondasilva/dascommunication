import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock } from "lucide-react";
import { Carte, LienBouton } from "@/components/ui";
import { LIBELLES_CATEGORIE } from "@/lib/constantes";
import { serviceParSlug } from "@/lib/donnees";
import { formaterMontant } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const service = await serviceParSlug((await params).slug);
  return service ? { title: service.nom, description: service.resume } : { title: "Service introuvable" };
}

export default async function PageService({ params }: PageProps<"/services/[slug]">) {
  const service = await serviceParSlug((await params).slug);
  if (!service) notFound();

  const livrables = service.livrables
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <Link href="/services" className="inline-flex items-center gap-1.5 text-sm text-encre-douce hover:text-encre">
        <ArrowLeft aria-hidden className="size-4" /> Tous les services
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_340px]">
        <div>
          <p className="text-sm font-medium text-marque-texte">
            {LIBELLES_CATEGORIE[service.categorie]}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance text-encre md:text-5xl">
            {service.nom}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-encre-douce">{service.resume}</p>

          <h2 className="mt-12 text-lg font-semibold text-encre">En détail</h2>
          <p className="mt-3 leading-relaxed whitespace-pre-line text-encre-douce">{service.description}</p>

          {livrables.length > 0 && (
            <>
              <h2 className="mt-10 text-lg font-semibold text-encre">Ce que vous recevez</h2>
              <ul className="mt-4 space-y-3">
                {livrables.map((l) => (
                  <li key={l} className="flex gap-3 text-encre-douce">
                    <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-marque-fonce" />
                    {l}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <aside>
          <Carte className="sticky top-24 p-6">
            <p className="text-sm text-encre-muette">À partir de</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums text-encre">
              {formaterMontant(service.prixDepart)}
            </p>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-encre-douce">
              <Clock aria-hidden className="size-4" /> Délai indicatif : {service.delaiJours} jours
            </p>
            <LienBouton href={`/commander?service=${service.slug}`} taille="lg" className="mt-6 w-full">
              Commander ce service
              <ArrowRight aria-hidden className="size-4" />
            </LienBouton>
            <p className="mt-3 text-center text-xs text-encre-muette">Sans engagement, devis sous 24 h ouvrées</p>
          </Carte>
        </aside>
      </div>
    </div>
  );
}
