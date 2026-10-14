"use server";

import { and, asc, eq, ne, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { realisations, visuels } from "@/db/schema";
import { journaliser } from "@/lib/audit";
import { acteur, autoriser } from "@/lib/auth";
import { enregistrerImage, supprimerImage } from "@/lib/stockage";
import { erreursDe, schemaRealisation, valeursDe, type EtatFormulaire } from "@/lib/validations";

const REFUS: EtatFormulaire = { message: "Votre rôle ne vous permet pas de gérer les réalisations." };

function rafraichir(id?: number) {
  revalidatePath("/", "layout");
  revalidatePath("/dashboard/realisations");
  if (id) revalidatePath(`/dashboard/realisations/${id}`);
}

/** Renumérote les visuels d'une réalisation (0, 1, 2…) dans l'ordre donné. */
async function renumeroter(realisationId: number, idsDansLOrdre?: number[]) {
  const ids =
    idsDansLOrdre ??
    (
      await db
        .select({ id: visuels.id })
        .from(visuels)
        .where(eq(visuels.realisationId, realisationId))
        .orderBy(asc(visuels.ordre), asc(visuels.id))
    ).map((v) => v.id);
  await db.transaction(async (tx) => {
    for (const [i, id] of ids.entries()) {
      await tx.update(visuels).set({ ordre: i }).where(eq(visuels.id, id));
    }
  });
}

/* ------------------------------------------------------------------ */
/*  Fiche réalisation                                                   */
/* ------------------------------------------------------------------ */

export async function enregistrerRealisation(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const c = await autoriser("realisations.gerer");
  if (!c) return REFUS;

  const parse = schemaRealisation.safeParse(Object.fromEntries(formData));
  if (!parse.success) {
    return { message: "Merci de corriger les champs indiqués.", erreurs: erreursDe(parse.error), valeurs: valeursDe(formData) };
  }
  const { id, ...v } = parse.data;

  const doublon = await db.query.realisations.findFirst({
    where: id ? and(eq(realisations.slug, v.slug), ne(realisations.id, id)) : eq(realisations.slug, v.slug),
    columns: { id: true },
  });
  if (doublon) return { erreurs: { slug: ["Cette adresse est déjà utilisée"] }, valeurs: valeursDe(formData) };

  const valeurs = {
    ...v,
    client: v.client ?? null,
    secteur: v.secteur ?? null,
    description: v.description ?? null,
    lien: v.lien ?? null,
    majLe: new Date(),
  };

  if (id) {
    await db.update(realisations).set(valeurs).where(eq(realisations.id, id));
    await journaliser(acteur(c), "realisation.modifiee", v.titre);
    rafraichir(id);
    return { ok: true, message: "Réalisation enregistrée." };
  }

  const [creee] = await db.insert(realisations).values(valeurs).returning({ id: realisations.id });
  await journaliser(acteur(c), "realisation.creee", v.titre);
  rafraichir();
  redirect(`/dashboard/realisations/${creee.id}?nouvelle=1`);
}

export async function supprimerRealisation(formData: FormData) {
  const c = await autoriser("realisations.gerer");
  if (!c) redirect("/dashboard/acces-refuse");
  const id = Number(formData.get("id"));
  const r = await db.query.realisations.findFirst({ where: eq(realisations.id, id), with: { visuels: true } });
  if (!r) redirect("/dashboard/realisations");

  await db.delete(realisations).where(eq(realisations.id, id));
  await Promise.all(r.visuels.filter((v) => v.televerse).map((v) => supprimerImage(v.url)));
  await journaliser(acteur(c), "realisation.supprimee", r.titre);
  rafraichir();
  redirect("/dashboard/realisations");
}

/** Bascule rapide depuis la liste : publiée / masquée, ou mise en avant sur l'accueil. */
export async function basculerRealisation(formData: FormData) {
  const c = await autoriser("realisations.gerer");
  if (!c) return;
  const id = Number(formData.get("id"));
  const champ = formData.get("champ") === "misEnAvant" ? "misEnAvant" : "publie";
  const r = await db.query.realisations.findFirst({ where: eq(realisations.id, id) });
  if (!r) return;
  await db
    .update(realisations)
    .set({ [champ]: !r[champ], majLe: new Date() })
    .where(eq(realisations.id, id));
  await journaliser(acteur(c), `realisation.${champ === "publie" ? (r.publie ? "masquee" : "publiee") : r.misEnAvant ? "retiree_accueil" : "mise_en_avant"}`, r.titre);
  rafraichir(id);
}

/* ------------------------------------------------------------------ */
/*  Visuels                                                             */
/* ------------------------------------------------------------------ */

export type ResultatEnvoi = { ok: true } | { ok: false; message: string };

/** Envoi d'un visuel (un fichier par appel, déjà compressé par le navigateur). */
export async function televerserVisuel(formData: FormData): Promise<ResultatEnvoi> {
  const c = await autoriser("realisations.gerer");
  if (!c) return { ok: false, message: REFUS.message! };

  const id = Number(formData.get("realisationId"));
  const fichier = formData.get("fichier");
  if (!(fichier instanceof File) || fichier.size === 0) return { ok: false, message: "Aucun fichier reçu." };

  const r = await db.query.realisations.findFirst({ where: eq(realisations.id, id), columns: { id: true, titre: true } });
  if (!r) return { ok: false, message: "Réalisation introuvable." };

  try {
    const image = await enregistrerImage(fichier, r.titre);
    const [{ max }] = await db
      .select({ max: sql<number>`coalesce(max(${visuels.ordre}), -1)::int` })
      .from(visuels)
      .where(eq(visuels.realisationId, id));
    await db.insert(visuels).values({
      realisationId: id,
      url: image.url,
      largeur: image.largeur,
      hauteur: image.hauteur,
      alt: r.titre,
      ordre: max + 1,
      televerse: true,
    });
    await db.update(realisations).set({ majLe: new Date() }).where(eq(realisations.id, id));
  } catch (e) {
    console.error("[televerserVisuel]", e);
    return { ok: false, message: e instanceof Error ? e.message : "Envoi impossible." };
  }

  await journaliser(acteur(c), "visuel.ajoute", r.titre, { fichier: fichier.name });
  rafraichir(id);
  return { ok: true };
}

export async function supprimerVisuel(formData: FormData) {
  const c = await autoriser("realisations.gerer");
  if (!c) return;
  const id = Number(formData.get("id"));
  const v = await db.query.visuels.findFirst({ where: eq(visuels.id, id), with: { realisation: { columns: { titre: true } } } });
  if (!v) return;
  await db.delete(visuels).where(eq(visuels.id, id));
  if (v.televerse) await supprimerImage(v.url);
  await renumeroter(v.realisationId);
  await journaliser(acteur(c), "visuel.supprime", v.realisation.titre);
  rafraichir(v.realisationId);
}

/** Déplace un visuel d'un cran (« avant » / « apres ») ou le place en couverture. */
export async function deplacerVisuel(formData: FormData) {
  const c = await autoriser("realisations.gerer");
  if (!c) return;
  const id = Number(formData.get("id"));
  const sens = String(formData.get("sens"));
  const v = await db.query.visuels.findFirst({ where: eq(visuels.id, id) });
  if (!v) return;

  const ids = (
    await db
      .select({ id: visuels.id })
      .from(visuels)
      .where(eq(visuels.realisationId, v.realisationId))
      .orderBy(asc(visuels.ordre), asc(visuels.id))
  ).map((x) => x.id);
  const i = ids.indexOf(id);
  if (sens === "couverture" && i > 0) {
    ids.splice(i, 1);
    ids.unshift(id);
  } else if (sens === "avant" && i > 0) {
    [ids[i - 1], ids[i]] = [ids[i], ids[i - 1]];
  } else if (sens === "apres" && i < ids.length - 1) {
    [ids[i + 1], ids[i]] = [ids[i], ids[i + 1]];
  } else return;

  await renumeroter(v.realisationId, ids);
  rafraichir(v.realisationId);
}

export async function modifierTexteVisuel(formData: FormData) {
  const c = await autoriser("realisations.gerer");
  if (!c) return;
  const id = Number(formData.get("id"));
  const alt = String(formData.get("alt") ?? "").trim().slice(0, 200);
  const v = await db.query.visuels.findFirst({ where: eq(visuels.id, id), columns: { realisationId: true } });
  if (!v) return;
  await db.update(visuels).set({ alt }).where(eq(visuels.id, id));
  rafraichir(v.realisationId);
}
