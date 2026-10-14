import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, SearchCheck } from "lucide-react";
import { Reseaux } from "@/components/site/reseaux";
import { SITE } from "@/lib/constantes";

export const metadata: Metadata = {
  title: "Contact",
  description: "Écrivez-nous, commandez un service ou suivez votre projet. Présents au Maryland, en Virginie et au Bénin.",
};

export default function PageContact() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <p className="text-sm font-medium text-marque-texte">Contact</p>
      <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight text-balance text-encre md:text-7xl">
        Prêt à faire le premier pas&nbsp;?
      </h1>
      <p className="mt-6 max-w-xl text-lg text-encre-douce">
        Refonte complète, nouvelle application ou identité visuelle à repenser : nous sommes prêts à vous écouter.
      </p>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        <Link
          href="/commander"
          className="group flex flex-col justify-between rounded-md bg-encre p-7 text-white transition hover:bg-encre/90 md:row-span-2"
        >
          <div>
            <p className="text-sm text-white/60">Le plus rapide</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Décrire mon projet</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Choisissez un service et décrivez votre besoin. Vous recevez une référence et un espace pour suivre votre
              projet et demander des modifications.
            </p>
          </div>
          <span className="mt-8 inline-flex items-center gap-2 font-medium text-marque">
            Commander <ArrowRight aria-hidden className="size-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>

        <a
          href={`mailto:${SITE.email}`}
          className="group flex items-start gap-4 rounded-md bg-white p-7 ring-1 ring-bordure transition hover:ring-encre/25"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-fond text-marque-texte">
            <Mail aria-hidden className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm text-encre-muette">E-mail direct</h2>
            <p className="mt-1 font-semibold break-all text-encre group-hover:underline">{SITE.email}</p>
          </div>
        </a>

        <div className="flex items-start gap-4 rounded-md bg-white p-7 ring-1 ring-bordure">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-fond text-marque-texte">
            <MapPin aria-hidden className="size-5" />
          </span>
          <div>
            <h2 className="text-sm text-encre-muette">Présence</h2>
            <p className="mt-1 font-semibold text-encre">Maryland, Virginie et Bénin</p>
            <p className="text-sm text-encre-muette">et à distance</p>
          </div>
        </div>

        <Link
          href="/suivi"
          className="group flex items-start gap-4 rounded-md bg-white p-7 ring-1 ring-bordure transition hover:ring-encre/25"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-fond text-marque-texte">
            <SearchCheck aria-hidden className="size-5" />
          </span>
          <div>
            <h2 className="text-sm text-encre-muette">Déjà client ?</h2>
            <p className="mt-1 font-semibold text-encre group-hover:underline">Suivre ma commande</p>
          </div>
        </Link>

        <div className="flex flex-col justify-between gap-4 rounded-md bg-white p-7 ring-1 ring-bordure">
          <h2 className="text-sm text-encre-muette">Suivez-nous</h2>
          <Reseaux />
        </div>
      </div>
    </div>
  );
}
