import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

/**
 * Vérification rapide avant le rendu (sans accès à la base) :
 * - /dashboard réservé à l'équipe, /espace à tout compte connecté
 * - /connexion redirige un utilisateur déjà connecté
 * Les pages et les Server Actions revérifient tout côté serveur.
 */
const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
  const { pathname, search } = req.nextUrl;
  const session = req.auth;
  const connecte = Boolean(session?.user?.id);
  const equipe = session?.user?.type === "equipe";

  if (pathname.startsWith("/dashboard") && !connecte) {
    const url = new URL("/connexion", req.url);
    url.searchParams.set("espace", "equipe");
    url.searchParams.set("redirection", pathname + search);
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/espace") && !connecte) {
    const url = new URL("/connexion", req.url);
    url.searchParams.set("redirection", pathname + search);
    return NextResponse.redirect(url);
  }
  if (pathname === "/connexion" && connecte) {
    return NextResponse.redirect(new URL(equipe ? "/dashboard" : "/espace", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/espace/:path*", "/connexion"],
};
