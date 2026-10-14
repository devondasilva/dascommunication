import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constantes";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/dashboard", "/connexion", "/suivi/"] },
    sitemap: `${SITE.url.replace(/\/$/, "")}/sitemap.xml`,
  };
}
