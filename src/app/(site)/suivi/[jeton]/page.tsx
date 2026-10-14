import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Alerte, Badge, Carte, cx } from "@/components/ui";
import { STATUT_COMMANDE, STATUT_MODIFICATION, PRIORITE } from "@/lib/constantes";
import { commandeParJeton } from "@/lib/donnees";
import { formaterDate, formaterDateHeure, formaterMontant } from "@/lib/format";
import { CopierLien } from "./copier-lien";
import { FormulaireModification } from "./formulaire-modification";

export const metadata: Metadata = {
  title: "Suivi de commande",
  robots: { index: false, follow: false },
};

const ETAPES = ["nouvelle", "en_cours", "en_revision", "livree"] as const;

export default async function PageSuiviCommande({ params, searchParams }: PageProps<"/suivi/[jeton]">) {
  const { jeton } = await params;
  const { nouvelle } = await searchParams;
  const cmd = await commandeParJeton(jeton);
  if (!cmd) notFound();

  const statut = STATUT_COMMANDE[cmd.statut];
  const indexEtape = ETAPES.indexOf(cmd.statut as (typeof ETAPES)[number]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16">
      {nouvelle && (
        <Alerte ton="succes" className="mb-8">
          <p className="font-medium">Merci, votre commande est bien enregistrée.</p>
          <p className="mt-1">
            Conservez votre référence <strong className="font-mono">{cmd.reference}</strong> et le lien de cette
            page : ils vous permettent de suivre l&apos;avancement et de demander des modifications.
          </p>
        </Alerte>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="font-mono text-sm text-encre-muette">{cmd.reference}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-encre">{cmd.serviceNom}</h1>
          <p className="mt-2 text-sm text-encre-douce">Commandée le {formaterDate(cmd.creeLe)}</p>
        </div>
        <CopierLien />
      </div>

      {/* Avancement */}
      <Carte className="mt-8 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge ton={statut.ton}>{statut.libelle}</Badge>
          <p className="text-sm text-encre-douce">{statut.description}</p>
        </div>

        {cmd.statut !== "annulee" && (
          <ol className="mt-6 grid grid-cols-4 gap-2" aria-label="Étapes du projet">
            {ETAPES.map((e, i) => {
              const fait = i <= indexEtape;
              return (
                <li key={e} className="flex flex-col gap-2">
                  <span className={cx("h-1.5 rounded-full", fait ? "bg-marque-fonce" : "bg-bordure")} />
                  <span
                    className={cx("flex items-center gap-1 text-xs", fait ? "font-medium text-encre" : "text-encre-muette")}
                  >
                    {fait && <Check aria-hidden className="size-3.5 text-marque-fonce" />}
                    {STATUT_COMMANDE[e].libelle}
                    <span className="sr-only">{fait ? " (atteinte)" : " (à venir)"}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        )}

        <dl className="mt-6 grid gap-4 border-t border-bordure pt-5 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-encre-muette">Client</dt>
            <dd className="mt-0.5 font-medium text-encre">{cmd.entreprise || cmd.clientNom}</dd>
          </div>
          <div>
            <dt className="text-encre-muette">Montant</dt>
            <dd className="mt-0.5 font-medium tabular-nums text-encre">
              {cmd.montant != null ? formaterMontant(cmd.montant) : "Devis en préparation"}
            </dd>
          </div>
          <div>
            <dt className="text-encre-muette">Date souhaitée</dt>
            <dd className="mt-0.5 font-medium text-encre">{formaterDate(cmd.dateSouhaitee)}</dd>
          </div>
        </dl>
      </Carte>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_300px] [&>*]:min-w-0">
        <div className="space-y-8">
          {/* Demandes de modification */}
          <section aria-labelledby="titre-modifs">
            <h2 id="titre-modifs" className="text-lg font-semibold text-encre">
              Demandes de modification
            </h2>

            {cmd.modifications.length > 0 && (
              <ul className="mt-4 space-y-3">
                {cmd.modifications.map((m) => (
                  <li key={m.id}>
                    <Carte className="p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge ton={STATUT_MODIFICATION[m.statut].ton}>{STATUT_MODIFICATION[m.statut].libelle}</Badge>
                        <span className="text-xs text-encre-muette">
                          Priorité {PRIORITE[m.priorite].libelle.toLowerCase()}, le {formaterDate(m.creeLe)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-encre">{m.description}</p>
                      {m.reponse && (
                        <div className="mt-3 rounded-lg bg-fond px-3 py-2.5 text-sm">
                          <p className="text-xs font-medium text-encre-muette">Notre réponse</p>
                          <p className="mt-1 whitespace-pre-line text-encre">{m.reponse}</p>
                        </div>
                      )}
                    </Carte>
                  </li>
                ))}
              </ul>
            )}

            {cmd.statut === "annulee" ? (
              <p className="mt-4 text-sm text-encre-muette">
                Cette commande est annulée : il n&apos;est plus possible de demander de modification.
              </p>
            ) : (
              <Carte className="mt-4 p-5">
                <h3 className="font-medium text-encre">Demander une modification</h3>
                <p className="mt-1 text-sm text-encre-muette">
                  Décrivez précisément ce que vous souhaitez changer. Nous vous répondons ici même.
                </p>
                <div className="mt-4">
                  <FormulaireModification jeton={jeton} />
                </div>
              </Carte>
            )}
          </section>
        </div>

        {/* Historique */}
        <aside aria-labelledby="titre-historique">
          <h2 id="titre-historique" className="text-lg font-semibold text-encre">
            Historique
          </h2>
          <ol className="mt-4 space-y-0 border-l border-bordure">
            {cmd.activites.map((a) => (
              <li key={a.id} className="relative pb-5 pl-5 last:pb-0">
                <span
                  aria-hidden
                  className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-white ring-2 ring-marque-fonce"
                />
                <p className="text-sm text-encre">{a.message}</p>
                <p className="mt-0.5 text-xs text-encre-muette">{formaterDateHeure(a.creeLe)}</p>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
