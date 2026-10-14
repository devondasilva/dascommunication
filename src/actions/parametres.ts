"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { parametres, services } from "@/db/schema";
import { journaliser } from "@/lib/audit";
import { acteur, autoriser } from "@/lib/auth";
import { formaterMontant } from "@/lib/format";
import { CLES_PARAMETRES, PARAMETRES_PAR_DEFAUT } from "@/lib/parametres";
import { schemaTarif, type EtatFormulaire } from "@/lib/validations";

/* ------------------------------------------------------------------ */
/*  Tarifs : prix et délais de tous les services en un écran            */
/* ------------------------------------------------------------------ */

export async function enregistrerTarifs(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const c = await autoriser("services.gerer");
  if (!c) return { message: "Votre rôle ne vous permet pas de modifier les tarifs." };

  const actuels = await db
    .select({ id: services.id, nom: services.nom, prix: services.prixDepart, usd: services.prixUsd, delai: services.delaiJours })
    .from(services);
  type Valeurs = { prix: number; usd: number | null; delai: number };
  const erreurs: Record<string, string[]> = {};
  const changements: (Valeurs & { id: number; nom: string; avant: Valeurs })[] = [];

  for (const s of actuels) {
    const prix = formData.get(`prix-${s.id}`);
    const usd = formData.get(`usd-${s.id}`) ?? (s.usd != null ? String(s.usd) : "");
    const delai = formData.get(`delai-${s.id}`);
    if (prix === null || delai === null) continue;
    const parse = schemaTarif.safeParse({ prix, usd, delai });
    if (!parse.success) {
      for (const issue of parse.error.issues) erreurs[`${String(issue.path[0])}-${s.id}`] = [issue.message];
      continue;
    }
    const d = parse.data;
    if (d.prix !== s.prix || d.usd !== s.usd || d.delai !== s.delai) {
      changements.push({ id: s.id, nom: s.nom, ...d, avant: { prix: s.prix, usd: s.usd, delai: s.delai } });
    }
  }

  if (Object.keys(erreurs).length) {
    const valeurs: Record<string, string> = {};
    formData.forEach((v, k) => typeof v === "string" && (valeurs[k] = v));
    return { message: "Certaines valeurs sont invalides : corrigez les cases signalées.", erreurs, valeurs };
  }
  if (changements.length === 0) return { ok: true, message: "Aucun changement à enregistrer." };

  await db.transaction(async (tx) => {
    for (const ch of changements) {
      await tx
        .update(services)
        .set({ prixDepart: ch.prix, prixUsd: ch.usd, delaiJours: ch.delai })
        .where(eq(services.id, ch.id));
    }
  });
  await journaliser(acteur(c), "tarifs.modifies", `${changements.length} service(s)`, {
    changements: changements.map((ch) => ({
      service: ch.nom,
      prix: ch.prix !== ch.avant.prix ? `${formaterMontant(ch.avant.prix)} → ${formaterMontant(ch.prix)}` : undefined,
      usd:
        ch.usd !== ch.avant.usd
          ? `${ch.avant.usd != null ? formaterMontant(ch.avant.usd, "USD") : "auto"} → ${ch.usd != null ? formaterMontant(ch.usd, "USD") : "auto"}`
          : undefined,
      delai: ch.delai !== ch.avant.delai ? `${ch.avant.delai} → ${ch.delai} jours` : undefined,
    })),
  });

  revalidatePath("/", "layout");
  return {
    ok: true,
    message: `${changements.length} tarif${changements.length > 1 ? "s" : ""} mis à jour. Le site affiche déjà les nouveaux prix.`,
  };
}

/* ------------------------------------------------------------------ */
/*  Paramètres du site                                                  */
/* ------------------------------------------------------------------ */

const LIMITES: Partial<Record<(typeof CLES_PARAMETRES)[number], number>> = {
  banniereTitre: 90,
  banniereAccroche: 60,
  banniereArguments: 300,
  banniereTitreEn: 90,
  banniereAccrocheEn: 60,
  banniereArgumentsEn: 300,
  tauxUsd: 10,
};

export async function enregistrerParametres(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const c = await autoriser("parametres.gerer");
  if (!c) return { message: "Votre rôle ne vous permet pas de modifier les paramètres." };

  const erreurs: Record<string, string[]> = {};
  const valeurs: Record<string, string> = {};
  for (const cle of CLES_PARAMETRES) {
    const v = String(formData.get(cle) ?? "").trim();
    valeurs[cle] = v;
    const max = LIMITES[cle] ?? 200;
    if (v.length > max) erreurs[cle] = [`${max} caractères maximum`];
    if (["linkedin", "instagram", "facebook"].includes(cle) && v && !/^https:\/\//.test(v)) {
      erreurs[cle] = ["Le lien doit commencer par https://"];
    }
    if (cle === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) erreurs[cle] = ["Adresse e-mail invalide"];
    if (cle === "tauxUsd") {
      const n = Number(v.replace(",", "."));
      if (!Number.isFinite(n) || n < 1 || n > 100000) erreurs[cle] = ["Indiquez un nombre, par exemple 600"];
      else valeurs[cle] = String(n);
    }
    if (["banniereTitre", "email", "tauxUsd"].includes(cle) && !v) erreurs[cle] = ["Champ obligatoire"];
  }
  if (Object.keys(erreurs).length) return { message: "Merci de corriger les champs indiqués.", erreurs, valeurs };

  await db.transaction(async (tx) => {
    for (const cle of CLES_PARAMETRES) {
      const v = valeurs[cle] ?? PARAMETRES_PAR_DEFAUT[cle];
      await tx
        .insert(parametres)
        .values({ cle, valeur: v })
        .onConflictDoUpdate({ target: parametres.cle, set: { valeur: v, majLe: new Date() } });
    }
  });
  await journaliser(acteur(c), "parametres.modifies");
  revalidatePath("/", "layout");
  return { ok: true, message: "Paramètres enregistrés. Le site est à jour." };
}
