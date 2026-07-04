import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react'; // Icônes pour le menu
import logo from '../assets/img/logo_fr.png';

const Nav: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // État pour le menu mobile
  const [isVisible, setIsVisible] = useState(true); // État pour cacher au scroll bas
  const [lastScrollY, setLastScrollY] = useState(0);

  const brandColor = "#27BAA3";

  // Gestion du scroll (effet sticky et masquage automatique)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Gestion de l'ombre et de la hauteur au scroll
      setIsScrolled(currentScrollY > 20);

      // 2. Gestion de la disparition au scroll vers le bas (se déclenche après 80px)
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        if (!isOpen) setIsVisible(false); // On cache si on descend (et que le menu mobile est fermé)
      } else {
        setIsVisible(true); // On réaffiche dès qu'on remonte
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isOpen]);

  // Bloquer le scroll de l'arrière-plan (body) quand le menu mobile est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Expertises', href: '/Expertises' },
    { name: 'Projets', href: '/Project' },
    { name: 'À Propos', href: '/About' },
    { name: 'Contact', href: '/Contact' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-[100] transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled || isOpen ? 'py-4 bg-white shadow-lg' : 'py-6 bg-white'
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
              className="md:hidden p-2 text-[#333333] focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* --- MENU MOBILE OVERLAY --- */}
        <div className={`
          fixed inset-0 bg-white z-[105] flex flex-col justify-between items-center transition-all duration-500 ease-in-out md:hidden
          pt-24 pb-6 px-6 h-screen
          ${isOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : 'translate-x-full opacity-0 pointer-events-none'}
        `}>
          
          {/* Conteneur des Liens - Utilisation de my-auto pour équilibrer, gap serré et ajustement hauteur */}
          <div className="flex flex-col gap-[4vh] text-center w-full max-w-sm my-auto">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-2xl xs:text-3xl font-black uppercase tracking-tighter text-[#333333] hover:text-[#27BAA3] transition-colors"
              >
                {link.name}
              </a>
            ))}
            
            <a 
              href="#proforma"
              onClick={() => setIsOpen(false)}
              className="mt-2 px-8 py-3.5 rounded-full text-white font-black uppercase tracking-widest text-xs sm:text-sm text-center shadow-md active:scale-95 transition-transform w-full"
              style={{ backgroundColor: brandColor }}
            >
              Devis Proforma
            </a>
          </div>
          
          {/* Social / Footer en bas, fixe sans encombrer le milieu */}
          <div className="flex justify-center w-full pt-4 border-t border-gray-100">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">DASCOMMUNICATION</span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;