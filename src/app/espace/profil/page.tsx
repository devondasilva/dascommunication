import { Carte } from "@/components/ui";
import { i18n } from "@/i18n/serveur";
import { exigerConnexion } from "@/lib/auth";
import { FormulaireProfil } from "../formulaire-profil";

export async function generateMetadata() {
  const { tr } = await i18n();
  return { title: tr("Mon profil", "My profile") };
}

export default async function PageProfilClient() {
  const c = await exigerConnexion();
  const { tr, date } = await i18n();
  const u = c.utilisateur;
  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl font-semibold text-encre">{tr("Mon profil", "My profile")}</h1>
      <p className="mt-2 text-encre-douce">
        {u.googleId ? tr("Connecté avec Google :", "Signed in with Google:") : tr("Connecté avec votre compte :", "Signed in as:")}{" "}
        <strong className="text-encre">{u.email}</strong>
      </p>
      <Carte className="mt-8 p-6">
        <FormulaireProfil profil={u} />
      </Carte>
      <p className="mt-4 text-xs text-encre-muette">
        {tr("Compte créé le", "Account created on")} {date(u.creeLe)}.
      </p>
    </div>
  );
}
