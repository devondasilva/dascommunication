"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { activites, commandes, modifications, services } from "@/db/schema";
import { journaliser } from "@/lib/audit";
import { acteur, autoriser } from "@/lib/auth";
import { STATUT_COMMANDE, STATUT_MODIFICATION } from "@/lib/constantes";
import { formaterPrix } from "@/i18n/commun";
import { statutCommande, statutModification } from "@/i18n/libelles";
import { formaterMontant } from "@/lib/format";
import {
  erreursDe,
  schemaMajCommande,
  schemaMajModification,
  schemaService,
  valeursDe,
  type EtatFormulaire,
} from "@/lib/validations";

const rafraichir = () => revalidatePath("/dashboard", "layout");
const REFUS: EtatFormulaire = { message: "Votre rôle ne vous permet pas cette action." };

/* ------------------------------------------------------------------ */
/*  Commandes                                                           */
/* ------------------------------------------------------------------ */

export async function mettreAJourCommande(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const c = await autoriser("commandes.gerer");
  if (!c) return REFUS;

  const parse = schemaMajCommande.safeParse(Object.fromEntries(formData));
  if (!parse.success) return { erreurs: erreursDe(parse.error), valeurs: valeursDe(formData) };
  const d = parse.data;

  const avant = await db.query.commandes.findFirst({ where: eq(commandes.id, d.id) });
  if (!avant) return { message: "Commande introuvable." };
  // Le montant ne peut être modifié qu'avec l'accès aux finances
  if (!c.peut("finances.voir")) d.montant = avant.montant;

  await db.transaction(async (tx) => {
    await tx
      .update(commandes)
      .set({
        statut: d.statut,
        montant: d.montant,
        notesInternes: d.notesInternes ?? null,
        majLe: new Date(),
      })
      .where(eq(commandes.id, d.id));

    if (avant.statut !== d.statut) {
      await tx.insert(activites).values({
        commandeId: d.id,
        message:
          avant.langue === "en"
            ? `Status: ${statutCommande(d.statut, "en").libelle}`
            : `Statut : ${STATUT_COMMANDE[d.statut].libelle}`,
      });
    }
    if (avant.montant !== d.montant && d.montant != null) {
      await tx.insert(activites).values({
        commandeId: d.id,
        message:
          avant.langue === "en"
            ? `Amount set to ${formaterPrix(d.montant, avant.devise, "en")}`
            : `Montant fixé à ${formaterMontant(d.montant, avant.devise)}`,
      });
    }
    if (d.messageClient) {
      await tx.insert(activites).values({ commandeId: d.id, message: d.messageClient });
    }
  });

  await journaliser(acteur(c), "commande.modifiee", avant.reference, {
    statut: avant.statut !== d.statut ? [avant.statut, d.statut] : undefined,
    montant: avant.montant !== d.montant ? [avant.montant, d.montant] : undefined,
  });
  rafraichir();
  revalidatePath(`/suivi/${avant.jetonSuivi}`);
  revalidatePath(`/en/suivi/${avant.jetonSuivi}`);
  return { ok: true, message: "Commande mise à jour." };
}

export async function supprimerCommande(formData: FormData) {
  const c = await autoriser("commandes.supprimer");
  if (!c) redirect("/dashboard/acces-refuse");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  const cmd = await db.query.commandes.findFirst({ where: eq(commandes.id, id), columns: { reference: true } });
  await db.transaction(async (tx) => {
    await tx.delete(modifications).where(eq(modifications.commandeId, id));
    await tx.delete(activites).where(eq(activites.commandeId, id));
    await tx.delete(commandes).where(eq(commandes.id, id));
  });
  await journaliser(acteur(c), "commande.supprimee", cmd?.reference);
  rafraichir();
  redirect("/dashboard/commandes");
}

/* ------------------------------------------------------------------ */
/*  Demandes de modification                                            */
/* ------------------------------------------------------------------ */

