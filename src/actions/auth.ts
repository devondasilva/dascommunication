"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { journaliser } from "@/lib/audit";
import { utilisateurConnecte } from "@/lib/auth";
import type { EtatFormulaire } from "@/lib/validations";

/** N'accepte que des redirections internes. */
function cibleSure(cible: unknown, defaut: string) {
  const c = typeof cible === "string" ? cible : "";
  return c.startsWith("/") && !c.startsWith("//") ? c : defaut;
}

const MESSAGES: Record<string, string> = {
  identifiants: "E-mail ou mot de passe incorrect.",
  "2fa_invalide": "Code de vérification incorrect. Saisissez le code à 6 chiffres affiché dans votre application.",
  bloque: "Trop de tentatives. Réessayez dans 15 minutes.",
};

export type EtatConnexion = EtatFormulaire & { etape?: "identifiants" | "2fa" };

export async function connexionEquipe(_: EtatConnexion, formData: FormData): Promise<EtatConnexion> {
  const email = String(formData.get("email") ?? "").trim();
  const motDePasse = String(formData.get("motDePasse") ?? "");
  const code = String(formData.get("code") ?? "");
  const valeurs = { email };

  if (!email || !motDePasse) {
    return {
      etape: "identifiants",
      valeurs,
      erreurs: {
        ...(email ? {} : { email: ["Indiquez votre adresse e-mail"] }),
        ...(motDePasse ? {} : { motDePasse: ["Indiquez votre mot de passe"] }),
      },
    };
  }

  try {
    await signIn("equipe", {
      email,
      motDePasse,
      code,
      redirectTo: cibleSure(formData.get("redirection"), "/dashboard"),
    });
    return {};
  } catch (e) {
    if (e instanceof AuthError) {
      const codeErreur = (e as AuthError & { code?: string }).code ?? "";
      if (codeErreur === "2fa_requis") return { etape: "2fa", valeurs };
      return {
        etape: codeErreur === "2fa_invalide" ? "2fa" : "identifiants",
        valeurs,
        message: MESSAGES[codeErreur] ?? MESSAGES.identifiants,
      };
    }
    throw e; // redirection Next.js en cas de succès
  }
}

export async function connexionGoogle(formData: FormData) {
  await signIn("google", { redirectTo: cibleSure(formData.get("redirection"), "/espace") });
}

export async function connexionClientDemo() {
  await signIn("client-demo", { redirectTo: "/espace" });
}

export async function deconnexion() {
  const c = await utilisateurConnecte();
  if (c) await journaliser({ id: c.utilisateur.id, email: c.utilisateur.email }, "deconnexion");
  await signOut({ redirectTo: "/" });
}
