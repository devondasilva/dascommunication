import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import {
  Send,
  Sparkles,
  Code2,
  Palette,
  Plus,
  ArrowUpRight,
  ChevronDown,
  Globe,
  Lock,
  Layers,
  Clock3,
  Megaphone,
  Smartphone,
  Boxes
} from 'lucide-react';
import poster from '../assets/img/poster.png';

// ---------------------------------------------------------------------------
// Contenu
// ---------------------------------------------------------------------------

const services = [
  {
    icon: <Palette />,
    title: 'Brand Identity',
    desc: "Création de récits visuels uniques et d'identités de marque fortes pour marquer votre marché.",
    filter: 'Brand Identity',
    tags: ['Design', 'Branding', 'Campagnes']
  },
  {
    icon: <Sparkles />,
    title: 'Logo Showcase',
    desc: 'Développement logotypes sur-mesure et chartes graphiques adaptées à tous vos supports.',
    filter: 'Logo Showcase',
    tags: ['Logo', 'Assets', 'Identité']
  },
  {
    icon: <Code2 />,
    title: 'Web Design',
    desc: 'Interfaces UI/UX fluides et écosystèmes web modernes codés pour la performance et la conversion.',
    filter: 'Web Design',
    tags: ['Next.js', 'UI/UX', 'Tailwind']
  }
];

const stack = ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Figma', 'Framer Motion'];

