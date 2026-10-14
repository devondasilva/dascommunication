import { SITE } from "./constantes";

const fmtMontant = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: SITE.devise,
  maximumFractionDigits: 0,
});

const fmtNombre = new Intl.NumberFormat("fr-FR");

const fmtDate = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const fmtDateHeure = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const fmtRelatif = new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" });

export const formaterMontant = (v: number | null | undefined) =>
  v == null ? "—" : fmtMontant.format(v);

export const formaterNombre = (v: number) => fmtNombre.format(v);

export const formaterDate = (d: Date | string | null | undefined) =>
  d ? fmtDate.format(typeof d === "string" ? new Date(d) : d) : "—";

export const formaterDateHeure = (d: Date) => fmtDateHeure.format(d);

/** « il y a 3 jours », « hier », « à l'instant »… */
export function formaterRelatif(d: Date) {
  const secondes = Math.round((d.getTime() - Date.now()) / 1000);
  const abs = Math.abs(secondes);
  if (abs < 60) return "à l'instant";
  if (abs < 3600) return fmtRelatif.format(Math.round(secondes / 60), "minute");
  if (abs < 86_400) return fmtRelatif.format(Math.round(secondes / 3600), "hour");
  if (abs < 86_400 * 30) return fmtRelatif.format(Math.round(secondes / 86_400), "day");
  return formaterDate(d);
}

export const pluriel = (n: number, singulier: string, plurielMot = `${singulier}s`) =>
  `${formaterNombre(n)} ${n > 1 ? plurielMot : singulier}`;
