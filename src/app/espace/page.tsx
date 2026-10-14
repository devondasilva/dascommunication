import Link from "next/link";
import { MessageSquareDiff } from "lucide-react";
import { Alerte, Badge, Carte, LienBouton } from "@/components/ui";
import { statutCommande } from "@/i18n/libelles";
import { i18n } from "@/i18n/serveur";
import { exigerConnexion } from "@/lib/auth";
import { commandesDuClient } from "@/lib/donnees";
import { FormulaireProfil } from "./formulaire-profil";

export async function generateMetadata() {
  const { tr } = await i18n();
  return { title: tr("Mes projets", "My projects") };
}

export default async function PageEspace({ searchParams }: PageProps<"/espace">) {
  const { profil: profilOk } = await searchParams;
  const c = await exigerConnexion();
  const u = c.utilisateur;
  const [commandes, { langue, tr, l, fmtPrix, date }] = await Promise.all([commandesDuClient(u.id, u.email), i18n()]);
  const prenom = (u.nom ?? "").split(" ")[0];
  const enCours = commandes.filter((cmd) => cmd.statut !== "livree" && cmd.statut !== "annulee").length;

  return (
    <>
      <h1 className="text-4xl font-semibold text-encre md:text-5xl">{prenom ? `${tr("Bonjour", "Hello")} ${prenom}` : tr("Bonjour", "Hello")}</h1>
      <p className="mt-2 text-encre-douce">
        {commandes.length === 0
          ? tr("Bienvenue dans votre espace DAS COM.", "Welcome to your DAS COM client area.")
          : enCours > 0
            ? tr(`${enCours} projet${enCours > 1 ? "s" : ""} en cours.`, `${enCours} project${enCours > 1 ? "s" : ""} in progress.`)
            : tr("Tous vos projets sont terminés.", "All your projects are complete.")}
      </p>

      {profilOk === "ok" && u.profilComplet && (
        <Alerte ton="succes" className="mt-8">
          {tr(
            "Profil enregistré. Vous pouvez maintenant demander votre premier devis.",
            "Profile saved. You can now request your first quote.",
          )}
        </Alerte>
      )}

      {!u.profilComplet && (
        <Carte className="mt-8 border-l-4 border-l-marque p-6">
          <h2 className="text-xl font-semibold text-encre">{tr("Complétez votre profil", "Complete your profile")}</h2>
          <p className="mt-1 text-sm text-encre-douce">
            {tr(
              "Ces informations nous permettent de vous recontacter et de préparer vos devis.",
              "This information lets us contact you and prepare your quotes.",
            )}
          </p>
          <div className="mt-6">
            <FormulaireProfil profil={u} libelleBouton={tr("Enregistrer mon profil", "Save my profile")} retour="accueil" />
          </div>
        </Carte>
      )}

      <section aria-labelledby="titre-projets" className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <h2 id="titre-projets" className="text-2xl font-semibold text-encre">
            {tr("Mes projets", "My projects")}
          </h2>
          <LienBouton href={l("/commander")} variante="secondaire" taille="sm">
            {tr("Nouveau projet", "New project")}
          </LienBouton>
        </div>

        {commandes.length === 0 ? (
          <Carte className="mt-5 px-6 py-14 text-center">
            <p className="font-titre text-2xl font-semibold text-encre">
              {tr("Votre premier projet commence ici", "Your first project starts here")}
            </p>
            <p className="mx-auto mt-2 max-w-md text-encre-douce">
              {tr(
                "Décrivez votre besoin en quelques lignes : identité visuelle, réseaux sociaux, site web, événement… Nous revenons vers vous avec un devis sous 24 h ouvrées.",
                "Describe what you need in a few lines: brand identity, social media, website, event… We get back to you with a quote within one business day.",
              )}
            </p>
            <LienBouton href={l("/commander")} className="mt-6">
              {tr("Demander un devis", "Get a quote")}
            </LienBouton>
          </Carte>
        ) : (
          <ul className="mt-5 space-y-3">
            {commandes.map((cmd) => {
              const statut = statutCommande(cmd.statut, langue);
              const modifsOuvertes = cmd.modifications.filter((m) => m.statut === "en_attente" || m.statut === "en_cours").length;
              return (
                <li key={cmd.id}>
                  <Carte className="relative flex flex-col gap-4 p-5 transition hover:ring-encre/25 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs text-encre-muette">
                        <span className="font-mono">{cmd.reference}</span>, {tr("commandé le", "ordered on")} {date(cmd.creeLe)}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-encre">
                        <Link href={l(`/suivi/${cmd.jetonSuivi}`)} className="after:absolute after:inset-0">
                          {cmd.serviceNom}
                        </Link>
                      </h3>
                      <p className="mt-1 line-clamp-1 text-sm text-encre-douce">{cmd.brief}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {modifsOuvertes > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-800">
                          <MessageSquareDiff aria-hidden className="size-3.5" />
                          {tr(
                            `${modifsOuvertes} modification${modifsOuvertes > 1 ? "s" : ""} en cours`,
                            `${modifsOuvertes} change${modifsOuvertes > 1 ? "s" : ""} in progress`,
                          )}
                        </span>
                      )}
                      {cmd.montant != null && (
                        <span className="text-sm font-medium tabular-nums text-encre">{fmtPrix(cmd.montant, cmd.devise)}</span>
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
