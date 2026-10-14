import Link from "next/link";
import { EntetePage } from "@/components/dashboard/entete-page";
import { exigerEquipe } from "@/lib/auth";
import { LIBELLES_CATEGORIE } from "@/lib/constantes";
import { tousLesServices } from "@/lib/donnees";
import { CATEGORIES_SERVICE } from "@/lib/enums";
import { parametresSite, tauxUsd } from "@/lib/parametres";
import { TableauTarifs } from "./tableau-tarifs";

export const metadata = { title: "Tarifs" };

export default async function PageTarifs() {
  const c = await exigerEquipe("services.gerer");
  const [services, p] = await Promise.all([tousLesServices(), parametresSite()]);
  const taux = tauxUsd(p);
  const groupes = CATEGORIES_SERVICE.map((cat) => ({
    titre: LIBELLES_CATEGORIE[cat],
    lignes: services
      .filter((s) => s.categorie === cat)
      .map((s) => ({ id: s.id, nom: s.nom, prix: s.prixDepart, usd: s.prixUsd, delai: s.delaiJours, actif: s.actif })),
  })).filter((g) => g.lignes.length > 0);

  return (
    <>
      <EntetePage
        titre="Tarifs"
        description="Prix de départ en F CFA et en dollars, et délais de tous vos services : modifiez puis enregistrez une seule fois."
      />
      <p className="-mt-4 mb-6 max-w-3xl text-sm text-encre-douce">
        Un prix en dollars laissé vide est calculé automatiquement au taux de{" "}
        <strong className="text-encre">{taux} F CFA pour 1 $</strong>, arrondi.{" "}
        {c.peut("parametres.gerer") && (
          <Link href="/dashboard/parametres#devises" className="font-medium text-marque-texte hover:underline">
            Modifier le taux
          </Link>
        )}
      </p>
      <TableauTarifs groupes={groupes} taux={taux} />
    </>
  );
}
