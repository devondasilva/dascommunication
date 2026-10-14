import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { supprimerService } from "@/actions/admin";
import { exigerEquipe } from "@/lib/auth";
import { EntetePage } from "@/components/dashboard/entete-page";
import { FormulaireService } from "@/components/dashboard/formulaire-service";
import { Carte } from "@/components/ui";
import { BoutonConfirmation } from "@/components/ui/bouton-envoi";
import { serviceParId } from "@/lib/donnees";

export const metadata = { title: "Modifier le service" };

export default async function PageModifierService({ params }: PageProps<"/dashboard/services/[id]">) {
  await exigerEquipe("services.gerer");
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const service = await serviceParId(id);
  if (!service) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/dashboard/services" className="inline-flex items-center gap-1.5 text-sm text-encre-muette hover:text-encre">
        <ArrowLeft aria-hidden className="size-4" /> Services
      </Link>
      <div className="mt-4">
        <EntetePage titre={service.nom} description="Modifiez les informations affichées sur le site." />
      </div>
      <Carte className="p-6">
        <FormulaireService service={service} />
      </Carte>

      <Carte className="mt-6 flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-encre">Supprimer ce service</p>
          <p className="text-xs text-encre-muette">
            Les commandes existantes sont conservées. Pour le retirer temporairement, masquez-le plutôt.
          </p>
        </div>
        <form action={supprimerService}>
          <input type="hidden" name="id" value={service.id} />
          <BoutonConfirmation variante="danger" taille="sm" message={`Supprimer définitivement « ${service.nom} » ?`}>
            <Trash2 aria-hidden className="size-4" /> Supprimer
          </BoutonConfirmation>
        </form>
      </Carte>
    </div>
  );
}
