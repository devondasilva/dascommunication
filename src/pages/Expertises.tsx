import React from 'react';
import { motion } from 'framer-motion';
import { Code2, PenTool, BarChart3, Smartphone} from 'lucide-react';
import Nav from '../components/Nav';

const Expertises: React.FC = () => {
  const brandColor = "#8DC63F";
  const darkColor = "#333333";

  const expertiseList = [
    {
      id: "01",
      title: "Développement Web & Software",
      category: "Ingénierie",
      icon: <Code2 size={32} />,
      description: "Conception d'architectures robustes avec React, TypeScript et Next.js. Nous transformons des besoins métier complexes en interfaces fluides et sécurisées.",
      skills: ["Applications Full-Stack", "API REST & GraphQL", "Optimisation Performance"]
    },
    {
      id: "02",
      title: "Design Graphique & Branding",
      category: "Identité",
      icon: <PenTool size={32} />,
      description: "Création d'univers visuels uniques. Du logotype à la charte graphique complète, nous forgeons l'ADN visuel qui vous démarque de la concurrence.",
      skills: ["Logotype & Iconographie", "Supports Print", "Direction Artistique"]
    },
    {
      id: "03",
      title: "Stratégie Marketing Digital",
      category: "Croissance",
      icon: <BarChart3 size={32} />,
      description: "Propulsion de votre visibilité via des stratégies SEO pointues et des campagnes publicitaires data-driven pour un ROI mesurable.",
      skills: ["SEO / SEA", "Content Marketing", "Analyse de Données"]
    },
    {
      id: "04",
      title: "UI/UX Design",
      category: "Expérience",
      icon: <Smartphone size={32} />,
      description: "Prototypage haute fidélité centré sur l'utilisateur. Nous optimisons chaque point de contact pour maximiser la conversion et la rétention.",
      skills: ["Prototypage Figma", "User Testing", "Design System"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* --- EN-TÊTE DE PAGE --- */}
      <section className="pt-40 pb-20 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-[2px] w-12" style={{ backgroundColor: brandColor }}></div>
            <span className="text-xs font-black uppercase tracking-[0.4em] text-gray-400">Ce que nous maîtrisons</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-black text-[#333333] leading-none tracking-tighter mb-8">
            NOS <span style={{ color: brandColor }}>EXPERTISES.</span>
          </h1>
          <p className="max-w-2xl text-xl text-gray-500 leading-relaxed">
            Une synergie unique entre technologie de pointe et esthétique minimaliste pour propulser votre communication institutionnelle.
          </p>
        </div>
      </section>

      {/* --- GRILLE DES SERVICES --- */}
      <section className="py-24 px-6 bg-[#fcfcfc]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {expertiseList.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-12 bg-white rounded-[2rem] border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-10">
                  <div 
                    className="p-4 rounded-2xl text-white shadow-lg"
                    style={{ backgroundColor: darkColor }}
                  >
                    {item.icon}
                  </div>
                  <span className="text-6xl font-black text-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    {item.id}
                  </span>
                </div>

                <div className="mb-2 text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: brandColor }}>
                  {item.category}
                </div>
                <h3 className="text-3xl font-black text-[#333333] mb-6 tracking-tighter">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed mb-8 text-lg">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  {item.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="px-4 py-2 rounded-full bg-gray-50 text-[#333333] text-[11px] font-bold uppercase border border-gray-100 group-hover:border-[#8DC63F]/30 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-[#333333] p-16 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20" style={{ backgroundColor: brandColor, filter: 'blur(80px)' }}></div>
          
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8">
            Besoin d'une expertise spécifique ?
          </h2>
          <p className="text-gray-400 mb-10 text-lg">
            Discutons de votre projet pour définir la stratégie technique et visuelle la plus adaptée.
          </p>
          <button 
            className="px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm transition-transform hover:scale-105 active:scale-95 shadow-xl"
            style={{ backgroundColor: brandColor, color: 'white' }}
          >
            Obtenir un Devis Gratuit
          </button>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 px-6 border-t border-gray-100 text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.4em]">
          © 2026 DASCOMMUNICATION — Excellence Digital & Visual
        </p>
      </footer>
    </div>
  );
};

export default Expertises;