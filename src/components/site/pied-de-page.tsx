import Link from "next/link";
import { SITE } from "@/lib/constantes";
import { Logo } from "./logo";
import { Reseaux } from "./reseaux";

const COLONNES = [
  {
    titre: "Services",
    liens: [
      { href: "/services?categorie=marketing", libelle: "Marketing digital" },
      { href: "/services?categorie=design", libelle: "Design graphique" },
      { href: "/services?categorie=seo", libelle: "SEO" },
      { href: "/services?categorie=developpement", libelle: "Web et applications" },
      { href: "/services?categorie=evenementiel", libelle: "Événementiel" },
    ],
  },
  {
    titre: "L'agence",
    liens: [
      { href: "/realisations", libelle: "Réalisations" },
      { href: "/a-propos", libelle: "Qui sommes-nous" },
      { href: "/contact", libelle: "Contact" },
    ],
  },
  {
    titre: "Clients",
    liens: [
      { href: "/commander", libelle: "Demander un devis" },
      { href: "/espace", libelle: "Mon espace" },
      { href: "/suivi", libelle: "Suivre une commande" },
    ],
  },
];

export function PiedDePage() {
  return (
    <footer className="bg-nuit text-white/65">
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-10 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo clair />
            <p className="mt-6 max-w-xs leading-relaxed">
              Agence de communication, de design et de développement. Au Maryland, en Virginie et au Bénin.
            </p>
            <a href={`mailto:${SITE.email}`} className="mt-6 inline-block text-white underline-offset-4 hover:underline">
              {SITE.email}
            </a>
            <div className="mt-6">
              <Reseaux clair />
            </div>
          </div>
          {COLONNES.map((col) => (
            <div key={col.titre}>
              <p className="font-medium text-white">{col.titre}</p>
              <ul className="mt-4 space-y-2.5">
                {col.liens.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-white">
                      {l.libelle}
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
          {SITE.slogan}
        </p>

        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.nom}
          </p>
          <Link href="/connexion?espace=equipe" className="hover:text-white">
            Accès équipe
          </Link>
        </div>
      </div>
    </footer>
  );
}
