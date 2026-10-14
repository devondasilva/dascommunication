/**
 * Outils de traduction partagés (serveur et navigateur).
 *
 * Le français est servi à la racine (/services), l'anglais sous /en
 * (/en/services). Le proxy retire le préfixe et transmet la langue à
 * l'application dans l'en-tête « x-langue » : une seule arborescence de
 * pages sert les deux langues.
 */
import { DEVISES, type Devise, type Langue } from "@/lib/enums";

export const ENTETE_LANGUE = "x-langue";
export const COOKIE_DEVISE = "devise";
export const LOCALES: Record<Langue, string> = { fr: "fr-FR", en: "en-US" };

/** Choix d'un texte selon la langue : tr("Bonjour", "Hello"). */
export type Tr = (fr: string, en: string) => string;
export const creerTr =
  (langue: Langue): Tr =>
  (fr, en) =>
    langue === "en" ? en : fr;

/** Lien interne dans la langue voulue : lienLocal("en", "/services") → "/en/services". */
export function lienLocal(langue: Langue, chemin: string) {
  if (langue === "fr" || !chemin.startsWith("/") || chemin.startsWith("//")) return chemin;
  if (chemin === "/") return "/en";
  if (chemin.startsWith("/?") || chemin.startsWith("/#")) return `/en${chemin.slice(1)}`;
  return `/en${chemin}`;
}

/** Chemin sans le préfixe de langue : "/en/services" → "/services". */
export function sansPrefixe(chemin: string) {
  if (chemin === "/en") return "/";
  if (chemin.startsWith("/en/")) return chemin.slice(3);
  return chemin;
}

export const langueDuChemin = (chemin: string): Langue => (chemin === "/en" || chemin.startsWith("/en/") ? "en" : "fr");

export const estDevise = (v: unknown): v is Devise => DEVISES.includes(v as Devise);

/** Devise proposée par défaut : dollars en anglais, F CFA en français. */
export const deviseParDefaut = (langue: Langue): Devise => (langue === "en" ? "USD" : "XOF");

export const LIBELLES_DEVISE: Record<Devise, { court: string; fr: string; en: string }> = {
  XOF: { court: "F CFA", fr: "Francs CFA", en: "CFA francs" },
  USD: { court: "USD", fr: "Dollars US", en: "US dollars" },
};

/* ------------------------------------------------------------------ */
/*  Formats                                                             */
/* ------------------------------------------------------------------ */

const formateurs = new Map<string, Intl.NumberFormat>();
function formateurPrix(devise: Devise, langue: Langue) {
  const cle = `${devise}-${langue}`;
  let f = formateurs.get(cle);
  if (!f) {
    f = new Intl.NumberFormat(LOCALES[langue], { style: "currency", currency: devise, maximumFractionDigits: 0 });
    formateurs.set(cle, f);
  }
  return f;
}

export const formaterPrix = (v: number | null | undefined, devise: Devise, langue: Langue) =>
  v == null ? "—" : formateurPrix(devise, langue).format(v);

/**
 * Nombre et symbole séparés pour une mise en forme soignée :
 * « 250 000 » + « F CFA », ou « $ » + « 420 ».
 */
export function partiesPrix(v: number, devise: Devise, langue: Langue) {
  const parties = formateurPrix(devise, langue).formatToParts(v);
  const iSymbole = parties.findIndex((p) => p.type === "currency");
  const iNombre = parties.findIndex((p) => p.type === "integer");
  const symbole = parties[iSymbole]?.value ?? "";
  const nombre = parties
    .filter((p) => p.type !== "currency" && p.type !== "literal")
    .map((p) => p.value)
    .join("");
  return { nombre, symbole, symboleAvant: iSymbole !== -1 && iSymbole < iNombre };
}

export const formaterDateLangue = (d: Date | string | null | undefined, langue: Langue) =>
  d
    ? new Intl.DateTimeFormat(LOCALES[langue], { day: "numeric", month: "long", year: "numeric" }).format(
        typeof d === "string" ? new Date(d) : d,
      )
    : "—";

export const formaterDateHeureLangue = (d: Date, langue: Langue) =>
  new Intl.DateTimeFormat(LOCALES[langue], {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
