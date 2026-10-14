import { randomBytes, scrypt as scryptCb, timingSafeEqual, type ScryptOptions } from "node:crypto";

/**
 * Hachage des mots de passe avec scrypt (inclus dans Node.js, aucune dépendance).
 * Format stocké : scrypt$N$r$p$sel$empreinte (base64url)
 */

const N = 16384;
const R = 8;
const P = 1;
const LONGUEUR = 64;

function scrypt(motDePasse: string, sel: Buffer, options: ScryptOptions): Promise<Buffer> {
  return new Promise((ok, ko) =>
    scryptCb(motDePasse.normalize("NFKC"), sel, LONGUEUR, options, (err, cle) => (err ? ko(err) : ok(cle))),
  );
}

export async function hacherMotDePasse(motDePasse: string) {
  const sel = randomBytes(16);
  const empreinte = await scrypt(motDePasse, sel, { N, r: R, p: P });
  return ["scrypt", N, R, P, sel.toString("base64url"), empreinte.toString("base64url")].join("$");
}

export async function verifierMotDePasse(motDePasse: string, stocke: string | null | undefined) {
  if (!stocke) {
    // Calcul factice pour garder un temps de réponse constant
    await scrypt(motDePasse, randomBytes(16), { N, r: R, p: P });
    return false;
  }
  const [algo, n, r, p, sel, empreinte] = stocke.split("$");
  if (algo !== "scrypt" || !sel || !empreinte) return false;
  const attendue = Buffer.from(empreinte, "base64url");
  const calculee = await scrypt(motDePasse, Buffer.from(sel, "base64url"), {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });
  return attendue.length === calculee.length && timingSafeEqual(attendue, calculee);
}

/** Règles minimales pour l'équipe : 10 caractères, une lettre et un chiffre. */
export function motDePasseValide(motDePasse: string) {
  return motDePasse.length >= 10 && /[A-Za-zÀ-ÿ]/.test(motDePasse) && /\d/.test(motDePasse);
}
