import Link from "next/link";
import { MODE_DEMO } from "@/lib/config";

/** Rappel visible en mode démo (aucune base PostgreSQL configurée). */
export function BandeauDemo() {
  if (!MODE_DEMO) return null;
  return (
    <div className="bg-nuit px-4 py-2 text-center text-xs text-white/80">
      Version de démonstration : les données sont fictives et peuvent être réinitialisées.{" "}
      <Link href="/connexion?espace=equipe" className="font-medium text-marque underline-offset-2 hover:underline">
        Comptes de test
      </Link>
    </div>
  );
}
