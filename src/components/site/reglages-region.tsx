"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { cx } from "@/components/ui";
import { choisirDevise } from "@/i18n/actions";
import { useI18n } from "@/i18n/client";
import { lienLocal, sansPrefixe } from "@/i18n/commun";
import type { Devise, Langue } from "@/lib/enums";

const LANGUES: { code: Langue; nom: string; court: string }[] = [
  { code: "fr", nom: "Français", court: "FR" },
  { code: "en", nom: "English", court: "EN" },
];

const DEVISES: { code: Devise; fr: string; en: string; symbole: string }[] = [
  { code: "XOF", fr: "Francs CFA", en: "CFA francs", symbole: "F CFA" },
  { code: "USD", fr: "Dollars US", en: "US dollars", symbole: "$" },
];

/** Choix de la langue (lien vers la même page dans l'autre langue) et de la devise des prix. */
function Choix({ onChoisi }: { onChoisi?: () => void }) {
  const { langue, devise, tr } = useI18n();
  const chemin = sansPrefixe(usePathname());
  const router = useRouter();
  const [enCours, demarrer] = useTransition();

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="text-xs font-medium text-encre-muette">{tr("Langue", "Language")}</legend>
        <ul className="mt-2 grid grid-cols-2 gap-1.5">
          {LANGUES.map((l) => {
            const actif = l.code === langue;
            const href = lienLocal(l.code, chemin);
            return (
              <li key={l.code}>
                {/* Lien classique (pas de navigation client) : toute la page, en-tête compris, change de langue */}
                <a
                  href={href}
                  hrefLang={l.code}
                  lang={l.code}
                  aria-current={actif ? "true" : undefined}
                  onClick={(e) => {
                    // Conserve les filtres de la page (?categorie=…)
                    e.preventDefault();
                    onChoisi?.();
                    window.location.assign(href + window.location.search);
                  }}
                  className={cx(
                    "flex h-10 items-center justify-between gap-2 rounded-md px-3 text-sm whitespace-nowrap transition-colors",
                    actif ? "bg-encre font-medium text-white" : "bg-fond text-encre hover:bg-marque-pale",
                  )}
                >
                  {l.nom}
                  <span className={cx("text-xs", actif ? "text-white/60" : "text-encre-muette")}>{l.court}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <fieldset disabled={enCours}>
        <legend className="text-xs font-medium text-encre-muette">{tr("Afficher les prix en", "Show prices in")}</legend>
        <ul className="mt-2 grid grid-cols-2 gap-1.5">
          {DEVISES.map((d) => {
            const actif = d.code === devise;
            return (
              <li key={d.code}>
                <button
                  type="button"
                  aria-pressed={actif}
                  onClick={() => {
                    if (actif) return;
                    const donnees = new FormData();
                    donnees.set("devise", d.code);
                    demarrer(async () => {
                      await choisirDevise(donnees);
                      router.refresh();
                      onChoisi?.();
                    });
                  }}
                  className={cx(
                    "flex h-10 w-full items-center justify-between gap-2 rounded-md px-3 text-sm whitespace-nowrap transition-colors disabled:opacity-60",
                    actif ? "bg-encre font-medium text-white" : "bg-fond text-encre hover:bg-marque-pale",
                  )}
                >
                  {langue === "en" ? d.en : d.fr}
                  <span className={cx("text-xs", actif ? "text-white/60" : "text-encre-muette")}>{d.symbole}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>
    </div>
  );
}

/** Version compacte de l'en-tête : bouton « FR · F CFA » qui ouvre le panneau. */
export function ReglagesRegion() {
  const { langue, devise, tr } = useI18n();
  const [ouvert, setOuvert] = useState(false);
  const conteneur = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ouvert) return;
    const fermer = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !conteneur.current?.contains(e.target as Node)) setOuvert(false);
    };
    document.addEventListener("mousedown", fermer);
    document.addEventListener("keydown", fermer);
    return () => {
      document.removeEventListener("mousedown", fermer);
      document.removeEventListener("keydown", fermer);
    };
  }, [ouvert]);

  return (
    <div ref={conteneur} className="relative">
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert}
        aria-controls="reglages-region"
        aria-label={tr("Langue et devise", "Language and currency")}
        className="flex h-10 items-center gap-1.5 rounded-md px-3 text-sm text-encre-douce transition-colors hover:bg-fond hover:text-encre"
      >
        <Globe aria-hidden className="size-4" />
        <span className="font-medium text-encre">{langue.toUpperCase()}</span>
        <span aria-hidden className="text-encre-muette">·</span>
        <span>{devise === "USD" ? "USD" : "F CFA"}</span>
        <ChevronDown aria-hidden className={cx("size-3.5 transition-transform", ouvert && "rotate-180")} />
      </button>
      {ouvert && (
        <div
          id="reglages-region"
          className="absolute top-full right-0 z-50 mt-2 w-80 rounded-md bg-white p-4 shadow-[0_24px_48px_-16px_rgb(28_32_102/0.3)] ring-1 ring-bordure"
        >
          <Choix onChoisi={() => setOuvert(false)} />
        </div>
      )}
    </div>
  );
}

/** Version dépliée, pour le menu mobile. */
export function ReglagesRegionListe() {
  return <Choix />;
}
