import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock } from "lucide-react";
import { Carte, LienBouton } from "@/components/ui";
import { texteService } from "@/i18n/contenu";
import { categorieService } from "@/i18n/libelles";
import { i18n, metaLangues } from "@/i18n/serveur";
import { serviceParSlug } from "@/lib/donnees";

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [service, { langue, tr }] = await Promise.all([serviceParSlug(slug), i18n()]);
  if (!service) return { title: tr("Service introuvable", "Service not found") };
  const texte = texteService(service, langue);
  return { title: texte.nom, description: texte.resume, alternates: await metaLangues(`/services/${slug}`) };
}

export default async function PageService({ params }: PageProps<"/services/[slug]">) {
  const [service, { langue, devise, taux, tr, l, prix, fmtPrix }] = await Promise.all([
    serviceParSlug((await params).slug),
    i18n(),
  ]);
  if (!service) notFound();
  const texte = texteService(service, langue);
  const converti = devise === "USD" && service.prixUsd == null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <Link href={l("/services")} className="inline-flex items-center gap-1.5 text-sm text-encre-douce hover:text-encre">
        <ArrowLeft aria-hidden className="size-4" /> {tr("Tous les services", "All services")}
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_340px]">
        <div>
          <p className="text-sm font-medium text-marque-texte">{categorieService(service.categorie, langue)}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance text-encre md:text-5xl">{texte.nom}</h1>
          <p className="mt-5 text-lg leading-relaxed text-encre-douce">{texte.resume}</p>

          <h2 className="mt-12 text-lg font-semibold text-encre">{tr("En détail", "In detail")}</h2>
          <p className="mt-3 leading-relaxed whitespace-pre-line text-encre-douce">{texte.description}</p>

          {texte.livrables.length > 0 && (
            <>
              <h2 className="mt-10 text-lg font-semibold text-encre">{tr("Ce que vous recevez", "What you get")}</h2>
              <ul className="mt-4 space-y-3">
                {texte.livrables.map((livrable) => (
                  <li key={livrable} className="flex gap-3 text-encre-douce">
                    <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-marque-fonce" />
                    {livrable}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <aside>
          <Carte className="sticky top-24 p-6">
            <p className="text-sm text-encre-muette">{tr("À partir de", "Starting at")}</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums text-encre">{fmtPrix(prix(service))}</p>
            {converti && (
              <p className="mt-1 text-xs text-encre-muette">
                {tr(
                  `Soit ${fmtPrix(service.prixDepart, "XOF")}, converti au taux de ${taux} F CFA pour 1 $`,
                  `${fmtPrix(service.prixDepart, "XOF")}, converted at ${taux} CFA francs per US dollar`,
                )}
              </p>
            )}
            <p className="mt-3 flex items-center gap-1.5 text-sm text-encre-douce">
              <Clock aria-hidden className="size-4" /> {tr("Délai indicatif :", "Typical timeline:")} {service.delaiJours}{" "}
              {tr("jours", "days")}
            </p>
            <LienBouton href={l(`/commander?service=${service.slug}`)} taille="lg" className="mt-6 w-full">
              {tr("Commander ce service", "Order this service")}
              <ArrowRight aria-hidden className="size-4" />
            </LienBouton>
            <p className="mt-3 text-center text-xs text-encre-muette">
              {tr("Sans engagement, devis sous 24 h ouvrées", "No obligation, quote within one business day")}
            </p>
          </Carte>
        </aside>
      </div>
    </div>
  );
}
