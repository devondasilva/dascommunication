"use client";

import { useActionState, useState } from "react";
import { connexionEquipe, type EtatConnexion } from "@/actions/auth";
import { Alerte, Champ } from "@/components/ui";
import { BoutonEnvoi } from "@/components/ui/bouton-envoi";
import { useI18n } from "@/i18n/client";

export function FormulaireEquipe({ redirection, emailInitial }: { redirection?: string; emailInitial?: string }) {
  const { tr } = useI18n();
  const [etat, action] = useActionState<EtatConnexion, FormData>(connexionEquipe, {});
  const deuxiemeEtape = etat.etape === "2fa";
  // Champs contrôlés : conservés entre l'étape « mot de passe » et l'étape « code »
  const [email, setEmail] = useState(emailInitial ?? "");
  const [motDePasse, setMotDePasse] = useState("");

  return (
    <form action={action} className="space-y-4" noValidate>
      {etat.message && <Alerte ton="erreur">{etat.message}</Alerte>}
      {redirection && <input type="hidden" name="redirection" value={redirection} />}

      <div className={deuxiemeEtape ? "hidden" : "space-y-4"}>
        <Champ
          label={tr("E-mail professionnel", "Work email")}
          name="email"
          type="email"
          autoComplete="username"
          requis
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          erreur={etat.erreurs?.email}
        />
        <Champ
          label={tr("Mot de passe", "Password")}
          name="motDePasse"
          type="password"
          autoComplete="current-password"
          requis
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          erreur={etat.erreurs?.motDePasse}
        />
      </div>

      {deuxiemeEtape && (
        <>
          <Alerte ton="info">
            {tr(
              "Ouvrez votre application d'authentification et saisissez le code à 6 chiffres affiché pour DAS Communication.",
              "Open your authenticator app and enter the 6-digit code shown for DAS Communication.",
            )}
          </Alerte>
          <Champ
            label={tr("Code de vérification", "Verification code")}
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            autoFocus
            requis
            className="text-center font-mono text-lg tracking-[0.4em]"
          />
        </>
      )}

      <BoutonEnvoi className="w-full" taille="lg" enCours={tr("Connexion…", "Signing in…")}>
        {deuxiemeEtape ? tr("Vérifier et me connecter", "Verify and sign in") : tr("Me connecter", "Sign in")}
      </BoutonEnvoi>
    </form>
  );
}
