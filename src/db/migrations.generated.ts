// Fichier généré par scripts/embarquer-migrations.mjs — ne pas modifier à la main.
export const MIGRATIONS: { nom: string; requetes: string[] }[] = [
  {
    "nom": "0000_fondations",
    "requetes": [
      "CREATE TABLE \"activites\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"commande_id\" integer NOT NULL,\n\t\"message\" text NOT NULL,\n\t\"visible_client\" boolean DEFAULT true NOT NULL,\n\t\"cree_le\" timestamp with time zone DEFAULT now() NOT NULL\n);",
      "CREATE TABLE \"commandes\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"reference\" text NOT NULL,\n\t\"jeton_suivi\" text NOT NULL,\n\t\"client_id\" uuid,\n\t\"service_id\" integer,\n\t\"service_nom\" text NOT NULL,\n\t\"client_nom\" text NOT NULL,\n\t\"client_email\" text NOT NULL,\n\t\"client_telephone\" text,\n\t\"entreprise\" text,\n\t\"brief\" text NOT NULL,\n\t\"budget\" text,\n\t\"date_souhaitee\" text,\n\t\"statut\" text DEFAULT 'nouvelle' NOT NULL,\n\t\"montant\" integer,\n\t\"notes_internes\" text,\n\t\"cree_le\" timestamp with time zone DEFAULT now() NOT NULL,\n\t\"maj_le\" timestamp with time zone DEFAULT now() NOT NULL,\n\tCONSTRAINT \"commandes_reference_unique\" UNIQUE(\"reference\"),\n\tCONSTRAINT \"commandes_jeton_suivi_unique\" UNIQUE(\"jeton_suivi\")\n);",
      "CREATE TABLE \"invitations\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"email\" text NOT NULL,\n\t\"role_id\" integer NOT NULL,\n\t\"competences\" text[] DEFAULT '{}'::text[] NOT NULL,\n\t\"jeton_hash\" text NOT NULL,\n\t\"expire_le\" timestamp with time zone NOT NULL,\n\t\"acceptee_le\" timestamp with time zone,\n\t\"invite_par\" uuid,\n\t\"cree_le\" timestamp with time zone DEFAULT now() NOT NULL,\n\tCONSTRAINT \"invitations_jeton_hash_unique\" UNIQUE(\"jeton_hash\")\n);",
      "CREATE TABLE \"journal_audit\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"acteur_id\" uuid,\n\t\"acteur_email\" text,\n\t\"action\" text NOT NULL,\n\t\"cible\" text,\n\t\"details\" jsonb,\n\t\"cree_le\" timestamp with time zone DEFAULT now() NOT NULL\n);",
      "CREATE TABLE \"modifications\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"commande_id\" integer NOT NULL,\n\t\"description\" text NOT NULL,\n\t\"priorite\" text DEFAULT 'normale' NOT NULL,\n\t\"statut\" text DEFAULT 'en_attente' NOT NULL,\n\t\"reponse\" text,\n\t\"cree_le\" timestamp with time zone DEFAULT now() NOT NULL,\n\t\"maj_le\" timestamp with time zone DEFAULT now() NOT NULL\n);",
      "CREATE TABLE \"roles\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"slug\" text NOT NULL,\n\t\"nom\" text NOT NULL,\n\t\"description\" text DEFAULT '' NOT NULL,\n\t\"permissions\" text[] DEFAULT '{}'::text[] NOT NULL,\n\t\"systeme\" boolean DEFAULT false NOT NULL,\n\t\"cree_le\" timestamp with time zone DEFAULT now() NOT NULL,\n\tCONSTRAINT \"roles_slug_unique\" UNIQUE(\"slug\")\n);",
      "CREATE TABLE \"services\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"slug\" text NOT NULL,\n\t\"nom\" text NOT NULL,\n\t\"categorie\" text NOT NULL,\n\t\"resume\" text NOT NULL,\n\t\"description\" text NOT NULL,\n\t\"livrables\" text DEFAULT '' NOT NULL,\n\t\"prix_depart\" integer NOT NULL,\n\t\"delai_jours\" integer NOT NULL,\n\t\"actif\" boolean DEFAULT true NOT NULL,\n\t\"ordre\" integer DEFAULT 0 NOT NULL,\n\t\"cree_le\" timestamp with time zone DEFAULT now() NOT NULL,\n\tCONSTRAINT \"services_slug_unique\" UNIQUE(\"slug\")\n);",
      "CREATE TABLE \"utilisateurs\" (\n\t\"id\" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,\n\t\"email\" text NOT NULL,\n\t\"nom\" text,\n\t\"image\" text,\n\t\"type\" text DEFAULT 'client' NOT NULL,\n\t\"role_id\" integer,\n\t\"competences\" text[] DEFAULT '{}'::text[] NOT NULL,\n\t\"google_id\" text,\n\t\"mot_de_passe\" text,\n\t\"secret_2fa\" text,\n\t\"actif\" boolean DEFAULT true NOT NULL,\n\t\"entreprise\" text,\n\t\"telephone\" text,\n\t\"pays\" text,\n\t\"profil_complet\" boolean DEFAULT false NOT NULL,\n\t\"derniere_connexion\" timestamp with time zone,\n\t\"cree_le\" timestamp with time zone DEFAULT now() NOT NULL\n);",
      "ALTER TABLE \"activites\" ADD CONSTRAINT \"activites_commande_id_commandes_id_fk\" FOREIGN KEY (\"commande_id\") REFERENCES \"public\".\"commandes\"(\"id\") ON DELETE cascade ON UPDATE no action;",
      "ALTER TABLE \"commandes\" ADD CONSTRAINT \"commandes_client_id_utilisateurs_id_fk\" FOREIGN KEY (\"client_id\") REFERENCES \"public\".\"utilisateurs\"(\"id\") ON DELETE set null ON UPDATE no action;",
      "ALTER TABLE \"commandes\" ADD CONSTRAINT \"commandes_service_id_services_id_fk\" FOREIGN KEY (\"service_id\") REFERENCES \"public\".\"services\"(\"id\") ON DELETE set null ON UPDATE no action;",
      "ALTER TABLE \"invitations\" ADD CONSTRAINT \"invitations_role_id_roles_id_fk\" FOREIGN KEY (\"role_id\") REFERENCES \"public\".\"roles\"(\"id\") ON DELETE cascade ON UPDATE no action;",
      "ALTER TABLE \"invitations\" ADD CONSTRAINT \"invitations_invite_par_utilisateurs_id_fk\" FOREIGN KEY (\"invite_par\") REFERENCES \"public\".\"utilisateurs\"(\"id\") ON DELETE set null ON UPDATE no action;",
      "ALTER TABLE \"journal_audit\" ADD CONSTRAINT \"journal_audit_acteur_id_utilisateurs_id_fk\" FOREIGN KEY (\"acteur_id\") REFERENCES \"public\".\"utilisateurs\"(\"id\") ON DELETE set null ON UPDATE no action;",
      "ALTER TABLE \"modifications\" ADD CONSTRAINT \"modifications_commande_id_commandes_id_fk\" FOREIGN KEY (\"commande_id\") REFERENCES \"public\".\"commandes\"(\"id\") ON DELETE cascade ON UPDATE no action;",
      "ALTER TABLE \"utilisateurs\" ADD CONSTRAINT \"utilisateurs_role_id_roles_id_fk\" FOREIGN KEY (\"role_id\") REFERENCES \"public\".\"roles\"(\"id\") ON DELETE set null ON UPDATE no action;",
      "CREATE INDEX \"activites_commande_idx\" ON \"activites\" USING btree (\"commande_id\");",
      "CREATE INDEX \"commandes_statut_idx\" ON \"commandes\" USING btree (\"statut\");",
      "CREATE INDEX \"commandes_cree_le_idx\" ON \"commandes\" USING btree (\"cree_le\");",
      "CREATE INDEX \"commandes_email_idx\" ON \"commandes\" USING btree (lower(\"client_email\"));",
      "CREATE INDEX \"commandes_client_idx\" ON \"commandes\" USING btree (\"client_id\");",
      "CREATE INDEX \"journal_cree_le_idx\" ON \"journal_audit\" USING btree (\"cree_le\");",
      "CREATE INDEX \"journal_action_idx\" ON \"journal_audit\" USING btree (\"action\");",
      "CREATE INDEX \"modifications_commande_idx\" ON \"modifications\" USING btree (\"commande_id\");",
      "CREATE INDEX \"modifications_statut_idx\" ON \"modifications\" USING btree (\"statut\");",
      "CREATE UNIQUE INDEX \"utilisateurs_email_idx\" ON \"utilisateurs\" USING btree (lower(\"email\"));",
      "CREATE UNIQUE INDEX \"utilisateurs_google_idx\" ON \"utilisateurs\" USING btree (\"google_id\");",
      "CREATE INDEX \"utilisateurs_type_idx\" ON \"utilisateurs\" USING btree (\"type\");"
    ]
  },
  {
    "nom": "0001_portfolio_parametres",
    "requetes": [
      "CREATE TABLE \"parametres\" (\n\t\"cle\" text PRIMARY KEY NOT NULL,\n\t\"valeur\" text NOT NULL,\n\t\"maj_le\" timestamp with time zone DEFAULT now() NOT NULL\n);",
      "CREATE TABLE \"realisations\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"slug\" text NOT NULL,\n\t\"titre\" text NOT NULL,\n\t\"categorie\" text NOT NULL,\n\t\"description\" text,\n\t\"client\" text,\n\t\"secteur\" text,\n\t\"lien\" text,\n\t\"tags\" text[] DEFAULT '{}'::text[] NOT NULL,\n\t\"mis_en_avant\" boolean DEFAULT false NOT NULL,\n\t\"publie\" boolean DEFAULT true NOT NULL,\n\t\"ordre\" integer DEFAULT 0 NOT NULL,\n\t\"cree_le\" timestamp with time zone DEFAULT now() NOT NULL,\n\t\"maj_le\" timestamp with time zone DEFAULT now() NOT NULL,\n\tCONSTRAINT \"realisations_slug_unique\" UNIQUE(\"slug\")\n);",
      "CREATE TABLE \"visuels\" (\n\t\"id\" serial PRIMARY KEY NOT NULL,\n\t\"realisation_id\" integer NOT NULL,\n\t\"url\" text NOT NULL,\n\t\"largeur\" integer NOT NULL,\n\t\"hauteur\" integer NOT NULL,\n\t\"alt\" text DEFAULT '' NOT NULL,\n\t\"ordre\" integer DEFAULT 0 NOT NULL,\n\t\"televerse\" boolean DEFAULT false NOT NULL,\n\t\"cree_le\" timestamp with time zone DEFAULT now() NOT NULL\n);",
      "ALTER TABLE \"visuels\" ADD CONSTRAINT \"visuels_realisation_id_realisations_id_fk\" FOREIGN KEY (\"realisation_id\") REFERENCES \"public\".\"realisations\"(\"id\") ON DELETE cascade ON UPDATE no action;",
      "CREATE INDEX \"realisations_categorie_idx\" ON \"realisations\" USING btree (\"categorie\");",
      "CREATE INDEX \"realisations_ordre_idx\" ON \"realisations\" USING btree (\"ordre\");",
      "CREATE INDEX \"visuels_realisation_idx\" ON \"visuels\" USING btree (\"realisation_id\",\"ordre\");"
    ]
  },
  {
    "nom": "0002_bilingue_devises",
    "requetes": [
      "ALTER TABLE \"commandes\" ADD COLUMN \"devise\" text DEFAULT 'XOF' NOT NULL;",
      "ALTER TABLE \"commandes\" ADD COLUMN \"langue\" text DEFAULT 'fr' NOT NULL;",
      "ALTER TABLE \"realisations\" ADD COLUMN \"titre_en\" text;",
      "ALTER TABLE \"realisations\" ADD COLUMN \"description_en\" text;",
      "ALTER TABLE \"realisations\" ADD COLUMN \"secteur_en\" text;",
      "ALTER TABLE \"services\" ADD COLUMN \"prix_usd\" integer;",
      "ALTER TABLE \"services\" ADD COLUMN \"nom_en\" text;",
      "ALTER TABLE \"services\" ADD COLUMN \"resume_en\" text;",
      "ALTER TABLE \"services\" ADD COLUMN \"description_en\" text;",
      "ALTER TABLE \"services\" ADD COLUMN \"livrables_en\" text;"
    ]
  }
];
