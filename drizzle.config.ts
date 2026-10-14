import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

/**
 * Sert uniquement à générer les migrations SQL (npm run db:generate).
 * Elles sont ensuite appliquées par src/db/migrer.ts, en local (PGlite)
 * comme en production (PostgreSQL).
 */
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
});
