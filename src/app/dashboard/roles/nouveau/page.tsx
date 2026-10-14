import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EntetePage } from "@/components/dashboard/entete-page";
import { FormulaireRole } from "@/components/dashboard/formulaire-role";
import { Carte } from "@/components/ui";
import { exigerEquipe } from "@/lib/auth";

export const metadata = { title: "Nouveau rôle" };

export default async function PageNouveauRole() {
  await exigerEquipe("roles.gerer");
  return (
    <div className="max-w-4xl">
      <Link href="/dashboard/roles" className="inline-flex items-center gap-1.5 text-sm text-encre-muette hover:text-encre">
        <ArrowLeft aria-hidden className="size-4" /> Rôles et accès
      </Link>
      <div className="mt-4">
        <EntetePage titre="Nouveau rôle" description="Cochez uniquement les accès nécessaires au métier concerné." />
      </div>
      <Carte className="p-6">
        <FormulaireRole />
      </Carte>
    </div>
  );
}
