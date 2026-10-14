import Link from "next/link";
import { Eye, EyeOff, Pencil, Plus } from "lucide-react";
import { basculerService } from "@/actions/admin";
import { exigerEquipe } from "@/lib/auth";
import { EntetePage } from "@/components/dashboard/entete-page";
import { Badge, Carte, EtatVide, LienBouton } from "@/components/ui";
import { LIBELLES_CATEGORIE } from "@/lib/constantes";
import { tousLesServices } from "@/lib/donnees";
import { formaterMontant } from "@/lib/format";

export const metadata = { title: "Services" };

export default async function PageServicesAdmin() {
  await exigerEquipe("services.gerer");
  const services = await tousLesServices();

  return (
    <>
      <EntetePage
        titre="Services"
        description="Le catalogue affiché sur le site. Un service masqué ne peut plus être commandé."
        actions={
          <>
            <LienBouton href="/dashboard/tarifs" taille="sm" variante="secondaire">
              Modifier les tarifs
            </LienBouton>
            <LienBouton href="/dashboard/services/nouveau" taille="sm">
              <Plus aria-hidden className="size-4" /> Nouveau service
            </LienBouton>
          </>
        }
      />

      <Carte className="overflow-hidden">
        {services.length === 0 ? (
          <EtatVide
            titre="Aucun service"
            texte="Créez votre premier service pour qu'il apparaisse sur le site."
            action={<LienBouton href="/dashboard/services/nouveau">Créer un service</LienBouton>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-bordure bg-fond/60 text-xs text-encre-muette">
                <tr>
                  <th scope="col" className="px-5 py-2.5 font-medium">Service</th>
                  <th scope="col" className="hidden px-3 py-2.5 font-medium md:table-cell">Catégorie</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">Prix de départ</th>
                  <th scope="col" className="hidden px-3 py-2.5 text-right font-medium sm:table-cell">Commandes</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Visibilité</th>
                  <th scope="col" className="px-5 py-2.5"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bordure">
                {services.map((s) => (
                  <tr key={s.id} className={s.actif ? undefined : "bg-fond/50"}>
                    <td className="px-5 py-3">
                      <Link href={`/dashboard/services/${s.id}`} className="font-medium text-encre hover:underline">
                        {s.nom}
                      </Link>
                      <p className="text-xs text-encre-muette">
                        {s.delaiJours} jours · /{s.slug}
                        {!s.nomEn && <span className="ml-1.5 font-medium text-amber-800">· anglais à compléter</span>}
                      </p>
                    </td>
                    <td className="hidden px-3 py-3 text-encre-douce md:table-cell">{LIBELLES_CATEGORIE[s.categorie]}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-encre">
                      {formaterMontant(s.prixDepart)}
                      {s.prixUsd != null && <p className="text-xs text-encre-muette">{formaterMontant(s.prixUsd, "USD")}</p>}
                    </td>
                    <td className="hidden px-3 py-3 text-right tabular-nums text-encre-douce sm:table-cell">{s.nbCommandes}</td>
                    <td className="px-3 py-3">
                      <form action={basculerService}>
                        <input type="hidden" name="id" value={s.id} />
                        <input type="hidden" name="actif" value={String(s.actif)} />
                        <button
                          type="submit"
                          className="rounded-full"
                          title={s.actif ? "Masquer ce service" : "Afficher ce service"}
                        >
                          {s.actif ? <Badge ton="succes">Visible</Badge> : <Badge ton="neutre">Masqué</Badge>}
                          <span className="sr-only">{s.actif ? " — cliquer pour masquer" : " — cliquer pour afficher"}</span>
                        </button>
                      </form>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        {s.actif ? (
                          <Link
                            href={`/services/${s.slug}`}
                            target="_blank"
                            className="rounded-md p-1.5 text-encre-muette hover:bg-fond hover:text-encre"
                            title="Voir sur le site"
                          >
                            <Eye className="size-4" />
                            <span className="sr-only">Voir {s.nom} sur le site</span>
                          </Link>
                        ) : (
                          <span className="p-1.5 text-encre-muette/50" aria-hidden>
                            <EyeOff className="size-4" />
                          </span>
                        )}
                        <Link
                          href={`/dashboard/services/${s.id}`}
                          className="rounded-md p-1.5 text-encre-muette hover:bg-fond hover:text-encre"
                          title="Modifier"
                        >
                          <Pencil className="size-4" />
                          <span className="sr-only">Modifier {s.nom}</span>
                        </Link>
                      </div>
                    </td>
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
