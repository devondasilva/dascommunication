import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Mail, Phone, Trash2 } from "lucide-react";
import { supprimerCommande } from "@/actions/admin";
import { FormulaireReponseModification } from "@/components/dashboard/formulaire-reponse-modification";
import { Badge, Carte } from "@/components/ui";
import { BoutonConfirmation } from "@/components/ui/bouton-envoi";
import { PRIORITE, STATUT_COMMANDE, STATUT_MODIFICATION } from "@/lib/constantes";
import { exigerEquipe } from "@/lib/auth";
import { commandeDetail } from "@/lib/donnees";
import { formaterDate, formaterDateHeure } from "@/lib/format";
import { FormulaireCommandeAdmin } from "./formulaire-commande-admin";

export async function generateMetadata({ params }: PageProps<"/dashboard/commandes/[id]">) {
  const { id } = await params;
  return { title: `Commande #${id}` };
}

export default async function PageCommande({ params }: PageProps<"/dashboard/commandes/[id]">) {
  const c = await exigerEquipe("commandes.voir");
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const cmd = await commandeDetail(id);
  if (!cmd) notFound();

  const statut = STATUT_COMMANDE[cmd.statut];

  return (
    <>
      <Link
        href="/dashboard/commandes"
        className="inline-flex items-center gap-1.5 text-sm text-encre-muette hover:text-encre"
      >
        <ArrowLeft aria-hidden className="size-4" /> Commandes
      </Link>

      <div className="mt-4 mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-xl font-semibold text-encre">{cmd.reference}</h1>
            <Badge ton={statut.ton}>{statut.libelle}</Badge>
            {cmd.langue === "en" && <Badge ton="info">Client anglophone</Badge>}
            {cmd.devise === "USD" && <Badge ton="neutre">Facturation en dollars</Badge>}
          </div>
          <p className="mt-1 text-sm text-encre-muette">
            {cmd.serviceNom} · reçue le {formaterDateHeure(cmd.creeLe)}
          </p>
        </div>
        <Link
          href={cmd.langue === "en" ? `/en/suivi/${cmd.jetonSuivi}` : `/suivi/${cmd.jetonSuivi}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-marque-texte hover:underline"
        >
          Voir l&apos;espace client <ExternalLink aria-hidden className="size-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] [&>*]:min-w-0">
        <div className="space-y-6">
          {/* Brief */}
          <Carte className="p-5">
            <h2 className="text-sm font-medium text-encre">Brief du client</h2>
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-encre-douce">{cmd.brief}</p>
            <dl className="mt-5 grid gap-4 border-t border-bordure pt-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-encre-muette">Budget indiqué</dt>
                <dd className="mt-0.5 text-encre">{cmd.budget || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-encre-muette">Date souhaitée</dt>
                <dd className="mt-0.5 text-encre">{formaterDate(cmd.dateSouhaitee)}</dd>
              </div>
              <div>
                <dt className="text-xs text-encre-muette">Dernière mise à jour</dt>
                <dd className="mt-0.5 text-encre">{formaterDateHeure(cmd.majLe)}</dd>
              </div>
            </dl>
          </Carte>

          {/* Modifications */}
          <section aria-labelledby="titre-modifs">
            <h2 id="titre-modifs" className="text-sm font-medium text-encre">
              Demandes de modification ({cmd.modifications.length})
            </h2>
            {cmd.modifications.length === 0 ? (
              <p className="mt-3 text-sm text-encre-muette">Aucune demande pour cette commande.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {cmd.modifications.map((m) => (
                  <li key={m.id}>
                    <Carte className="p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge ton={STATUT_MODIFICATION[m.statut].ton}>{STATUT_MODIFICATION[m.statut].libelle}</Badge>
                        <Badge ton={PRIORITE[m.priorite].ton} sansIcone>
                          Priorité {PRIORITE[m.priorite].libelle.toLowerCase()}
                        </Badge>
                        <span className="text-xs text-encre-muette">{formaterDateHeure(m.creeLe)}</span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-encre">{m.description}</p>
                      <div className="mt-4 border-t border-bordure pt-4">
                        {c.peut("modifications.gerer") ? (
                          <FormulaireReponseModification modification={m} />
                        ) : (
                          m.reponse && <p className="text-sm text-encre-douce">Réponse : {m.reponse}</p>
                        )}
                      </div>
                    </Carte>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Historique */}
          <Carte className="p-5">
            <h2 className="text-sm font-medium text-encre">Historique</h2>
            <ol className="mt-4 border-l border-bordure">
              {cmd.activites.map((a) => (
                <li key={a.id} className="relative pb-4 pl-5 last:pb-0">
                  <span aria-hidden className="absolute top-1.5 -left-[4.5px] size-2 rounded-full bg-encre-muette" />
                  <p className="text-sm text-encre">{a.message}</p>
                  <p className="text-xs text-encre-muette">{formaterDateHeure(a.creeLe)}</p>
                </li>
              ))}
            </ol>
          </Carte>
        </div>

        <aside className="space-y-6">
          <Carte className="p-5">
            <h2 className="text-sm font-medium text-encre">Client</h2>
            <p className="mt-3 font-medium text-encre">{cmd.clientNom}</p>
            {cmd.entreprise && <p className="text-sm text-encre-muette">{cmd.entreprise}</p>}
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={`mailto:${cmd.clientEmail}?subject=${encodeURIComponent(`Votre commande ${cmd.reference}`)}`} className="inline-flex items-center gap-2 text-marque-texte hover:underline">
                  <Mail aria-hidden className="size-4" /> {cmd.clientEmail}
                </a>
              </li>
              {cmd.clientTelephone && (
                <li>
                  <a href={`tel:${cmd.clientTelephone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-marque-texte hover:underline">
                    <Phone aria-hidden className="size-4" /> {cmd.clientTelephone}
                  </a>
                </li>
              )}
            </ul>
          </Carte>

          <Carte className="p-5">
            <h2 className="text-sm font-medium text-encre">Gestion</h2>
            <div className="mt-4">
              {c.peut("commandes.gerer") ? (
                <FormulaireCommandeAdmin commande={cmd} montants={c.peut("finances.voir")} />
              ) : (
                <p className="text-sm text-encre-muette">Votre rôle permet de consulter cette commande, pas de la modifier.</p>
              )}
            </div>
          </Carte>

          {c.peut("commandes.supprimer") && (
          <form action={supprimerCommande}>
            <input type="hidden" name="id" value={cmd.id} />
            <BoutonConfirmation
              variante="danger"
              taille="sm"
              className="w-full"
              message={`Supprimer définitivement la commande ${cmd.reference} ? Cette action est irréversible.`}
            >
              <Trash2 aria-hidden className="size-4" /> Supprimer la commande
            </BoutonConfirmation>
          </form>
          )}
        </aside>
      </div>
    </>
  );
}
