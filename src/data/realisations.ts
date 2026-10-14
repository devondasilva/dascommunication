/**
 * Portfolio DAS Communication (repris du site das-communication).
 * Images optimisées dans /public/realisations.
 * Pour ajouter une réalisation : déposez l'image dans /public/realisations
 * puis ajoutez une entrée ci-dessous.
 */

export const CATEGORIES_REALISATION = {
  logos: "Logos",
  web: "Web & applications",
  visuels: "Visuels & supports",
  edition: "Édition",
} as const;

export type CategorieRealisation = keyof typeof CATEGORIES_REALISATION;

export type ImageRealisation = { src: string; largeur: number; hauteur: number; alt: string };

export type Realisation = {
  slug: string;
  titre: string;
  categorie: CategorieRealisation;
  description?: string;
  client?: string;
  secteur?: string;
  lien?: string;
  tags: string[];
  misEnAvant?: boolean;
  image: ImageRealisation;
  galerie?: ImageRealisation[];
};

export const REALISATIONS: Realisation[] = [
  {
    "slug": "identite-visuelle-das-com",
    "titre": "Identité visuelle DAS COM",
    "categorie": "logos",
    "client": "DAS COMMUNICATION",
    "secteur": "Agence de communication",
    "tags": [
      "Logo",
      "Identité"
    ],
    "image": {
      "src": "/realisations/log_en.webp",
      "largeur": 1600,
      "hauteur": 1600,
      "alt": "Identité visuelle DAS COM"
    }
  },
  {
    "slug": "logo-heritage-collection",
    "titre": "Logo Heritage Collection",
    "categorie": "logos",
    "client": "Heritage",
    "secteur": "Mode",
    "tags": [
      "Logo",
      "Mode"
    ],
    "image": {
      "src": "/realisations/logheri.webp",
      "largeur": 176,
      "hauteur": 150,
      "alt": "Logo Heritage Collection"
    }
  },
  {
    "slug": "logo-calyne-services",
    "titre": "Logo Calyne Services",
    "categorie": "logos",
    "client": "Calyne Services",
    "secteur": "Transit & services",
    "tags": [
      "Logo",
      "Services"
    ],
    "image": {
      "src": "/realisations/logcal.webp",
      "largeur": 1600,
      "hauteur": 1600,
      "alt": "Logo Calyne Services"
    }
  },
  {
    "slug": "logo-mades",
    "titre": "Logo MADES",
    "categorie": "logos",
    "client": "MADES",
    "secteur": "Management sportif",
    "tags": [
      "Logo",
      "Sport"
    ],
    "image": {
      "src": "/realisations/logomades.webp",
      "largeur": 1600,
      "hauteur": 1600,
      "alt": "Logo MADES"
    }
  },
  {
    "slug": "logo-jes-jeune-educateur-de-sport",
    "titre": "Logo JES — Jeune Éducateur de Sport",
    "categorie": "logos",
    "client": "JES",
    "secteur": "Sport & éducation",
    "tags": [
      "Logo",
      "Sport"
    ],
    "misEnAvant": true,
    "image": {
      "src": "/realisations/log1.webp",
      "largeur": 1280,
      "hauteur": 1280,
      "alt": "Logo JES — Jeune Éducateur de Sport"
    }
  },
  {
    "slug": "logo-williams-world-tour",
    "titre": "Logo Williams World Tour",
    "categorie": "logos",
    "client": "Williams World Tour",
    "secteur": "Événementiel sportif",
    "tags": [
      "Logo",
      "Événementiel"
    ],
    "image": {
      "src": "/realisations/log2.webp",
      "largeur": 1280,
      "hauteur": 1280,
      "alt": "Logo Williams World Tour"
    }
  },
  {
    "slug": "application-jilo-services",
    "titre": "Application JILO Services",
    "categorie": "web",
    "description": "Plateforme de services pilotée par un chatbot, pour des échanges clients fluides.",
    "lien": "https://www.figma.com/design/OBH27pCqCDZeAhiA14lUcu/Projet_app_JILO",
    "image": {
      "src": "/realisations/web-w1.webp",
      "largeur": 990,
      "hauteur": 459,
      "alt": "Maquette Application JILO Services"
    },
    "tags": [
      "Figma",
      "React Native"
    ]
  },
  {
    "slug": "tennis-connect",
    "titre": "Tennis Connect",
    "categorie": "web",
    "description": "Application de réservation de cours de tennis : disponibilité des courts en temps réel et mise en relation des joueurs.",
    "lien": "https://www.figma.com/design/5mHUn8AJUQH8COCBdCHoLP/Projet_Site_MADES",
    "image": {
      "src": "/realisations/web-w2.webp",
      "largeur": 1172,
      "hauteur": 506,
      "alt": "Maquette Tennis Connect"
    },
    "tags": [
      "UI/UX",
      "Next.js"
    ]
  },
  {
    "slug": "plateforme-mades",
    "titre": "Plateforme MADES",
    "categorie": "web",
    "description": "Plateforme de gestion d'événements sportifs : actualités en direct, billetterie et engagement des fans.",
    "lien": "https://www.figma.com/design/5mHUn8AJUQH8COCBdCHoLP/Projet_Site_MADES",
    "misEnAvant": true,
    "image": {
      "src": "/realisations/web-w3.webp",
      "largeur": 590,
      "hauteur": 450,
      "alt": "Maquette Plateforme MADES"
    },
    "tags": [
      "React",
      "Tailwind"
    ]
  },
  {
    "slug": "flyer-de-services-calyne-services",
    "titre": "Flyer de services Calyne Services",
    "categorie": "visuels",
    "client": "Calyne Services",
    "description": "Flyer de présentation des services : transit, pressing, import-export, transfert d'argent, vente et location de véhicules.",
    "tags": [
      "Flyer",
      "Print"
    ],
    "misEnAvant": true,
    "image": {
      "src": "/realisations/s15.webp",
      "largeur": 1600,
      "hauteur": 2270,
      "alt": "Flyer de services Calyne Services"
    }
  },
  {
    "slug": "cartes-de-visite-laforet",
    "titre": "Cartes de visite Laforêt",
    "categorie": "visuels",
    "client": "Laforêt",
    "description": "Cartes de visite recto verso aux couleurs de l'agence immobilière.",
    "tags": [
      "Cartes de visite",
      "Print"
    ],
    "image": {
      "src": "/realisations/card.webp",
      "largeur": 1201,
      "hauteur": 1201,
      "alt": "Cartes de visite Laforêt"
    }
  },
  {
    "slug": "affiche-conference-semaine-des-raquettes",
    "titre": "Affiche conférence-débat — Semaine des raquettes et du beach volley",
    "categorie": "visuels",
    "client": "Université de Guyane",
    "description": "Affiche de la conférence-débat sur l'expérience des joueurs professionnels et les sports de raquette dans la formation STAPS.",
    "tags": [
      "Affiche",
      "Événementiel"
    ],
    "misEnAvant": true,
    "image": {
      "src": "/realisations/s18.webp",
      "largeur": 904,
      "hauteur": 1280,
      "alt": "Affiche conférence-débat — Semaine des raquettes et du beach volley"
    }
  },
  {
    "slug": "affiche-recherche-de-logement",
    "titre": "Affiche recherche de logement",
    "categorie": "visuels",
    "client": "Bourse d'Utilité Sociale",
    "description": "Annonce de recherche de logement pour un étudiant joueur de tennis, avec garantie de loyer par l'association.",
    "tags": [
      "Affiche",
      "Associatif"
    ],
    "image": {
      "src": "/realisations/s7.webp",
      "largeur": 1080,
      "hauteur": 1242,
      "alt": "Affiche recherche de logement"
    }
  },
  {
    "slug": "affiche-sponsoring-formation-tennis",
    "titre": "Affiche sponsoring — Formation des entraîneurs de tennis",
    "categorie": "visuels",
    "client": "MADES",
    "description": "Visuel de sponsoring pour la 2e édition de la formation certifiante des entraîneurs de tennis, espace francophone.",
    "tags": [
      "Affiche",
      "Sport"
    ],
    "image": {
      "src": "/realisations/s4.webp",
      "largeur": 1600,
      "hauteur": 1861,
      "alt": "Affiche sponsoring — Formation des entraîneurs de tennis"
    }
  },
  {
    "slug": "affiche-williams-world-tour",
    "titre": "Affiche Williams World Tour",
    "categorie": "visuels",
    "client": "Williams World Tour",
    "description": "Affiche d'un événement célébrant le sport, le cinéma et le leadership féminin : conférence, projection et match d'exhibition.",
    "tags": [
      "Affiche",
      "Événementiel"
    ],
    "misEnAvant": true,
    "image": {
      "src": "/realisations/s16.webp",
      "largeur": 904,
      "hauteur": 1280,
      "alt": "Affiche Williams World Tour"
    }
  },
  {
    "slug": "campagne-visite-benin",
    "titre": "Campagne « Visite Bénin »",
    "categorie": "visuels",
    "client": "MADES",
    "description": "Visuel de campagne pour promouvoir le Bénin comme destination touristique, intégré aux affiches de la formation.",
    "tags": [
      "Campagne",
      "Tourisme"
    ],
    "image": {
      "src": "/realisations/s6.webp",
      "largeur": 1600,
      "hauteur": 1921,
      "alt": "Campagne « Visite Bénin »"
    }
  },
  {
    "slug": "affiche-intervenant-formation-2024",
    "titre": "Affiche intervenant — Formation certifiante 2024",
    "categorie": "visuels",
    "client": "MADES",
    "description": "Présentation de l'intervenant de la 3e édition : coach de tennis, de padel et de beach tennis.",
    "tags": [
      "Affiche",
      "Sport"
    ],
    "image": {
      "src": "/realisations/s3.webp",
      "largeur": 1448,
      "hauteur": 2048,
      "alt": "Affiche intervenant — Formation certifiante 2024"
    }
  },
  {
    "slug": "post-reseaux-sociaux-das-communication",
    "titre": "Post réseaux sociaux « What if everything changed soon? »",
    "categorie": "visuels",
    "client": "DAS COMMUNICATION",
    "description": "Visuel d'accroche pour les réseaux sociaux de l'agence.",
    "tags": [
      "Réseaux sociaux"
    ],
    "image": {
      "src": "/realisations/s8.webp",
      "largeur": 526,
      "hauteur": 526,
      "alt": "Post réseaux sociaux « What if everything changed soon? »"
    }
  },
  {
    "slug": "visuel-thanksgiving",
    "titre": "Visuel Thanksgiving",
    "categorie": "visuels",
    "client": "DAS COMMUNICATION",
    "description": "Visuel de fête pour les réseaux sociaux de l'agence.",
    "tags": [
      "Réseaux sociaux"
    ],
    "image": {
      "src": "/realisations/s9.webp",
      "largeur": 1080,
      "hauteur": 1080,
      "alt": "Visuel Thanksgiving"
    }
  },
  {
    "slug": "presentation-des-services-das-communication",
    "titre": "Présentation des services DAS Communication",
    "categorie": "visuels",
    "client": "DAS COMMUNICATION",
    "description": "Visuel de présentation : logo, chartes graphiques, supports imprimés et contenus digitaux.",
    "tags": [
      "Réseaux sociaux",
      "Marque"
    ],
    "image": {
      "src": "/realisations/s23.webp",
      "largeur": 596,
      "hauteur": 842,
      "alt": "Présentation des services DAS Communication"
    }
  },
  {
    "slug": "affiche-soiree-de-gala",
    "titre": "Affiche Soirée de gala",
    "categorie": "visuels",
    "client": "Temple Mahuklo de Sékandji",
    "description": "Affiche de soirée de gala organisée sous le haut parrainage de l'Église protestante méthodiste du Bénin.",
    "tags": [
      "Affiche",
      "Événementiel"
    ],
    "image": {
      "src": "/realisations/s24.webp",
      "largeur": 1600,
      "hauteur": 2263,
      "alt": "Affiche Soirée de gala"
    }
  },
  {
    "slug": "invitation-inauguration-le-mothe-coffee",
    "titre": "Invitation inauguration Le Mothé Coffee",
    "categorie": "visuels",
    "client": "Le Mothé Coffee",
    "description": "Carton d'invitation à l'ouverture d'un café-restaurant.",
    "tags": [
      "Invitation",
      "Restauration"
    ],
    "image": {
      "src": "/realisations/s10.webp",
      "largeur": 526,
      "hauteur": 526,
      "alt": "Invitation inauguration Le Mothé Coffee"
    }
  },
  {
    "slug": "affiche-centre-aere-multisports",
    "titre": "Affiche centre aéré multisports",
    "categorie": "visuels",
    "client": "Break Club",
    "description": "Affiche d'un centre d'accueil sportif à dominante tennis : formule centre aéré, tarifs et activités.",
    "tags": [
      "Affiche",
      "Sport"
    ],
    "image": {
      "src": "/realisations/s11.webp",
      "largeur": 1600,
      "hauteur": 2262,
      "alt": "Affiche centre aéré multisports"
    }
  },
  {
    "slug": "banniere-calyne-services",
    "titre": "Bannière Calyne Services",
    "categorie": "visuels",
    "client": "Calyne Services",
    "description": "Bannière web reprenant l'offre de services de l'entreprise.",
    "tags": [
      "Bannière",
      "Web"
    ],
    "image": {
      "src": "/realisations/s14.webp",
      "largeur": 1600,
      "hauteur": 900,
      "alt": "Bannière Calyne Services"
    }
  },
  {
    "slug": "carte-de-voeux-2025",
    "titre": "Carte de vœux 2025",
    "categorie": "visuels",
    "client": "MADES",
    "description": "Visuel de vœux « Bonne et heureuse année 2025 ».",
    "tags": [
      "Réseaux sociaux"
    ],
    "image": {
      "src": "/realisations/s17.webp",
      "largeur": 1080,
      "hauteur": 1080,
      "alt": "Carte de vœux 2025"
    }
  },
  {
    "slug": "post-le-savez-vous-formation-2024",
    "titre": "Post « Le savez-vous ? » — Formation 2024",
    "categorie": "visuels",
    "client": "MADES",
    "description": "Visuel d'information sur la formation certifiante tennis, padel et beach tennis.",
    "tags": [
      "Réseaux sociaux",
      "Sport"
    ],
    "image": {
      "src": "/realisations/s2.webp",
      "largeur": 1080,
      "hauteur": 1080,
      "alt": "Post « Le savez-vous ? » — Formation 2024"
    }
  },
  {
    "slug": "affiche-tournoi-open-jeune",
    "titre": "Affiche tournoi Open jeune",
    "categorie": "visuels",
    "description": "Affiche d'un tournoi jeunes (galaxie balle orange et verte) dans le cadre de la Semaine des raquettes et du beach volley.",
    "tags": [
      "Affiche",
      "Sport"
    ],
    "image": {
      "src": "/realisations/s19.webp",
      "largeur": 904,
      "hauteur": 1280,
      "alt": "Affiche tournoi Open jeune"
    }
  },
  {
    "slug": "catalogue-oeuvres-kodedjo-felix",
    "titre": "Catalogue d'œuvres de Kodedjo Félix",
    "categorie": "visuels",
    "client": "Kodedjo Félix",
    "description": "Présentation d'œuvres et des formats de tableaux disponibles pour un artiste peintre.",
    "tags": [
      "Catalogue",
      "Art"
    ],
    "image": {
      "src": "/realisations/s20.webp",
      "largeur": 1280,
      "hauteur": 905,
      "alt": "Catalogue d'œuvres de Kodedjo Félix"
    }
  },
  {
    "slug": "affiche-activite-periscolaire-2025-2026",
    "titre": "Affiche activité périscolaire 2025-2026",
    "categorie": "visuels",
    "client": "APEL",
    "description": "Affiche d'inscription aux activités sportives périscolaires pour les 6-12 ans.",
    "tags": [
      "Affiche",
      "Éducation"
    ],
    "image": {
      "src": "/realisations/s21.webp",
      "largeur": 904,
      "hauteur": 1280,
      "alt": "Affiche activité périscolaire 2025-2026"
    }
  },
  {
    "slug": "affiche-conference-esgis",
    "titre": "Affiche conférence ESGIS",
    "categorie": "visuels",
    "client": "ESGIS",
    "description": "Affiche d'une conférence étudiante sur la recherche de stage académique.",
    "tags": [
      "Affiche",
      "Éducation"
    ],
    "image": {
      "src": "/realisations/s22.webp",
      "largeur": 1080,
      "hauteur": 1080,
      "alt": "Affiche conférence ESGIS"
    }
  },
  {
    "slug": "affiche-intervenants-formation-2023",
    "titre": "Affiche des intervenants — Formation certifiante 2023",
    "categorie": "visuels",
    "client": "MADES",
    "description": "Présentation des intervenants et des pays participants de la 2e édition.",
    "tags": [
      "Affiche",
      "Sport"
    ],
    "image": {
      "src": "/realisations/s5.webp",
      "largeur": 1600,
      "hauteur": 1363,
      "alt": "Affiche des intervenants — Formation certifiante 2023"
    }
  },
  {
    "slug": "magazine-semaine-des-raquettes-2024",
    "titre": "Magazine — Semaine des raquettes et du beach volley 2024",
    "categorie": "edition",
    "description": "Conception éditoriale complète du magazine de l'édition 2024 : couverture, sommaire, édito, articles et quatrième de couverture.",
    "misEnAvant": true,
    "image": {
      "src": "/realisations/livre-l1.webp",
      "largeur": 1131,
      "hauteur": 1600,
      "alt": "Couverture du magazine Semaine des raquettes et du beach volley 2024"
    },
    "galerie": [
      {
        "src": "/realisations/livre-l1.webp",
        "largeur": 1131,
        "hauteur": 1600,
        "alt": "Magazine — Couverture"
      },
      {
        "src": "/realisations/livre-l2.webp",
        "largeur": 596,
        "hauteur": 842,
        "alt": "Magazine — Sommaire"
      },
      {
        "src": "/realisations/livre-l3.webp",
        "largeur": 1131,
        "hauteur": 1600,
        "alt": "Magazine — Édito"
      },
      {
        "src": "/realisations/livre-l4.webp",
        "largeur": 1131,
        "hauteur": 1600,
        "alt": "Magazine — Article 1"
      },
      {
        "src": "/realisations/livre-l5.webp",
        "largeur": 1131,
        "hauteur": 1600,
        "alt": "Magazine — Article 2"
      },
      {
        "src": "/realisations/livre-l6.webp",
        "largeur": 1132,
        "hauteur": 1600,
        "alt": "Magazine — Dos"
      },
      {
        "src": "/realisations/livre-l7.webp",
        "largeur": 1131,
        "hauteur": 1600,
        "alt": "Magazine — Page 7"
      },
      {
        "src": "/realisations/livre-l8.webp",
        "largeur": 1131,
        "hauteur": 1600,
        "alt": "Magazine — Page 8"
      },
      {
        "src": "/realisations/livre-l9.webp",
        "largeur": 1131,
        "hauteur": 1600,
        "alt": "Magazine — Page 9"
      },
      {
        "src": "/realisations/livre-l10.webp",
        "largeur": 1131,
        "hauteur": 1600,
        "alt": "Magazine — Page 10"
      },
      {
        "src": "/realisations/livre-l11.webp",
        "largeur": 1131,
        "hauteur": 1600,
        "alt": "Magazine — Page 11"
      },
      {
        "src": "/realisations/livre-l12.webp",
        "largeur": 1131,
        "hauteur": 1600,
        "alt": "Magazine — Page 12"
      },
      {
        "src": "/realisations/livre-l13.webp",
        "largeur": 1131,
        "hauteur": 1600,
        "alt": "Magazine — Page 13"
      },
      {
        "src": "/realisations/livre-l14.webp",
        "largeur": 1131,
        "hauteur": 1600,
        "alt": "Magazine — Page 14"
      },
      {
        "src": "/realisations/livre-l15.webp",
        "largeur": 1131,
        "hauteur": 1600,
        "alt": "Magazine — Page 15"
      },
      {
        "src": "/realisations/livre-l16.webp",
        "largeur": 1131,
        "hauteur": 1600,
        "alt": "Magazine — Page 16"
      },
      {
        "src": "/realisations/livre-l17.webp",
        "largeur": 1131,
        "hauteur": 1600,
        "alt": "Magazine — Page 17"
      },
      {
        "src": "/realisations/livre-l18.webp",
        "largeur": 1131,
        "hauteur": 1600,
        "alt": "Magazine — Page 18"
      },
      {
        "src": "/realisations/livre-l20.webp",
        "largeur": 1131,
        "hauteur": 1600,
        "alt": "Magazine — Quatrième de couverture"
      }
    ],
    "tags": [
      "Édition",
      "Mise en page",
      "Print"
    ]
  }
];

export const realisationsMisesEnAvant = () => REALISATIONS.filter((r) => r.misEnAvant);
export const realisationParSlug = (slug: string) => REALISATIONS.find((r) => r.slug === slug);
