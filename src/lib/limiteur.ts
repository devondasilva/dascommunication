/**
 * Limiteur de tentatives de connexion, en mémoire (par instance).
 * 5 échecs en 15 minutes bloquent l'adresse pendant 15 minutes.
 * En production à fort trafic, remplacez-le par un stockage partagé (Redis / Upstash).
 */
const FENETRE_MS = 15 * 60 * 1000;
const MAX_ECHECS = 5;

const echecs = new Map<string, { n: number; depuis: number }>();

export function estBloque(cle: string) {
  const e = echecs.get(cle);
  if (!e) return false;
  if (Date.now() - e.depuis > FENETRE_MS) {
    echecs.delete(cle);
    return false;
  }
  return e.n >= MAX_ECHECS;
}

export function enregistrerEchec(cle: string) {
  const e = echecs.get(cle);
  if (!e || Date.now() - e.depuis > FENETRE_MS) echecs.set(cle, { n: 1, depuis: Date.now() });
  else e.n++;
}

export function reinitialiserEchecs(cle: string) {
  echecs.delete(cle);
}
