import "server-only";
import { db } from "@/db";
import { journalAudit } from "@/db/schema";

type Acteur = { id: string; email: string } | null;

/** Enregistre une action sensible dans le journal d'audit (sans jamais bloquer l'action). */
export async function journaliser(acteur: Acteur, action: string, cible?: string, details?: Record<string, unknown>) {
  try {
    await db.insert(journalAudit).values({
      acteurId: acteur?.id ?? null,
      acteurEmail: acteur?.email ?? null,
      action,
      cible: cible ?? null,
      details: details ?? null,
    });
  } catch (e) {
    console.error("[audit] écriture impossible", e);
  }
}
