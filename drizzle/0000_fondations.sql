CREATE TABLE "activites" (
	"id" serial PRIMARY KEY NOT NULL,
	"commande_id" integer NOT NULL,
	"message" text NOT NULL,
	"visible_client" boolean DEFAULT true NOT NULL,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "commandes" (
	"id" serial PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"jeton_suivi" text NOT NULL,
	"client_id" uuid,
	"service_id" integer,
	"service_nom" text NOT NULL,
	"client_nom" text NOT NULL,
	"client_email" text NOT NULL,
	"client_telephone" text,
	"entreprise" text,
	"brief" text NOT NULL,
	"budget" text,
	"date_souhaitee" text,
	"statut" text DEFAULT 'nouvelle' NOT NULL,
	"montant" integer,
	"notes_internes" text,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL,
	"maj_le" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "commandes_reference_unique" UNIQUE("reference"),
	CONSTRAINT "commandes_jeton_suivi_unique" UNIQUE("jeton_suivi")
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"role_id" integer NOT NULL,
	"competences" text[] DEFAULT '{}'::text[] NOT NULL,
	"jeton_hash" text NOT NULL,
	"expire_le" timestamp with time zone NOT NULL,
	"acceptee_le" timestamp with time zone,
	"invite_par" uuid,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invitations_jeton_hash_unique" UNIQUE("jeton_hash")
);
--> statement-breakpoint
CREATE TABLE "journal_audit" (
	"id" serial PRIMARY KEY NOT NULL,
	"acteur_id" uuid,
	"acteur_email" text,
	"action" text NOT NULL,
	"cible" text,
	"details" jsonb,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "modifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"commande_id" integer NOT NULL,
	"description" text NOT NULL,
	"priorite" text DEFAULT 'normale' NOT NULL,
	"statut" text DEFAULT 'en_attente' NOT NULL,
	"reponse" text,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL,
	"maj_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"nom" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"permissions" text[] DEFAULT '{}'::text[] NOT NULL,
	"systeme" boolean DEFAULT false NOT NULL,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"nom" text NOT NULL,
	"categorie" text NOT NULL,
	"resume" text NOT NULL,
	"description" text NOT NULL,
	"livrables" text DEFAULT '' NOT NULL,
	"prix_depart" integer NOT NULL,
	"delai_jours" integer NOT NULL,
	"actif" boolean DEFAULT true NOT NULL,
	"ordre" integer DEFAULT 0 NOT NULL,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "utilisateurs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"nom" text,
	"image" text,
	"type" text DEFAULT 'client' NOT NULL,
	"role_id" integer,
	"competences" text[] DEFAULT '{}'::text[] NOT NULL,
	"google_id" text,
	"mot_de_passe" text,
	"secret_2fa" text,
	"actif" boolean DEFAULT true NOT NULL,
	"entreprise" text,
	"telephone" text,
	"pays" text,
	"profil_complet" boolean DEFAULT false NOT NULL,
	"derniere_connexion" timestamp with time zone,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activites" ADD CONSTRAINT "activites_commande_id_commandes_id_fk" FOREIGN KEY ("commande_id") REFERENCES "public"."commandes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commandes" ADD CONSTRAINT "commandes_client_id_utilisateurs_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."utilisateurs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commandes" ADD CONSTRAINT "commandes_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invite_par_utilisateurs_id_fk" FOREIGN KEY ("invite_par") REFERENCES "public"."utilisateurs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_audit" ADD CONSTRAINT "journal_audit_acteur_id_utilisateurs_id_fk" FOREIGN KEY ("acteur_id") REFERENCES "public"."utilisateurs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modifications" ADD CONSTRAINT "modifications_commande_id_commandes_id_fk" FOREIGN KEY ("commande_id") REFERENCES "public"."commandes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "utilisateurs" ADD CONSTRAINT "utilisateurs_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activites_commande_idx" ON "activites" USING btree ("commande_id");--> statement-breakpoint
CREATE INDEX "commandes_statut_idx" ON "commandes" USING btree ("statut");--> statement-breakpoint
CREATE INDEX "commandes_cree_le_idx" ON "commandes" USING btree ("cree_le");--> statement-breakpoint
CREATE INDEX "commandes_email_idx" ON "commandes" USING btree (lower("client_email"));--> statement-breakpoint
CREATE INDEX "commandes_client_idx" ON "commandes" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "journal_cree_le_idx" ON "journal_audit" USING btree ("cree_le");--> statement-breakpoint
CREATE INDEX "journal_action_idx" ON "journal_audit" USING btree ("action");--> statement-breakpoint
CREATE INDEX "modifications_commande_idx" ON "modifications" USING btree ("commande_id");--> statement-breakpoint
CREATE INDEX "modifications_statut_idx" ON "modifications" USING btree ("statut");--> statement-breakpoint
CREATE UNIQUE INDEX "utilisateurs_email_idx" ON "utilisateurs" USING btree (lower("email"));--> statement-breakpoint
CREATE UNIQUE INDEX "utilisateurs_google_idx" ON "utilisateurs" USING btree ("google_id");--> statement-breakpoint
CREATE INDEX "utilisateurs_type_idx" ON "utilisateurs" USING btree ("type");