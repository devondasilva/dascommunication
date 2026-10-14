"use client";

import { useActionState, useState } from "react";
import { enregistrerTarifs } from "@/actions/parametres";
import { Alerte, Carte, cx } from "@/components/ui";
import { BoutonEnvoi } from "@/components/ui/bouton-envoi";
import type { EtatFormulaire } from "@/lib/validations";

type Ligne = { id: number; nom: string; prix: number; delai: number; actif: boolean };

const fmt = new Intl.NumberFormat("fr-FR");
const champ =
  "h-10 w-full rounded-md bg-white px-3 text-right tabular-nums ring-1 ring-inset ring-bordure focus:ring-2 focus:ring-marque-fonce focus:outline-none aria-[invalid=true]:ring-red-400";

export function TableauTarifs({ groupes }: { groupes: { titre: string; lignes: Ligne[] }[] }) {
  const [etat, action] = useActionState<EtatFormulaire, FormData>(enregistrerTarifs, {});
  const [modifies, setModifies] = useState<Set<string>>(new Set());
  const marquer = (cle: string, change: boolean) =>
    setModifies((m) => {
      const n = new Set(m);
      if (change) n.add(cle);
      else n.delete(cle);
      return n;
    });

  return (
    <form action={action} onSubmit={() => setModifies(new Set())} noValidate>
      {etat.message && (
        <Alerte ton={etat.ok ? "succes" : "erreur"} className="mb-5">
          {etat.message}
        </Alerte>
      )}

      <div className="space-y-6">
        {groupes.map((g) => (
          <Carte key={g.titre} className="overflow-hidden">
            <h2 className="border-b border-bordure bg-fond/60 px-5 py-3 text-sm font-semibold text-encre">{g.titre}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-encre-muette">
                  <tr>
                    <th scope="col" className="px-5 pt-3 pb-1 text-left font-medium">Service</th>
                    <th scope="col" className="w-48 px-3 pt-3 pb-1 text-right font-medium">Prix de départ</th>
                    <th scope="col" className="w-32 px-5 pt-3 pb-1 text-right font-medium">Délai (jours)</th>
                  </tr>
                </thead>
                <tbody>
                  {g.lignes.map((l) => {
                    const cleP = `prix-${l.id}`;
                    const cleD = `delai-${l.id}`;
                    const errP = etat.erreurs?.[cleP]?.[0];
                    const errD = etat.erreurs?.[cleD]?.[0];
                    const change = modifies.has(cleP) || modifies.has(cleD);
                    return (
                      <tr key={l.id} className={cx("border-t border-bordure/70", change && "bg-marque-pale/50")}>
                        <td className="px-5 py-2.5">
                          <span className="font-medium text-encre">{l.nom}</span>
                          {!l.actif && <span className="ml-2 text-xs text-encre-muette">(masqué)</span>}
                          {change && <span className="ml-2 text-xs font-medium text-marque-texte">modifié</span>}
                        </td>
                        <td className="px-3 py-2.5">
                          <label htmlFor={cleP} className="sr-only">
                            Prix de départ de {l.nom}
                          </label>
                          <input
                            id={cleP}
                            name={cleP}
                            inputMode="numeric"
                            defaultValue={etat.valeurs?.[cleP] ?? fmt.format(l.prix)}
                            aria-invalid={errP ? true : undefined}
                            onChange={(e) => marquer(cleP, e.target.value.replace(/\D/g, "") !== String(l.prix))}
                            className={champ}
                          />
                          {errP && <p className="mt-1 text-right text-xs text-red-700">{errP}</p>}
                        </td>
                        <td className="px-5 py-2.5">
                          <label htmlFor={cleD} className="sr-only">
                            Délai de {l.nom} en jours
                          </label>
                          <input
                            id={cleD}
                            name={cleD}
                            type="number"
                            min={1}
                            max={365}
                            defaultValue={etat.valeurs?.[cleD] ?? l.delai}
                            aria-invalid={errD ? true : undefined}
                            onChange={(e) => marquer(cleD, e.target.value !== String(l.delai))}
                            className={champ}
                          />
                          {errD && <p className="mt-1 text-right text-xs text-red-700">{errD}</p>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Carte>
        ))}
      </div>

      <div className="sticky bottom-0 mt-6 -mx-4 flex items-center justify-between gap-4 border-t border-bordure bg-fond/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-md sm:border sm:bg-white sm:px-5">
        <p className="text-sm text-encre-muette" aria-live="polite">
          {modifies.size > 0 ? `${modifies.size} valeur${modifies.size > 1 ? "s" : ""} modifiée${modifies.size > 1 ? "s" : ""}` : "Aucune modification en cours"}
        </p>
        <BoutonEnvoi enCours="Enregistrement…">Enregistrer les tarifs</BoutonEnvoi>
      </div>
    </form>
  );
}
