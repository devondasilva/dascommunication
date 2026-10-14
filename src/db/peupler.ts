/**
 * Données initiales : rôles, compte super-admin, catalogue de services,
 * et — en mode démo uniquement — des commandes et un membre d'équipe fictifs.
 * Idempotent : peut être relancé sans créer de doublons.
 */
import { randomBytes } from "node:crypto";
import { and, eq, isNull, sql } from "drizzle-orm";
import { hacherMotDePasse } from "@/lib/mot-de-passe";
import { ROLES_PAR_DEFAUT } from "@/lib/permissions";
import { REALISATIONS_INITIALES } from "./realisations-initiales";
import { REALISATIONS_EN, SERVICES_EN } from "./traductions-initiales";
import * as schema from "./schema";
import type { BaseDeDonnees } from "./types";

export const COMPTES_DEMO = {
  admin: { email: "admin@demo.dascom", motDePasse: "DasCom-demo-2026" },
  designer: { email: "designer@demo.dascom", motDePasse: "Designer-demo-2026" },
  client: { email: "client@demo.dascom" },
};

const CATALOGUE: (typeof schema.services.$inferInsert)[] = [
  {
    slug: "strategie-marketing-digital",
    nom: "Stratégie marketing digital",
    categorie: "marketing",
    resume: "Un plan d'action clair pour attirer, convertir et fidéliser vos clients.",
    description:
      "Audit de votre présence en ligne, analyse de la concurrence, définition des cibles et des messages, puis feuille de route sur 6 mois avec les canaux prioritaires et les indicateurs à suivre.",
    livrables: "Audit digital complet\nPersonas et parcours client\nPlan d'action sur 6 mois\nTableau de bord des indicateurs",
    prixDepart: 350000,
    delaiJours: 14,
    ordre: 1,
  },
  {
    slug: "community-management",
    nom: "Community management",
    categorie: "marketing",
    resume: "Une présence régulière et engageante sur Facebook, Instagram, LinkedIn et TikTok.",
    description:
      "Ligne éditoriale, calendrier mensuel, création des visuels et des textes, publication, modération et rapport de performance chaque mois.",
    livrables: "Calendrier éditorial mensuel\n12 à 20 publications par mois\nModération des commentaires\nRapport mensuel",
    prixDepart: 150000,
    delaiJours: 30,
    ordre: 2,
  },
  {
    slug: "publicite-en-ligne",
    nom: "Publicité en ligne",
    categorie: "marketing",
    resume: "Des campagnes Meta, Google et TikTok ciblées pour générer des contacts qualifiés.",
    description:
      "Paramétrage des comptes publicitaires et du suivi des conversions, ciblage, création des annonces, tests A/B et optimisation continue du budget.",
    livrables: "Configuration des comptes et du suivi\n3 à 6 annonces\nOptimisation hebdomadaire\nBilan de campagne",
    prixDepart: 200000,
    delaiJours: 21,
    ordre: 3,
  },
  {
    slug: "emailing-automatisation",
    nom: "E-mailing et automatisation",
    categorie: "marketing",
    resume: "Des newsletters et des scénarios automatiques qui transforment vos contacts en clients.",
    description:
      "Mise en place de l'outil d'e-mailing, modèles aux couleurs de votre marque, segmentation de la base et scénarios automatisés (bienvenue, relance, fidélisation).",
    livrables: "Configuration de l'outil\n2 modèles de newsletter\n3 scénarios automatisés\nSegmentation de la base",
    prixDepart: 180000,
    delaiJours: 14,
    ordre: 4,
  },
  {
    slug: "identite-visuelle",
    nom: "Identité visuelle et logo",
    categorie: "design",
    resume: "Un logo et une charte graphique qui rendent votre marque reconnaissable.",
    description:
      "Recherche créative, propositions de logo, déclinaisons, palette de couleurs, typographies et règles d'usage réunies dans une charte graphique.",
    livrables: "3 pistes de logo\nDéclinaisons couleur et monochrome\nCharte graphique PDF\nFichiers sources",
    prixDepart: 250000,
    delaiJours: 15,
    ordre: 5,
  },
  {
    slug: "supports-print",
    nom: "Affiches et supports imprimés",
    categorie: "design",
    resume: "Affiches, flyers, kakémonos, brochures et cartes de visite prêts à imprimer.",
    description:
      "Conception graphique de vos supports imprimés, adaptés à votre charte, avec préparation des fichiers pour l'imprimeur.",
    livrables: "Maquettes des supports\n2 séries de retouches\nFichiers prêts à imprimer (PDF HD)",
    prixDepart: 60000,
    delaiJours: 7,
    ordre: 6,
  },
  {
    slug: "ui-ux-design",
    nom: "UI/UX design",
    categorie: "design",
    resume: "Des maquettes d'application et de site pensées pour vos utilisateurs.",
    description:
      "Parcours utilisateurs, wireframes puis maquettes haute fidélité sur Figma, prototype cliquable et design system prêt pour le développement.",
    livrables: "Parcours et wireframes\nMaquettes Figma\nPrototype cliquable\nDesign system",
    prixDepart: 300000,
    delaiJours: 21,
    ordre: 7,
  },
  {
    slug: "audit-seo",
    nom: "Audit et SEO technique",
    categorie: "seo",
    resume: "Comprendre pourquoi Google ne vous trouve pas, et corriger.",
    description:
      "Analyse technique (vitesse, indexation, structure), mots-clés, concurrence et contenus, puis corrections prioritaires et plan d'action.",
    livrables: "Rapport d'audit\nListe des corrections priorisées\nÉtude de mots-clés\nSuivi des positions sur 3 mois",
    prixDepart: 200000,
    delaiJours: 14,
    ordre: 8,
  },
  {
    slug: "seo-local",
    nom: "SEO local",
    categorie: "seo",
    resume: "Apparaître en tête quand on vous cherche près de chez vous.",
    description:
      "Optimisation de votre fiche Google Business Profile, annuaires locaux, avis clients et pages locales de votre site.",
    livrables: "Fiche Google optimisée\nInscription aux annuaires\nStratégie d'avis clients\nRapport mensuel",
    prixDepart: 120000,
    delaiJours: 21,
    ordre: 9,
  },
  {
    slug: "creation-site-web",
    nom: "Site web",
    categorie: "developpement",
    resume: "Un site rapide, moderne et pensé pour convertir vos visiteurs.",
    description:
      "Maquettes, développement React / Next.js, intégration de vos contenus, référencement de base et mise en ligne. Idéal pour un site vitrine ou un site d'événement.",
    livrables: "Maquettes Figma\nSite développé et responsive\nOptimisation SEO et performances\nMise en ligne et prise en main",
    prixDepart: 450000,
    delaiJours: 30,
    ordre: 10,
  },
  {
    slug: "application-web-mobile",
    nom: "Application web et mobile",
    categorie: "developpement",
    resume: "Plateformes de réservation, espaces membres, outils métier sur mesure.",
    description:
      "Cadrage fonctionnel, design, développement web et mobile, paiements en ligne (Mobile Money, carte), tableau de bord et maintenance.",
    livrables: "Cahier des charges\nApplication développée et testée\nTableau de bord administrateur\nFormation et maintenance",
    prixDepart: 1500000,
    delaiJours: 60,
    ordre: 11,
  },
  {
    slug: "communication-evenementielle",
    nom: "Communication événementielle et sportive",
    categorie: "evenementiel",
    resume: "Tournois, conférences, galas : toute la communication de votre événement.",
    description:
      "Identité de l'événement, affiches, posts réseaux sociaux, badges, kakémonos, programme ou magazine, relations presse et couverture le jour J.",
    livrables: "Identité de l'événement\nAffiche et déclinaisons\nKit réseaux sociaux\nProgramme ou magazine",
    prixDepart: 300000,
    delaiJours: 21,
    ordre: 12,
  },
  {
    slug: "video-motion-design",
    nom: "Vidéo et motion design",
    categorie: "contenu",
    resume: "Des vidéos courtes et animées qui retiennent l'attention.",
    description:
      "Script, storyboard, tournage ou animation, montage et sous-titres, dans les formats adaptés à chaque réseau social.",
    livrables: "Script et storyboard\nVidéo montée et sous-titrée\nDéclinaisons 9:16, 1:1 et 16:9",
    prixDepart: 150000,
    delaiJours: 14,
    ordre: 13,
  },
  {
    slug: "redaction-contenus",
    nom: "Rédaction de contenus",
    categorie: "contenu",
    resume: "Des textes clairs et percutants pour votre site, vos articles et vos supports.",
    description:
      "Rédaction optimisée pour le référencement : pages de site, articles de blog, communiqués et textes commerciaux, dans le ton de votre marque.",
    livrables: "Brief éditorial\nTextes rédigés et relus\nOptimisation SEO de base",
    prixDepart: 80000,
    delaiJours: 10,
    ordre: 14,
  },
];

