import React from 'react';
import {ArrowRight, ShieldCheck } from 'lucide-react';
import log from '../assets/img/log.png';    

const Footer: React.FC = () => {
  const primaryColor = "#27BAA3";   // Turquoise

  return (
    <footer className="bg-[#0E1020] text-white pt-24 pb-12 px-6 overflow-hidden relative border-t border-white/5">
      {/* Effet visuel de fond : halo lumineux turquoise subtil */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#27BAA3] blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        {/* --- TOP SECTION : NEWSLETTER & BRAND --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20 border-b border-white/10">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-8">
              <div className="  flex items-center justify-center" >
                <img src={log} alt="Logo" className="w-32 md:w-48 h-auto" />
              </div>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed max-w-sm mb-10">
              Propulser les marques et les institutions via des solutions logicielles de pointe et un design d'impact.
            </p>
              <div className="flex gap-4">
              <SocialIcon 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2c-1.657 0-2 1-2 2v7h-4v-14h4v2" />
                    <rect x="2" y="9" width="4" height="11" rx="1" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                }
                href="https://www.linkedin.com/in/honore-da-silva-b02561194"
              />
              
              {/* SVG inline robuste pour Instagram (indépendant de la version lucide-react) */}
              <SocialIcon 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                } 
                href="https://www.instagram.com/devondasilva5?igsh=MWNsd2FucjE2ZnJzbg%3D%3D&utm_source=qr" 
              />
              
              <SocialIcon 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z" />
                  </svg>
                }
                href="https://www.facebook.com/devon.dasilva.37"
              />
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-6" style={{ color: primaryColor }}>Restez à l'avant-garde du digital</h3>
            <div className="relative max-w-lg">
              <input 
                type="email" 
                placeholder="Votre adresse email pro" 
                className="w-full bg-white/5 border border-white/10 py-5 px-6 rounded-2xl outline-none focus:border-[#27BAA3] transition-all text-sm font-medium text-white placeholder-gray-500"
              />
              <button 
                className="absolute right-2 top-2 bottom-2 text-[#0E1020] px-6 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:brightness-110 transition-all cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                S'abonner <ArrowRight size={14} />
              </button>
            </div>
            <div className="mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={12} /> Données sécurisées • Aucun Spam garanti
            </div>
          </div>
        </div>

        {/* --- MIDDLE SECTION : LINKS --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-20">
          <FooterColumn 
            title="Expertises" 
            links={["Développement Web", "Branding & Design", "Marketing Digital", "Interfaces UI/UX"]} 
            activeColor={primaryColor}
          />
          <FooterColumn 
            title="L'Agence" 
            links={["Nos Projets", "Nos Valeurs", "Méthodologie", "Contact"]} 
            activeColor={primaryColor}
          />
          <FooterColumn 
            title="Ressources" 
            links={["Journal/Blog", "Études de cas", "Design Systems", "Open Source"]} 
            activeColor={primaryColor}
          />
          <FooterColumn 
            title="Légal" 
            links={["Mentions Légales", "Confidentialité", "Conditions Générales", "Support Client"]} 
            activeColor={primaryColor}
          />
        </div>

        {/* --- BOTTOM SECTION : COPYRIGHT & INFO --- */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
            <p>© 2026 DASCOMM STUDIO</p>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/10"></div>
            <p className="flex items-center gap-2 italic">
               Excellence Digital & Visual • MD • VA • BJ
            </p>
          </div>
          
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <a href="#" className="hover:text-[#27BAA3] transition-colors">Politique de cookies</a>
            <a href="#" className="hover:text-[#27BAA3] transition-colors">Plan du site</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- SOUS-COMPOSANTS INTERNES ---

interface FooterColumnProps {
  title: string;
  links: string[];
  activeColor: string;
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, links, activeColor }) => (
  <div className="flex flex-col gap-6">
    <h4 
      className="text-[11px] font-black uppercase tracking-[0.4em] text-white underline underline-offset-8 italic"
      style={{ textDecorationColor: `${activeColor}40` }}
    >
      {title}
    </h4>
    <ul className="flex flex-col gap-4">
      {links.map((link) => (
        <li key={link}>
          <a 
            href="#" 
            className="text-sm text-gray-400 hover:translate-x-2 transition-all inline-block font-medium"
            style={{ '--hover-color': activeColor } as React.CSSProperties}
            onMouseEnter={(e) => (e.currentTarget.style.color = activeColor)}
            onMouseLeave={(e) => (e.currentTarget.style.color = '')}
          >
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

interface SocialIconProps {
  icon: React.ReactNode;
  href: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ icon, href }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#27BAA3] hover:text-[#0E1020] hover:border-transparent transition-all hover:-translate-y-1"
  >
    {icon}
  </a>
);

export default Footer;