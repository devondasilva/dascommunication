import type { Metadata } from "next";
import { FormulaireRecherche } from "./formulaire-recherche";

export const metadata: Metadata = {
  title: "Suivre ma commande",
  description: "Retrouvez votre commande avec sa référence et votre adresse e-mail.",
};

export default function PageSuivi() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6 md:py-28">
      <h1 className="text-3xl font-semibold tracking-tight text-encre md:text-4xl">Suivre ma commande</h1>
      <p className="mt-3 text-encre-douce">
        Saisissez la référence reçue lors de votre commande et l&apos;adresse e-mail utilisée.
      </p>
      <div className="mt-8">
        <FormulaireRecherche />
      </div>
    </div>
  );
}
