import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';

// Importations des sources de données
import { itemData } from '../data/poster';
import { LOGOS } from '../data/Logos';
import { WEB_PROJECTS } from '../data/Webprojects';
import {livrePages} from '../data/Livre';

import '../index.css';
import Nav from '../components/Nav';

interface ProjectItem {
  id?: string | number;
  img: string;
  title: string;
  category?: string;
  client?: string;
}

export default function Project() {
  const [open, setOpen] = useState(false);
  const [activeImg, setActiveImg] = useState<ProjectItem | null>(null);
  
  const location = useLocation();
  const filters = ['All', 'Brand Identity', 'Logo Showcase', 'Web Design','Livre'];

  // 1. Initialisation : On check d'abord le state de react-router, puis l'URL, sinon 'All'
  const [activeFilter, setActiveFilter] = useState<string>(() => {
    if (location.state && (location.state as any).filter) {
      return (location.state as any).filter;
    }
    const queryParams = new URLSearchParams(window.location.search);
    const filterParam = queryParams.get('filter');
    return filters.includes(filterParam || '') ? (filterParam as string) : 'All';
  });

  const primaryColor = "#27BAA3";   // Turquoise
  const secondaryColor = "#2D3079"; // Bleu profond

  const handleOpen = (item: ProjectItem) => {
    setActiveImg(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // 2. Écoute active des changements de navigation (clics internes ou URL)
  useEffect(() => {
    // Priorité au state envoyé par la navigation programmée
    if (location.state && (location.state as any).filter) {
      setActiveFilter((location.state as any).filter);
    } else {
      // Sinon on se rabat sur l'URL query param
      const queryParams = new URLSearchParams(location.search);
      const filterParam = queryParams.get('filter');
      if (filterParam && filters.includes(filterParam)) {
        setActiveFilter(filterParam);
      } else if (!filterParam) {
        setActiveFilter('All');
      }
    }
  }, [location.state, location.search]); // On écoute les deux variations

  // Fonction centrale pour récupérer et filtrer les données selon l'onglet actif
  const getFilteredData = (): ProjectItem[] => {
    switch (activeFilter) {
      case 'Logo Showcase':
        return LOGOS;
      case 'Web Design':
        return WEB_PROJECTS;
      case 'Brand Identity':
        return itemData.filter((item: any) => item.category === 'Brand Identity' || !item.category);
      case 'Livre':
        return livrePages.map((page: any) => ({
          id: page.id,
          img: page.image,
          title: page.title,
          category: 'Livre'
        }));
      case 'All':
      default:
        return [
          ...itemData.map((item: any) => ({ ...item, category: item.category || 'Brand Identity' })),
          ...LOGOS.map((item: any) => ({ ...item, category: item.category || 'Logo Showcase' })),
          ...WEB_PROJECTS.map((item: any) => ({ ...item, category: item.category || 'Web Design' }))
        ];
    }
  };

  const currentData = getFilteredData();

  return (
    <div className='min-h-screen bg-white font-sans text-[#1C1E36] selection:bg-[#27BAA3] selection:text-white'>
      <Nav />
      
      {/* --- HEADER COHÉRENT & FILTRES --- */}
      <header className="bg-white border-b mt-20 border-gray-100 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="max-w-2xl">
              <h2 className="font-black text-5xl md:text-8xl text-[#1C1E36] tracking-tighter leading-none mb-6">
                Latest <span style={{ color: primaryColor }}>Work.</span>
              </h2>
              <p className="text-xl text-gray-500 leading-relaxed">
                A collection of visual experiences, brand identities, and digital interfaces 
                crafted for impact and performance.
              </p>
            </div>
            <div className="flex gap-4 mb-2">
              <div className="text-right">
                <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Total Projects</p>
                <p className="text-3xl font-black text-[#2D3079]">{currentData.length}</p>
              </div>
            </div>
          </div>

          {/* Boutons de Filtres */}
          <div className="flex flex-wrap gap-2 mt-12 border-t border-gray-100 pt-6">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-[#2D3079] text-white border-[#2D3079] shadow-lg shadow-[#2D3079]/10'
                    : 'bg-gray-50 text-gray-400 border-gray-200/60 hover:text-[#1C1E36] hover:bg-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* --- RENDU DE SCÈNE DYNAMIQUE --- */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {(() => {
          if (currentData.length === 0) {
            return (
              <div className="w-full text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
                <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Aucun projet trouvé dans cette catégorie.</p>
              </div>
            );
          }

          if (activeFilter === 'Logo Showcase') {
            return (
              <section className="w-full px-2">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-4 italic">Crafting Symbols</h4>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                      Logo <br /> <span className="italic font-light drop-shadow-sm" style={{ color: primaryColor }}>Showcase.</span>
                    </h2>
                  </div>
                  <p className="max-w-xs md:text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                    From financial institutions to boutique startups, creating marks that define the core of a brand.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {currentData.map((logo, index) => (
                    <div 
                      key={logo.id || index} 
                      onClick={() => handleOpen(logo)}
                      className="group relative aspect-square bg-gray-50 border border-gray-100 overflow-hidden rounded-[2.5rem] transition-all duration-700 hover:shadow-2xl cursor-pointer"
                    >
                      <div className="absolute inset-0 p-16 flex items-center justify-center transition-transform duration-700 group-hover:scale-50 group-hover:-translate-y-12">
                        <img src={logo.img} alt={logo.client || logo.title} className="max-w-full max-h-full object-contain transition-all duration-500" />
                      </div>
                      
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10 translate-y-full group-hover:translate-y-0" style={{ backgroundColor: primaryColor }}>
                        <span className="text-[9px] font-black uppercase tracking-widest text-black/40 mb-2">{logo.category || 'Logo'}</span>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">{logo.client || 'Client'}</h3>
                        <p className="text-[10px] font-bold text-white uppercase tracking-widest italic">{logo.title}</p>
                      </div>
                      <div className="absolute top-8 right-8 w-2 h-2 rounded-full bg-slate-200 group-hover:bg-white transition-colors"></div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          return (
            <Box sx={{ width: '100%', minHeight: 600 }}>
              <Box component={Masonry} columns={{ xs: 1, sm: 2, md: 3 }} spacing={3}>
                {currentData.map((item, index) => (
                  <div 
                    key={index} 
                    className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-[#2D3079]/10 transition-all duration-500 border border-gray-100 bg-gray-50"
                    onClick={() => handleOpen(item)}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-auto block transition-transform duration-700 group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-[#2D3079]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span 
                          className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-white mb-2 inline-block"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {item.category || 'Project'}
                        </span>
                        <h4 className="text-white text-xl font-bold italic tracking-tight">{item.title}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </Box>
            </Box>
          );
        })()}
      </main>

      {/* --- MODAL (LIGHTBOX) --- */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            style: { backgroundColor: 'rgba(28, 30, 54, 0.95)' }
          },
        }}
      >
        <Fade in={open}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            outline: 'none',
            maxWidth: '95vw',
            maxHeight: '95vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <IconButton 
              onClick={handleClose}
              sx={{ 
                position: 'absolute', 
                top: -50, 
                right: { xs: 0, md: -50 }, 
                color: 'white',
                '&:hover': { color: primaryColor }
              }}
            >
              <CloseIcon sx={{ fontSize: 40 }} />
            </IconButton>

            {activeImg && (
              <div className="relative">
                <img 
                  src={activeImg.img} 
                  alt={activeImg.title}
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    maxHeight: '80vh', 
                    objectFit: 'contain',
                    borderRadius: '12px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                  }}
                />
                <div className="mt-6 text-center">
                  <h3 className="text-white text-3xl font-black uppercase tracking-tighter">
                    {activeImg.title}
                  </h3>
                  <div className="w-12 h-1 mx-auto mt-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                </div>
              </div>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}