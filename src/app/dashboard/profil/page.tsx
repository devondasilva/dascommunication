import { ShieldCheck, ShieldOff } from "lucide-react";
import { preparer2fa, secret2faEnAttente } from "@/actions/compte";
import { EntetePage } from "@/components/dashboard/entete-page";
import { Alerte, Badge, Bouton, Carte } from "@/components/ui";
import { exigerEquipe } from "@/lib/auth";
import { qrCode2fa } from "@/lib/deux-facteurs";
import { PERMISSIONS } from "@/lib/permissions";
import { FormulaireMotDePasse, FormulaireActivation2fa, FormulaireDesactivation2fa } from "./formulaires";

export const metadata = { title: "Mon compte" };

export default async function PageProfil({ searchParams }: PageProps<"/dashboard/profil">) {
  const { "2fa": etat2fa } = await searchParams;
  const c = await exigerEquipe();
  const u = c.utilisateur;
  const secretEnAttente = u.a2fa ? null : await secret2faEnAttente();
  const qr = secretEnAttente ? await qrCode2fa(secretEnAttente, u.email) : null;

  return (
    <div className="max-w-4xl">
      <EntetePage titre="Mon compte" description={u.email} />
      {etat2fa === "activee" && u.a2fa && (
        <Alerte ton="succes" className="mb-6">
          Double authentification activée. Le code vous sera demandé à chaque connexion.
        </Alerte>
      )}
      {etat2fa === "desactivee" && !u.a2fa && (
        <Alerte ton="info" className="mb-6">
          Double authentification désactivée.
        </Alerte>
      )}

      <div className="grid gap-6">
        <Carte className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-encre">{u.nom}</p>
              <p className="text-sm text-encre-muette">{c.role?.nom ?? "Sans rôle"}</p>
            </div>
            {u.competences.length > 0 && (
              <ul className="flex flex-wrap gap-1.5" aria-label="Compétences">
                {u.competences.map((comp) => (
                  <li key={comp} className="rounded-md bg-fond px-2 py-0.5 text-xs text-encre-douce">
                    {comp}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <details className="mt-5 border-t border-bordure pt-4">
            <summary className="cursor-pointer text-sm font-medium text-marque-texte select-none hover:underline">
              Voir mes accès ({c.permissions.size})
            </summary>
            <ul className="mt-3 grid gap-1.5 text-sm text-encre-douce sm:grid-cols-2">
              {[...c.permissions].map((p) => (
                <li key={p}>{PERMISSIONS[p].libelle}</li>
              ))}
            </ul>
          </details>
        </Carte>

        <Carte className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-encre">Double authentification</h2>
              <p className="mt-1 max-w-lg text-sm text-encre-douce">
                En plus du mot de passe, un code à 6 chiffres généré par une application (Google Authenticator,
                Microsoft Authenticator, 1Password…) est demandé à chaque connexion.
              </p>
            </div>
            {u.a2fa ? (
              <Badge ton="succes">Activée</Badge>
            ) : (
              <Badge ton="attention">Désactivée</Badge>
            )}
          </div>

          <div className="mt-6">
            {u.a2fa ? (
              <FormulaireDesactivation2fa />
            ) : qr ? (
              <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
                {/* eslint-disable-next-line @next/next/no-img-element -- image générée (data URL) */}
                <img src={qr} alt="QR code à scanner avec votre application d'authentification" width={220} height={220} className="rounded-xl ring-1 ring-bordure" />
                <div className="space-y-4">
                  <ol className="list-decimal space-y-1.5 pl-5 text-sm text-encre-douce">
                    <li>Ouvrez votre application d&apos;authentification.</li>
                    <li>Scannez ce QR code, ou saisissez la clé ci-dessous.</li>
                    <li>Entrez le code à 6 chiffres affiché pour confirmer.</li>
                  </ol>
                  <p className="rounded-lg bg-fond px-3 py-2 font-mono text-xs break-all text-encre">{secretEnAttente}</p>
                  <FormulaireActivation2fa />
                </div>
              </div>
            ) : (
              <form action={preparer2fa}>
                <Bouton type="submit">
                  <ShieldCheck aria-hidden className="size-4" /> Activer la double authentification
                </Bouton>
              </form>
            )}
          </div>
          {!u.a2fa && !qr && (
            <p className="mt-4 flex items-center gap-1.5 text-xs text-encre-muette">
              <ShieldOff aria-hidden className="size-3.5" /> Fortement recommandée pour les comptes ayant accès aux finances ou à l&apos;équipe.
            </p>
          )}
        </Carte>

        <Carte className="p-6">
          <h2 className="text-lg font-semibold text-encre">Mot de passe</h2>
          <div className="mt-5 max-w-md">
            <FormulaireMotDePasse />
          </div>
        </Carte>
      </div>
    </div>
  );
}
