import type { Metadata } from "next";
import { CircleCheck, Clock, ShieldCheck } from "lucide-react";
import { LIBELLES_CATEGORIE } from "@/lib/constantes";
import { utilisateurConnecte } from "@/lib/auth";
import { parametresSite } from "@/lib/parametres";
import { servicesActifs } from "@/lib/donnees";
import { formaterMontant } from "@/lib/format";
import { FormulaireCommande } from "./formulaire-commande";

export const metadata: Metadata = {
  title: "Commander",
  description: "Décrivez votre projet marketing ou communication et recevez un devis sous 24 h ouvrées.",
};

const GARANTIES = [
  { icone: Clock, texte: "Réponse sous 24 h ouvrées" },
  { icone: CircleCheck, texte: "Devis gratuit et sans engagement" },
  { icone: ShieldCheck, texte: "Vos données restent confidentielles" },
];

export default async function PageCommander({ searchParams }: PageProps<"/commander">) {
  const { service: slug } = await searchParams;
  const [services, connecte, parametres] = await Promise.all([servicesActifs(), utilisateurConnecte(), parametresSite()]);
  const initial = services.find((s) => s.slug === slug)?.id;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
      <div className="grid gap-14 lg:grid-cols-[1fr_300px]">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight text-encre md:text-5xl">Demander un devis</h1>
          <p className="mt-4 text-lg text-encre-douce">
            Quelques informations suffisent. Vous recevez ensuite un lien pour suivre votre projet et demander des
            modifications.
          </p>
          <div className="mt-10">
            <FormulaireCommande
              serviceInitial={initial}
              profil={connecte?.utilisateur}
              services={services.map((s) => ({
                id: s.id,
                nom: s.nom,
                categorie: LIBELLES_CATEGORIE[s.categorie],
                prix: formaterMontant(s.prixDepart),
              }))}
            />
          </div>
        </div>

        <aside className="lg:pt-28">
          <ul className="space-y-4 rounded-2xl bg-fond p-6">
            {GARANTIES.map(({ icone: Icone, texte }) => (
              <li key={texte} className="flex items-center gap-3 text-sm text-encre">
                <Icone aria-hidden className="size-5 text-marque-fonce" />
                {texte}
              </li>
            ))}
          </ul>
          <p className="mt-6 px-1 text-sm text-encre-muette">
            Une question avant de commander ?<br />
            <a href={`mailto:${parametres.email}`} className="font-medium text-marque-texte hover:underline">
              {parametres.email}
            </a>
          </p>
        </aside>
      </div>
    </div>
  );
}
