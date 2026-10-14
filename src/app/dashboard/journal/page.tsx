import { EntetePage } from "@/components/dashboard/entete-page";
import { Carte, EtatVide } from "@/components/ui";
import { exigerEquipe } from "@/lib/auth";
import { journal } from "@/lib/donnees";
import { formaterDateHeure } from "@/lib/format";

export const metadata = { title: "Journal d'audit" };

/** Libellés lisibles des actions enregistrées. */
const ACTIONS: Record<string, string> = {
  connexion: "Connexion",
  deconnexion: "Déconnexion",
  inscription: "Inscription",
  "commande.modifiee": "Commande modifiée",
  "commande.supprimee": "Commande supprimée",
  "modification.traitee": "Demande de modification traitée",
  "service.cree": "Service créé",
  "service.modifie": "Service modifié",
  "service.masque": "Service masqué",
  "service.affiche": "Service affiché",
  "service.supprime": "Service supprimé",
  "equipe.invitation": "Invitation envoyée",
  "equipe.invitation_revoquee": "Invitation annulée",
  "equipe.invitation_acceptee": "Invitation acceptée",
  "equipe.membre_modifie": "Membre modifié",
  "equipe.membre_desactive": "Membre désactivé",
  "equipe.membre_reactive": "Membre réactivé",
  "role.cree": "Rôle créé",
  "role.modifie": "Rôle modifié",
  "role.supprime": "Rôle supprimé",
  "compte.mot_de_passe_change": "Mot de passe changé",
  "compte.2fa_activee": "Double authentification activée",
  "compte.2fa_desactivee": "Double authentification désactivée",
  "realisation.creee": "Réalisation créée",
  "realisation.modifiee": "Réalisation modifiée",
  "realisation.supprimee": "Réalisation supprimée",
  "realisation.publiee": "Réalisation publiée",
  "realisation.masquee": "Réalisation masquée",
  "realisation.mise_en_avant": "Réalisation mise sur l'accueil",
  "realisation.retiree_accueil": "Réalisation retirée de l'accueil",
  "visuel.ajoute": "Visuel ajouté",
  "visuel.supprime": "Visuel supprimé",
  "tarifs.modifies": "Tarifs modifiés",
  "parametres.modifies": "Paramètres du site modifiés",
};

export default async function PageJournal() {
  await exigerEquipe("audit.voir");
  const lignes = await journal(200);

  return (
    <>
      <EntetePage titre="Journal d'audit" description="Les 200 dernières actions sensibles : connexions, droits, commandes, catalogue." />
      <Carte className="overflow-hidden">
        {lignes.length === 0 ? (
          <EtatVide titre="Aucune action enregistrée" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-bordure bg-fond/60 text-xs text-encre-muette">
                <tr>
                  <th scope="col" className="px-5 py-2.5 font-medium">Date</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Action</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Cible</th>
                  <th scope="col" className="px-5 py-2.5 font-medium">Par</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bordure">
                {lignes.map((l) => (
                  <tr key={l.id}>
                    <td className="px-5 py-2.5 text-xs whitespace-nowrap text-encre-muette tabular-nums">{formaterDateHeure(l.creeLe)}</td>
                    <td className="px-3 py-2.5 text-encre">{ACTIONS[l.action] ?? l.action}</td>
                    <td className="px-3 py-2.5 text-encre-douce">{l.cible ?? ""}</td>
                    <td className="px-5 py-2.5 text-encre-douce">{l.acteurEmail ?? "Système"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Carte>
    </>
  );
}
