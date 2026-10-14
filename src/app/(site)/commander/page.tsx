import type { Metadata } from "next";
import { CircleCheck, Clock, ShieldCheck } from "lucide-react";
import { texteService } from "@/i18n/contenu";
import { categorieService } from "@/i18n/libelles";
import { i18n, metaLangues } from "@/i18n/serveur";
import { utilisateurConnecte } from "@/lib/auth";
import { servicesActifs } from "@/lib/donnees";
import { parametresSite } from "@/lib/parametres";
import { FormulaireCommande } from "./formulaire-commande";

export async function generateMetadata(): Promise<Metadata> {
  const { tr } = await i18n();
  return {
    title: tr("Commander", "Get a quote"),
    description: tr(
      "Décrivez votre projet marketing ou communication et recevez un devis sous 24 h ouvrées.",
      "Describe your marketing or communication project and receive a quote within one business day.",
    ),
    alternates: await metaLangues("/commander"),
  };
}

export default async function PageCommander({ searchParams }: PageProps<"/commander">) {
  const { service: slug } = await searchParams;
  const [services, connecte, parametres, { langue, devise, tr, prix, fmtPrix }] = await Promise.all([
    servicesActifs(),
    utilisateurConnecte(),
    parametresSite(),
    i18n(),
  ]);
  const initial = services.find((s) => s.slug === slug)?.id;
  const garanties = [
    { icone: Clock, texte: tr("Réponse sous 24 h ouvrées", "Reply within one business day") },
    { icone: CircleCheck, texte: tr("Devis gratuit et sans engagement", "Free, no-obligation quote") },
    { icone: ShieldCheck, texte: tr("Vos données restent confidentielles", "Your information stays confidential") },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
      <div className="grid gap-14 lg:grid-cols-[1fr_300px]">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight text-encre md:text-5xl">
            {tr("Demander un devis", "Get a quote")}
          </h1>
          <p className="mt-4 text-lg text-encre-douce">
            {tr(
              "Quelques informations suffisent. Vous recevez ensuite un lien pour suivre votre projet et demander des modifications.",
              "A few details are all we need. You then receive a link to follow your project and request changes.",
            )}
          </p>
          <div className="mt-10">
            <FormulaireCommande
              serviceInitial={initial}
              profil={connecte?.utilisateur}
              services={services.map((s) => ({
                id: s.id,
                nom: texteService(s, langue).nom,
                categorie: categorieService(s.categorie, langue),
                prix: fmtPrix(prix(s)),
              }))}
            />
          </div>
        </div>

        <aside className="lg:pt-28">
          <ul className="space-y-4 rounded-2xl bg-fond p-6">
            {garanties.map(({ icone: Icone, texte }) => (
              <li key={texte} className="flex items-center gap-3 text-sm text-encre">
                <Icone aria-hidden className="size-5 text-marque-fonce" />
                {texte}
              </li>
            ))}
          </ul>
          <p className="mt-4 px-1 text-xs leading-relaxed text-encre-muette">
            {devise === "USD"
              ? tr(
                  "Prix indiqués en dollars US : votre devis et votre facture seront établis en dollars.",
                  "Prices shown in US dollars: your quote and invoice will be issued in dollars.",
                )
              : tr(
                  "Prix indiqués en francs CFA : votre devis et votre facture seront établis en F CFA.",
                  "Prices shown in CFA francs: your quote and invoice will be issued in CFA francs.",
                )}{" "}
            {tr("Changez de devise avec le sélecteur en haut de page.", "Switch currency with the selector at the top of the page.")}
          </p>
          <p className="mt-6 px-1 text-sm text-encre-muette">
            {tr("Une question avant de commander ?", "A question before ordering?")}
            <br />
            <a href={`mailto:${parametres.email}`} className="font-medium text-marque-texte hover:underline">
              {parametres.email}
            </a>
          </p>
        </aside>
      </div>
    </div>
  );
}