const jeton = () => randomBytes(18).toString("base64url");
const ilYa = (jours: number) => new Date(Date.now() - jours * 86_400_000);

export async function peupler(db: BaseDeDonnees, { demo }: { demo: boolean }) {
  // 1. Rôles (sans écraser les permissions personnalisées)
  for (const r of ROLES_PAR_DEFAUT) {
    await db
      .insert(schema.roles)
      .values({ slug: r.slug, nom: r.nom, description: r.description, permissions: r.permissions, systeme: r.systeme ?? false })
      .onConflictDoNothing({ target: schema.roles.slug });
  }
  // Le super-admin a toujours toutes les permissions, même ajoutées plus tard
  const superAdmin = ROLES_PAR_DEFAUT[0];
  await db.update(schema.roles).set({ permissions: superAdmin.permissions }).where(eq(schema.roles.slug, superAdmin.slug));

  const roles = await db.select().from(schema.roles);
  const roleId = (slug: string) => roles.find((r) => r.slug === slug)!.id;

  // 2. Compte super-admin
  const emailAdmin = (process.env.ADMIN_EMAIL || (demo ? COMPTES_DEMO.admin.email : "")).toLowerCase();
  const mdpAdmin = process.env.ADMIN_PASSWORD || (demo ? COMPTES_DEMO.admin.motDePasse : "");
  if (emailAdmin && mdpAdmin) {
    const existe = await db.query.utilisateurs.findFirst({
      where: sql`lower(${schema.utilisateurs.email}) = ${emailAdmin}`,
      columns: { id: true },
    });
    if (!existe) {
      await db.insert(schema.utilisateurs).values({
        email: emailAdmin,
        nom: "Administrateur DAS COM",
        type: "equipe",
        roleId: roleId("super-admin"),
        motDePasse: await hacherMotDePasse(mdpAdmin),
        profilComplet: true,
      });
    }
  }

  // 3. Catalogue
  for (const s of CATALOGUE) {
    await db.insert(schema.services).values(s).onConflictDoNothing({ target: schema.services.slug });
  }

  // 4. Portfolio : import initial (une seule fois, quand la table est vide)
  const [{ nbReal }] = await db.select({ nbReal: sql<number>`count(*)::int` }).from(schema.realisations);
  if (nbReal === 0) {
    let ordre = 0;
    for (const r of REALISATIONS_INITIALES) {
      const [cree] = await db
        .insert(schema.realisations)
        .values({
          slug: r.slug,
          titre: r.titre,
          categorie: r.categorie,
          description: r.description ?? null,
          client: r.client ?? null,
          secteur: r.secteur ?? null,
          lien: r.lien ?? null,
          tags: r.tags,
          misEnAvant: r.misEnAvant ?? false,
          ordre: ordre++,
        })
        .returning({ id: schema.realisations.id });
      const images = r.galerie?.length ? r.galerie : [r.image];
      await db.insert(schema.visuels).values(
        images.map((img, i) => ({
          realisationId: cree.id,
          url: img.src,
          largeur: img.largeur,
          hauteur: img.hauteur,
          alt: img.alt,
          ordre: i,
        })),
      );
    }
  }

  // 5. Version anglaise des contenus d'origine (sans écraser une traduction saisie)
  for (const [slug, t] of Object.entries(SERVICES_EN)) {
    await db
      .update(schema.services)
      .set({ nomEn: t.nom, resumeEn: t.resume, descriptionEn: t.description, livrablesEn: t.livrables })
      .where(and(eq(schema.services.slug, slug), isNull(schema.services.nomEn)));
  }
  for (const [slug, t] of Object.entries(REALISATIONS_EN)) {
    await db
      .update(schema.realisations)
      .set({ titreEn: t.titre, descriptionEn: t.description ?? null, secteurEn: t.secteur ?? null })
      .where(and(eq(schema.realisations.slug, slug), isNull(schema.realisations.titreEn)));
  }

  if (!demo) return;

  // 6. Démo : un membre « designer » pour tester les permissions
  const designer = await db.query.utilisateurs.findFirst({
    where: eq(schema.utilisateurs.email, COMPTES_DEMO.designer.email),
    columns: { id: true },
  });
  if (!designer) {
    await db.insert(schema.utilisateurs).values({
      email: COMPTES_DEMO.designer.email,
      nom: "Awa Designer",
      type: "equipe",
      roleId: roleId("designer"),
      competences: ["Design graphique", "Print"],
      motDePasse: await hacherMotDePasse(COMPTES_DEMO.designer.motDePasse),
      profilComplet: true,
    });
  }

  // 7. Démo : commandes fictives
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(schema.commandes);
  if (n > 0) return;

  const services = await db.select().from(schema.services);
  const parSlug = Object.fromEntries(services.map((s) => [s.slug, s]));

  const demoCommandes: Array<{
    slug: string;
    nom: string;
    entreprise: string;
    statut: schema.StatutCommande;
    montant: number | null;
    jours: number;
    brief: string;
    en?: boolean;
  }> = [
    { slug: "identite-visuelle", nom: "Aïcha Kossou", entreprise: "Saveurs du Golfe", statut: "livree", montant: 275000, jours: 160, brief: "Création du logo et de la charte pour notre restaurant à Cotonou." },
    { slug: "community-management", nom: "Marc Hounkpè", entreprise: "Hounkpè Immobilier", statut: "livree", montant: 150000, jours: 120, brief: "Animation de nos pages Facebook et Instagram pendant 3 mois." },
    { slug: "supports-print", nom: "Grâce Adjovi", entreprise: "École Les Étoiles", statut: "livree", montant: 85000, jours: 95, brief: "Flyers et affiches pour la rentrée scolaire." },
    { slug: "publicite-en-ligne", nom: "Yves Dossou", entreprise: "AgroPlus", statut: "livree", montant: 240000, jours: 70, brief: "Campagne Meta pour le lancement de notre nouvelle gamme." },
    { slug: "communication-evenementielle", nom: "Nadia Sossa", entreprise: "Ligue de tennis du Littoral", statut: "en_revision", montant: 380000, jours: 40, brief: "Affiche, posts et programme pour notre tournoi open de décembre." },
    { slug: "creation-site-web", nom: "Paul Agossa", entreprise: "TechBénin", statut: "en_cours", montant: 450000, jours: 20, brief: "Site vitrine de 6 pages avec formulaire de contact et blog." },
    { slug: "audit-seo", nom: "Fatou Bello", entreprise: "Mode Africa", statut: "en_cours", montant: 200000, jours: 12, brief: "Notre boutique en ligne n'apparaît pas sur Google, besoin d'un audit." },
    { slug: "video-motion-design", nom: "Serge Ahouandjinou", entreprise: "Festival Vodun Arts", statut: "nouvelle", montant: null, jours: 3, brief: "Teaser vidéo de 30 secondes pour annoncer la prochaine édition du festival." },
    { slug: "identite-visuelle", nom: "Esther Zinsou", entreprise: "Beach Club Fidjrossè", statut: "nouvelle", montant: null, jours: 1, brief: "Logo et charte pour un club de plage, ambiance sportive et conviviale." },
    { slug: "supports-print", nom: "Rodrigue Kpadé", entreprise: "Pharmacie du Port", statut: "annulee", montant: null, jours: 50, brief: "Cartes de visite pour l'équipe." },
    { slug: "creation-site-web", nom: "Jordan Miller", entreprise: "Chesapeake Tennis Academy", statut: "en_cours", montant: 1450, jours: 9, brief: "Website for our tennis academy in Maryland: programs, coaches, online sign-up for summer camps.", en: true },
  ];

  let numero = 1;
  for (const d of demoCommandes) {
    const service = parSlug[d.slug];
    const date = ilYa(d.jours);
    const [cmd] = await db
      .insert(schema.commandes)
      .values({
        reference: `CMD-${date.getFullYear()}-${String(numero++).padStart(4, "0")}`,
        jetonSuivi: jeton(),
        serviceId: service.id,
        serviceNom: service.nom,
        clientNom: d.nom,
        clientEmail: `${d.nom.split(" ")[0].toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")}@example.com`,
        clientTelephone: d.en ? "+1 301 555 0142" : "+229 97 00 00 00",
        entreprise: d.entreprise,
        brief: d.brief,
        statut: d.statut,
        montant: d.montant,
        langue: d.en ? "en" : "fr",
        devise: d.en ? "USD" : "XOF",
        creeLe: date,
        majLe: date,
      })
      .returning();

    await db
      .insert(schema.activites)
      .values({ commandeId: cmd.id, message: d.en ? "Order received" : "Commande reçue", creeLe: date });

    if (d.statut === "en_revision") {
      await db.insert(schema.modifications).values({
        commandeId: cmd.id,
        description: "Pouvez-vous ajouter le logo du sponsor principal en bas de l'affiche ?",
        priorite: "haute",
        statut: "en_attente",
        creeLe: ilYa(2),
        majLe: ilYa(2),
      });
    }
  }
}
