CREATE TABLE "parametres" (
	"cle" text PRIMARY KEY NOT NULL,
	"valeur" text NOT NULL,
	"maj_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "realisations" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"titre" text NOT NULL,
	"categorie" text NOT NULL,
	"description" text,
	"client" text,
	"secteur" text,
	"lien" text,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"mis_en_avant" boolean DEFAULT false NOT NULL,
	"publie" boolean DEFAULT true NOT NULL,
	"ordre" integer DEFAULT 0 NOT NULL,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL,
	"maj_le" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "realisations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "visuels" (
	"id" serial PRIMARY KEY NOT NULL,
	"realisation_id" integer NOT NULL,
	"url" text NOT NULL,
	"largeur" integer NOT NULL,
	"hauteur" integer NOT NULL,
	"alt" text DEFAULT '' NOT NULL,
	"ordre" integer DEFAULT 0 NOT NULL,
	"televerse" boolean DEFAULT false NOT NULL,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "visuels" ADD CONSTRAINT "visuels_realisation_id_realisations_id_fk" FOREIGN KEY ("realisation_id") REFERENCES "public"."realisations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "realisations_categorie_idx" ON "realisations" USING btree ("categorie");--> statement-breakpoint
CREATE INDEX "realisations_ordre_idx" ON "realisations" USING btree ("ordre");--> statement-breakpoint
CREATE INDEX "visuels_realisation_idx" ON "visuels" USING btree ("realisation_id","ordre");