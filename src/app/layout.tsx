import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/instrument-sans/wdth.css";
import { BandeauDemo } from "@/components/bandeau-demo";
import { SITE } from "@/lib/constantes";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.nom} — Agence de communication, design et digital`,
    template: `%s · ${SITE.nom}`,
  },
  description:
    "Marketing digital, design graphique, SEO, sites et applications, communication événementielle. Demandez un devis en ligne et suivez votre projet depuis votre espace client.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE.nom,
  },
};

export const viewport: Viewport = {
  themeColor: "#1c2066",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="min-h-dvh">
        <BandeauDemo />
        {children}
      </body>
    </html>
  );
}
