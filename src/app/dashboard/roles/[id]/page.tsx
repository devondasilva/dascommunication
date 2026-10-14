import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { supprimerRole } from "@/actions/equipe";
import { EntetePage } from "@/components/dashboard/entete-page";
import { FormulaireRole } from "@/components/dashboard/formulaire-role";
import { Alerte, Carte } from "@/components/ui";
import { BoutonConfirmation } from "@/components/ui/bouton-envoi";
import { exigerEquipe } from "@/lib/auth";
import { roleParId } from "@/lib/donnees";

export const metadata = { title: "Modifier le rôle" };

export default async function PageRole({ params, searchParams }: PageProps<"/dashboard/roles/[id]">) {
  await exigerEquipe("roles.gerer");
  const id = Number((await params).id);
  const { erreur } = await searchParams;
  if (!Number.isInteger(id)) notFound();
  const role = await roleParId(id);
  if (!role) notFound();

  return (
    <div className="max-w-4xl">
      <Link href="/dashboard/roles" className="inline-flex items-center gap-1.5 text-sm text-encre-muette hover:text-encre">
        <ArrowLeft aria-hidden className="size-4" /> Rôles et accès
      </Link>
      <div className="mt-4">
        <EntetePage titre={role.nom} description={role.description || undefined} />
      </div>
      {erreur === "utilise" && (
        <Alerte ton="erreur" className="mb-6">
          Ce rôle est attribué à des membres de l&apos;équipe. Changez d&apos;abord leur rôle, puis supprimez-le.
        </Alerte>
      )}
      <Carte className="p-6">
        <FormulaireRole role={role} />
      </Carte>

      {!role.systeme && (
        <Carte className="mt-6 flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-encre">Supprimer ce rôle</p>
            <p className="text-xs text-encre-muette">Possible uniquement s&apos;il n&apos;est attribué à personne.</p>
          </div>
          <form action={supprimerRole}>
            <input type="hidden" name="id" value={role.id} />
            <BoutonConfirmation variante="danger" taille="sm" message={`Supprimer le rôle « ${role.nom} » ?`}>
              <Trash2 aria-hidden className="size-4" /> Supprimer
            </BoutonConfirmation>
          </form>
        </Carte>
      )}
    </div>
  );
}
