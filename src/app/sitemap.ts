import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constantes";
import { realisationsPubliees, servicesActifs } from "@/lib/donnees";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const pages = ["", "/services", "/realisations", "/a-propos", "/contact", "/commander"].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  let services: MetadataRoute.Sitemap = [];
  let realisations: MetadataRoute.Sitemap = [];
  try {
    services = (await servicesActifs()).map((s) => ({ url: `${base}/services/${s.slug}`, priority: 0.7 }));
    realisations = (await realisationsPubliees()).map((r) => ({
      url: `${base}/realisations/${r.slug}`,
      lastModified: r.majLe,
      priority: 0.6,
    }));
  } catch {
    // Base indisponible : le sitemap reste valide avec les pages principales
  }

  return [...pages, ...services, ...realisations];
}
