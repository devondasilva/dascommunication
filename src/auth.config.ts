import type { NextAuthConfig } from "next-auth";
import { secretAuth } from "@/lib/config";

/**
 * Configuration partagée, sans accès à la base : utilisée par proxy.ts
 * pour une vérification rapide du jeton. Les fournisseurs et les
 * callbacks qui lisent la base sont ajoutés dans auth.ts.
 */
export const authConfig = {
  secret: secretAuth(),
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/connexion", error: "/connexion" },
  providers: [],
  callbacks: {
    session({ session, token }) {
      if (token.uid) session.user.id = token.uid;
      session.user.type = token.typeCompte;
      return session;
    },
  },
} satisfies NextAuthConfig;
