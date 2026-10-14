import type { MetadataRoute } from "next";
import { REALISATIONS } from "@/data/realisations";
import { SITE } from "@/lib/constantes";
import { servicesActifs } from "@/lib/donnees";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const pages = ["", "/services", "/realisations", "/a-propos", "/contact", "/commander"].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  let services: MetadataRoute.Sitemap = [];
  try {
    services = (await servicesActifs()).map((s) => ({ url: `${base}/services/${s.slug}`, priority: 0.7 }));
  } catch {
    // Base indisponible : le sitemap reste valide sans les fiches services
  }

  const realisations = REALISATIONS.map((r) => ({ url: `${base}/realisations/${r.slug}`, priority: 0.6 }));

  return [...pages, ...services, ...realisations];
}
