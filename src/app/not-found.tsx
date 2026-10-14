import { LienBouton } from "@/components/ui";
import { i18n } from "@/i18n/serveur";

export default async function PageIntrouvable() {
  const { tr, l } = await i18n();
  return (
    <div className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <p className="font-mono text-sm text-encre-muette">{tr("Erreur 404", "Error 404")}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-encre">{tr("Page introuvable", "Page not found")}</h1>
        <p className="mt-3 text-encre-douce">
          {tr(
            "Le lien est peut-être incorrect ou la page n'existe plus.",
            "The link may be wrong or the page no longer exists.",
          )}
        </p>
        <LienBouton href={l("/")} className="mt-8">
          {tr("Retour à l'accueil", "Back to home")}
        </LienBouton>
      </div>
    </div>
  );
}
