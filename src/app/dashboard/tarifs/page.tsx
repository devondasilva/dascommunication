import { EntetePage } from "@/components/dashboard/entete-page";
import { exigerEquipe } from "@/lib/auth";
import { LIBELLES_CATEGORIE, SITE } from "@/lib/constantes";
import { tousLesServices } from "@/lib/donnees";
import { CATEGORIES_SERVICE } from "@/lib/enums";
import { TableauTarifs } from "./tableau-tarifs";

export const metadata = { title: "Tarifs" };

export default async function PageTarifs() {
  await exigerEquipe("services.gerer");
  const services = await tousLesServices();
  const groupes = CATEGORIES_SERVICE.map((c) => ({
    titre: LIBELLES_CATEGORIE[c],
    lignes: services
      .filter((s) => s.categorie === c)
      .map((s) => ({ id: s.id, nom: s.nom, prix: s.prixDepart, delai: s.delaiJours, actif: s.actif })),
  })).filter((g) => g.lignes.length > 0);

  return (
    <>
      <EntetePage
        titre="Tarifs"
        description={`Mettez à jour les prix de départ (en ${SITE.devise === "XOF" ? "F CFA" : SITE.devise}) et les délais de tous vos services, puis enregistrez une seule fois.`}
      />
      <TableauTarifs groupes={groupes} />
    </>
  );
}
