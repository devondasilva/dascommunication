import React, { useState, useEffect } from 'react';
import logo from '../assets/img/logo_fr.png';

const Nav: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const brandColor = "#8DC63F";

  // Détecte le scroll pour changer l'apparence du header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    
    <div className="">
      
      {/* --- HERO SECTION --- */}
    
    <nav 
      className={` top-0 w-full z-[100] transition-all duration-300 ${
        isScrolled ? 'py-4 bg-white/80 backdrop-blur-md shadow-lg shadow-gray-100' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <a href="/"> <img src={logo} alt="Logo" className="w-48 md:w-48 h-auto" /></a>  
        </div>

        {/* NAVIGATION LINKS (Desktop) */}
        <div className="hidden md:flex items-center gap-10">
          {['Expertises', 'Projets', 'About'].map((item) => (
            <a 
              key={item}
              href={`${item}`}
              className="text-xs font-black uppercase tracking-widest text-[#333333] hover:opacity-60 transition-opacity relative group"
            >
              {item}
              <span 
                className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full"
                style={{ backgroundColor: brandColor }}
              ></span>
            </a>
          ))}
        </div>

        {/* CTA BUTTON */}
        <div className="flex items-center gap-6">
          <a 
            href="#proforma" 
            className="hidden sm:block px-6 py-3 rounded-full text-white text-[11px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-md"
            style={{ backgroundColor: brandColor }}
          >
            Devis Proforma
          </a>
          
          {/* MOBILE MENU ICON (Simple burger) */}
          <div className="md:hidden flex flex-col gap-1.5 cursor-pointer">
            <span className="w-6 h-0.5 bg-[#333333]"></span>
            <span className="w-6 h-0.5 bg-[#8DC63F]"></span>
            <span className="w-4 h-0.5 bg-[#333333] self-end"></span>
          </div>
        </div>

      </div>
    </nav>

    </div>
  );
};

export default Nav;