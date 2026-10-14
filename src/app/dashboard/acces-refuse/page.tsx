import { ShieldAlert } from "lucide-react";
import { LienBouton } from "@/components/ui";
import { exigerEquipe } from "@/lib/auth";

export const metadata = { title: "Accès refusé" };

export default async function PageAccesRefuse() {
  const c = await exigerEquipe();
  return (
    <div className="grid min-h-[60dvh] place-items-center text-center">
      <div className="max-w-md">
        <ShieldAlert aria-hidden className="mx-auto size-10 text-encre-muette" />
        <h1 className="mt-4 text-2xl font-semibold text-encre">Cette page n&apos;est pas incluse dans votre rôle</h1>
        <p className="mt-2 text-encre-douce">
          Votre rôle actuel est <strong className="text-encre">{c.role?.nom ?? "non défini"}</strong>. Si vous avez
          besoin de cet accès, demandez-le à un administrateur.
        </p>
        <LienBouton href="/dashboard" className="mt-6">
          Revenir au dashboard
        </LienBouton>
      </div>
    </div>
  );
}
