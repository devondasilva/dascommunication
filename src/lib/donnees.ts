import "server-only";
import { and, asc, count, desc, eq, gte, ilike, inArray, isNull, or, sql, sum } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";
import {
  activites,
  commandes,
  invitations,
  journalAudit,
  modifications,
  roles,
  services,
  utilisateurs,
  type StatutCommande,
  type StatutModification,
} from "@/db/schema";

/**
 * Toutes les lectures se font à la requête (données toujours à jour,
 * et le build n'a pas besoin d'accéder à la base).
 */

/* ================================================================== */
/*  Public                                                              */
/* ================================================================== */

export async function servicesActifs() {
  await connection();
  return db.query.services.findMany({
    where: eq(services.actif, true),
    orderBy: [asc(services.ordre), asc(services.nom)],
  });
}

export async function serviceParSlug(slug: string) {
  await connection();
  return db.query.services.findFirst({
    where: and(eq(services.slug, slug), eq(services.actif, true)),
  });
}

/** Espace de suivi client : uniquement via le jeton secret. */
export async function commandeParJeton(jeton: string) {
  await connection();
  return db.query.commandes.findFirst({
    where: eq(commandes.jetonSuivi, jeton),
    columns: { notesInternes: false },
    with: {
      modifications: { orderBy: [desc(modifications.creeLe)] },
      activites: {
        where: eq(activites.visibleClient, true),
        orderBy: [desc(activites.creeLe), desc(activites.id)],
      },
    },
  });
}

/* ================================================================== */
/*  Dashboard                                                           */
/* ================================================================== */

export async function compteursMenu() {
  await connection();
  const [[c], [m]] = await Promise.all([
    db.select({ n: count() }).from(commandes).where(eq(commandes.statut, "nouvelle")),
    db.select({ n: count() }).from(modifications).where(eq(modifications.statut, "en_attente")),
  ]);
  return { commandesNouvelles: c.n, modificationsEnAttente: m.n };
}

function debutDuMois(decalageMois = 0) {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + decalageMois, 1);
}

export async function statistiques() {
  await connection();
  const debutMois = debutDuMois();
  const debut6Mois = debutDuMois(-5);

  const [parStatut, [caMois], [caTotal], [enCoursMontant], [modifsAttente], parMoisBrut, topServices] =
    await Promise.all([
      db.select({ statut: commandes.statut, n: count() }).from(commandes).groupBy(commandes.statut),
      db
        .select({ total: sum(commandes.montant) })
        .from(commandes)
        .where(and(eq(commandes.statut, "livree"), gte(commandes.majLe, debutMois))),
      db.select({ total: sum(commandes.montant) }).from(commandes).where(eq(commandes.statut, "livree")),
      db
        .select({ total: sum(commandes.montant) })
        .from(commandes)
        .where(inArray(commandes.statut, ["en_cours", "en_revision"])),
      db.select({ n: count() }).from(modifications).where(eq(modifications.statut, "en_attente")),
      db
        .select({
          mois: sql<string>`to_char(${commandes.creeLe}, 'YYYY-MM')`.as("mois"),
          n: count(),
        })
        .from(commandes)
        .where(gte(commandes.creeLe, debut6Mois))
        .groupBy(sql`mois`),
      db
        .select({ nom: commandes.serviceNom, n: count() })
        .from(commandes)
        .where(sql`${commandes.statut} != 'annulee'`)
        .groupBy(commandes.serviceNom)
        .orderBy(desc(count()))
        .limit(5),
    ]);

  const compte = Object.fromEntries(parStatut.map((r) => [r.statut, r.n])) as Partial<
    Record<StatutCommande, number>
  >;

  // Série complète des 6 derniers mois (mois vides inclus)
  const indexMois = new Map(parMoisBrut.map((r) => [r.mois, r.n]));
  const fmtMois = new Intl.DateTimeFormat("fr-FR", { month: "short" });
  const parMois = Array.from({ length: 6 }, (_, i) => {
    const d = debutDuMois(i - 5);
    const cle = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return { cle, libelle: fmtMois.format(d).replace(".", ""), n: indexMois.get(cle) ?? 0 };
  });

  return {
    compte,
    total: parStatut.reduce((a, r) => a + r.n, 0),
    caMois: Number(caMois.total ?? 0),
    caTotal: Number(caTotal.total ?? 0),
    montantEnCours: Number(enCoursMontant.total ?? 0),
    modificationsEnAttente: modifsAttente.n,
    parMois,
    topServices,
  };
}

export async function dernieresCommandes(limite = 6) {
  await connection();
  return db.query.commandes.findMany({
    orderBy: [desc(commandes.creeLe), desc(commandes.id)],
    limit: limite,
  });
}

export async function listeCommandes(filtres: { statut?: StatutCommande; q?: string }) {
  await connection();
  const conditions = [];
  if (filtres.statut) conditions.push(eq(commandes.statut, filtres.statut));
  if (filtres.q) {
    const motif = `%${filtres.q}%`;
    conditions.push(
      or(
        ilike(commandes.reference, motif),
        ilike(commandes.clientNom, motif),
        ilike(commandes.clientEmail, motif),
        ilike(commandes.entreprise, motif),
        ilike(commandes.serviceNom, motif),
      ),
    );
  }
  return db.query.commandes.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    orderBy: [desc(commandes.creeLe), desc(commandes.id)],
    with: {
      modifications: { columns: { id: true, statut: true } },
    },
  });
}

