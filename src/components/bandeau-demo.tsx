import { langueRequete } from "@/i18n/serveur";
import { MODE_DEMO } from "@/lib/config";

/** Rappel visible en mode démo (aucune base PostgreSQL configurée). */
export async function BandeauDemo() {
  if (!MODE_DEMO) return null;
  const en = (await langueRequete()) === "en";
  return (
    <div className="bg-nuit px-4 py-2 text-center text-xs text-white/80">
      {en
        ? "Demo version: data is fictitious and may be reset."
        : "Version de démonstration : les données sont fictives et peuvent être réinitialisées."}{" "}
      {/* Lien classique : l'espace équipe est en français, toute la page doit changer de langue */}
      <a href="/connexion?espace=equipe" className="font-medium text-marque underline-offset-2 hover:underline">
        {en ? "Test accounts" : "Comptes de test"}
      </a>
    </div>
  );
}
