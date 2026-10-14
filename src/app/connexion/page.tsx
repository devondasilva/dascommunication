import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connexionClientDemo, connexionGoogle } from "@/actions/auth";
import { Logo } from "@/components/site/logo";
import { Alerte, cx } from "@/components/ui";
import { COMPTES_DEMO } from "@/db/peupler";
import { i18n } from "@/i18n/serveur";
import { GOOGLE_CONFIGURE, MODE_DEMO } from "@/lib/config";
import { FormulaireEquipe } from "./formulaire-equipe";

export async function generateMetadata(): Promise<Metadata> {
  const { tr } = await i18n();
  return { title: tr("Connexion", "Sign in"), robots: { index: false, follow: false } };
}

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
  const { tr, l } = await i18n();
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
        href={l(`/connexion${q ? `?${q}` : ""}`)}
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
            {tr("Vos projets,", "Your projects,")}
            <br />
            {tr("au même endroit.", "all in one place.")}
          </p>
          <p className="mt-5 max-w-sm text-white/70">
            {tr(
              "Devis, commandes, livrables et échanges avec l'équipe DAS COM, depuis votre espace.",
              "Quotes, orders, deliverables and conversations with the DAS COM team, from your client area.",
            )}
          </p>
        </div>
      </aside>

      {/* Formulaire */}
      <main className="flex flex-col px-6 py-10 sm:px-12">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href={l("/")} className="text-sm text-encre-douce hover:text-encre">
            {tr("Retour au site", "Back to website")}
          </Link>
        </div>

        <div className="mx-auto my-auto w-full max-w-sm py-12">
          <h1 className="text-4xl font-semibold text-encre">{tr("Connexion", "Sign in")}</h1>
          <p className="mt-2 text-encre-douce">
            {espace === "client"
              ? tr(
                  "Accédez à votre espace pour demander un devis et suivre vos projets.",
                  "Access your client area to request quotes and follow your projects.",
                )
              : tr("Réservé aux membres de l'équipe DAS COM.", "For DAS COM team members only.")}
          </p>

          <nav aria-label={tr("Type de compte", "Account type")} className="mt-8 flex gap-1 rounded-xl bg-fond p-1">
            {onglet("client", tr("Je suis client", "I'm a client"))}
            {onglet("equipe", tr("Équipe DAS COM", "DAS COM team"))}
          </nav>

          <div className="mt-8 space-y-4">
            {bienvenue && (
              <Alerte ton="succes">
                {tr(
                  "Votre compte est prêt. Connectez-vous avec le mot de passe que vous venez de choisir.",
                  "Your account is ready. Sign in with the password you just chose.",
                )}
              </Alerte>
            )}
            {erreurOAuth && (
              <Alerte ton="erreur">
                {erreurOAuth === "AccessDenied"
                  ? tr(
                      "Ce compte Google n'a pas accès à l'espace (compte désactivé ou e-mail non vérifié).",
                      "This Google account cannot access the client area (account disabled or email not verified).",
                    )
                  : tr("La connexion n'a pas abouti. Réessayez.", "Sign-in failed. Please try again.")}
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
                    {tr("Continuer avec Google", "Continue with Google")}
                  </button>
                </form>
                {!GOOGLE_CONFIGURE && (
                  <p className="text-sm text-encre-muette">
                    {tr(
                      "La connexion Google sera disponible dès que les clés AUTH_GOOGLE_ID et AUTH_GOOGLE_SECRET seront configurées.",
                      "Google sign-in will be available once the AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET keys are configured.",
                    )}
                  </p>
                )}
                {MODE_DEMO && (
                  <form action={connexionClientDemo}>
                    <button
                      type="submit"
                      className="h-12 w-full rounded-xl bg-encre font-medium text-white transition hover:bg-nuit"
                    >
                      {tr("Visiter l'espace client de démonstration", "Try the demo client area")}
                    </button>
                  </form>
                )}
                <p className="pt-2 text-sm text-encre-muette">
                  {tr(
                    "Pas encore de compte ? Il est créé automatiquement à votre première connexion avec Google.",
                    "No account yet? It is created automatically the first time you sign in with Google.",
                  )}
                </p>
              </>
            ) : (
              <>
                <FormulaireEquipe redirection={redirection} emailInitial={emailInitial} />
                {MODE_DEMO && (
                  <div className="rounded-xl bg-fond p-4 text-sm text-encre-douce">
                    <p className="font-medium text-encre">{tr("Comptes de test", "Test accounts")}</p>
                    <dl className="mt-2 space-y-2">
                      <div>
                        <dt>{tr("Super-administrateur", "Super administrator")}</dt>
                        <dd className="font-mono text-xs text-encre">
                          {COMPTES_DEMO.admin.email} / {COMPTES_DEMO.admin.motDePasse}
                        </dd>
                      </div>
                      <div>
                        <dt>{tr("Designer (accès limité)", "Designer (limited access)")}</dt>
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
