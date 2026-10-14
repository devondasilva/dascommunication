import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/instrument-sans/wdth.css";
import { BandeauDemo } from "@/components/bandeau-demo";
import { FournisseurI18n } from "@/i18n/client";
import { deviseRequete, langueRequete } from "@/i18n/serveur";
import { SITE } from "@/lib/constantes";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const en = (await langueRequete()) === "en";
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: en
        ? `${SITE.nom} — Communication, design and digital agency`
        : `${SITE.nom} — Agence de communication, design et digital`,
      template: `%s · ${SITE.nom}`,
    },
    description: en
      ? "Digital marketing, graphic design, SEO, websites and apps, event communication. Request a quote online and track your project from your client area."
      : "Marketing digital, design graphique, SEO, sites et applications, communication événementielle. Demandez un devis en ligne et suivez votre projet depuis votre espace client.",
    openGraph: {
      type: "website",
      locale: en ? "en_US" : "fr_FR",
      alternateLocale: en ? "fr_FR" : "en_US",
      siteName: SITE.nom,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#1c2066",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [langue, devise] = await Promise.all([langueRequete(), deviseRequete()]);
  return (
    <html lang={langue}>
      <body className="min-h-dvh">
        <FournisseurI18n langue={langue} devise={devise}>
          <BandeauDemo />
          {children}
        </FournisseurI18n>
      </body>
    </html>
  );
}