export async function commandeDetail(id: number) {
  await connection();
  return db.query.commandes.findFirst({
    where: eq(commandes.id, id),
    with: {
      service: true,
      modifications: { orderBy: [desc(modifications.creeLe)] },
      activites: { orderBy: [desc(activites.creeLe), desc(activites.id)] },
    },
  });
}

export async function listeModifications(statut?: StatutModification) {
  await connection();
  return db.query.modifications.findMany({
    where: statut ? eq(modifications.statut, statut) : undefined,
    orderBy: [desc(modifications.creeLe), desc(modifications.id)],
    with: {
      commande: {
        columns: { id: true, reference: true, clientNom: true, serviceNom: true, entreprise: true },
      },
    },
  });
}

export async function compteModificationsParStatut() {
  await connection();
  const lignes = await db
    .select({ statut: modifications.statut, n: count() })
    .from(modifications)
    .groupBy(modifications.statut);
  return Object.fromEntries(lignes.map((l) => [l.statut, l.n])) as Partial<Record<StatutModification, number>>;
}

export async function tousLesServices() {
  await connection();
  const [liste, usage] = await Promise.all([
    db.query.services.findMany({ orderBy: [asc(services.ordre), asc(services.nom)] }),
    db
      .select({ serviceId: commandes.serviceId, n: count() })
      .from(commandes)
      .groupBy(commandes.serviceId),
  ]);
  const parId = new Map(usage.map((u) => [u.serviceId, u.n]));
  return liste.map((s) => ({ ...s, nbCommandes: parId.get(s.id) ?? 0 }));
}

export async function serviceParId(id: number) {
  await connection();
  return db.query.services.findFirst({ where: eq(services.id, id) });
}

/* ================================================================== */
/*  Espace client                                                       */
/* ================================================================== */

/** Commandes du client : rattachées à son compte ou passées avec son e-mail avant inscription. */
export async function commandesDuClient(clientId: string, email: string) {
  await connection();
  return db.query.commandes.findMany({
    where: or(eq(commandes.clientId, clientId), sql`lower(${commandes.clientEmail}) = ${email.toLowerCase()}`),
    orderBy: [desc(commandes.creeLe)],
    columns: { notesInternes: false },
    with: { modifications: { columns: { id: true, statut: true } } },
  });
}

/* ================================================================== */
/*  Équipe, rôles, clients, audit                                       */
/* ================================================================== */

export async function membresEquipe() {
  await connection();
  return db.query.utilisateurs.findMany({
    where: eq(utilisateurs.type, "equipe"),
    columns: { motDePasse: false, secret2fa: false },
    with: { role: true },
    orderBy: [desc(utilisateurs.actif), asc(utilisateurs.nom)],
  });
}

export async function invitationsEnAttente() {
  await connection();
  return db.query.invitations.findMany({
    where: and(isNull(invitations.acceptee), gte(invitations.expireLe, new Date())),
    with: { role: { columns: { nom: true } } },
    orderBy: [desc(invitations.creeLe)],
  });
}

export async function tousLesRoles() {
  await connection();
  const [liste, usage] = await Promise.all([
    db.query.roles.findMany({ orderBy: [desc(roles.systeme), asc(roles.nom)] }),
    db
      .select({ roleId: utilisateurs.roleId, n: count() })
      .from(utilisateurs)
      .where(eq(utilisateurs.type, "equipe"))
      .groupBy(utilisateurs.roleId),
  ]);
  const parId = new Map(usage.map((u) => [u.roleId, u.n]));
  return liste.map((r) => ({ ...r, nbMembres: parId.get(r.id) ?? 0 }));
}

export async function roleParId(id: number) {
  await connection();
  return db.query.roles.findFirst({ where: eq(roles.id, id) });
}

export async function listeClients(q?: string) {
  await connection();
  const motif = q ? `%${q}%` : undefined;
  const lignes = await db
    .select({
      id: utilisateurs.id,
      email: utilisateurs.email,
      nom: utilisateurs.nom,
      image: utilisateurs.image,
      entreprise: utilisateurs.entreprise,
      telephone: utilisateurs.telephone,
      pays: utilisateurs.pays,
      creeLe: utilisateurs.creeLe,
      derniereConnexion: utilisateurs.derniereConnexion,
      nbCommandes: sql<number>`(select count(*)::int from commandes c where c.client_id = "utilisateurs"."id" or lower(c.client_email) = lower("utilisateurs"."email"))`,
    })
    .from(utilisateurs)
    .where(
      and(
        eq(utilisateurs.type, "client"),
        motif
          ? or(ilike(utilisateurs.email, motif), ilike(utilisateurs.nom, motif), ilike(utilisateurs.entreprise, motif))
          : undefined,
      ),
    )
    .orderBy(desc(utilisateurs.creeLe));
  return lignes;
}

export async function journal(limite = 100) {
  await connection();
  return db.query.journalAudit.findMany({ orderBy: [desc(journalAudit.creeLe), desc(journalAudit.id)], limit: limite });
}
