import React from 'react';
import Nav from './Nav';
import '../index.css';
import { LOGOS } from '../data/Logos';
// Imports des images du livre



const brandColor = "#8DC63F";

const LogoShow: React.FC = () => {

  return (
    <div className="min-h-screen bg-[#D8D8D8] flex flex-col items-center overflow-x-hidden selection:bg-[#8DC63F] selection:text-white">
      <Nav />

      {/* --- HEADER --- */}

      {/* --- SECTION 2: LOGO SHOWCASE --- */}
      <section className="w-full max-w-7xl px-6 py-10 ">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-4 italic">Crafting Symbols</h4>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Logo <br /> <span className="text-white italic font-light drop-shadow-sm">Showcase.</span>
            </h2>
          </div>
          <p className="max-w-xs text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
            From financial institutions to boutique startups, creating marks that define the core of a brand.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LOGOS.map((logo) => (
            <div key={logo.id} className="group relative aspect-square bg-white overflow-hidden rounded-[2.5rem] transition-all duration-700 hover:shadow-2xl">
              <div className="absolute inset-0 p-16 flex items-center justify-center transition-transform duration-700 group-hover:scale-50 group-hover:-translate-y-12">
                <img src={logo.img} alt={logo.client} className="max-w-full max-h-full object-contain  group-hover:grayscale-0 transition-all duration-500" />
              </div>
              
              {/* Info Overlay */}
              <div className="absolute inset-0 bg-[#8DC63F] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10 translate-y-full group-hover:translate-y-0">
                <span className="text-[9px] font-black uppercase tracking-widest text-black/40 mb-2">{logo.category}</span>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">{logo.client}</h3>
                <p className="text-[10px] font-bold text-white uppercase tracking-widest italic">{logo.title}</p>
              </div>
              <div className="absolute top-8 right-8 w-2 h-2 rounded-full bg-slate-100 group-hover:bg-white transition-colors"></div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER ÉDITORIAL --- */}
      <footer className="w-full max-w-7xl px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-slate-900/10">
        <div className="md:col-span-2">
          <h4 className="text-xs font-black uppercase tracking-[0.5em] text-slate-400 mb-6 italic">Art Direction</h4>
          <p className="text-2xl md:text-4xl font-black text-slate-800 leading-[1.1] tracking-tight">
            Fusing the raw intensity of <span style={{ color: brandColor }}>Amazonian energy</span> with high-end editorial precision. 
            Graphic design that doesn't just look good, but communicates power.
          </p>
        </div>
        
        <div className="space-y-10">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 underline decoration-[#8DC63F] decoration-2">Core Services</h4>
            <div className="flex flex-wrap gap-2 mt-4">
              {['Logo Design', 'UI/UX Strategy', 'Print Editorial', 'Brand Growth'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 hover:border-[#8DC63F] transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Based in</h4>
            <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">Maryland</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LogoShow;    