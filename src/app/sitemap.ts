import type { MetadataRoute } from "next";
import { lienLocal } from "@/i18n/commun";
import { SITE } from "@/lib/constantes";
import { realisationsPubliees, servicesActifs } from "@/lib/donnees";

/** Chaque page existe en français (racine) et en anglais (/en), déclarées l'une à l'autre. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const url = (chemin: string, langue: "fr" | "en") => `${base}${lienLocal(langue, chemin)}`.replace(/\/$/, "") || base;

  const entrees = (chemin: string, options: { priority: number; lastModified?: Date; changeFrequency?: "weekly" }) =>
    (["fr", "en"] as const).map((langue) => ({
      url: url(chemin, langue),
      ...options,
      alternates: { languages: { fr: url(chemin, "fr"), en: url(chemin, "en") } },
    }));

  const pages = ["/", "/services", "/realisations", "/a-propos", "/contact", "/commander"].flatMap((p) =>
    entrees(p, { changeFrequency: "weekly", priority: p === "/" ? 1 : 0.8 }),
  );

  let services: MetadataRoute.Sitemap = [];
  let realisations: MetadataRoute.Sitemap = [];
  try {
    services = (await servicesActifs()).flatMap((s) => entrees(`/services/${s.slug}`, { priority: 0.7 }));
    realisations = (await realisationsPubliees()).flatMap((r) =>
      entrees(`/realisations/${r.slug}`, { priority: 0.6, lastModified: r.majLe }),
    );
  } catch {
    // Base indisponible : le sitemap reste valide avec les pages principales
  }

  return [...pages, ...services, ...realisations];
}
