import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Alerte, Badge, Carte, cx } from "@/components/ui";
import { priorite, statutCommande, statutModification, traduireActivite } from "@/i18n/libelles";
import { i18n } from "@/i18n/serveur";
import { commandeParJeton } from "@/lib/donnees";
import { CopierLien } from "./copier-lien";
import { FormulaireModification } from "./formulaire-modification";

export async function generateMetadata(): Promise<Metadata> {
  const { tr } = await i18n();
  return { title: tr("Suivi de commande", "Order tracking"), robots: { index: false, follow: false } };
}

const ETAPES = ["nouvelle", "en_cours", "en_revision", "livree"] as const;

export default async function PageSuiviCommande({ params, searchParams }: PageProps<"/suivi/[jeton]">) {
  const { jeton } = await params;
  const { nouvelle } = await searchParams;
  const [cmd, { langue, tr, fmtPrix, date, dateHeure }] = await Promise.all([commandeParJeton(jeton), i18n()]);
  if (!cmd) notFound();

  const statut = statutCommande(cmd.statut, langue);
  const indexEtape = ETAPES.indexOf(cmd.statut as (typeof ETAPES)[number]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16">
      {nouvelle && (
        <Alerte ton="succes" className="mb-8">
          <p className="font-medium">{tr("Merci, votre commande est bien enregistrée.", "Thank you, your order has been received.")}</p>
          <p className="mt-1">
            {tr("Conservez votre référence", "Keep your reference")} <strong className="font-mono">{cmd.reference}</strong>{" "}
            {tr(
              "et le lien de cette page : ils vous permettent de suivre l'avancement et de demander des modifications.",
              "and the link to this page: you can use them to follow progress and request changes.",
            )}
          </p>
        </Alerte>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="font-mono text-sm text-encre-muette">{cmd.reference}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-encre">{cmd.serviceNom}</h1>
          <p className="mt-2 text-sm text-encre-douce">
            {tr("Commandée le", "Ordered on")} {date(cmd.creeLe)}
          </p>
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
          <ol className="mt-6 grid grid-cols-4 gap-2" aria-label={tr("Étapes du projet", "Project stages")}>
            {ETAPES.map((e, i) => {
              const fait = i <= indexEtape;
              return (
                <li key={e} className="flex flex-col gap-2">
                  <span className={cx("h-1.5 rounded-full", fait ? "bg-marque-fonce" : "bg-bordure")} />
                  <span
                    className={cx("flex items-center gap-1 text-xs", fait ? "font-medium text-encre" : "text-encre-muette")}
                  >
                    {fait && <Check aria-hidden className="size-3.5 text-marque-fonce" />}
                    {statutCommande(e, langue).libelle}
                    <span className="sr-only">{fait ? tr(" (atteinte)", " (reached)") : tr(" (à venir)", " (upcoming)")}</span>
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
            <dt className="text-encre-muette">{tr("Montant", "Amount")}</dt>
            <dd className="mt-0.5 font-medium tabular-nums text-encre">
              {cmd.montant != null ? fmtPrix(cmd.montant, cmd.devise) : tr("Devis en préparation", "Quote in preparation")}
            </dd>
          </div>
          <div>
            <dt className="text-encre-muette">{tr("Date souhaitée", "Preferred date")}</dt>
            <dd className="mt-0.5 font-medium text-encre">{date(cmd.dateSouhaitee)}</dd>
          </div>
        </dl>
      </Carte>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_300px] [&>*]:min-w-0">
        <div className="space-y-8">
          {/* Demandes de modification */}
          <section aria-labelledby="titre-modifs">
            <h2 id="titre-modifs" className="text-lg font-semibold text-encre">
              {tr("Demandes de modification", "Change requests")}
            </h2>

            {cmd.modifications.length > 0 && (
              <ul className="mt-4 space-y-3">
                {cmd.modifications.map((m) => (
                  <li key={m.id}>
                    <Carte className="p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge ton={statutModification(m.statut, langue).ton}>{statutModification(m.statut, langue).libelle}</Badge>
                        <span className="text-xs text-encre-muette">
                          {tr(
                            `Priorité ${priorite(m.priorite, langue).toLowerCase()}, le ${date(m.creeLe)}`,
                            `${priorite(m.priorite, langue)} priority, ${date(m.creeLe)}`,
                          )}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-encre">{m.description}</p>
                      {m.reponse && (
                        <div className="mt-3 rounded-lg bg-fond px-3 py-2.5 text-sm">
                          <p className="text-xs font-medium text-encre-muette">{tr("Notre réponse", "Our reply")}</p>
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
                {tr(
                  "Cette commande est annulée : il n'est plus possible de demander de modification.",
                  "This order has been cancelled: changes can no longer be requested.",
                )}
              </p>
            ) : (
              <Carte className="mt-4 p-5">
                <h3 className="font-medium text-encre">{tr("Demander une modification", "Request a change")}</h3>
                <p className="mt-1 text-sm text-encre-muette">
                  {tr(
                    "Décrivez précisément ce que vous souhaitez changer. Nous vous répondons ici même.",
                    "Describe exactly what you would like changed. We will reply right here.",
                  )}
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
            {tr("Historique", "History")}
          </h2>
          <ol className="mt-4 space-y-0 border-l border-bordure">
            {cmd.activites.map((a) => (
              <li key={a.id} className="relative pb-5 pl-5 last:pb-0">
                <span
                  aria-hidden
                  className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-white ring-2 ring-marque-fonce"
                />
                <p className="text-sm text-encre">{traduireActivite(a.message, langue)}</p>
                <p className="mt-0.5 text-xs text-encre-muette">{dateHeure(a.creeLe)}</p>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
