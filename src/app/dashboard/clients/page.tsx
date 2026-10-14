import Form from "next/form";
import Image from "next/image";
import { Search } from "lucide-react";
import { EntetePage } from "@/components/dashboard/entete-page";
import { Carte, EtatVide } from "@/components/ui";
import { exigerEquipe } from "@/lib/auth";
import { listeClients } from "@/lib/donnees";
import { formaterDate, formaterRelatif, pluriel } from "@/lib/format";

export const metadata = { title: "Clients" };

export default async function PageClients({ searchParams }: PageProps<"/dashboard/clients">) {
  await exigerEquipe("clients.voir");
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";
  const clients = await listeClients(q || undefined);

  return (
    <>
      <EntetePage
        titre="Clients"
        description="Les comptes créés avec Google depuis l'espace client."
        actions={
          <Form action="/dashboard/clients" className="relative w-full sm:w-72" role="search">
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-encre-muette" />
            <label htmlFor="q" className="sr-only">
              Rechercher un client
            </label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Nom, e-mail, entreprise…"
              className="h-9 w-full rounded-lg bg-white pr-3 pl-9 text-sm ring-1 ring-bordure ring-inset placeholder:text-encre-muette focus:ring-2 focus:ring-marque-fonce focus:outline-none"
            />
          </Form>
        }
      />

      <Carte className="overflow-hidden">
        {clients.length === 0 ? (
          <EtatVide
            titre={q ? "Aucun client trouvé" : "Aucun client inscrit pour le moment"}
            texte={q ? "Essayez une autre recherche." : "Les clients apparaissent ici après leur première connexion avec Google."}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-bordure bg-fond/60 text-xs text-encre-muette">
                <tr>
                  <th scope="col" className="px-5 py-2.5 font-medium">Client</th>
                  <th scope="col" className="hidden px-3 py-2.5 font-medium md:table-cell">Contact</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">Commandes</th>
                  <th scope="col" className="hidden px-5 py-2.5 text-right font-medium sm:table-cell">Inscription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bordure">
                {clients.map((cl) => (
                  <tr key={cl.id}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {cl.image ? (
                          <Image src={cl.image} alt="" width={32} height={32} className="size-8 rounded-full" unoptimized />
                        ) : (
                          <span aria-hidden className="grid size-8 place-items-center rounded-full bg-fond text-xs font-medium text-encre-douce">
                            {(cl.nom ?? cl.email).slice(0, 1).toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-encre">{cl.nom ?? "Sans nom"}</p>
                          <p className="truncate text-xs text-encre-muette">{cl.entreprise ?? cl.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-3 py-3 text-encre-douce md:table-cell">
                      <p>{cl.email}</p>
                      {cl.telephone && <p className="text-xs text-encre-muette">{cl.telephone}{cl.pays ? `, ${cl.pays}` : ""}</p>}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-encre">{cl.nbCommandes}</td>
                    <td className="hidden px-5 py-3 text-right text-xs text-encre-muette sm:table-cell">
                      <p>{formaterDate(cl.creeLe)}</p>
                      {cl.derniereConnexion && <p>vu {formaterRelatif(cl.derniereConnexion)}</p>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Carte>
      <p className="mt-3 text-xs text-encre-muette">{pluriel(clients.length, "client")}</p>
    </>
  );
}
