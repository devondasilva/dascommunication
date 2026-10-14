/**
 * Copie les migrations SQL de ./drizzle dans src/db/migrations.generated.ts
 * pour qu'elles soient embarquées dans l'application (aucun fichier à lire
 * au démarrage, ce qui fonctionne aussi sur Vercel).
 * Lancé automatiquement par `npm run db:generate`.
 */
import fs from "node:fs";
import path from "node:path";

const dossier = path.resolve("drizzle");
const fichiers = fs.readdirSync(dossier).filter((f) => f.endsWith(".sql")).sort();
const migrations = fichiers.map((f) => ({
  nom: f.replace(/\.sql$/, ""),
  requetes: fs
    .readFileSync(path.join(dossier, f), "utf8")
    .split("--> statement-breakpoint")
    .map((q) => q.trim())
    .filter(Boolean),
}));

const contenu = `// Fichier généré par scripts/embarquer-migrations.mjs — ne pas modifier à la main.
export const MIGRATIONS: { nom: string; requetes: string[] }[] = ${JSON.stringify(migrations, null, 2)};
`;
fs.writeFileSync(path.resolve("src/db/migrations.generated.ts"), contenu);
console.log(`✓ ${migrations.length} migration(s) embarquée(s)`);
