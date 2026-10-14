import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { exigerEquipe } from "@/lib/auth";
import { EntetePage } from "@/components/dashboard/entete-page";
import { FormulaireService } from "@/components/dashboard/formulaire-service";
import { Carte } from "@/components/ui";

export const metadata = { title: "Nouveau service" };

export default async function PageNouveauService() {
  await exigerEquipe("services.gerer");
  return (
    <div className="max-w-3xl">
      <Link href="/dashboard/services" className="inline-flex items-center gap-1.5 text-sm text-encre-muette hover:text-encre">
        <ArrowLeft aria-hidden className="size-4" /> Services
      </Link>
      <div className="mt-4">
        <EntetePage titre="Nouveau service" description="Il apparaîtra dans le catalogue dès qu'il est visible." />
      </div>
      <Carte className="p-6">
        <FormulaireService />
      </Carte>
    </div>
  );
}
