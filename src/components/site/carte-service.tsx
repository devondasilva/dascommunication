import Link from "next/link";
import {
  Check,
  Clapperboard,
  Clock,
  Code2,
  Megaphone,
  PenTool,
  Search,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { Service } from "@/db/schema";
import { texteService } from "@/i18n/contenu";
import { categorieService } from "@/i18n/libelles";
import { i18n } from "@/i18n/serveur";
import type { CategorieService } from "@/lib/enums";
import { cx } from "@/components/ui";

export const ICONES_CATEGORIE: Record<CategorieService, LucideIcon> = {
  marketing: Megaphone,
  design: PenTool,
  seo: Search,
  developpement: Code2,
  evenementiel: Trophy,
  contenu: Clapperboard,
};

/**
 * Carte de service : rectangle aux angles discrets, prix mis en avant,
 * deux actions claires (commander directement ou voir le détail).
 */
export async function CarteService({
  service,
  populaire = false,
  afficherDomaine = true,
}: {
  service: Service;
  populaire?: boolean;
  /** Masqué quand les cartes sont déjà regroupées sous le titre du domaine */
  afficherDomaine?: boolean;
}) {
  const { langue, tr, l, prix, partiesPrix } = await i18n();
  const Icone = ICONES_CATEGORIE[service.categorie];
  const texte = texteService(service, langue);
  const { nombre, symbole, symboleAvant } = partiesPrix(prix(service));
  const livrables = texte.livrables.slice(0, 3);

  return (
    <article
      className={cx(
        "group relative flex flex-col rounded-md border bg-white transition duration-300 ease-sortie",
        "hover:-translate-y-1 hover:border-marque hover:shadow-[0_24px_48px_-24px_rgb(28_32_102/0.35)]",
        populaire ? "border-encre" : "border-bordure",
      )}
    >
      {/* Liseré teal qui se déploie au survol */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 rounded-t-md bg-marque transition-transform duration-500 ease-sortie group-hover:scale-x-100"
      />

      {populaire && (
        <span className="absolute -top-3 right-5 rounded-sm bg-encre px-2.5 py-1 text-xs font-medium text-white">
          {tr("Le plus demandé", "Most popular")}
        </span>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-md bg-marque-pale text-marque-texte transition-colors group-hover:bg-marque group-hover:text-nuit">
            <Icone aria-hidden className="size-5" strokeWidth={1.75} />
          </span>
          {afficherDomaine && <span className="text-sm text-encre-muette">{categorieService(service.categorie, langue)}</span>}
        </div>

        <h3 className="mt-5 text-xl leading-snug font-semibold text-encre">
          <Link href={l(`/services/${service.slug}`)} className="hover:underline hover:decoration-marque hover:decoration-2 hover:underline-offset-4">
            {texte.nom}
          </Link>
        </h3>
        <p className="mt-2 leading-relaxed text-encre-douce">{texte.resume}</p>

        {livrables.length > 0 && (
          <ul className="mt-5 space-y-2 text-sm text-encre-douce">
            {livrables.map((livrable) => (
              <li key={livrable} className="flex gap-2">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-marque-fonce" strokeWidth={2.5} />
                {livrable}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-bordure bg-fond/70 px-6 pt-5 pb-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-encre-muette">{tr("À partir de", "Starting at")}</p>
            <p className="mt-0.5 flex items-baseline gap-0.5 text-encre">
              {symboleAvant && <span className="self-start pt-0.5 text-lg font-semibold">{symbole}</span>}
              <span className="font-titre text-[2rem] leading-none font-bold tracking-tight tabular-nums">{nombre}</span>
              {!symboleAvant && <span className="ml-0.5 text-sm font-semibold">{symbole}</span>}
            </p>
          </div>
          <p className="flex items-center gap-1 pb-0.5 text-sm text-encre-muette">
            <Clock aria-hidden className="size-4" />
            {service.delaiJours} {tr("jours", "days")}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
          <Link
            href={l(`/commander?service=${service.slug}`)}
            className="flex h-11 items-center justify-center rounded-md bg-marque font-medium text-nuit transition-colors hover:bg-encre hover:text-white"
          >
            {tr("Commander", "Order")}
          </Link>
          <Link
            href={l(`/services/${service.slug}`)}
            className="flex h-11 items-center justify-center rounded-md px-4 font-medium text-encre ring-1 ring-encre/20 transition hover:bg-white hover:ring-encre"
            aria-label={`${tr("Détails :", "Details:")} ${texte.nom}`}
          >
            {tr("Détails", "Details")}
          </Link>
        </div>
      </div>
    </article>
  );
}
