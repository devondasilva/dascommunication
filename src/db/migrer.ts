import { sql } from "drizzle-orm";
import { MIGRATIONS } from "./migrations.generated";
import type { BaseDeDonnees } from "./types";

/**
 * Applique les migrations embarquées qui ne l'ont pas encore été.
 * Chaque migration s'exécute dans une transaction ; son nom est
 * enregistré dans la table _migrations.
 */
export async function migrer(db: BaseDeDonnees) {
  await db.execute(sql`create table if not exists _migrations (
    nom text primary key,
    appliquee_le timestamptz not null default now()
  )`);

  const deja = await db.execute<{ nom: string }>(sql`select nom from _migrations`);
  const lignes = (Array.isArray(deja) ? deja : (deja as { rows: { nom: string }[] }).rows) as { nom: string }[];
  const appliquees = new Set(lignes.map((l) => l.nom));

  let nb = 0;
  for (const m of MIGRATIONS) {
    if (appliquees.has(m.nom)) continue;
    await db.transaction(async (tx) => {
      for (const requete of m.requetes) await tx.execute(sql.raw(requete));
      await tx.execute(sql`insert into _migrations (nom) values (${m.nom})`);
    });
    nb++;
  }
  return nb;
}
