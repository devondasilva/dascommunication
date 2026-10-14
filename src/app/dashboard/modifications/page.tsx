import Link from "next/link";
import { EntetePage } from "@/components/dashboard/entete-page";
import { FormulaireReponseModification } from "@/components/dashboard/formulaire-reponse-modification";
import { Badge, Carte, cx, EtatVide } from "@/components/ui";
import { STATUTS_MODIFICATION, type StatutModification } from "@/db/schema";
import { PRIORITE, STATUT_MODIFICATION } from "@/lib/constantes";
import { compteModificationsParStatut, listeModifications } from "@/lib/donnees";
import { formaterRelatif } from "@/lib/format";
import { exigerEquipe } from "@/lib/auth";

export const metadata = { title: "Modifications" };

export default async function PageModifications({ searchParams }: PageProps<"/dashboard/modifications">) {
  await exigerEquipe("modifications.gerer");
  const sp = await searchParams;
  const statut = STATUTS_MODIFICATION.includes(sp.statut as StatutModification)
    ? (sp.statut as StatutModification)
    : undefined;

  const [liste, compte] = await Promise.all([listeModifications(statut), compteModificationsParStatut()]);
  const total = Object.values(compte).reduce((a, n) => a + (n ?? 0), 0);

  return (
    <>
      <EntetePage
        titre="Demandes de modification"
        description="Les ajustements demandés par vos clients depuis leur espace de suivi."
      />

      <nav aria-label="Filtrer par statut" className="flex flex-wrap gap-1.5">
        {[undefined, ...STATUTS_MODIFICATION].map((s) => {
          const actif = s === statut;
          const n = s ? (compte[s] ?? 0) : total;
          return (
            <Link
              key={s ?? "toutes"}
              href={s ? `/dashboard/modifications?statut=${s}` : "/dashboard/modifications"}
              aria-current={actif ? "page" : undefined}
              className={cx(
                "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm transition-colors",
                actif ? "bg-encre text-white" : "bg-fond text-encre-douce hover:text-encre",
              )}
            >
              {s ? STATUT_MODIFICATION[s].libelle : "Toutes"}
              <span className={cx("text-xs tabular-nums", actif ? "text-white/60" : "text-encre-muette")}>{n}</span>
            </Link>
          );
        })}
      </nav>

      {liste.length === 0 ? (
        <Carte className="mt-5">
          <EtatVide titre="Aucune demande" texte="Rien à traiter ici pour le moment." />
        </Carte>
      ) : (
        <ul className="mt-5 space-y-3">
          {liste.map((m) => (
            <li key={m.id}>
              <Carte className="grid grid-cols-1 gap-5 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,380px)] [&>*]:min-w-0">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge ton={STATUT_MODIFICATION[m.statut].ton}>{STATUT_MODIFICATION[m.statut].libelle}</Badge>
                    <Badge ton={PRIORITE[m.priorite].ton} sansIcone>
                      Priorité {PRIORITE[m.priorite].libelle.toLowerCase()}
                    </Badge>
                    <span className="text-xs text-encre-muette">{formaterRelatif(m.creeLe)}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-encre">{m.description}</p>
                  <p className="mt-3 text-xs text-encre-muette">
                    <Link
                      href={`/dashboard/commandes/${m.commande.id}`}
                      className="font-mono font-medium text-marque-texte hover:underline"
                    >
                      {m.commande.reference}
                    </Link>{" "}
                    · {m.commande.entreprise || m.commande.clientNom} · {m.commande.serviceNom}
                  </p>
                </div>
                <div className="md:border-l md:border-bordure md:pl-5">
                  <FormulaireReponseModification modification={m} />
                </div>
              </Carte>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
