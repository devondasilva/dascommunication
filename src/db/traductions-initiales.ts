/**
 * Version anglaise du catalogue et du portfolio d'origine.
 * Appliquée au démarrage aux services et réalisations dont l'anglais n'a
 * pas encore été saisi : une traduction modifiée dans le dashboard n'est
 * jamais écrasée.
 */

export const SERVICES_EN: Record<string, { nom: string; resume: string; description: string; livrables: string }> = {
  "strategie-marketing-digital": {
    nom: "Digital marketing strategy",
    resume: "A clear action plan to attract, convert and retain your customers.",
    description:
      "An audit of your online presence, a competitor review, your target audiences and key messages, then a 6-month roadmap with priority channels and the metrics to track.",
    livrables: "Full digital audit\nPersonas and customer journeys\n6-month action plan\nKPI dashboard",
  },
  "community-management": {
    nom: "Social media management",
    resume: "A steady, engaging presence on Facebook, Instagram, LinkedIn and TikTok.",
    description:
      "Editorial line, monthly calendar, visuals and copywriting, publishing, comment moderation and a performance report every month.",
    livrables: "Monthly content calendar\n12 to 20 posts per month\nComment moderation\nMonthly report",
  },
  "publicite-en-ligne": {
    nom: "Online advertising",
    resume: "Targeted Meta, Google and TikTok campaigns that bring in qualified leads.",
    description:
      "Ad account and conversion tracking setup, targeting, ad creation, A/B testing and ongoing budget optimisation.",
    livrables: "Account and tracking setup\n3 to 6 ads\nWeekly optimisation\nCampaign report",
  },
  "emailing-automatisation": {
    nom: "Email marketing and automation",
    resume: "Newsletters and automated flows that turn your contacts into customers.",
    description:
      "Email platform setup, on-brand templates, list segmentation and automated flows (welcome, follow-up, loyalty).",
    livrables: "Platform setup\n2 newsletter templates\n3 automated flows\nList segmentation",
  },
  "identite-visuelle": {
    nom: "Brand identity and logo",
    resume: "A logo and brand guidelines that make your brand instantly recognisable.",
    description:
      "Creative research, logo proposals, variations, colour palette, typography and usage rules, all gathered in a brand guidelines document.",
    livrables: "3 logo concepts\nColour and monochrome versions\nBrand guidelines (PDF)\nSource files",
  },
  "supports-print": {
    nom: "Posters and print materials",
    resume: "Posters, flyers, roll-up banners, brochures and business cards, ready to print.",
    description: "Graphic design of your print materials in line with your brand, with files prepared for the printer.",
    livrables: "Print layouts\n2 rounds of revisions\nPrint-ready files (high-res PDF)",
  },
  "ui-ux-design": {
    nom: "UI/UX design",
    resume: "App and website mock-ups designed around your users.",
    description:
      "User journeys, wireframes, then high-fidelity Figma mock-ups, a clickable prototype and a design system ready for development.",
    livrables: "User journeys and wireframes\nFigma mock-ups\nClickable prototype\nDesign system",
  },
  "audit-seo": {
    nom: "SEO audit and technical SEO",
    resume: "Find out why Google can't find you, and fix it.",
    description:
      "Technical analysis (speed, indexing, structure), keywords, competition and content, followed by priority fixes and an action plan.",
    livrables: "Audit report\nPrioritised list of fixes\nKeyword research\n3 months of rank tracking",
  },
  "seo-local": {
    nom: "Local SEO",
    resume: "Show up first when people search for you nearby.",
    description:
      "Optimisation of your Google Business Profile, local directories, customer reviews and the local pages of your website.",
    livrables: "Optimised Google profile\nDirectory listings\nCustomer review strategy\nMonthly report",
  },
  "creation-site-web": {
    nom: "Website",
    resume: "A fast, modern website built to turn visitors into customers.",
    description:
      "Mock-ups, React / Next.js development, content integration, SEO basics and launch. Ideal for a business website or an event website.",
    livrables: "Figma mock-ups\nResponsive website\nSEO and performance optimisation\nLaunch and handover",
  },
  "application-web-mobile": {
    nom: "Web and mobile app",
    resume: "Booking platforms, member areas and custom business tools.",
    description:
      "Functional scoping, design, web and mobile development, online payments (Mobile Money, cards), admin dashboard and maintenance.",
    livrables: "Specifications\nDeveloped and tested app\nAdmin dashboard\nTraining and maintenance",
  },
  "communication-evenementielle": {
    nom: "Event and sports communication",
    resume: "Tournaments, conferences, galas: complete communication for your event.",
    description:
      "Event identity, posters, social media posts, badges, roll-up banners, programme or magazine, press relations and coverage on the day.",
    livrables: "Event identity\nPoster and variations\nSocial media kit\nProgramme or magazine",
  },
  "video-motion-design": {
    nom: "Video and motion design",
    resume: "Short animated videos that hold attention.",
    description: "Script, storyboard, filming or animation, editing and subtitles, in the right format for each social network.",
    livrables: "Script and storyboard\nEdited, subtitled video\n9:16, 1:1 and 16:9 versions",
  },
  "redaction-contenus": {
    nom: "Copywriting",
    resume: "Clear, punchy copy for your website, articles and marketing materials.",
    description:
      "SEO-friendly writing: website pages, blog articles, press releases and sales copy, in your brand's tone of voice.",
    livrables: "Editorial brief\nWritten and proofread copy\nBasic SEO optimisation",
  },
};

