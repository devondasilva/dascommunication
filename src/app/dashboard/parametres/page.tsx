import { EntetePage } from "@/components/dashboard/entete-page";
import { exigerEquipe } from "@/lib/auth";
import { parametresSite } from "@/lib/parametres";
import { FormulaireParametres } from "./formulaire-parametres";

export const metadata = { title: "Paramètres du site" };

export default async function PageParametres() {
  await exigerEquipe("parametres.gerer");
  const p = await parametresSite();
  return (
    <div className="max-w-3xl">
      <EntetePage
        titre="Paramètres du site"
        description="Coordonnées, réseaux sociaux, textes de la bannière d'appel au devis (français et anglais) et taux du dollar. Les changements sont visibles immédiatement."
      />
      <FormulaireParametres parametres={p} />
    </div>
  );
}
