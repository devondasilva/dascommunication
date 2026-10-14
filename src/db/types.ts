import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import type * as schema from "./schema";

/** Type commun aux deux pilotes (PGlite en local / démo, postgres-js en production). */
export type BaseDeDonnees = PgDatabase<PgQueryResultHKT, typeof schema>;
