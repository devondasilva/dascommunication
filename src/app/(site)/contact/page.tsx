import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone, SearchCheck } from "lucide-react";
import { Reseaux } from "@/components/site/reseaux";
import { i18n, metaLangues } from "@/i18n/serveur";
import { parametresSite } from "@/lib/parametres";

export async function generateMetadata(): Promise<Metadata> {
  const { tr } = await i18n();
  return {
    title: "Contact",
    description: tr(
      "Écrivez-nous, commandez un service ou suivez votre projet. Présents au Maryland, en Virginie et au Bénin.",
      "Write to us, order a service or track your project. Based in Maryland, Virginia and Benin.",
    ),
    alternates: await metaLangues("/contact"),
  };
}

export default async function PageContact() {
  const [p, { langue, tr, l }] = await Promise.all([parametresSite(), i18n()]);
  const presence = langue === "en" ? p.presenceEn || p.presence : p.presence;
  const whatsapp = p.whatsapp.replace(/\D/g, "");
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <p className="text-sm font-medium text-marque-texte">Contact</p>
      <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight text-balance text-encre md:text-7xl">
        {tr("Prêt à faire le premier pas\u00a0?", "Ready to take the first step?")}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-encre-douce">
        {tr(
          "Refonte complète, nouvelle application ou identité visuelle à repenser : nous sommes prêts à vous écouter.",
          "A full redesign, a new app or a brand identity to rethink: we are ready to listen.",
        )}
      </p>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        <Link
          href={l("/commander")}
          className="group flex flex-col justify-between rounded-md bg-encre p-7 text-white transition hover:bg-encre/90 md:row-span-2"
        >
          <div>
            <p className="text-sm text-white/60">{tr("Le plus rapide", "Fastest")}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">{tr("Décrire mon projet", "Describe my project")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              {tr(
                "Choisissez un service et décrivez votre besoin. Vous recevez une référence et un espace pour suivre votre projet et demander des modifications.",
                "Pick a service and describe what you need. You receive a reference and a space to follow your project and request changes.",
              )}
            </p>
          </div>
          <span className="mt-8 inline-flex items-center gap-2 font-medium text-marque">
            {tr("Commander", "Order")} <ArrowRight aria-hidden className="size-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>

        <a
          href={`mailto:${p.email}`}
          className="group flex items-start gap-4 rounded-md bg-white p-7 ring-1 ring-bordure transition hover:ring-encre/25"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-md bg-fond text-marque-texte">
            <Mail aria-hidden className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm text-encre-muette">{tr("E-mail direct", "Email us")}</h2>
            <p className="mt-1 font-semibold break-all text-encre group-hover:underline">{p.email}</p>
          </div>
        </a>

        <div className="flex items-start gap-4 rounded-md bg-white p-7 ring-1 ring-bordure">
          <span className="grid size-11 shrink-0 place-items-center rounded-md bg-fond text-marque-texte">
            <MapPin aria-hidden className="size-5" />
          </span>
          <div>
            <h2 className="text-sm text-encre-muette">{tr("Présence", "Locations")}</h2>
            <p className="mt-1 font-semibold text-encre">{presence}</p>
            <p className="text-sm text-encre-muette">{tr("et à distance", "and remote")}</p>
          </div>
        </div>

        {(whatsapp || p.telephone) && (
          <a
            href={whatsapp ? `https://wa.me/${whatsapp}` : `tel:${p.telephone.replace(/\s/g, "")}`}
            target={whatsapp ? "_blank" : undefined}
            rel={whatsapp ? "noopener noreferrer" : undefined}
            className="group flex items-start gap-4 rounded-md bg-white p-7 ring-1 ring-bordure transition hover:ring-encre/25"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-md bg-fond text-marque-texte">
              {whatsapp ? <MessageCircle aria-hidden className="size-5" /> : <Phone aria-hidden className="size-5" />}
            </span>
            <div>
              <h2 className="text-sm text-encre-muette">{whatsapp ? "WhatsApp" : tr("Téléphone", "Phone")}</h2>
              <p className="mt-1 font-semibold text-encre group-hover:underline">{whatsapp ? p.whatsapp : p.telephone}</p>
            </div>
          </a>
        )}

        <Link
          href={l("/suivi")}
          className="group flex items-start gap-4 rounded-md bg-white p-7 ring-1 ring-bordure transition hover:ring-encre/25"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-md bg-fond text-marque-texte">
            <SearchCheck aria-hidden className="size-5" />
          </span>
          <div>
            <h2 className="text-sm text-encre-muette">{tr("Déjà client ?", "Already a client?")}</h2>
            <p className="mt-1 font-semibold text-encre group-hover:underline">{tr("Suivre ma commande", "Track my order")}</p>
          </div>
        </Link>

        <div className="flex flex-col justify-between gap-4 rounded-md bg-white p-7 ring-1 ring-bordure">
          <h2 className="text-sm text-encre-muette">{tr("Suivez-nous", "Follow us")}</h2>
          <Reseaux liens={p} />
        </div>
      </div>
    </div>
  );
}
