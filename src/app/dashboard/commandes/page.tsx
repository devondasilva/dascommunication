import Form from "next/form";
import Link from "next/link";
import { Search } from "lucide-react";
import { EntetePage } from "@/components/dashboard/entete-page";
import { TableauCommandes } from "@/components/dashboard/tableau-commandes";
import { Carte, cx, EtatVide } from "@/components/ui";
import { STATUTS_COMMANDE, type StatutCommande } from "@/db/schema";
import { STATUT_COMMANDE } from "@/lib/constantes";
import { exigerEquipe } from "@/lib/auth";
import { listeCommandes } from "@/lib/donnees";
import { pluriel } from "@/lib/format";

export const metadata = { title: "Commandes" };

export default async function PageCommandes({ searchParams }: PageProps<"/dashboard/commandes">) {
  const c = await exigerEquipe("commandes.voir");
  const sp = await searchParams;
  const statut = STATUTS_COMMANDE.includes(sp.statut as StatutCommande) ? (sp.statut as StatutCommande) : undefined;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";

  const commandes = await listeCommandes({ statut, q: q || undefined });

  const lien = (s?: StatutCommande) => {
    const p = new URLSearchParams();
    if (s) p.set("statut", s);
    if (q) p.set("q", q);
    const chaine = p.toString();
    return `/dashboard/commandes${chaine ? `?${chaine}` : ""}`;
  };

  return (
    <>
      <EntetePage titre="Commandes" description="Toutes les commandes reçues depuis le site." />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Filtrer par statut" className="flex flex-wrap gap-1.5">
          {[undefined, ...STATUTS_COMMANDE].map((s) => {
            const actif = s === statut;
            return (
              <Link
                key={s ?? "toutes"}
                href={lien(s)}
                aria-current={actif ? "page" : undefined}
                className={cx(
                  "h-8 rounded-full px-3 text-sm leading-8 transition-colors",
                  actif ? "bg-encre text-white" : "bg-fond text-encre-douce hover:text-encre",
                )}
              >
                {s ? STATUT_COMMANDE[s].libelle : "Toutes"}
              </Link>
            );
          })}
        </nav>

        <Form action="/dashboard/commandes" className="relative w-full lg:w-72" role="search">
          {statut && <input type="hidden" name="statut" value={statut} />}
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-encre-muette" />
          <label htmlFor="q" className="sr-only">
            Rechercher une commande
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Référence, client, service…"
            className="h-9 w-full rounded-lg bg-white pr-3 pl-9 text-sm ring-1 ring-bordure ring-inset placeholder:text-encre-muette focus:ring-2 focus:ring-marque-fonce focus:outline-none"
          />
        </Form>
      </div>

      <Carte className="mt-5 px-5 pt-2 pb-1">
        {commandes.length ? (
          <TableauCommandes commandes={commandes} montants={c.peut("finances.voir")} />
        ) : (
          <EtatVide
            titre="Aucune commande trouvée"
            texte={q || statut ? "Essayez un autre filtre ou une autre recherche." : "Les commandes passées sur le site apparaîtront ici."}
          />
        )}
      </Carte>
      <p className="mt-3 text-xs text-encre-muette">{pluriel(commandes.length, "commande")}</p>
    </>
  );
}
