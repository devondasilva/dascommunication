import { LienBouton } from "@/components/ui";

export default function PageIntrouvable() {
  return (
    <div className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <p className="font-mono text-sm text-encre-muette">Erreur 404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-encre">Page introuvable</h1>
        <p className="mt-3 text-encre-douce">Le lien est peut-être incorrect ou la page n&apos;existe plus.</p>
        <LienBouton href="/" className="mt-8">
          Retour à l&apos;accueil
        </LienBouton>
      </div>
    </div>
  );
}
