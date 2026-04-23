import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lightbulb, Users} from 'lucide-react';
import Nav from '../components/Nav';

// Données des valeurs
const values = [
  {
    icon: <ShieldCheck size={32} />,
    title: "Intégrité Technique",
    desc: "Nous ne faisons aucun compromis sur la sécurité et la robustesse du code que nous livrons."
  },
  {
    icon: <Lightbulb size={32} />,
    title: "Innovation Utile",
    desc: "Le design et la tech ne servent à rien s'ils ne résolvent pas un problème réel pour votre entreprise."
  },
  {
    icon: <Users size={32} />,
    title: "Esprit de Partenariat",
    desc: "Nous ne sommes pas de simples prestataires, mais une extension de votre équipe."
  }
];

// Données de l'équipe
const team = [
  {
    name: "Honore Christel De DA SILVA",
    role: "Founder & Full-Stack Engineer",
    img: "https://via.placeholder.com/400x500", // Remplace par ta photo
    bio: "Expert IT et passionné de développement logiciel haute performance."
  },
  {
    name: "Devon Da Silva",
    role: "Creative Director & UI/UX",
    img: "https://via.placeholder.com/400x500",
    bio: "Spécialiste en identité visuelle et interfaces numériques immersives."
  }
];

const About: React.FC = () => {
  const brandColor = "#8DC63F";
  const darkColor = "#333333";

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* --- HERO VALEURS --- */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto border-b border-gray-100">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <span className="text-xs font-black uppercase tracking-[0.5em] mb-6 block" style={{ color: brandColor }}>
            Notre ADN
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-[#333333] leading-none tracking-tighter mb-8">
            NOS VALEURS <br /> <span className="text-slate-300">& L'ÉQUIPE.</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            Chez <span className="font-bold text-[#333333]">DASCOMMUNICATION</span>, nous croyons que l'excellence naît de la précision technique et de l'audace créative.
          </p>
        </motion.div>
      </section>

      {/* --- GRILLE DES VALEURS --- */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {values.map((val, i) => (
            <div key={i} className="group">
              <div 
                className="w-16 h-16 flex items-center justify-center rounded-2xl mb-8 transition-transform group-hover:-rotate-6"
                style={{ backgroundColor: darkColor, color: brandColor }}
              >
                {val.icon}
              </div>
              <h3 className="text-2xl font-black text-[#333333] mb-4 tracking-tight">{val.title}</h3>
              <p className="text-gray-500 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION ÉQUIPE --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="mb-20 text-center md:text-left">
          <h2 className="text-xs font-black uppercase tracking-[0.5em] text-gray-400 mb-4">The Minds</h2>
          <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-[#333333]">
            Les visages de <span style={{ color: brandColor }}>l'impact.</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {team.map((member, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-[3rem] bg-gray-50 flex flex-col md:flex-row items-center border border-gray-100"
            >
              {/* Photo */}
              <div className="w-full md:w-1/2 h-[400px] overflow-hidden">
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
              </div>

              {/* Infos */}
              <div className="w-full md:w-1/2 p-10">
                <h4 className="text-2xl font-black text-[#333333] tracking-tighter leading-tight mb-2">
                  {member.name}
                </h4>
                <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: brandColor }}>
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  {member.bio}
                </p>
                
                
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
          © 2026 DASCOMMUNICATION — Maryland • Virginia
        </p>
      </footer>
    </div>
  );
};

export default About;