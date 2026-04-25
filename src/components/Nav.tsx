import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react'; // Icônes pour le menu
import logo from '../assets/img/logo_fr.png';

const Nav: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // État pour le menu mobile

  const brandColor = "#8DC63F";
  const darkColor = "#333333";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Expertises', href: '/Expertises' },
    { name: 'Projets', href: '/Projets' },
    { name: 'About', href: '/About' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
          isScrolled || isOpen ? 'py-4 bg-white shadow-lg' : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* LOGO */}
          <div className="flex items-center z-[110]">
            <a href="/">
              <img src={logo} alt="Logo" className="w-32 md:w-48 h-auto transition-all" />
            </a>
          </div>

          {/* NAVIGATION DESKTOP */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className="text-xs font-black uppercase tracking-widest text-[#333333] hover:opacity-60 transition-opacity relative group"
              >
                {link.name}
                <span 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full"
                  style={{ backgroundColor: brandColor }}
                ></span>
              </a>
            ))}
          </div>

          {/* CTA & BURGER */}
          <div className="flex items-center gap-4 z-[110]">
            <a 
              href="#proforma" 
              className="hidden sm:block px-6 py-3 rounded-full text-white text-[11px] font-black uppercase tracking-widest transition-all hover:scale-105 shadow-md"
              style={{ backgroundColor: brandColor }}
            >
              Devis Proforma
            </a>
            
            {/* BOUTON BURGER (Visible uniquement sur mobile) */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-[#333333] focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* --- MENU MOBILE OVERLAY --- */}
        <div className={`
          fixed inset-0 bg-white z-[105] flex flex-col justify-center items-center transition-transform duration-500 ease-in-out md:hidden
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="flex flex-col gap-8 text-center">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)} // Ferme le menu au clic
                className="text-3xl font-black uppercase tracking-tighter text-[#333333] hover:text-[#8DC63F] transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#proforma"
              onClick={() => setIsOpen(false)}
              className="mt-4 px-8 py-4 rounded-full text-white font-black uppercase tracking-widest text-sm"
              style={{ backgroundColor: brandColor }}
            >
              Devis Proforma
            </a>
          </div>
          
          {/* Social Links Small */}
          <div className="absolute bottom-10 flex gap-6">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">DASCOMMUNICATION</span>
          </div>
        </div>
      </nav>

      {/* Spacer pour éviter que le contenu ne passe sous le header fixe */}
      <div className="h-0 md:h-0"></div>
    </>
  );
};

export default Nav;