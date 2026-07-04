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
  Layers
} from 'lucide-react';
import poster from '../assets/img/poster.png';

const services = [
  {
    icon: <Palette />,
    title: "Brand Identity", 
    desc: "Création de récits visuels uniques et d'identités de marque fortes pour marquer votre marché.",
    filter: "Brand Identity",
    tags: ["Design", "Branding", "Campagnes"]
  },
  {
    icon: <Sparkles />,
    title: "Logo Showcase", 
    desc: "Développement logotypes sur-mesure et chartes graphiques adaptées à tous vos supports.",
    filter: "Logo Showcase",
    tags: ["Logo", "Assets", "Identité"]
  },
  {
    icon: <Code2 />,
    title: "Web Design", 
    desc: "Interfaces UI/UX fluides et écosystèmes web modernes codés pour la performance et la conversion.",
    filter: "Web Design",
    tags: ["Next.js", "UI/UX", "Tailwind"]
  }
];

const featuredProjects = [
  {
    tag: 'Next.js & E-Commerce',
    title: 'Aura Premium Odyssée',
    description: 'Refonte de l\'expérience d\'achat cosmétique. +42% de performances de chargement.',
    link: '/Project'
  },
  {
    tag: 'SaaS Platform',
    title: 'PANAGRO Management',
    description: 'Interface d\'analyses prédictives et suivi d\'investissements agricoles d\'envergure.',
    link: 'https://panagro.vercel.app/'
  },
  {
    tag: 'Branding & Web',
    title: 'MADES Sports Org',
    description: 'Identité graphique moderne et plateforme dynamique pour athlètes de haut niveau.',
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

const Home: React.FC = () => {
  const [besoin, setBesoin] = useState('Web Design');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  const navigate = useNavigate();

  // Redirection harmonisée vers '/Project'
  const handleServiceClick = (e: React.MouseEvent, filterValue: string) => {
    e.preventDefault();
    navigate('/Project', { state: { filter: filterValue } });
  };

  return (
    <div className="min-h-screen bg-white text-[#1C1E36] font-sans overflow-x-hidden selection:bg-[#27BAA3] selection:text-white">
      <Nav />

      {/* --- BACKGROUND BLOBS --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#27BAA3]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#2D3079]/4 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 space-y-24">
        
        {/* --- HERO SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8 bg-[#2D3079]/5 border border-[#2D3079]/10 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-6 right-6 opacity-30 group-hover:opacity-100 transition-opacity">
              <Sparkles size={32} className="text-[#27BAA3]" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#2D3079] mb-4">
              Studio digital — MD · VA · Bénin
            </p>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.95] mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27BAA3] to-[#2D3079]">
                DAS COM
              </span>
            </h1>
            <p className="text-gray-600 text-base md:text-lg max-w-md leading-relaxed">
              Nous fusionnons <span className="text-[#2D3079] font-bold">code de précision</span> et design visionnaire pour propulser votre impact business.
            </p>
          </div>

          <div className="lg:col-span-4 bg-gradient-to-br from-[#2D3079] to-[#1C1E36] rounded-[2rem] overflow-hidden flex items-center justify-center p-6 min-h-[250px]">
            <img
              src={poster}
              alt="Design"
              className="w-full h-full max-h-[240px] object-contain transform hover:scale-103 transition-transform duration-500"
            />
          </div>
        </div>

        {/* --- EXPERTISE / SERVICES --- */}
        <section>
          <div className="mb-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#27BAA3] mb-1">Expertise</p>
            <h2 className="text-3xl font-black tracking-tighter">Des solutions bâties pour l'impact.</h2>
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
                  <h4 className="text-xl font-black mb-2 tracking-tight group-hover:translate-x-1 transition-transform">{service.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">{service.desc}</p>
                </div>
                
                <div className="flex justify-between items-center mt-auto w-full">
                  <div className="flex flex-wrap gap-1.5">
                    {service.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-white border border-gray-200/60 rounded-full text-gray-400">
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
        </section>

        {/* --- PORTFOLIO --- */}
        <section>
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#27BAA3] mb-1">Réalisations</p>
              <h3 className="text-3xl font-black tracking-tighter">Prêt pour la production.</h3>
            </div>
            <button 
              onClick={() => navigate('/Project')} // Aligné également sur '/Project'
              className="group flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#2D3079] hover:opacity-75 transition-opacity cursor-pointer bg-transparent border-none"
            >
              Voir tout <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((p, index) => (
              <div key={index} className="bg-gray-50 border border-gray-100 p-8 rounded-[2rem] flex flex-col justify-between group hover:border-[#2D3079]/20 transition-all min-h-[250px]">
                <div>
                  <span className="text-[8px] font-black uppercase tracking-widest bg-white border border-gray-200 px-2.5 py-1 rounded-full text-gray-400">{p.tag}</span>
                  <h4 className="text-xl font-black tracking-tight mt-5 text-[#1C1E36]">{p.title}</h4>
                  <p className="text-gray-500 text-xs mt-2 leading-relaxed">{p.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#2D3079] group-hover:text-white transition-all">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- ENGAGEMENTS SUBTILS --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="flex gap-4 items-start">
            <div className="p-2.5 bg-[#27BAA3]/10 text-[#27BAA3] rounded-xl"><Globe size={18} /></div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-tight">Portée Transatlantique</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">Standards techniques US couplés à la réactivité d'un hub dynamique.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-2.5 bg-[#2D3079]/10 text-[#2D3079] rounded-xl"><Lock size={18} /></div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-tight">Sécurité & Performance</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">Architectures durcies conçues pour absorber de forts pics d'audience.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-2.5 bg-gray-100 text-gray-600 rounded-xl"><Layers size={18} /></div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-tight">Zéro Dette Technique</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">Code typé, modulaire et documenté. Vous restez propriétaire à 100%.</p>
            </div>
          </div>
        </section>

        {/* --- ACTION & CONTACT --- */}
        <section id="proforma" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 bg-[#2D3079] rounded-[2.5rem] p-8 md:p-10 text-white flex flex-col justify-between">
            <div className="mb-6">
              <h3 className="text-3xl font-black tracking-tighter">Prêt à démarrer ?</h3>
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
                className="w-full py-4 bg-white text-[#2D3079] rounded-xl font-black uppercase tracking-wider text-xs hover:bg-[#27BAA3] hover:text-white transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Envoyer la demande</span>
                <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 bg-gray-50 border border-gray-100 rounded-[2.5rem] p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-black tracking-tighter mb-4">Rejoindre le Studio</h3>
              <div className="divide-y divide-gray-100">
                <div className="py-3 flex justify-between items-center text-sm font-bold">
                  <span>Frontend Lead</span>
                  <span className="text-[9px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-400">React / TS</span>
                </div>
                <div className="py-3 flex justify-between items-center text-sm font-bold">
                  <span>Art Director</span>
                  <span className="text-[9px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-400">Figma</span>
                </div>
              </div>
            </div>

            <button className="mt-6 py-4 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center gap-1.5 hover:border-[#27BAA3] hover:bg-[#27BAA3]/5 transition-all group cursor-pointer">
              <Plus size={16} className="text-gray-400 group-hover:text-[#27BAA3]" />
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 group-hover:text-[#1C1E36]">Déposer un Portfolio</span>
            </button>
          </div>
        </section>

        {/* --- FAQ --- */}
        <section className="max-w-2xl mx-auto pt-4">
          <h3 className="text-2xl font-black tracking-tighter text-center mb-6">FAQ</h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-5 flex justify-between items-center text-left font-bold text-sm text-[#1C1E36] hover:bg-gray-100/40 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown size={16} className={`transform transition-transform duration-200 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`transition-all duration-200 ease-in-out overflow-hidden ${activeFaq === i ? 'max-h-32 border-t border-gray-100 bg-white' : 'max-h-0'}`}>
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