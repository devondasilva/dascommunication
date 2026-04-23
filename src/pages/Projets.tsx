import { useState } from 'react';
import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import { itemData } from '../data/poster';

import '../index.css';
import Nav from '../components/Nav';


export default function Project() {
  const [open, setOpen] = useState(false);
  const [activeImg, setActiveImg] = useState<{img: string, title: string} | null>(null);
  const brandColor = "#8DC63F";

  const handleOpen = (item: {img: string, title: string}) => {
    setActiveImg(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className='min-h-screen bg-slate-50 font-sans'>
      <Nav />
      
      {/* --- HEADER SECTION --- */}
      <header className="bg-white border-b border-slate-100 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="max-w-2xl">
                    <h2 className="font-black text-5xl md:text-8xl text-[#333333] tracking-tighter leading-none mb-6">
                        Latest <span style={{ color: brandColor }}>Work.</span>
                    </h2>
                    <p className="text-xl text-slate-500 leading-relaxed">
                        A collection of visual experiences, brand identities, and digital interfaces 
                        crafted for impact and performance.
                    </p>
                </div>
                <div className="flex gap-4 mb-2">
                    <div className="text-right">
                        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Total Projects</p>
                        <p className="text-3xl font-black">{itemData.length}</p>
                    </div>
                </div>
            </div>
        </div>
      </header>

      {/* --- MASONRY GALLERY SECTION --- */}
      <main className='max-w-7xl mx-auto px-4 py-16'>
        <Box sx={{ width: '100%', minHeight: 800 }}>
          <Masonry 
            columns={{ xs: 1, sm: 2, md: 3 }} 
            spacing={3}
          >
            {itemData.map((item, index) => (
              <div 
                key={index} 
                className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
                onClick={() => handleOpen(item)}
              >
                {/* Image */}
                <img
                  src={item.img}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-auto block transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span 
                            className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white mb-2 inline-block"
                            style={{ backgroundColor: brandColor }}
                        >
                            Project
                        </span>
                        <h4 className="text-white text-xl font-bold italic">{item.title}</h4>
                    </div>
                </div>
              </div>
            ))}
          </Masonry>
        </Box>
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
            style: { backgroundColor: 'rgba(0, 0, 0, 0.92)' } 
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
                '&:hover': { color: brandColor }
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
                    borderRadius: '8px',
                    boxShadow: '0 0 100px rgba(0,0,0,0.5)'
                    }}
                />
                <div className="mt-6 text-center">
                    <h3 className="text-white text-3xl font-black uppercase tracking-tighter">
                        {activeImg.title}
                    </h3>
                    <div className="w-12 h-1 mx-auto mt-2 rounded-full" style={{ backgroundColor: brandColor }}></div>
                </div>
              </div>
            )}
          </Box>
        </Fade>
      </Modal>

      {/* --- FOOTER CTA --- */}
       <footer className="bg-white py-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm">
            © 2026 — Design Portfolio. Developed by <span className="font-bold text-slate-800">D@scommunication</span>.
          </p>
          <div className="flex gap-6 text-sm font-bold uppercase tracking-widest text-gray-400">
             <a href="https://www.instagram.com/devondasilva5?igsh=MWNsd2FucjE2ZnJzbg%3D%3D&utm_source=qr" className="hover:opacity-70 transition-opacity">Instagram</a>
             <a href="https://www.linkedin.com/in/honore-da-silva-b02561194" className="hover:opacity-70 transition-opacity">LinkedIn</a>
             <a href="https://www.facebook.com/devon.dasilva.37" className="hover:opacity-70 transition-opacity">Facebook</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

