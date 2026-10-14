"use client";

import { useActionState } from "react";
import { activer2fa, changerMotDePasse, desactiver2fa } from "@/actions/compte";
import { Alerte, Champ } from "@/components/ui";
import { BoutonEnvoi } from "@/components/ui/bouton-envoi";
import type { EtatFormulaire } from "@/lib/validations";

function ChampCode({ id, erreur }: { id: string; erreur?: string[] }) {
  return (
    <Champ
      label="Code à 6 chiffres"
      name="code"
      id={id}
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={6}
      requis
      className="max-w-40 text-center font-mono tracking-[0.3em]"
      erreur={erreur}
    />
  );
}

export function FormulaireActivation2fa() {
  const [etat, action] = useActionState<EtatFormulaire, FormData>(activer2fa, {});
  return (
    <form action={action} className="space-y-3" noValidate>
      {etat.message && <Alerte ton={etat.ok ? "succes" : "erreur"}>{etat.message}</Alerte>}
      <ChampCode id="code-activation" erreur={etat.erreurs?.code} />
      <BoutonEnvoi enCours="Vérification…">Confirmer et activer</BoutonEnvoi>
    </form>
  );
}

export function FormulaireDesactivation2fa() {
  const [etat, action] = useActionState<EtatFormulaire, FormData>(desactiver2fa, {});
  return (
    <form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-end" noValidate>
      {etat.message && <Alerte ton={etat.ok ? "succes" : "erreur"}>{etat.message}</Alerte>}
      <ChampCode id="code-desactivation" erreur={etat.erreurs?.code} />
      <BoutonEnvoi variante="danger" enCours="Vérification…">
        Désactiver
      </BoutonEnvoi>
    </form>
  );
}

export function FormulaireMotDePasse() {
  const [etat, action] = useActionState<EtatFormulaire, FormData>(changerMotDePasse, {});
  return (
    <form action={action} className="space-y-4" noValidate>
      {etat.message && <Alerte ton={etat.ok ? "succes" : "erreur"}>{etat.message}</Alerte>}
      <Champ label="Mot de passe actuel" name="actuel" type="password" autoComplete="current-password" requis erreur={etat.erreurs?.actuel} />
      <Champ
        label="Nouveau mot de passe"
        name="nouveau"
        type="password"
        autoComplete="new-password"
        requis
        aide="10 caractères minimum, avec au moins une lettre et un chiffre."
        erreur={etat.erreurs?.nouveau}
      />
      <Champ label="Confirmation" name="confirmation" type="password" autoComplete="new-password" requis erreur={etat.erreurs?.confirmation} />
      <BoutonEnvoi enCours="Enregistrement…">Changer le mot de passe</BoutonEnvoi>
    </form>
  );
}
