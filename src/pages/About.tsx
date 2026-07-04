import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lightbulb, Users, ArrowUpRight } from 'lucide-react';
import Nav from '../components/Nav';
import Dor from '../assets/img/Dors.jpeg';

// Données des valeurs avec un sous-titre conceptuel ajouté
const values = [
  {
    icon: <ShieldCheck size={28} />,
    title: "Intégrité Technique",
    tag: "Zéro Dette Technique",
    desc: "Nous ne faisons aucun compromis sur la sécurité, l'accessibilité et la robustesse du code livré. Chaque ligne est taillée pour durer et évoluer sans casser."
  },
  {
    icon: <Lightbulb size={28} />,
    title: "Innovation Utile",
    tag: "Design Centré Business",
    desc: "L'esthétique et la technique n'ont de valeur que si elles résolvent un problème concret pour votre entreprise et fluidifient l'expérience de vos utilisateurs."
  },
  {
    icon: <Users size={28} />,
    title: "Esprit de Partenariat",
    tag: "Cocréation Transparente",
    desc: "Nous refusons la posture de simples exécutants. Nous nous immergeons dans votre écosystème pour devenir le moteur technique de vos ambitions."
  }
];

// Données de l'équipe enrichies avec des réseaux sociaux
const team = [
  {
    name: "Mr Devon DA SILVA",
    role: "Founder & Full-Stack Engineer",
    img: "https://via.placeholder.com/400x500", // Remplace par ta photo
    bio: "Architecte logiciel spécialisé dans les écosystèmes modernes (React, Next.js, TypeScript). Il transforme les architectures complexes en interfaces fluides, performantes et sécurisées.",
    social: {
      linkedin: "#",
      github: "#"
    }
  },
  {
    name: "Mme Dorcas DA SILVA",
    role: "Creative Director & UI/UX",
    img: Dor,
    bio: "Spécialiste de la narration visuelle et de la psychologie des interfaces. Elle façonne des identités de marque mémorables et conçoit des parcours utilisateurs immersifs à fort taux de conversion.",
    social: {
      linkedin: "#"
    }
  }
];

// Statistiques d'impact
const stats = [
  { value: "99.9%", label: "Disponibilité & Fiabilité du Code" },
  { value: "50k+", label: "Lignes de Code Propulsées" },
  { value: "100%", label: "Engagement Éco-responsable" }
];

const About: React.FC = () => {
  const primaryColor = "#27BAA3";   // Turquoise
  const secondaryColor = "#2D3079"; // Bleu profond

  return (
    <div className="min-h-screen bg-white text-[#1C1E36] font-sans selection:bg-[#27BAA3] selection:text-white antialiased">
      <Nav />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-44 pb-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-20 right-0 w-72 h-72 bg-[#27BAA3]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-10 w-96 h-96 bg-[#2D3079]/5 rounded-full blur-3xl pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl"
        >
          <span className="text-xs font-black uppercase tracking-[0.6em] mb-6 block" style={{ color: primaryColor }}>
            Notre Manifeste
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-[#1C1E36] leading-[0.95] tracking-tighter mb-10">
            L'INGÉNIERIE D'ABORD. <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-gray-300 to-gray-500">L'IMPACT PARTOUT.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-3xl font-light">
            Chez <span className="font-bold text-[#2D3079]">DASCOMMUNICATION</span>, nous fusionnons la rigueur de l'ingénierie logicielle full-stack et la puissance du design stratégique pour propulser votre entreprise vers ses sommets.
          </p>
        </motion.div>

        {/* --- CHIFFRES CLÉS (ANIMÉS) --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-20 pt-12 border-t border-gray-100"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <span className="text-4xl md:text-6xl font-black tracking-tight" style={{ color: secondaryColor }}>
                {stat.value}
              </span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-snug">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* --- GRILLE DES VALEURS --- */}
      <section className="py-28 px-6 bg-gradient-to-b from-gray-50/70 to-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400 block mb-3">Fondations</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Nos principes non négociables</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {values.map((val, i) => (
              <div 
                key={i} 
                className="bg-white p-8 lg:p-10 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/40 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div 
                    className="w-14 h-14 flex items-center justify-center rounded-2xl mb-8 transition-transform group-hover:scale-110 shadow-lg shadow-[#2D3079]/10"
                    style={{ backgroundColor: secondaryColor, color: primaryColor }}
                  >
                    {val.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest block mb-2" style={{ color: primaryColor }}>
                    {val.tag}
                  </span>
                  <h3 className="text-2xl font-black text-[#1C1E36] mb-4 tracking-tight">{val.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION ÉQUIPE --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400 block mb-3">L'Équipe Core</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#1C1E36]">
              Les esprits derrière <span style={{ color: primaryColor }}>l'exécution.</span>
            </h2>
          </div>
          <p className="text-gray-400 text-sm max-w-sm font-medium leading-relaxed">
            Pas d'intermédiaires, pas de strates managériales inutiles. Vous collaborez directement avec les créateurs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {team.map((member, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-[2.5rem] bg-gray-50/50 flex flex-col sm:flex-row items-stretch border border-gray-100 hover:shadow-2xl hover:shadow-[#2D3079]/5 transition-all duration-500"
            >
              {/* Photo avec overlay au survol */}
              <div className="w-full sm:w-1/2 h-[380px] sm:h-auto overflow-hidden relative">
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-102 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>

              {/* Contenu et infos */}
              <div className="w-full sm:w-1/2 p-8 lg:p-10 flex flex-col justify-between bg-white sm:bg-transparent">
                <div>
                  <h3 className="text-2xl font-black text-[#1C1E36] tracking-tight leading-tight mb-2">
                    {member.name}
                  </h3>
                  <p className="text-xs font-extrabold uppercase tracking-widest mb-6" style={{ color: primaryColor }}>
                    {member.role}
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed font-light">
                    {member.bio}
                  </p>
                </div>

                {/* Liens réseaux sociaux dynamiques 
                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100/80">
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} className="p-2 bg-gray-100 hover:bg-[#2D3079] text-gray-500 hover:text-white rounded-xl transition-all duration-300" aria-label="LinkedIn">
                      <Linkedin size={18} />
                    </a>
                  )}
                  {member.social.github && (
                    <a href={member.social.github} className="p-2 bg-gray-100 hover:bg-[#1C1E36] text-gray-500 hover:text-white rounded-xl transition-all duration-300" aria-label="GitHub">
                      <Github size={18} />
                    </a>
                  )}
                </div>*/}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- SECTION ACCÉLÉRATEUR DE PROJET (CTA ACCROCHEUR) --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-center relative overflow-hidden">
        <div className="bg-[#1C1E36] text-white rounded-[3rem] py-16 px-8 relative overflow-hidden group shadow-2xl">
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-10 blur-2xl transition-transform group-hover:scale-120" style={{ backgroundColor: primaryColor }} />
          
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <span className="text-xs font-black uppercase tracking-[0.5em] mb-4 text-gray-400">Prêt à collaborer ?</span>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight mb-8 leading-tight">
              Construisons votre prochaine infrastructure numérique.
            </h3>
            <a 
              href="#contact" 
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-black uppercase tracking-widest text-xs transition-all duration-300 hover:scale-105 shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              Lancer le Projet <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;