import Link from "next/link";
import { MessageSquareDiff } from "lucide-react";
import { Alerte, Badge, Carte, LienBouton } from "@/components/ui";
import { exigerConnexion } from "@/lib/auth";
import { STATUT_COMMANDE } from "@/lib/constantes";
import { commandesDuClient } from "@/lib/donnees";
import { formaterDate, formaterMontant } from "@/lib/format";
import { FormulaireProfil } from "./formulaire-profil";

export const metadata = { title: "Mes projets" };

export default async function PageEspace({ searchParams }: PageProps<"/espace">) {
  const { profil: profilOk } = await searchParams;
  const c = await exigerConnexion();
  const u = c.utilisateur;
  const commandes = await commandesDuClient(u.id, u.email);
  const prenom = (u.nom ?? "").split(" ")[0];
  const enCours = commandes.filter((cmd) => cmd.statut !== "livree" && cmd.statut !== "annulee").length;

  return (
    <>
      <h1 className="text-4xl font-semibold text-encre md:text-5xl">{prenom ? `Bonjour ${prenom}` : "Bonjour"}</h1>
      <p className="mt-2 text-encre-douce">
        {commandes.length === 0
          ? "Bienvenue dans votre espace DAS COM."
          : enCours > 0
            ? `${enCours} projet${enCours > 1 ? "s" : ""} en cours.`
            : "Tous vos projets sont terminés."}
      </p>

      {profilOk === "ok" && u.profilComplet && (
        <Alerte ton="succes" className="mt-8">
          Profil enregistré. Vous pouvez maintenant demander votre premier devis.
        </Alerte>
      )}

      {!u.profilComplet && (
        <Carte className="mt-8 border-l-4 border-l-marque p-6">
          <h2 className="text-xl font-semibold text-encre">Complétez votre profil</h2>
          <p className="mt-1 text-sm text-encre-douce">
            Ces informations nous permettent de vous recontacter et de préparer vos devis.
          </p>
          <div className="mt-6">
            <FormulaireProfil profil={u} libelleBouton="Enregistrer mon profil" retour="accueil" />
          </div>
        </Carte>
      )}

      <section aria-labelledby="titre-projets" className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <h2 id="titre-projets" className="text-2xl font-semibold text-encre">
            Mes projets
          </h2>
          <LienBouton href="/commander" variante="secondaire" taille="sm">
            Nouveau projet
          </LienBouton>
        </div>

        {commandes.length === 0 ? (
          <Carte className="mt-5 px-6 py-14 text-center">
            <p className="font-titre text-2xl font-semibold text-encre">Votre premier projet commence ici</p>
            <p className="mx-auto mt-2 max-w-md text-encre-douce">
              Décrivez votre besoin en quelques lignes : identité visuelle, réseaux sociaux, site web, événement…
              Nous revenons vers vous avec un devis sous 24 h ouvrées.
            </p>
            <LienBouton href="/commander" className="mt-6">
              Demander un devis
            </LienBouton>
          </Carte>
        ) : (
          <ul className="mt-5 space-y-3">
            {commandes.map((cmd) => {
              const statut = STATUT_COMMANDE[cmd.statut];
              const modifsOuvertes = cmd.modifications.filter((m) => m.statut === "en_attente" || m.statut === "en_cours").length;
              return (
                <li key={cmd.id}>
                  <Carte className="relative flex flex-col gap-4 p-5 transition hover:ring-encre/25 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs text-encre-muette">
                        <span className="font-mono">{cmd.reference}</span>, commandé le {formaterDate(cmd.creeLe)}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-encre">
                        <Link href={`/suivi/${cmd.jetonSuivi}`} className="after:absolute after:inset-0">
                          {cmd.serviceNom}
                        </Link>
                      </h3>
                      <p className="mt-1 line-clamp-1 text-sm text-encre-douce">{cmd.brief}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {modifsOuvertes > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-800">
                          <MessageSquareDiff aria-hidden className="size-3.5" />
                          {modifsOuvertes} modification{modifsOuvertes > 1 ? "s" : ""} en cours
                        </span>
                      )}
                      {cmd.montant != null && (
                        <span className="text-sm font-medium tabular-nums text-encre">{formaterMontant(cmd.montant)}</span>
                      )}
                      <Badge ton={statut.ton}>{statut.libelle}</Badge>
                    </div>
                  </Carte>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
