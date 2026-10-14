import Link from "next/link";
import { MessageSquareDiff } from "lucide-react";
import { Badge } from "@/components/ui";
import type { Commande, Modification } from "@/db/schema";
import { STATUT_COMMANDE } from "@/lib/constantes";
import { formaterMontant, formaterRelatif } from "@/lib/format";

type Ligne = Commande & { modifications?: Pick<Modification, "id" | "statut">[] };

export function TableauCommandes({
  commandes,
  compact = false,
  montants = true,
}: {
  commandes: Ligne[];
  compact?: boolean;
  /** Afficher les montants (permission finances.voir) */
  montants?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-bordure text-xs text-encre-muette">
          <tr>
            <th scope="col" className="py-2.5 pr-4 font-medium">Commande</th>
            <th scope="col" className="py-2.5 pr-4 font-medium">Client</th>
            {!compact && <th scope="col" className="hidden py-2.5 pr-4 font-medium md:table-cell">Service</th>}
            <th scope="col" className="py-2.5 pr-4 font-medium">Statut</th>
            {montants && <th scope="col" className="hidden py-2.5 pr-4 text-right font-medium sm:table-cell">Montant</th>}
            <th scope="col" className="hidden py-2.5 text-right font-medium sm:table-cell">Reçue</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-bordure">
          {commandes.map((c) => {
            const modifsOuvertes =
              c.modifications?.filter((m) => m.statut === "en_attente" || m.statut === "en_cours").length ?? 0;
            return (
              <tr key={c.id} className="group relative hover:bg-fond/70">
                <td className="py-3 pr-4">
                  <Link
                    href={`/dashboard/commandes/${c.id}`}
                    className="font-mono text-xs font-medium text-encre after:absolute after:inset-0 group-hover:underline"
                  >
                    {c.reference}
                  </Link>
                  {compact && <p className="mt-0.5 truncate text-xs text-encre-muette">{c.serviceNom}</p>}
                </td>
                <td className="py-3 pr-4">
                  <p className="font-medium text-encre">{c.clientNom}</p>
                  {c.entreprise && <p className="text-xs text-encre-muette">{c.entreprise}</p>}
                </td>
                {!compact && (
                  <td className="hidden py-3 pr-4 text-encre-douce md:table-cell">
                    <span className="line-clamp-1">{c.serviceNom}</span>
                  </td>
                )}
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <Badge ton={STATUT_COMMANDE[c.statut].ton}>{STATUT_COMMANDE[c.statut].libelle}</Badge>
                    {modifsOuvertes > 0 && (
                      <span
                        className="inline-flex items-center gap-0.5 text-xs text-amber-800"
                        title={`${modifsOuvertes} modification(s) à traiter`}
                      >
                        <MessageSquareDiff aria-hidden className="size-3.5" />
                        {modifsOuvertes}
                        <span className="sr-only"> modification(s) à traiter</span>
                      </span>
                    )}
                  </div>
                </td>
                {montants && (
                  <td className="hidden py-3 pr-4 text-right tabular-nums text-encre sm:table-cell">{formaterMontant(c.montant, c.devise)}</td>
                )}
                <td className="hidden py-3 text-right text-xs whitespace-nowrap text-encre-muette sm:table-cell">
                  {formaterRelatif(c.creeLe)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
