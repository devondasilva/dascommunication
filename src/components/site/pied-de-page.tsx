import Link from "next/link";
import { i18n } from "@/i18n/serveur";
import { SITE } from "@/lib/constantes";
import { parametresSite } from "@/lib/parametres";
import { Logo } from "./logo";
import { Reseaux } from "./reseaux";

export async function PiedDePage() {
  const [p, { tr, l, langue }] = await Promise.all([parametresSite(), i18n()]);
  const presence = langue === "en" ? p.presenceEn || p.presence : p.presence;

  const colonnes = [
    {
      titre: "Services",
      liens: [
        { href: "/services?categorie=marketing", libelle: tr("Marketing digital", "Digital marketing") },
        { href: "/services?categorie=design", libelle: tr("Design graphique", "Graphic design") },
        { href: "/services?categorie=seo", libelle: "SEO" },
        { href: "/services?categorie=developpement", libelle: tr("Web et applications", "Web and apps") },
        { href: "/services?categorie=evenementiel", libelle: tr("Événementiel", "Events") },
      ],
    },
    {
      titre: tr("L'agence", "Agency"),
      liens: [
        { href: "/realisations", libelle: tr("Réalisations", "Work") },
        { href: "/a-propos", libelle: tr("Qui sommes-nous", "About us") },
        { href: "/contact", libelle: "Contact" },
      ],
    },
    {
      titre: "Clients",
      liens: [
        { href: "/commander", libelle: tr("Demander un devis", "Get a quote") },
        { href: "/espace", libelle: tr("Mon espace", "My account") },
        { href: "/suivi", libelle: tr("Suivre une commande", "Track an order") },
      ],
    },
  ];

  return (
    <footer className="bg-nuit text-white/65">
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-10 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo clair />
            <p className="mt-6 max-w-xs leading-relaxed">
              {tr(
                "Agence de communication, de design et de développement.",
                "Communication, design and software agency.",
              )}
              {presence ? ` ${presence}.` : ""}
            </p>
            <a href={`mailto:${p.email}`} className="mt-6 inline-block text-white underline-offset-4 hover:underline">
              {p.email}
            </a>
            {p.telephone && (
              <a href={`tel:${p.telephone.replace(/\s/g, "")}`} className="mt-1 block text-white/80 hover:text-white">
                {p.telephone}
              </a>
            )}
            <div className="mt-6">
              <Reseaux clair liens={p} />
            </div>
          </div>
          {colonnes.map((col) => (
            <div key={col.titre}>
              <p className="font-medium text-white">{col.titre}</p>
              <ul className="mt-4 space-y-2.5">
                {col.liens.map((lien) => (
                  <li key={lien.href}>
                    <Link href={l(lien.href)} className="hover:text-white">
                      {lien.libelle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p
          aria-hidden
          className="mt-20 font-titre text-[clamp(3.5rem,13vw,11rem)] leading-none font-bold tracking-[-0.04em] text-white/[0.07] select-none"
        >
          {tr(SITE.slogan, "Always more creative")}
        </p>

        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.nom}
          </p>
          <div className="flex gap-5">
            {/* Lien classique : le changement de langue recharge toute la page */}
            <a href={langue === "en" ? "/" : "/en"} hrefLang={langue === "en" ? "fr" : "en"} className="hover:text-white">
              {langue === "en" ? "Version française" : "English version"}
            </a>
            {/* Espace équipe en français : lien classique pour recharger toute la page */}
            <a href="/connexion?espace=equipe" className="hover:text-white">
              {tr("Accès équipe", "Team login")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
