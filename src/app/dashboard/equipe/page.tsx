import { ShieldCheck } from "lucide-react";
import { basculerActivationMembre, revoquerInvitation } from "@/actions/equipe";
import { EntetePage } from "@/components/dashboard/entete-page";
import { Badge, Carte, EtatVide } from "@/components/ui";
import { BoutonConfirmation } from "@/components/ui/bouton-envoi";
import { exigerEquipe } from "@/lib/auth";
import { invitationsEnAttente, membresEquipe, tousLesRoles } from "@/lib/donnees";
import { formaterDate, formaterRelatif } from "@/lib/format";
import { FormulaireInvitation } from "./formulaire-invitation";
import { FormulaireMembre } from "./formulaire-membre";

export const metadata = { title: "Équipe" };

export default async function PageEquipe() {
  const c = await exigerEquipe("equipe.voir");
  const gerer = c.peut("equipe.gerer");
  const [membres, invitations, roles] = await Promise.all([membresEquipe(), invitationsEnAttente(), tousLesRoles()]);
  const optionsRoles = roles
    .filter((r) => !r.systeme || c.role?.systeme)
    .map((r) => ({ id: r.id, nom: r.nom }));

  return (
    <>
      <EntetePage
        titre="Équipe"
        description="Invitez vos collaborateurs et donnez à chacun l'accès dont il a besoin selon son métier."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px] [&>*]:min-w-0">
        <div className="space-y-6">
          <Carte className="overflow-hidden">
            <ul className="divide-y divide-bordure">
              {membres.map((m) => (
                <li key={m.id} className={m.actif ? "p-5" : "bg-fond/60 p-5"}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        aria-hidden
                        className="grid size-10 shrink-0 place-items-center rounded-full bg-encre font-titre text-sm font-semibold text-white"
                      >
                        {(m.nom ?? m.email).slice(0, 1).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-2 font-medium text-encre">
                          {m.nom ?? "Sans nom"}
                          {m.id === c.utilisateur.id && <span className="text-xs font-normal text-encre-muette">(vous)</span>}
                          {!m.actif && <Badge ton="neutre">Désactivé</Badge>}
                        </p>
                        <p className="truncate text-sm text-encre-muette">{m.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {m.role?.systeme && <ShieldCheck aria-hidden className="size-4 text-marque-texte" />}
                      <Badge ton={m.role?.systeme ? "succes" : "info"} sansIcone>
                        {m.role?.nom ?? "Sans rôle"}
                      </Badge>
                    </div>
                  </div>

                  {m.competences.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Compétences">
                      {m.competences.map((comp) => (
                        <li key={comp} className="rounded-md bg-fond px-2 py-0.5 text-xs text-encre-douce">
                          {comp}
                        </li>
                      ))}
                    </ul>
                  )}

                  <p className="mt-3 text-xs text-encre-muette">
                    {m.derniereConnexion ? `Dernière connexion ${formaterRelatif(m.derniereConnexion)}` : "Jamais connecté"}
                  </p>

                  {gerer && m.id !== c.utilisateur.id && (!m.role?.systeme || c.role?.systeme) && (
                    <details className="group mt-4">
                      <summary className="cursor-pointer text-sm font-medium text-marque-texte select-none hover:underline">
                        Modifier le rôle et les compétences
                      </summary>
                      <div className="mt-4 grid gap-4 border-t border-bordure pt-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                        <FormulaireMembre membre={{ id: m.id, roleId: m.roleId, competences: m.competences }} roles={optionsRoles} />
                        <form action={basculerActivationMembre}>
                          <input type="hidden" name="id" value={m.id} />
                          <BoutonConfirmation
                            variante={m.actif ? "danger" : "secondaire"}
                            taille="md"
                            message={
                              m.actif
                                ? `Désactiver ${m.email} ? Cette personne ne pourra plus se connecter.`
                                : `Réactiver ${m.email} ?`
                            }
                          >
                            {m.actif ? "Désactiver" : "Réactiver"}
                          </BoutonConfirmation>
                        </form>
                      </div>
                    </details>
                  )}
                </li>
              ))}
            </ul>
          </Carte>

          <section aria-labelledby="titre-invitations">
            <h2 id="titre-invitations" className="text-lg font-semibold text-encre">
              Invitations en attente
            </h2>
            {invitations.length === 0 ? (
              <p className="mt-2 text-sm text-encre-muette">Aucune invitation en attente.</p>
            ) : (
              <Carte className="mt-3 overflow-hidden">
                <ul className="divide-y divide-bordure">
                  {invitations.map((inv) => (
                    <li key={inv.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                      <div>
                        <p className="font-medium text-encre">{inv.email}</p>
                        <p className="text-xs text-encre-muette">
                          {inv.role.nom}, expire le {formaterDate(inv.expireLe)}
                        </p>
                      </div>
                      {gerer && (
                        <form action={revoquerInvitation}>
                          <input type="hidden" name="id" value={inv.id} />
                          <BoutonConfirmation variante="fantome" taille="sm" message={`Annuler l'invitation de ${inv.email} ?`}>
                            Annuler l&apos;invitation
                          </BoutonConfirmation>
                        </form>
                      )}
                    </li>
                  ))}
                </ul>
              </Carte>
            )}
          </section>
        </div>

        <aside>
          {gerer ? (
            <Carte className="p-5 xl:sticky xl:top-8">
              <h2 className="text-lg font-semibold text-encre">Inviter un membre</h2>
              <p className="mt-1 text-sm text-encre-muette">
                La personne reçoit un lien pour créer son mot de passe. Son rôle détermine ce qu&apos;elle voit.
              </p>
              <div className="mt-5">
                <FormulaireInvitation roles={optionsRoles} />
              </div>
            </Carte>
          ) : (
            <Carte className="p-5">
              <EtatVide titre="Consultation seule" texte="Votre rôle permet de voir l'équipe, pas de la modifier." />
            </Carte>
          )}
        </aside>
      </div>
    </>
  );
}
