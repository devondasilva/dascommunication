import { Carte } from "@/components/ui";
import { exigerConnexion } from "@/lib/auth";
import { formaterDate } from "@/lib/format";
import { FormulaireProfil } from "../formulaire-profil";

export const metadata = { title: "Mon profil" };

export default async function PageProfilClient() {
  const c = await exigerConnexion();
  const u = c.utilisateur;
  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl font-semibold text-encre">Mon profil</h1>
      <p className="mt-2 text-encre-douce">
        Connecté avec {u.googleId ? "Google" : "votre compte"} : <strong className="text-encre">{u.email}</strong>
      </p>
      <Carte className="mt-8 p-6">
        <FormulaireProfil profil={u} />
      </Carte>
      <p className="mt-4 text-xs text-encre-muette">Compte créé le {formaterDate(u.creeLe)}.</p>
    </div>
  );
}
