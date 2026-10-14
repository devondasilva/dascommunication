import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EntetePage } from "@/components/dashboard/entete-page";
import { FormulaireRealisation } from "@/components/dashboard/formulaire-realisation";
import { Carte } from "@/components/ui";
import { exigerEquipe } from "@/lib/auth";
import { CATEGORIES_REALISATION, type CategorieRealisation } from "@/lib/enums";

export const metadata = { title: "Nouvelle réalisation" };

export default async function PageNouvelleRealisation({ searchParams }: PageProps<"/dashboard/realisations/nouveau">) {
  await exigerEquipe("realisations.gerer");
  const { categorie } = await searchParams;
  const initiale = CATEGORIES_REALISATION.includes(categorie as CategorieRealisation)
    ? (categorie as CategorieRealisation)
    : undefined;

  return (
    <div className="max-w-3xl">
      <Link href="/dashboard/realisations" className="inline-flex items-center gap-1.5 text-sm text-encre-muette hover:text-encre">
        <ArrowLeft aria-hidden className="size-4" /> Réalisations
      </Link>
      <div className="mt-4">
        <EntetePage
          titre="Nouvelle réalisation"
          description="Renseignez les informations, puis ajoutez les visuels à l'étape suivante."
        />
      </div>
      <Carte className="p-6">
        <FormulaireRealisation categorieInitiale={initiale} />
      </Carte>
    </div>
  );
}
