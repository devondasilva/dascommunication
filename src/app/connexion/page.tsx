import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connexionClientDemo, connexionGoogle } from "@/actions/auth";
import { Logo } from "@/components/site/logo";
import { Alerte, cx } from "@/components/ui";
import { COMPTES_DEMO } from "@/db/peupler";
import { GOOGLE_CONFIGURE, MODE_DEMO } from "@/lib/config";
import { FormulaireEquipe } from "./formulaire-equipe";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false, follow: false },
};

const AFFICHES = ["s18", "s16", "s11", "s21"];

function LogoGoogle() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}

export default async function PageConnexion({ searchParams }: PageProps<"/connexion">) {
  const sp = await searchParams;
  const espace = sp.espace === "equipe" ? "equipe" : "client";
  const redirection = typeof sp.redirection === "string" ? sp.redirection : undefined;
  const bienvenue = sp.bienvenue === "1";
  const emailInitial = typeof sp.email === "string" ? sp.email : undefined;
  const erreurOAuth = typeof sp.error === "string" ? sp.error : undefined;

  const onglet = (cle: "client" | "equipe", libelle: string) => {
    const params = new URLSearchParams();
    if (cle === "equipe") params.set("espace", "equipe");
    if (redirection) params.set("redirection", redirection);
    const q = params.toString();
    return (
      <Link
        href={`/connexion${q ? `?${q}` : ""}`}
        aria-current={espace === cle ? "page" : undefined}
        className={cx(
          "flex-1 rounded-lg px-3 py-2 text-center text-sm transition-colors",
          espace === cle ? "bg-white font-medium text-encre shadow-sm" : "text-encre-douce hover:text-encre",
        )}
      >
        {libelle}
      </Link>
    );
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Panneau visuel */}
      <aside className="relative hidden overflow-hidden bg-nuit lg:block" aria-hidden>
        <div className="absolute inset-0 grid grid-cols-2 gap-4 p-6 opacity-90 [transform:rotate(-6deg)_scale(1.25)]">
          {AFFICHES.map((a) => (
            <div key={a} className="relative overflow-hidden rounded-2xl">
              <Image src={`/realisations/${a}.webp`} alt="" fill sizes="25vw" className="object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-nuit via-nuit/70 to-nuit/10" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="font-titre text-5xl leading-[0.95] font-semibold tracking-tight text-white">
            Vos projets,
            <br />
            au même endroit.
          </p>
          <p className="mt-5 max-w-sm text-white/70">
            Devis, commandes, livrables et échanges avec l&apos;équipe DAS COM, depuis votre espace.
          </p>
        </div>
      </aside>

      {/* Formulaire */}
      <main className="flex flex-col px-6 py-10 sm:px-12">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="text-sm text-encre-douce hover:text-encre">
            Retour au site
          </Link>
        </div>

        <div className="mx-auto my-auto w-full max-w-sm py-12">
          <h1 className="text-4xl font-semibold text-encre">Connexion</h1>
          <p className="mt-2 text-encre-douce">
            {espace === "client"
              ? "Accédez à votre espace pour demander un devis et suivre vos projets."
              : "Réservé aux membres de l'équipe DAS COM."}
          </p>

          <nav aria-label="Type de compte" className="mt-8 flex gap-1 rounded-xl bg-fond p-1">
            {onglet("client", "Je suis client")}
            {onglet("equipe", "Équipe DAS COM")}
          </nav>

          <div className="mt-8 space-y-4">
            {bienvenue && (
              <Alerte ton="succes">Votre compte est prêt. Connectez-vous avec le mot de passe que vous venez de choisir.</Alerte>
            )}
            {erreurOAuth && (
              <Alerte ton="erreur">
                {erreurOAuth === "AccessDenied"
                  ? "Ce compte Google n'a pas accès à l'espace (compte désactivé ou e-mail non vérifié)."
                  : "La connexion n'a pas abouti. Réessayez."}
              </Alerte>
            )}

            {espace === "client" ? (
              <>
                <form action={connexionGoogle}>
                  {redirection && <input type="hidden" name="redirection" value={redirection} />}
                  <button
                    type="submit"
                    disabled={!GOOGLE_CONFIGURE}
                    className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white font-medium text-encre ring-1 ring-bordure transition hover:bg-fond hover:ring-encre/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <LogoGoogle />
                    Continuer avec Google
                  </button>
                </form>
                {!GOOGLE_CONFIGURE && (
                  <p className="text-sm text-encre-muette">
                    La connexion Google sera disponible dès que les clés <code className="text-xs">AUTH_GOOGLE_ID</code> et{" "}
                    <code className="text-xs">AUTH_GOOGLE_SECRET</code> seront configurées.
                  </p>
                )}
                {MODE_DEMO && (
                  <form action={connexionClientDemo}>
                    <button
                      type="submit"
                      className="h-12 w-full rounded-xl bg-encre font-medium text-white transition hover:bg-nuit"
                    >
                      Visiter l&apos;espace client de démonstration
                    </button>
                  </form>
                )}
                <p className="pt-2 text-sm text-encre-muette">
                  Pas encore de compte ? Il est créé automatiquement à votre première connexion avec Google.
                </p>
              </>
            ) : (
              <>
                <FormulaireEquipe redirection={redirection} emailInitial={emailInitial} />
                {MODE_DEMO && (
                  <div className="rounded-xl bg-fond p-4 text-sm text-encre-douce">
                    <p className="font-medium text-encre">Comptes de test</p>
                    <dl className="mt-2 space-y-2">
                      <div>
                        <dt>Super-administrateur</dt>
                        <dd className="font-mono text-xs text-encre">
                          {COMPTES_DEMO.admin.email} / {COMPTES_DEMO.admin.motDePasse}
                        </dd>
                      </div>
                      <div>
                        <dt>Designer (accès limité)</dt>
                        <dd className="font-mono text-xs text-encre">
                          {COMPTES_DEMO.designer.email} / {COMPTES_DEMO.designer.motDePasse}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
