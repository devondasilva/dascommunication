/**
 * Configuration d'exécution.
 *
 * Mode démo : actif quand aucune base PostgreSQL n'est configurée
 * (DATABASE_URL absent). L'application utilise alors PGlite — un
 * PostgreSQL embarqué — avec des comptes et données fictifs. Pratique
 * pour développer en local ou prévisualiser une branche sur Vercel.
 * En démo sur Vercel, les données sont temporaires.
 */
export const MODE_DEMO = !process.env.DATABASE_URL;

const SECRET_DEMO = "mode-demo-uniquement-ne-pas-utiliser-en-production-das-com";

export function secretAuth(): string {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (MODE_DEMO) return SECRET_DEMO;
  throw new Error(
    "AUTH_SECRET manquant ou trop court (32 caractères minimum). Générez-le avec : npx auth secret",
  );
}

export const GOOGLE_CONFIGURE = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
