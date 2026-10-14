ALTER TABLE "commandes" ADD COLUMN "devise" text DEFAULT 'XOF' NOT NULL;--> statement-breakpoint
ALTER TABLE "commandes" ADD COLUMN "langue" text DEFAULT 'fr' NOT NULL;--> statement-breakpoint
ALTER TABLE "realisations" ADD COLUMN "titre_en" text;--> statement-breakpoint
ALTER TABLE "realisations" ADD COLUMN "description_en" text;--> statement-breakpoint
ALTER TABLE "realisations" ADD COLUMN "secteur_en" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "prix_usd" integer;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "nom_en" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "resume_en" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "description_en" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "livrables_en" text;