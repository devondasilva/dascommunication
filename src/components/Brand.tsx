import React, { useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Nav from './Nav';
import '../index.css';
import { livrePages } from '../data/Livre'; 

const brandColor = "#8DC63F";

// 1. Définition des interfaces pour supprimer tout usage de 'any'
interface PageData {
  id: number;
  image: string;
  title: string;
}

// Interface pour l'événement de flip (spécifique à la bibliothèque)
interface FlipEvent {
  data: number;
}

const Brand: React.FC = () => {
  // 2. Typage de la Ref : On définit la structure attendue au lieu de 'any'
  const flipBookRef = useRef<{ pageFlip: () => { flipNext: () => void; flipPrev: () => void } }>(null);
  
  const [currentPage, setCurrentPage] = useState<number>(0);

  const nextBtn = (): void => flipBookRef.current?.pageFlip().flipNext();
  const prevBtn = (): void => flipBookRef.current?.pageFlip().flipPrev();

  return (
    <div className="min-h-screen bg-[#D8D8D8] flex flex-col items-center overflow-x-hidden selection:bg-[#8DC63F] selection:text-white">
      <Nav />

      {/* --- HEADER ÉDITORIAL --- */}
      <header className="w-full max-w-7xl px-6 pt-24 md:pt-32 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="relative">
          <div 
            className="absolute -left-6 md:-left-10 top-2 h-full w-[4px] rounded-full"
            style={{ backgroundColor: brandColor }}
          ></div>
          
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85]">
            MAGAZINE <br />
            <span className="text-white drop-shadow-sm italic font-light">Showcase.</span>
          </h1>
          
          <div className="flex items-center gap-4 mt-8">
            <span className="text-slate-600 font-bold uppercase tracking-[0.3em] text-[10px]">Edition 2024 / Volume 01</span>
            <div className="w-12 h-[1px] bg-slate-900/20"></div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end text-right">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Location</span>
          <span className="text-slate-900 font-black text-xl tracking-tighter">FRENCH GUYANA</span>
        </div>
      </header>

      {/* --- ZONE DU LIVRE (FLIPBOOK) --- */}
      <main className="relative w-full max-w-6xl flex flex-col items-center justify-center py-10 md:py-16">
        <div className="absolute inset-0 bg-white/30 blur-[150px] rounded-full scale-75 pointer-events-none"></div>

        <div className="relative z-10 drop-shadow-[0_50px_80px_rgba(0,0,0,0.3)]">
          {/* @ts-expect-error: HTMLFlipBook lacks official React 18 types but is functional */}
          <HTMLFlipBook 
            width={450} 
            height={600}
            size="stretch"
            minWidth={300}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1533}
            maxShadowOpacity={0.4}
            showCover={true}
            className="magazine-book"
            ref={flipBookRef}
            onFlip={(e: FlipEvent) => setCurrentPage(e.data)}
            style={{ backgroundColor: 'transparent' }}
            usePortrait={false}
            startPage={0}
            drawShadow={true}
            flippingTime={1000}
            useMouseEvents={true}
          >
            {/* 3. Typage explicite de 'page' pour éviter l'erreur de la ligne 18/19 */}
            {livrePages.map((page: PageData) => (
              <div key={page.id} className="bg-white overflow-hidden rounded-r-sm md:rounded-r-md border-y border-r border-black/5 shadow-inner">
                <div className="relative h-full w-full overflow-hidden">
                  <img 
                    src={page.image} 
                    alt={page.title} 
                    className="w-full h-full object-cover shadow-2xl"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/20 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute inset-y-0 right-0 w-[2px] bg-white/20 pointer-events-none"></div>
                  <div className="absolute inset-0 rounded-[1rem] md:rounded-[1.5rem] pointer-events-none border-[1px] border-black/10"></div>
                </div>
              </div>
            ))}
          </HTMLFlipBook>
        </div>

        {/* --- CONTRÔLES DE NAVIGATION --- */}
        <div className="flex items-center justify-between w-full max-w-md mt-16 px-6 relative z-20">
          <button 
            onClick={prevBtn}
            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/50 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all duration-500 group"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>

          <div className="flex flex-col items-center">
             <div className="text-4xl font-black tabular-nums text-slate-900 tracking-tighter">
               {currentPage + 1} <span className="text-slate-400 text-xl font-light">/ {livrePages.length}</span>
             </div>
             <div className="h-1 w-8 rounded-full mt-2" style={{ backgroundColor: brandColor }}></div>
          </div>

          <button 
            onClick={nextBtn}
            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/50 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all duration-500 group"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </main>

      {/* --- FOOTER ÉDITORIAL --- */}
      <footer className="w-full max-w-7xl px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-slate-900/10">
        <div className="md:col-span-2">
          <h4 className="text-xs font-black uppercase tracking-[0.5em] text-slate-400 mb-6 italic">Concept & Art Direction</h4>
          <p className="text-2xl md:text-4xl font-black text-slate-800 leading-[1.1] tracking-tight">
            Fusing the raw intensity of Amazonian grit with high-end editorial precision. 
            Every page reflects the <span style={{ color: brandColor }}>vibrant energy of French Guiana</span>, 
            where athletic power meets monumental design.
          </p>
        </div>
        
        <div className="space-y-10">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">The Event</h4>
            <p className="text-sm font-bold text-slate-800 uppercase tracking-tighter italic">
              Elite Sporting Competition — French Guiana 2024
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Core Services</h4>
            <div className="flex flex-wrap gap-2">
              {['Sports Photography', 'Visual Identity', 'Editorial Layout'].map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-white/50 border border-white/80 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Location</h4>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: brandColor }}></div>
               <p className="text-sm font-bold text-slate-800 uppercase tracking-tighter">Cayenne / Kourou, GF</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Brand;