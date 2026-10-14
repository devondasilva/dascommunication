"use client";

import { useActionState, useState } from "react";
import { enregistrerRealisation } from "@/actions/realisations";
import { Alerte, Champ, LienBouton, Selection, ZoneTexte } from "@/components/ui";
import { BoutonEnvoi } from "@/components/ui/bouton-envoi";
import type { Realisation } from "@/db/schema";
import { LIBELLES_REALISATION } from "@/lib/constantes";
import { CATEGORIES_REALISATION, type CategorieRealisation } from "@/lib/enums";
import { slugifier } from "@/lib/slug";
import type { EtatFormulaire } from "@/lib/validations";

export function FormulaireRealisation({
  realisation,
  categorieInitiale,
}: {
  realisation?: Realisation;
  categorieInitiale?: CategorieRealisation;
}) {
  const [etat, action] = useActionState<EtatFormulaire, FormData>(enregistrerRealisation, {});
  const v = etat.ok ? {} : (etat.valeurs ?? {});
  const e = etat.erreurs ?? {};
  const [slug, setSlug] = useState(v.slug ?? realisation?.slug ?? "");
  const [slugManuel, setSlugManuel] = useState(Boolean(realisation));

  return (
    <form action={action} className="space-y-5" noValidate>
      {realisation && <input type="hidden" name="id" value={realisation.id} />}
      {etat.message && <Alerte ton={etat.ok ? "succes" : "erreur"}>{etat.message}</Alerte>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Champ
          label="Titre"
          name="titre"
          requis
          placeholder="ex. Affiche Tournoi Open de Cotonou"
          defaultValue={v.titre ?? realisation?.titre}
          erreur={e.titre}
          onChange={(ev) => !slugManuel && setSlug(slugifier(ev.target.value))}
        />
        <Selection
          label="Catégorie"
          name="categorie"
          requis
          defaultValue={v.categorie ?? realisation?.categorie ?? categorieInitiale ?? ""}
          erreur={e.categorie}
        >
          <option value="" disabled>
            Choisissez…
          </option>
          {CATEGORIES_REALISATION.map((c) => (
            <option key={c} value={c}>
              {LIBELLES_REALISATION[c]}
            </option>
          ))}
        </Selection>
        <Champ label="Client" name="client" defaultValue={v.client ?? realisation?.client ?? ""} erreur={e.client} />
        <Champ
          label="Secteur"
          name="secteur"
          placeholder="ex. Événementiel sportif"
          defaultValue={v.secteur ?? realisation?.secteur ?? ""}
          erreur={e.secteur}
        />
      </div>

      <ZoneTexte
        label="Description"
        name="description"
        rows={3}
        placeholder="Le contexte, ce qui a été réalisé, le résultat."
        defaultValue={v.description ?? realisation?.description ?? ""}
        erreur={e.description}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Champ
          label="Mots-clés"
          name="tags"
          placeholder="Affiche, Print, Sport"
          aide="Séparés par des virgules."
          defaultValue={v.tags ?? realisation?.tags.join(", ") ?? ""}
        />
        <Champ
          label="Lien externe"
          name="lien"
          type="url"
          placeholder="https://…"
          aide="Maquette Figma, site en ligne… (facultatif)"
          defaultValue={v.lien ?? realisation?.lien ?? ""}
          erreur={e.lien}
        />
        <Champ
          label="Adresse de la page"
          name="slug"
          requis
          value={slug}
          onChange={(ev) => {
            setSlugManuel(true);
            setSlug(ev.target.value);
          }}
          aide={`/realisations/${slug || "…"}`}
          erreur={e.slug}
          className="font-mono"
        />
        <Champ
          label="Ordre d'affichage"
          name="ordre"
          type="number"
          min={0}
          defaultValue={v.ordre ?? realisation?.ordre ?? 0}
          aide="Les plus petits nombres apparaissent en premier."
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2.5 text-sm text-encre">
          <input
            type="checkbox"
            name="publie"
            defaultChecked={v.publie ? v.publie === "on" : (realisation?.publie ?? true)}
            className="size-4 accent-encre"
          />
          Visible sur le site
        </label>
        <label className="flex items-center gap-2.5 text-sm text-encre">
          <input
            type="checkbox"
            name="misEnAvant"
            defaultChecked={v.misEnAvant ? v.misEnAvant === "on" : (realisation?.misEnAvant ?? false)}
            className="size-4 accent-encre"
          />
          Mettre en avant sur l&apos;accueil
        </label>
      </div>

      <div className="flex gap-3 border-t border-bordure pt-5">
        <BoutonEnvoi enCours="Enregistrement…">
          {realisation ? "Enregistrer les informations" : "Créer et ajouter les visuels"}
        </BoutonEnvoi>
        <LienBouton href="/dashboard/realisations" variante="fantome">
          {realisation ? "Retour à la liste" : "Annuler"}
        </LienBouton>
      </div>
    </form>
  );
}