// Services détaillés avec visuel à l'appui — remplacez `image` par une photo
// réelle de vos réalisations dès que possible (import depuis '../assets/img/...').
// Tant qu'aucune photo n'est fournie, un visuel duotone signature est affiché.
const detailedServices = [
  {
    icon: <Palette size={22} />,
    title: 'Conception de logo & charte graphique',
    desc: "Un logo mémorable accompagné d'un système graphique complet : couleurs, typographies, usages et déclinaisons pour rester cohérent sur tous vos supports.",
    tags: ['Logo', 'Charte graphique', 'Déclinaisons'],
    tone: 'from-[#27BAA3] to-[#12142B]',
    image: null as string | null
  },
  {
    icon: <Megaphone size={22} />,
    title: 'Gestion de vos réseaux sociaux',
    desc: 'Création de contenus, calendrier éditorial et animation de vos pages Facebook, Instagram, LinkedIn, TikTok et X.',
    tags: ['Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'X'],
    tone: 'from-[#2D3079] to-[#12142B]',
    image: null as string | null
  },
  {
    icon: <Smartphone size={22} />,
    title: "Conception d'applications web & mobile",
    desc: 'Interfaces sur-mesure pensées pour vos utilisateurs, du site web à l\'application native, du wireframe à la mise en production.',
    tags: ['Web App', 'iOS', 'Android'],
    tone: 'from-[#E0A73B] to-[#12142B]',
    image: null as string | null
  },
  {
    icon: <Boxes size={22} />,
    title: 'Autres services',
    desc: "Motion design, supports imprimés, formation aux outils numériques : parlez-nous de votre besoin, on l'intègre à votre projet.",
    tags: ['Motion design', 'Print', 'Formation'],
    tone: 'from-[#12142B] to-[#2D3079]',
    image: null as string | null
  }
];

const featuredProjects = [
  {
    tag: 'Next.js & E-Commerce',
    title: 'Aura Premium Odyssée',
    description: "Refonte de l'expérience d'achat cosmétique. +42% de performances de chargement.",
    link: '/Project'
  },
  {
    tag: 'SaaS Platform',
    title: 'PANAGRO Management',
    description: "Interface d'analyses prédictives et suivi d'investissements agricoles d'envergure.",
    link: 'https://panagro.vercel.app/'
  },
  {
    tag: 'Branding & Web',
    title: 'MADES Sports Org',
    description: 'Identité graphique moderne et plateforme dynamique pour athlètes de haut niveau.',
    link: 'https://mades-site.vercel.app/'
  }
];

const process = [
  {
    n: '01',
    title: 'Découverte',
    desc: 'Audit de vos besoins, benchmark concurrentiel et cadrage du brief créatif.'
  },
  {
    n: '02',
    title: 'Design',
    desc: "Maquettes UI/UX, système de composants et validation de la direction artistique."
  },
  {
    n: '03',
    title: 'Développement',
    desc: 'Intégration typée, tests de performance et recette avec vos équipes.'
  },
  {
    n: '04',
    title: 'Déploiement',
    desc: 'Mise en production, formation et 30 jours de support technique inclus.'
  }
];

const faqs = [
  {
    question: 'Quel est le délai moyen de conception ?',
    answer: 'Comptez 2 à 3 semaines pour un site vitrine stratégique, et 6 à 12 semaines pour une plateforme sur-mesure ou une application complexe.'
  },
  {
    question: 'Comment fonctionne la facturation ?',
    answer: 'Une facture proforma détaillée vous est envoyée sous 24h ouvrées. Le règlement est découpé par jalons (acompte, livraison).'
  },
  {
    question: 'Le suivi technique est-il inclus ?',
    answer: 'Oui, chaque projet intègre une garantie totale et un support technique de 30 jours.'
  }
];

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

const Home: React.FC = () => {
  const [besoin, setBesoin] = useState('Web Design');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const navigate = useNavigate();

  // Redirection harmonisée vers '/Project'
  const handleServiceClick = (e: React.MouseEvent, filterValue: string) => {
    e.preventDefault();
    navigate('/Project', { state: { filter: filterValue } });
  };

  const goToPortfolio = () => navigate('/Project');

  return (
    <div className="min-h-screen bg-white text-[#12142B] font-sans overflow-x-hidden selection:bg-[#27BAA3] selection:text-white">
      {/* Polices : Space Grotesk (display) + JetBrains Mono (code / labels) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-code { font-family: 'JetBrains Mono', monospace; }
        @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .cursor-blink { animation: blink 1s step-start infinite; }
      `}</style>

      <Nav />

      {/* --- BACKGROUND BLOBS --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#27BAA3]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#2D3079]/5 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 space-y-24">

        {/* --- HERO / BANNIÈRE --- */}
        <section className="rounded-[2.5rem] overflow-hidden bg-[#12142B] relative">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Panneau gauche — "le code" */}
            <div className="p-8 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative">
              <div>
                <p className="font-code text-[10px] uppercase tracking-[0.25em] text-[#27BAA3] mb-6">
                  Studio digital — MD · VA · Bénin
                </p>
                <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-6">
                  Code de précision.
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27BAA3] to-[#E0A73B]">
                    Design visionnaire.
                  </span>
                </h1>
                <p className="text-gray-400 text-base md:text-lg max-w-md leading-relaxed mb-10">
                  DAS COM fusionne les deux disciplines pour propulser l'impact business de votre marque, des deux côtés de l'Atlantique.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => document.getElementById('proforma')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-3.5 bg-[#27BAA3] text-[#12142B] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white transition-all cursor-pointer"
                >
                  Démarrer un projet
                </button>
                <button
                  onClick={goToPortfolio}
                  className="group flex items-center gap-1.5 px-6 py-3.5 border border-white/15 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:border-white/40 transition-all cursor-pointer"
                >
                  Voir nos réalisations
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Panneau droit — "le design", terminal stylisé */}
            <div className="p-8 md:p-12 flex flex-col justify-between bg-gradient-to-br from-[#2D3079] to-[#12142B] relative overflow-hidden">
              <div className="absolute -right-10 -top-10 opacity-20">
                <img src={poster} alt="" className="w-64 h-64 object-contain rotate-6" />
              </div>

              <div className="relative bg-black/30 border border-white/10 rounded-2xl p-5 font-code text-xs leading-relaxed backdrop-blur-sm">
                <div className="flex gap-1.5 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
                <p className="text-gray-500">// das-com/studio.ts</p>
                <p className="text-gray-300">
                  <span className="text-[#E0A73B]">const</span> impact = <span className="text-[#27BAA3]">fusion</span>(code, design)
                </p>
                <p className="text-gray-300">
                  <span className="text-[#E0A73B]">await</span> studio.<span className="text-[#27BAA3]">ship</span>(votreMarque)
                  <span className="cursor-blink text-white">▍</span>
                </p>
              </div>

              <div className="relative mt-10 flex items-center gap-2 text-white/70 font-code text-[10px] uppercase tracking-widest">
                <Clock3 size={13} />
                <span>Montgomery Village, US · 6h d'avance sur Cotonou, Bénin</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- EXPERTISE / SERVICES --- */}
        <section>
          <div className="mb-10">
            <p className="font-code text-[10px] uppercase tracking-widest text-[#27BAA3] mb-1">Expertise</p>
            <h2 className="font-display text-3xl font-bold tracking-tight">Des solutions bâties pour l'impact.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <button
                key={i}
                onClick={(e) => handleServiceClick(e, service.filter)}
                className="group text-left relative p-8 bg-gray-50 border border-gray-100 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between min-h-[250px] cursor-pointer"
              >
                <div>
                  <div className="mb-4 text-[#2D3079]/40 group-hover:text-[#27BAA3] transition-colors">
                    {service.icon}
                  </div>
                  <h4 className="font-display text-xl font-bold mb-2 tracking-tight group-hover:translate-x-1 transition-transform">
                    {service.title}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">{service.desc}</p>
                </div>

                <div className="flex justify-between items-center mt-auto w-full">
                  <div className="flex flex-wrap gap-1.5">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-code text-[9px] uppercase tracking-wider px-2.5 py-0.5 bg-white border border-gray-200/60 rounded-full text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Stack technique */}
          <div className="mt-6 flex flex-wrap gap-2">
            {stack.map((tech) => (
              <span
                key={tech}
                className="font-code text-[10px] px-3 py-1.5 bg-[#2D3079]/5 border border-[#2D3079]/10 rounded-full text-[#2D3079]"
              >
                &lt;{tech}/&gt;
              </span>
            ))}
          </div>
        </section>

        {/* --- SERVICES EN DÉTAIL, AVEC VISUELS --- */}
        <section>
          <div className="mb-10 max-w-xl">
            <p className="font-code text-[10px] uppercase tracking-widest text-[#27BAA3] mb-1">Ce qu'on fait pour vous</p>
            <h3 className="font-display text-3xl font-bold tracking-tight mb-3">Quatre façons de vous accompagner.</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Chaque service ci-dessous peut être pris seul ou combiné. Dites-nous où vous en êtes, on construit la suite avec vous.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {detailedServices.map((service, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-100 rounded-[2rem] overflow-hidden group hover:border-[#2D3079]/20 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                {/* Visuel — remplacez ce bloc par <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                   dès qu'une photo réelle de vos réalisations est disponible. */}
                <div className={`relative aspect-[16/10] bg-gradient-to-br ${service.tone} overflow-hidden`}>
                  {service.image ? (
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)',
                          backgroundSize: '18px 18px'
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                          {service.icon}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-7">
                  <h4 className="font-display text-lg font-bold tracking-tight mb-2">{service.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">{service.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-code text-[9px] uppercase tracking-wider px-2.5 py-0.5 bg-white border border-gray-200/60 rounded-full text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- PORTFOLIO --- */}
        <section>
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="font-code text-[10px] uppercase tracking-widest text-[#27BAA3] mb-1">Réalisations</p>
              <h3 className="font-display text-3xl font-bold tracking-tight">Prêt pour la production.</h3>
            </div>
            <button
              onClick={goToPortfolio}
              className="group flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#2D3079] hover:opacity-75 transition-opacity cursor-pointer bg-transparent border-none"
            >
              Voir tout <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((p, index) => {
              const isInternal = p.link.startsWith('/');
              const cardInner = (
                <>
                  <div>
                    <span className="font-code text-[8px] uppercase tracking-widest bg-white border border-gray-200 px-2.5 py-1 rounded-full text-gray-400">
                      {p.tag}
                    </span>
                    <h4 className="font-display text-xl font-bold tracking-tight mt-5 text-[#12142B]">{p.title}</h4>
                    <p className="text-gray-500 text-xs mt-2 leading-relaxed">{p.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#2D3079] group-hover:text-white transition-all">
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </>
              );

              return (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-100 p-8 rounded-[2rem] flex flex-col justify-between group hover:border-[#2D3079]/20 transition-all min-h-[250px]"
                >
                  {isInternal ? (
                    <button onClick={goToPortfolio} className="text-left flex flex-col justify-between h-full cursor-pointer">
                      {cardInner}
                    </button>
                  ) : (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="flex flex-col justify-between h-full">
                      {cardInner}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* --- PROCESS --- */}
        <section>
          <div className="mb-10">
            <p className="font-code text-[10px] uppercase tracking-widest text-[#27BAA3] mb-1">Méthode</p>
            <h3 className="font-display text-3xl font-bold tracking-tight">Comment on travaille.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {process.map((step) => (
              <div key={step.n} className="relative pt-6 border-t-2 border-[#2D3079]/10">
                <span className="font-code text-xs text-[#27BAA3]">{step.n}</span>
                <h4 className="font-display text-lg font-bold tracking-tight mt-3 mb-2">{step.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- ENGAGEMENTS SUBTILS --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="flex gap-4 items-start">
            <div className="p-2.5 bg-[#27BAA3]/10 text-[#27BAA3] rounded-xl"><Globe size={18} /></div>
            <div>
              <h4 className="font-display text-sm font-bold uppercase tracking-tight">Portée Transatlantique</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Standards techniques US couplés à la réactivité d'un hub basé au Bénin, encore en ligne quand vous dormez.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-2.5 bg-[#2D3079]/10 text-[#2D3079] rounded-xl"><Lock size={18} /></div>
            <div>
              <h4 className="font-display text-sm font-bold uppercase tracking-tight">Sécurité & Performance</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">Architectures durcies conçues pour absorber de forts pics d'audience.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-2.5 bg-gray-100 text-gray-600 rounded-xl"><Layers size={18} /></div>
            <div>
              <h4 className="font-display text-sm font-bold uppercase tracking-tight">Zéro Dette Technique</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">Code typé, modulaire et documenté. Vous restez propriétaire à 100%.</p>
            </div>
          </div>
        </section>

        {/* --- ACTION & CONTACT --- */}
        <section id="proforma" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 bg-[#2D3079] rounded-[2.5rem] p-8 md:p-10 text-white flex flex-col justify-between">
            <div className="mb-6">
              <h3 className="font-display text-3xl font-bold tracking-tight">Prêt à démarrer ?</h3>
              <p className="text-gray-300 text-xs mt-1 italic">Demandez une proforma instantanée sous 24h.</p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Nom ou Entreprise"
                  className="w-full px-5 py-3.5 bg-white/10 rounded-xl border border-transparent focus:border-[#27BAA3] focus:bg-white focus:text-black outline-none transition-all font-medium text-sm text-white placeholder-gray-400"
                />
                <input
                  type="email"
                  required
                  placeholder="vous@entreprise.com"
                  className="w-full px-5 py-3.5 bg-white/10 rounded-xl border border-transparent focus:border-[#27BAA3] focus:bg-white focus:text-black outline-none transition-all font-medium text-sm text-white placeholder-gray-400"
                />
              </div>

              <div className="relative">
                <select
                  value={besoin}
                  onChange={(e) => setBesoin(e.target.value)}
                  className="w-full px-5 py-3.5 bg-white/10 rounded-xl border border-transparent focus:border-[#27BAA3] focus:bg-white focus:text-black outline-none transition-all font-medium text-sm text-white cursor-pointer appearance-none"
                >
                  <option value="Brand Identity">Brand Identity</option>
                  <option value="Logo Showcase">Logo Showcase</option>
                  <option value="Web Design">Web Design</option>
                </select>
                <div className="absolute right-5 bottom-4 pointer-events-none text-gray-400 rotate-45">
                  <ArrowUpRight size={16} />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-white text-[#2D3079] rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-[#27BAA3] hover:text-white transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Envoyer la demande</span>
                <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 bg-gray-50 border border-gray-100 rounded-[2.5rem] p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-2xl font-bold tracking-tight mb-4">Rejoindre le Studio</h3>
              <div className="divide-y divide-gray-100">
                <div className="py-3 flex justify-between items-center text-sm font-bold">
                  <span>Frontend Lead</span>
                  <span className="font-code text-[9px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-400">React / TS</span>
                </div>
                <div className="py-3 flex justify-between items-center text-sm font-bold">
                  <span>Art Director</span>
                  <span className="font-code text-[9px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-400">Figma</span>
                </div>
              </div>
            </div>

            <button className="mt-6 py-4 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center gap-1.5 hover:border-[#27BAA3] hover:bg-[#27BAA3]/5 transition-all group cursor-pointer">
              <Plus size={16} className="text-gray-400 group-hover:text-[#27BAA3]" />
              <span className="font-code text-[10px] uppercase tracking-wider text-gray-400 group-hover:text-[#12142B]">
                Déposer un Portfolio
              </span>
            </button>
          </div>
        </section>

        {/* --- FAQ --- */}
        <section className="max-w-2xl mx-auto pt-4">
          <h3 className="font-display text-2xl font-bold tracking-tight text-center mb-6">FAQ</h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-5 flex justify-between items-center text-left font-bold text-sm text-[#12142B] hover:bg-gray-100/40 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown size={16} className={`transform transition-transform duration-200 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className={`transition-all duration-200 ease-in-out overflow-hidden ${
                    activeFaq === i ? 'max-h-32 border-t border-gray-100 bg-white' : 'max-h-0'
                  }`}
                >
                  <p className="p-5 text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