export async function mettreAJourModification(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const c = await autoriser("modifications.gerer");
  if (!c) return REFUS;

  const parse = schemaMajModification.safeParse(Object.fromEntries(formData));
  if (!parse.success) return { erreurs: erreursDe(parse.error), valeurs: valeursDe(formData) };
  const d = parse.data;

  const modif = await db.query.modifications.findFirst({
    where: eq(modifications.id, d.id),
    with: { commande: { columns: { id: true, jetonSuivi: true, statut: true, langue: true } } },
  });
  if (!modif) return { message: "Demande introuvable." };

  await db.transaction(async (tx) => {
    await tx
      .update(modifications)
      .set({ statut: d.statut, reponse: d.reponse ?? null, majLe: new Date() })
      .where(eq(modifications.id, d.id));

    if (modif.statut !== d.statut) {
      await tx.insert(activites).values({
        commandeId: modif.commandeId,
        message:
          modif.commande.langue === "en"
            ? `Change request: ${statutModification(d.statut, "en").libelle.toLowerCase()}`
            : `Demande de modification : ${STATUT_MODIFICATION[d.statut].libelle.toLowerCase()}`,
      });
    }

    // Toutes les demandes traitées → la commande sort de « En révision »
    if (modif.commande.statut === "en_revision" && (d.statut === "terminee" || d.statut === "refusee")) {
      const restantes = await tx.query.modifications.findFirst({
        where: and(
          eq(modifications.commandeId, modif.commandeId),
          ne(modifications.id, d.id),
          ne(modifications.statut, "terminee"),
          ne(modifications.statut, "refusee"),
        ),
        columns: { id: true },
      });
      if (!restantes) {
        await tx
          .update(commandes)
          .set({ statut: "en_cours", majLe: new Date() })
          .where(eq(commandes.id, modif.commandeId));
        await tx.insert(activites).values({
          commandeId: modif.commandeId,
          message:
            modif.commande.langue === "en"
              ? `Status: ${statutCommande("en_cours", "en").libelle}`
              : `Statut : ${STATUT_COMMANDE.en_cours.libelle}`,
        });
      }
    }
  });

  await journaliser(acteur(c), "modification.traitee", `#${d.id}`, { statut: d.statut });
  rafraichir();
  revalidatePath(`/suivi/${modif.commande.jetonSuivi}`);
  revalidatePath(`/en/suivi/${modif.commande.jetonSuivi}`);
  return { ok: true, message: "Demande mise à jour." };
}

/* ------------------------------------------------------------------ */
/*  Services                                                            */
/* ------------------------------------------------------------------ */

export async function enregistrerService(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const c = await autoriser("services.gerer");
  if (!c) return REFUS;

  const parse = schemaService.safeParse(Object.fromEntries(formData));
  if (!parse.success) {
    return {
      message: "Merci de corriger les champs indiqués.",
      erreurs: erreursDe(parse.error),
      valeurs: valeursDe(formData),
    };
  }
  const { id, ...valeurs } = parse.data;

  const doublon = await db.query.services.findFirst({
    where: id ? and(eq(services.slug, valeurs.slug), ne(services.id, id)) : eq(services.slug, valeurs.slug),
    columns: { id: true },
  });
  if (doublon) {
    return { erreurs: { slug: ["Ce slug est déjà utilisé"] }, valeurs: valeursDe(formData) };
  }

  if (id) {
    await db.update(services).set(valeurs).where(eq(services.id, id));
  } else {
    await db.insert(services).values(valeurs);
  }
  await journaliser(acteur(c), id ? "service.modifie" : "service.cree", valeurs.nom);

  rafraichir();
  revalidatePath("/", "layout");
  redirect("/dashboard/services");
}

export async function basculerService(formData: FormData) {
  const c = await autoriser("services.gerer");
  if (!c) return;
  const id = Number(formData.get("id"));
  const actif = formData.get("actif") === "true";
  await db.update(services).set({ actif: !actif }).where(eq(services.id, id));
  await journaliser(acteur(c), actif ? "service.masque" : "service.affiche", `#${id}`);
  rafraichir();
  revalidatePath("/", "layout");
}

export async function supprimerService(formData: FormData) {
  const c = await autoriser("services.gerer");
  if (!c) redirect("/dashboard/acces-refuse");
  const id = Number(formData.get("id"));
  // Les commandes existantes conservent le nom du service (serviceNom)
  await db.transaction(async (tx) => {
    await tx.update(commandes).set({ serviceId: null }).where(eq(commandes.serviceId, id));
    await tx.delete(services).where(eq(services.id, id));
  });
  await journaliser(acteur(c), "service.supprime", `#${id}`);
  rafraichir();
  revalidatePath("/", "layout");
  redirect("/dashboard/services");
}
