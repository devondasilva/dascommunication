/**
 * Prépare une base PostgreSQL de production : migrations + données initiales.
 *
 *   npm run db:setup            → migrations, rôles, super-admin (ADMIN_EMAIL / ADMIN_PASSWORD), catalogue
 *   npm run db:setup -- --demo  → idem + commandes et membre d'équipe fictifs
 *
 * Sans DATABASE_URL, rien à faire : le mode démo (PGlite) se prépare tout seul.
 */
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log("ℹ DATABASE_URL absent : mode démo (PGlite), la base se prépare au démarrage.");
    return;
  }
  const [{ default: postgres }, { drizzle }, schema, { migrer }, { peupler }] = await Promise.all([
    import("postgres"),
    import("drizzle-orm/postgres-js"),
    import("./schema"),
    import("./migrer"),
    import("./peupler"),
  ]);
  const client = postgres(process.env.DATABASE_URL, { prepare: false, max: 1 });
  const db = drizzle(client, { schema }) as never;
  try {
    const n = await migrer(db);
    console.log(`✓ ${n} migration(s) appliquée(s)`);
    await peupler(db, { demo: process.argv.includes("--demo") });
    console.log("✓ Données initiales en place");
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
