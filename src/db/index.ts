import "server-only";
import { MODE_DEMO } from "@/lib/config";
import { migrer } from "./migrer";
import { peupler } from "./peupler";
import * as schema from "./schema";
import type { BaseDeDonnees } from "./types";

/**
 * Connexion unique à la base, réutilisée entre les rechargements à chaud.
 * - DATABASE_URL défini → PostgreSQL (Neon, Supabase, Railway…) via postgres-js
 * - sinon → PGlite (PostgreSQL embarqué) : mode démo, zéro configuration
 */
const globale = globalThis as unknown as { __db?: Promise<BaseDeDonnees> };

async function ouvrir(): Promise<BaseDeDonnees> {
  if (!MODE_DEMO) {
    const [{ default: postgres }, { drizzle }] = await Promise.all([
      import("postgres"),
      import("drizzle-orm/postgres-js"),
    ]);
    const client = postgres(process.env.DATABASE_URL!, { prepare: false, max: 5 });
    return drizzle(client, { schema }) as unknown as BaseDeDonnees;
  }

  const [{ PGlite }, { drizzle }] = await Promise.all([
    import("@electric-sql/pglite"),
    import("drizzle-orm/pglite"),
  ]);
  // Sur Vercel seul /tmp est inscriptible ; en local, la base vit dans ./.pglite
  const dossier = process.env.PGLITE_DIR ?? (process.env.VERCEL ? "/tmp/pglite-dascom" : "./.pglite");
  const client = new PGlite(dossier);
  const db = drizzle(client, { schema }) as unknown as BaseDeDonnees;
  await migrer(db);
  await peupler(db, { demo: true });
  return db;
}

/**
 * Pendant `next build`, aucune page ne lit la base (toutes les lectures se
 * font à la requête) : on n'ouvre donc pas de connexion, ce qui évite que
 * plusieurs processus de build accèdent au même fichier PGlite.
 */
const enBuild = process.env.NEXT_PHASE === "phase-production-build";

function indisponible(): BaseDeDonnees {
  return new Proxy({} as BaseDeDonnees, {
    get() {
      throw new Error("Base de données indisponible pendant le build (lecture à faire à la requête).");
    },
  });
}

if (!enBuild) globale.__db ??= ouvrir();

export const db: BaseDeDonnees = enBuild ? indisponible() : await globale.__db!;
