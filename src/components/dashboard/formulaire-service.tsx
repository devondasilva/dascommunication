"use client";

import { useActionState, useState } from "react";
import { enregistrerService } from "@/actions/admin";
import { Alerte, Champ, LienBouton, Selection, ZoneTexte } from "@/components/ui";
import { BoutonEnvoi } from "@/components/ui/bouton-envoi";
import type { Service } from "@/db/schema";
import { CATEGORIES_SERVICE } from "@/lib/enums";
import { LIBELLES_CATEGORIE } from "@/lib/constantes";
import { slugifier } from "@/lib/slug";
import type { EtatFormulaire } from "@/lib/validations";

export function FormulaireService({ service }: { service?: Service }) {
  const [etat, action] = useActionState<EtatFormulaire, FormData>(enregistrerService, {});
  const v = etat.valeurs ?? {};
  const e = etat.erreurs ?? {};

  // Le slug suit le nom tant qu'il n'a pas été modifié à la main
  const [slug, setSlug] = useState(v.slug ?? service?.slug ?? "");
  const [slugManuel, setSlugManuel] = useState(Boolean(service));

  return (
    <form action={action} className="space-y-6" noValidate>
      {service && <input type="hidden" name="id" value={service.id} />}
      {etat.message && <Alerte ton="erreur">{etat.message}</Alerte>}

      <div className="grid gap-5 sm:grid-cols-2">
        <Champ
          label="Nom du service"
          name="nom"
          requis
          defaultValue={v.nom ?? service?.nom}
          erreur={e.nom}
          onChange={(ev) => !slugManuel && setSlug(slugifier(ev.target.value))}
        />
        <Champ
          label="Adresse (slug)"
          name="slug"
          requis
          value={slug}
          onChange={(ev) => {
            setSlugManuel(true);
            setSlug(ev.target.value);
          }}
          erreur={e.slug}
          aide={`URL : /services/${slug || "…"}`}
          className="font-mono"
        />
        <Selection label="Catégorie" name="categorie" requis defaultValue={v.categorie ?? service?.categorie ?? "marketing"}>
          {CATEGORIES_SERVICE.map((c) => (
            <option key={c} value={c}>
              {LIBELLES_CATEGORIE[c]}
            </option>
          ))}
        </Selection>
        <div className="grid grid-cols-[1fr_1fr_0.8fr] gap-4">
          <Champ
            label="Prix (F CFA)"
            name="prixDepart"
            type="number"
            min={0}
            step={1000}
            requis
            defaultValue={v.prixDepart ?? service?.prixDepart}
            erreur={e.prixDepart}
          />
          <Champ
            label="Prix (USD)"
            name="prixUsd"
            type="number"
            min={0}
            step={5}
            placeholder="Auto"
            defaultValue={v.prixUsd ?? service?.prixUsd ?? ""}
            erreur={e.prixUsd}
            aide="Vide = converti"
          />
          <Champ
            label="Délai (jours)"
            name="delaiJours"
            type="number"
            min={1}
            max={365}
            requis
            defaultValue={v.delaiJours ?? service?.delaiJours ?? 7}
            erreur={e.delaiJours}
          />
        </div>
      </div>

      <ZoneTexte
        label="Résumé"
        name="resume"
        requis
        rows={2}
        maxLength={200}
        defaultValue={v.resume ?? service?.resume}
        erreur={e.resume}
        aide="Une phrase affichée sur les cartes du catalogue (200 caractères max)."
      />
      <ZoneTexte
        label="Description détaillée"
        name="description"
        requis
        rows={5}
        defaultValue={v.description ?? service?.description}
        erreur={e.description}
      />
      <ZoneTexte
        label="Livrables"
        name="livrables"
        rows={4}
        defaultValue={v.livrables ?? service?.livrables}
        erreur={e.livrables}
        aide="Un livrable par ligne."
      />

      <fieldset className="space-y-5 rounded-lg border border-bordure bg-fond/50 p-5">
        <legend className="px-1 text-sm font-semibold text-encre">Version anglaise du site</legend>
        <p className="-mt-2 text-xs text-encre-muette">
          Affichée sur /en. Un champ laissé vide affiche le texte français à la place.
        </p>
        <Champ
          label="Name"
          name="nomEn"
          lang="en"
          defaultValue={v.nomEn ?? service?.nomEn ?? ""}
          erreur={e.nomEn}
        />
        <ZoneTexte
          label="Summary"
          name="resumeEn"
          lang="en"
          rows={2}
          maxLength={200}
          defaultValue={v.resumeEn ?? service?.resumeEn ?? ""}
          erreur={e.resumeEn}
        />
        <ZoneTexte
          label="Description"
          name="descriptionEn"
          lang="en"
          rows={4}
          defaultValue={v.descriptionEn ?? service?.descriptionEn ?? ""}
          erreur={e.descriptionEn}
        />
        <ZoneTexte
          label="Deliverables"
          name="livrablesEn"
          lang="en"
          rows={4}
          defaultValue={v.livrablesEn ?? service?.livrablesEn ?? ""}
          erreur={e.livrablesEn}
          aide="One deliverable per line, in the same order as in French."
        />
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Champ
          label="Ordre d'affichage"
          name="ordre"
          type="number"
          min={0}
          defaultValue={v.ordre ?? service?.ordre ?? 0}
          aide="Les plus petits nombres apparaissent en premier."
        />
        <label className="flex items-center gap-3 self-center pt-5 text-sm text-encre">
          <input
            type="checkbox"
            name="actif"
            defaultChecked={v.actif ? v.actif === "on" : (service?.actif ?? true)}
            className="size-4 accent-encre"
          />
          Visible sur le site
        </label>
      </div>

      <div className="flex gap-3 border-t border-bordure pt-6">
        <BoutonEnvoi enCours="Enregistrement…">{service ? "Enregistrer" : "Créer le service"}</BoutonEnvoi>
        <LienBouton href="/dashboard/services" variante="fantome">
          Annuler
        </LienBouton>
      </div>
    </form>
  );
}
