import React from 'react';
import Nav from '../components/Nav';
import { Send, Upload, CheckCircle2, ChevronRight } from 'lucide-react';
import poster from '../assets/img/poster.png';

const Home: React.FC = () => {
  const brandColor = "#8DC63F";
  const darkColor = "#333333";

  return (
    <div className="min-h-screen bg-white">
      <Nav/>
      {/* --- HERO SECTION --- */}
      <header className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        
        <div className="flex flex-col-reverse md:flex-row items-center gap-12">
          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#8DC63F]/10 border border-[#8DC63F]/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8DC63F] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8DC63F]"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#333333]">Disponible pour vos projets</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-[#333333] leading-[0.95] tracking-tighter mb-8">
              DESIGNER <br />
              <span style={{ color: brandColor }}>L'IMPACT.</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-lg leading-relaxed mb-10">
              Expertise bilingue en <span className="font-bold text-[#333333]">transformation digitale</span>. 
              Nous créons des solutions tech haute performance et des identités visuelles fortes.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-[#333333] text-white font-bold rounded-lg hover:bg-[#8DC63F] transition-all shadow-xl shadow-black/10">
                Lancer un Projet
              </button>
              <button className="px-8 py-4 border-2 border-gray-200 text-[#333333] font-bold rounded-lg hover:border-[#333333] transition-all">
                Voir Portfolio
              </button>
            </div>
          </div>

          <div className="flex-1 flex justify-center relative">
             <div className="absolute inset-0 bg-[#8DC63F]/10 blur-3xl rounded-full scale-75"></div>
             <img src={poster} alt="Poster" className="relative w-full max-w-md z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]" />
          </div>
        </div>
      </header>

      {/* --- SERVICES (CONTRASTE ÉLEVÉ) --- */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-12">Nos Expertises</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard title="Marketing Digital" icon={<CheckCircle2 color={brandColor} />} />
            <ServiceCard title="Web Development" icon={<CheckCircle2 color={brandColor} />} />
            <ServiceCard title="Graphic Design" icon={<CheckCircle2 color={brandColor} />} />
          </div>
        </div>
      </section>

      {/* --- FORMULAIRES (LISIBILITÉ MAXIMALE) --- */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* PROFORMA - FOND BLANC ÉPURÉ */}
        <div className="bg-white p-10 rounded-3xl border-2 border-gray-100 shadow-2xl shadow-gray-200/50">
          <h3 className="text-3xl font-black text-[#333333] mb-2">Demande de Proforma</h3>
          <p className="text-gray-500 mb-8 font-medium">Obtenez un devis précis pour vos besoins.</p>
          
          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-[#333333]">Entreprise / Nom</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:border-[#8DC63F] focus:ring-1 focus:ring-[#8DC63F] outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-[#333333]">Service</label>
              <select className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none">
                <option>Site Internet / App</option>
                <option>Marketing & SEO</option>
                <option>Design & Branding</option>
              </select>
            </div>
            <button className="w-full py-4 bg-[#8DC63F] text-white font-black rounded-xl hover:shadow-lg hover:shadow-[#8DC63F]/30 transition-all flex items-center justify-center gap-3">
              ENVOYER LA DEMANDE <Send size={18} />
            </button>
          </form>
        </div>

        {/* RECRUTEMENT - FOND NOIR CONTRASTÉ */}
        <div className="bg-[#333333] p-10 rounded-3xl shadow-2xl text-white relative overflow-hidden">
          <h3 className="text-3xl font-black mb-2 text-[#8DC63F]">Recrutement</h3>
          <p className="text-gray-400 mb-8 font-medium">Rejoignez l'équipe DASCOMMUNICATION.</p>
          
          <div className="space-y-8">
            <div className="flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl group hover:border-[#8DC63F] transition-all cursor-pointer">
              <div className="bg-[#8DC63F] p-4 rounded-full text-[#333333]">
                <Upload size={24} />
              </div>
              <div>
                <p className="font-bold text-lg">Déposer votre Portfolio</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">PDF ou Lien externe</p>
              </div>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <h4 className="font-bold text-[#8DC63F] mb-2 uppercase text-xs tracking-widest">Postes Ouverts :</h4>
              <ul className="text-sm space-y-2 text-gray-300">
                <li className="flex items-center gap-2"><ChevronRight size={14} color={brandColor} /> Full-Stack Developer (React/TSX)</li>
                <li className="flex items-center gap-2"><ChevronRight size={14} color={brandColor} /> UI/UX Designer</li>
              </ul>
            </div>
          </div>
        </div>

      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-gray-100 bg-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-black">
            <span style={{ color: brandColor }}>DAS</span><span className="text-[#333333]">COMMUNICATION</span>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">© 2026 Maryland & Virginia — Studio de Création</p>
        </div>
      </footer>
    </div>
  );
};

const ServiceCard = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
  <div className="p-8 bg-white border border-gray-200 rounded-2xl hover:border-[#333333] transition-all group shadow-sm">
    <div className="mb-4 transform group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-black text-[#333333]">{title}</h3>
    <div className="h-1 w-8 bg-[#8DC63F] mt-4 group-hover:w-full transition-all"></div>
  </div>
);

export default Home;