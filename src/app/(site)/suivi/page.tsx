import type { Metadata } from "next";
import { i18n, metaLangues } from "@/i18n/serveur";
import { FormulaireRecherche } from "./formulaire-recherche";

export async function generateMetadata(): Promise<Metadata> {
  const { tr } = await i18n();
  return {
    title: tr("Suivre ma commande", "Track my order"),
    description: tr(
      "Retrouvez votre commande avec sa référence et votre adresse e-mail.",
      "Find your order with its reference and your email address.",
    ),
    alternates: await metaLangues("/suivi"),
  };
}

export default async function PageSuivi() {
  const { tr } = await i18n();
  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6 md:py-28">
      <h1 className="text-3xl font-semibold tracking-tight text-encre md:text-4xl">{tr("Suivre ma commande", "Track my order")}</h1>
      <p className="mt-3 text-encre-douce">
        {tr(
          "Saisissez la référence reçue lors de votre commande et l'adresse e-mail utilisée.",
          "Enter the reference you received when ordering and the email address you used.",
        )}
      </p>
      <div className="mt-8">
        <FormulaireRecherche />
      </div>
    </div>
  );
}
