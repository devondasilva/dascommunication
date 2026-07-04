import React from 'react';
import Nav from './Nav';
import '../index.css';
import { WEB_PROJECTS } from '../data/Webprojects';

// Remplace ceci par ton fichier de données réel
// import { WEB_LOGOS } from '../data/WebDesigns';

const brandColor = "#8DC63F";

const WebDesign: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#D8D8D8] flex flex-col items-center overflow-x-hidden selection:bg-[#8DC63F] selection:text-white">
      <Nav />

      {/* --- HEADER --- */}
      <header className="w-full max-w-7xl px-6 md:pt-32 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="relative">
          <div 
            className="absolute -left-6 md:-left-10 top-2 h-full w-[4px] rounded-full" 
            style={{ backgroundColor: brandColor }}
          ></div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85]">
            DIGITAL <br />
            <span className="text-white drop-shadow-sm italic font-light">Interfaces.</span>
          </h1>
          <div className="flex items-center gap-4 mt-8">
            <span className="text-slate-600 font-bold uppercase tracking-[0.3em] text-[10px]">Product Design / Web Architecture</span>
            <div className="w-12 h-[1px] bg-slate-900/20"></div>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-end text-right">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Stack</span>
          <span className="text-slate-900 font-black text-xl tracking-tighter uppercase italic">React • Next.js • Tailwind</span>
        </div>
      </header>

      {/* --- SECTION: WEB SHOWCASE --- */}
      <section className="w-full max-w-7xl px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-4 italic">Operational Design</h4>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Web <br /> <span className="text-white italic font-light drop-shadow-sm">Solutions.</span>
            </h2>
          </div>
          <p className="max-w-xs text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
            Bridging pixel-perfect graphic design with high-performance software architecture.
          </p>
        </div>

        {/* GRILLE BENTO POUR LES INTERFACES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {WEB_PROJECTS.map((project) => (
            <div key={project.id} className="group relative bg-white overflow-hidden rounded-[2.5rem] transition-all duration-700 hover:shadow-2xl border border-white">
              
              {/* Browser Bar Decoration */}
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex gap-1.5 items-center">
                <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                <div className="ml-4 h-2 w-32 bg-slate-100 rounded-full"></div>
              </div>

              {/* Image Container */}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={project.img} 
                  alt={project.desc} 
                  className="w-full h-full object-cover object-top transition-all duration-1000 group-hover:scale-105" 
                />
                
                {/* Info Overlay on Hover */}
                <div className="absolute inset-0 bg-slate-900/90 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center items-center text-center p-10 translate-y-4 group-hover:translate-y-0">
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#8DC63F] mb-4">
                    {project.tags.join(', ')}
                  </span>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                    {project.desc}
                  </h3>
                  <p className="text-xs font-bold text-white/60 uppercase tracking-widest italic mb-8">
                    {project.title}
                  </p>
                  
                  <button className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-[#8DC63F] hover:text-white transition-all transform translate-y-8 group-hover:translate-y-0 duration-700">
                    Explore Interface
                  </button>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="absolute top-12 right-8 flex items-center gap-2">
                 <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Live System</span>
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#8DC63F] transition-colors animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER ÉDITORIAL --- */}
      <footer className="w-full max-w-7xl px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-slate-900/10">
        <div className="md:col-span-2">
          <h4 className="text-xs font-black uppercase tracking-[0.5em] text-slate-400 mb-6 italic">Engineering Aesthetics</h4>
          <p className="text-2xl md:text-4xl font-black text-slate-800 leading-[1.1] tracking-tight">
            I don't just build websites; I engineer <span style={{ color: brandColor }}>visual experiences</span> that are scalable, accessible, and performant.
          </p>
        </div>
        
        <div className="space-y-10">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 underline decoration-[#8DC63F] decoration-2">Web Stack</h4>
            <div className="flex flex-wrap gap-2 mt-4">
              {['React / Next.js', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Framer Motion'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 hover:border-[#8DC63F] transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Philosophy</h4>
            <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">Code as a Design Tool.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WebDesign;