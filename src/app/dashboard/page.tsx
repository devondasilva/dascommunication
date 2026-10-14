import Link from "next/link";
import { redirect } from "next/navigation";
import { exigerEquipe } from "@/lib/auth";
import { ArrowRight, Banknote, CircleDashed, Inbox, MessageSquareDiff, type LucideIcon } from "lucide-react";
import { EntetePage } from "@/components/dashboard/entete-page";
import { GraphiqueBarres } from "@/components/dashboard/graphique-barres";
import { TableauCommandes } from "@/components/dashboard/tableau-commandes";
import { Badge, Carte, EtatVide } from "@/components/ui";
import { STATUTS_COMMANDE } from "@/db/schema";
import { STATUT_COMMANDE } from "@/lib/constantes";
import { dernieresCommandes, statistiques } from "@/lib/donnees";
import { formaterMontant, formaterNombre } from "@/lib/format";

export const metadata = { title: "Vue d'ensemble" };

function Indicateur({
  titre,
  valeur,
  detail,
  icone: Icone,
  href,
}: {
  titre: string;
  valeur: string;
  detail?: string;
  icone: LucideIcon;
  href?: string;
}) {
  const corps = (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-encre-muette">{titre}</p>
        <Icone aria-hidden className="size-4 text-encre-muette" />
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums text-encre">{valeur}</p>
      {detail && <p className="mt-1 text-xs text-encre-muette">{detail}</p>}
    </>
  );
  return href ? (
    <Link href={href} className="block rounded-xl bg-white p-5 ring-1 ring-bordure transition hover:ring-encre/25">
      {corps}
    </Link>
  ) : (
    <Carte className="p-5">{corps}</Carte>
  );
}

export default async function VueEnsemble() {
  const c = await exigerEquipe();
  // Les rôles sans vue d'ensemble arrivent directement sur leurs commandes
  if (!c.peut("dashboard.voir")) redirect(c.peut("commandes.voir") ? "/dashboard/commandes" : "/dashboard/profil");
  const finances = c.peut("finances.voir");
  const [stats, recentes] = await Promise.all([statistiques(), dernieresCommandes()]);
  const enCours = (stats.compte.en_cours ?? 0) + (stats.compte.en_revision ?? 0);
  const maxService = Math.max(1, ...stats.topServices.map((s) => s.n));

  return (
    <>
      <EntetePage titre="Vue d'ensemble" description="L'activité de l'agence en un coup d'œil." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Indicateur
          titre="Nouvelles commandes"
          valeur={formaterNombre(stats.compte.nouvelle ?? 0)}
          detail="À prendre en charge"
          icone={Inbox}
          href="/dashboard/commandes?statut=nouvelle"
        />
        <Indicateur
          titre="Projets en cours"
          valeur={formaterNombre(enCours)}
          detail={finances ? `${formaterMontant(stats.montantEnCours)} en production` : "En production ou en révision"}
          icone={CircleDashed}
          href="/dashboard/commandes?statut=en_cours"
        />
        <Indicateur
          titre="Modifications à traiter"
          valeur={formaterNombre(stats.modificationsEnAttente)}
          detail="Demandes clients en attente"
          icone={MessageSquareDiff}
          href="/dashboard/modifications?statut=en_attente"
        />
        {finances && (<Indicateur
          titre="Chiffre d'affaires du mois"
          valeur={formaterMontant(stats.caMois)}
          detail={`${formaterMontant(stats.caTotal)} livrés au total`}
          icone={Banknote}
        />
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] [&>*]:min-w-0">
        <Carte className="p-5">
          <h2 className="text-sm font-medium text-encre">Commandes reçues · 6 derniers mois</h2>
          <div className="mt-6">
            <GraphiqueBarres donnees={stats.parMois} />
          </div>
        </Carte>

        <Carte className="p-5">
          <h2 className="text-sm font-medium text-encre">Répartition par statut</h2>
          <ul className="mt-4 divide-y divide-bordure">
            {STATUTS_COMMANDE.map((s) => (
              <li key={s}>
                <Link
                  href={`/dashboard/commandes?statut=${s}`}
                  className="flex items-center justify-between py-2.5 text-sm hover:text-encre"
                >
                  <Badge ton={STATUT_COMMANDE[s].ton}>{STATUT_COMMANDE[s].libelle}</Badge>
                  <span className="font-medium tabular-nums text-encre">{stats.compte[s] ?? 0}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-bordure pt-3 text-xs text-encre-muette">
            {formaterNombre(stats.total)} commandes au total
          </p>
        </Carte>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] [&>*]:min-w-0">
        <Carte className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-encre">Dernières commandes</h2>
            <Link
              href="/dashboard/commandes"
              className="inline-flex items-center gap-1 text-xs font-medium text-marque-texte hover:underline"
            >
              Tout voir <ArrowRight aria-hidden className="size-3.5" />
            </Link>
          </div>
          <div className="mt-3">
            {recentes.length ? (
              <TableauCommandes commandes={recentes} compact montants={finances} />
            ) : (
              <EtatVide titre="Aucune commande pour l'instant" texte="Les commandes passées sur le site apparaîtront ici." />
            )}
          </div>
        </Carte>

        <Carte className="p-5">
          <h2 className="text-sm font-medium text-encre">Services les plus demandés</h2>
          {stats.topServices.length ? (
            <ol className="mt-4 space-y-3.5">
              {stats.topServices.map((s) => (
                <li key={s.nom}>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="truncate text-encre">{s.nom}</span>
                    <span className="tabular-nums text-encre-muette">{s.n}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-fond" aria-hidden>
                    <div className="h-full rounded-full bg-marque-fonce" style={{ width: `${(s.n / maxService) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <EtatVide titre="Pas encore de données" />
          )}
        </Carte>
      </div>
    </>
  );
}
