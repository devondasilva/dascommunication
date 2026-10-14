import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import { ENTETE_LANGUE, langueDuChemin, lienLocal, sansPrefixe } from "@/i18n/commun";

/**
 * Exécuté avant chaque page :
 *
 * 1. Langue — les adresses /en/... servent la version anglaise : le préfixe
 *    est retiré (réécriture interne) et la langue transmise à l'application
 *    dans l'en-tête « x-langue ». Le dashboard reste en français.
 * 2. Accès — /dashboard réservé à l'équipe, /espace à tout compte connecté,
 *    /connexion redirige un utilisateur déjà connecté. Les pages et les
 *    Server Actions revérifient tout côté serveur.
 */
const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
  const { pathname, search } = req.nextUrl;
  const langue = langueDuChemin(pathname);
  const chemin = sansPrefixe(pathname);
  const session = req.auth;
  const connecte = Boolean(session?.user?.id);
  const equipe = session?.user?.type === "equipe";

  // L'espace équipe (connexion et dashboard) n'existe qu'en français
  if (langue === "en" && chemin === "/connexion" && req.nextUrl.searchParams.get("espace") === "equipe") {
    return NextResponse.redirect(new URL(chemin + search, req.url));
  }
  if (chemin.startsWith("/dashboard")) {
    if (langue === "en") return NextResponse.redirect(new URL(chemin + search, req.url));
    if (!connecte) {
      const url = new URL("/connexion", req.url);
      url.searchParams.set("espace", "equipe");
      url.searchParams.set("redirection", chemin + search);
      return NextResponse.redirect(url);
    }
  }
  if (chemin.startsWith("/espace") && !connecte) {
    const url = new URL(lienLocal(langue, "/connexion"), req.url);
    url.searchParams.set("redirection", lienLocal(langue, chemin) + search);
    return NextResponse.redirect(url);
  }
  if (chemin === "/connexion" && connecte) {
    return NextResponse.redirect(new URL(equipe ? "/dashboard" : lienLocal(langue, "/espace"), req.url));
  }

  const entetes = new Headers(req.headers);
  entetes.set(ENTETE_LANGUE, langue);
  if (langue === "en") {
    return NextResponse.rewrite(new URL(chemin + search, req.url), { request: { headers: entetes } });
  }
  return NextResponse.next({ request: { headers: entetes } });
});

export const config = {
  // Toutes les pages, sauf les fichiers statiques, les images et les API
  matcher: ["/((?!api|_next|fichiers/|.*\\..*).*)"],
};