export const REALISATIONS_EN: Record<string, { titre: string; description?: string; secteur?: string }> = {
  "identite-visuelle-das-com": { titre: "DAS COM brand identity", secteur: "Communication agency" },
  "logo-heritage-collection": { titre: "Heritage Collection logo", secteur: "Fashion" },
  "logo-calyne-services": { titre: "Calyne Services logo", secteur: "Freight & services" },
  "logo-mades": { titre: "MADES logo", secteur: "Sports management" },
  "logo-jes-jeune-educateur-de-sport": { titre: "JES logo — Young Sports Educator", secteur: "Sport & education" },
  "logo-williams-world-tour": { titre: "Williams World Tour logo", secteur: "Sports events" },
  "application-jilo-services": {
    titre: "JILO Services app",
    description: "A chatbot-driven services platform for smooth customer conversations.",
  },
  "tennis-connect": {
    titre: "Tennis Connect",
    description: "A tennis lesson booking app: real-time court availability and player matchmaking.",
  },
  "plateforme-mades": {
    titre: "MADES platform",
    description: "A sports event management platform: live news, ticketing and fan engagement.",
  },
  "flyer-de-services-calyne-services": {
    titre: "Calyne Services flyer",
    description: "Services flyer: freight forwarding, dry cleaning, import-export, money transfer, vehicle sales and rentals.",
  },
  "cartes-de-visite-laforet": {
    titre: "Laforêt business cards",
    description: "Double-sided business cards in the real estate agency's colours.",
  },
  "affiche-conference-semaine-des-raquettes": {
    titre: "Panel discussion poster — Racket Sports and Beach Volleyball Week",
    description:
      "Poster for a panel discussion on the experience of professional players and racket sports in sports science (STAPS) training.",
  },
  "affiche-recherche-de-logement": {
    titre: "Housing search poster",
    description: "Housing search notice for a student tennis player, with rent guaranteed by the association.",
  },
  "affiche-sponsoring-formation-tennis": {
    titre: "Sponsorship poster — Tennis coach training",
    description: "Sponsorship visual for the 2nd edition of the certified tennis coach training for French-speaking countries.",
  },
  "affiche-williams-world-tour": {
    titre: "Williams World Tour poster",
    description: "Poster for an event celebrating sport, film and women's leadership: talk, screening and exhibition match.",
  },
  "campagne-visite-benin": {
    titre: "“Visit Benin” campaign",
    description: "Campaign visual promoting Benin as a travel destination, featured on the training posters.",
  },
  "affiche-intervenant-formation-2024": {
    titre: "Speaker poster — 2024 certified training",
    description: "Introducing the 3rd edition's speaker: tennis, padel and beach tennis coach.",
  },
  "post-reseaux-sociaux-das-communication": {
    titre: "Social media post “What if everything changed soon?”",
    description: "Teaser visual for the agency's social media.",
  },
  "visuel-thanksgiving": {
    titre: "Thanksgiving visual",
    description: "Holiday visual for the agency's social media.",
  },
  "presentation-des-services-das-communication": {
    titre: "DAS Communication services overview",
    description: "Overview visual: logos, brand guidelines, print materials and digital content.",
  },
  "affiche-soiree-de-gala": {
    titre: "Gala evening poster",
    description: "Poster for a gala evening held under the patronage of the Protestant Methodist Church of Benin.",
  },
  "invitation-inauguration-le-mothe-coffee": {
    titre: "Le Mothé Coffee opening invitation",
    description: "Invitation card for the opening of a café-restaurant.",
  },
  "affiche-centre-aere-multisports": {
    titre: "Multi-sport day camp poster",
    description: "Poster for a tennis-focused sports day camp: programme, prices and activities.",
  },
  "banniere-calyne-services": {
    titre: "Calyne Services banner",
    description: "Web banner presenting the company's range of services.",
  },
  "carte-de-voeux-2025": {
    titre: "2025 greeting card",
    description: "“Happy New Year 2025” greeting visual.",
  },
  "post-le-savez-vous-formation-2024": {
    titre: "“Did you know?” post — 2024 training",
    description: "Information visual about the certified tennis, padel and beach tennis training.",
  },
  "affiche-tournoi-open-jeune": {
    titre: "Junior Open tournament poster",
    description:
      "Poster for a junior tournament (orange and green ball levels) during the Racket Sports and Beach Volleyball Week.",
  },
  "catalogue-oeuvres-kodedjo-felix": {
    titre: "Kodedjo Félix artwork catalogue",
    description: "A painter's catalogue presenting his works and the available canvas sizes.",
  },
  "affiche-activite-periscolaire-2025-2026": {
    titre: "After-school activities poster 2025-2026",
    description: "Sign-up poster for after-school sports activities for children aged 6 to 12.",
  },
  "affiche-conference-esgis": {
    titre: "ESGIS talk poster",
    description: "Poster for a student talk on finding an academic internship.",
  },
  "affiche-intervenants-formation-2023": {
    titre: "Speakers poster — 2023 certified training",
    description: "Introducing the speakers and participating countries of the 2nd edition.",
  },
  "magazine-semaine-des-raquettes-2024": {
    titre: "Magazine — Racket Sports and Beach Volleyball Week 2024",
    description:
      "Complete editorial design of the 2024 edition's magazine: cover, contents, editorial, articles and back cover.",
  },
};
