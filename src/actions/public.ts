"use server";

import { randomBytes } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { utilisateurConnecte } from "@/lib/auth";
import { activites, commandes, modifications, services } from "@/db/schema";
import {
  erreursDe,
  schemaCommande,
  schemaDemandeModification,
  schemaRechercheSuivi,
  valeursDe,
  type EtatFormulaire,
} from "@/lib/validations";

/** Champ « pot de miel » invisible : rempli uniquement par les robots. */
const estUnRobot = (formData: FormData) => Boolean(formData.get("site_web"));

/* ------------------------------------------------------------------ */
/*  Passer une commande                                                 */
/* ------------------------------------------------------------------ */

export async function passerCommande(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  if (estUnRobot(formData)) return { ok: true };

  const parse = schemaCommande.safeParse(Object.fromEntries(formData));
  if (!parse.success) {
    return {
      message: "Merci de corriger les champs indiqués.",
      erreurs: erreursDe(parse.error),
      valeurs: valeursDe(formData),
    };
  }
  const d = parse.data;

  const service = await db.query.services.findFirst({
    where: and(eq(services.id, d.serviceId), eq(services.actif, true)),
  });
  if (!service) {
    return {
      message: "Ce service n'est plus disponible.",
      erreurs: { serviceId: ["Choisissez un autre service"] },
      valeurs: valeursDe(formData),
    };
  }

  const jetonSuivi = randomBytes(18).toString("base64url");
  // Commande rattachée au compte client s'il est connecté
  const connecte = await utilisateurConnecte();
  const clientId = connecte?.utilisateur.type === "client" ? connecte.utilisateur.id : null;

  await db.transaction(async (tx) => {
    const [cmd] = await tx
      .insert(commandes)
      .values({
        reference: `TMP-${jetonSuivi}`,
        jetonSuivi,
        clientId,
        serviceId: service.id,
        serviceNom: service.nom,
        clientNom: d.clientNom,
        clientEmail: d.clientEmail,
        clientTelephone: d.clientTelephone,
        entreprise: d.entreprise,
        brief: d.brief,
        budget: d.budget,
        dateSouhaitee: d.dateSouhaitee,
      })
      .returning({ id: commandes.id });

    // Référence lisible basée sur l'identifiant : unique et séquentielle
    const reference = `CMD-${new Date().getFullYear()}-${String(cmd.id).padStart(4, "0")}`;
    await tx.update(commandes).set({ reference }).where(eq(commandes.id, cmd.id));
    await tx.insert(activites).values({ commandeId: cmd.id, message: "Commande reçue" });
  });

  revalidatePath("/dashboard", "layout");
  revalidatePath("/espace");
  redirect(`/suivi/${jetonSuivi}?nouvelle=1`);
}

/* ------------------------------------------------------------------ */
/*  Retrouver une commande (référence + e-mail)                         */
/* ------------------------------------------------------------------ */

export async function rechercherCommande(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const parse = schemaRechercheSuivi.safeParse(Object.fromEntries(formData));
  if (!parse.success) {
    return { erreurs: erreursDe(parse.error), valeurs: valeursDe(formData) };
  }

  const cmd = await db.query.commandes.findFirst({
    where: and(eq(commandes.reference, parse.data.reference), eq(commandes.clientEmail, parse.data.email)),
    columns: { jetonSuivi: true },
  });

  if (!cmd) {
    // Message volontairement générique : on ne révèle pas si la référence existe
    return {
      message: "Aucune commande ne correspond à cette référence et cette adresse e-mail.",
      valeurs: valeursDe(formData),
    };
  }

  redirect(`/suivi/${cmd.jetonSuivi}`);
}

/* ------------------------------------------------------------------ */
/*  Demander une modification                                           */
/* ------------------------------------------------------------------ */

export async function demanderModification(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  if (estUnRobot(formData)) return { ok: true };

  const parse = schemaDemandeModification.safeParse(Object.fromEntries(formData));
  if (!parse.success) {
    return { erreurs: erreursDe(parse.error), valeurs: valeursDe(formData) };
  }

  const cmd = await db.query.commandes.findFirst({
    where: eq(commandes.jetonSuivi, parse.data.jeton),
    columns: { id: true, statut: true },
  });
  if (!cmd) return { message: "Commande introuvable." };
  if (cmd.statut === "annulee") {
    return { message: "Cette commande est annulée : impossible de demander une modification." };
  }

  await db.transaction(async (tx) => {
    await tx.insert(modifications).values({
      commandeId: cmd.id,
      description: parse.data.description,
      priorite: parse.data.priorite,
    });
    // Une demande sur un projet livré ou en cours le repasse en révision
    if (cmd.statut === "livree" || cmd.statut === "en_cours") {
      await tx
        .update(commandes)
        .set({ statut: "en_revision", majLe: new Date() })
        .where(eq(commandes.id, cmd.id));
    }
    await tx.insert(activites).values({
      commandeId: cmd.id,
      message: "Demande de modification envoyée",
    });
  });

  revalidatePath(`/suivi/${parse.data.jeton}`);
  revalidatePath("/dashboard", "layout");
  return { ok: true, message: "Votre demande a bien été envoyée. Nous revenons vers vous rapidement." };
}
