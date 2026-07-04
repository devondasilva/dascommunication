import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Share2, ArrowRight } from "lucide-react";
import Nav from '../components/Nav';
import '../index.css';

const Contact: React.FC = () => {
    const primaryColor = "#27BAA3"; 

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#1C1E36] selection:bg-[#27BAA3] selection:text-white">
            <Nav />

            {/* --- HERO SECTION --- */}
            <section className="pt-32 pb-12 px-6 max-w-7xl mx-auto text-center md:text-left">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-xs font-black uppercase tracking-[0.4em] mb-4 block text-gray-400">
                        Initiative
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
                        Prêt à faire <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27BAA3] to-[#2D3079]">
                            le premier pas ?
                        </span>
                    </h1>
                </motion.div>
            </section>

            <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    
                    {/* --- CÔTÉ GAUCHE : CARTES DE CONTACT --- */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <p className="text-lg text-gray-500 mb-6 font-light leading-relaxed">
                            Que ce soit pour une refonte complète, une nouvelle application ou repenser votre identité visuelle, nous sommes prêts à écouter.
                        </p>

                        {/* Carte Email */}
                        <motion.a 
                            href="mailto:dascom2004@gmail.com"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="group flex items-start gap-6 p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#27BAA3]/30 transition-all duration-300"
                        >
                            <div className="p-4 bg-gray-50 rounded-2xl text-[#27BAA3] group-hover:bg-[#27BAA3] group-hover:text-white transition-colors">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">Email Direct</h3>
                                <p className="text-lg font-black text-[#1C1E36]">dascom2004@gmail.com</p>
                            </div>
                        </motion.a>

                        {/* Carte Localisation */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-start gap-6 p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm"
                        >
                            <div className="p-4 bg-gray-50 rounded-2xl text-[#1C1E36]">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">QG & Opérations</h3>
                                <p className="text-lg font-bold text-[#1C1E36] leading-tight">
                                    Takoma Park, MD (USA) <br />
                                    <span className="text-sm font-normal text-gray-500">Présence : Virginia • Benin • Remote</span>
                                </p>
                            </div>
                        </motion.div>

                        {/* Carte Réseaux */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-start gap-6 p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm"
                        >
                            <div className="p-4 bg-gray-50 rounded-2xl text-[#1C1E36]">
                                <Share2 size={24} />
                            </div>
                            <div className="w-full">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Réseaux Sociaux</h3>
                                <div className="flex gap-4">
                                    <a href="https://www.linkedin.com/in/honore-da-silva-b02561194" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-50 rounded-xl text-sm font-bold hover:bg-[#1C1E36] hover:text-white transition-colors">LinkedIn</a>
                                    <a href="https://www.instagram.com/devondasilva5?igsh=MWNsd2FucjE2ZnJzbg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-50 rounded-xl text-sm font-bold hover:bg-[#27BAA3] hover:text-white transition-colors">Instagram</a>
                                    <a href="https://www.facebook.com/devon.dasilva.37" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-50 rounded-xl text-sm font-bold hover:bg-[#1C1E36] hover:text-white transition-colors">Facebook</a>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* --- CÔTÉ DROIT : FORMULAIRE MINIMALISTE --- */}
                    <div className="lg:col-span-7">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-gray-200/50"
                        >
                            <h2 className="text-3xl font-black mb-10 tracking-tight">Parlez-nous de vous.</h2>
                            
                            <form className="space-y-10">
                                {/* Ligne Nom / Email */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="relative group">
                                        <input 
                                            type="text" 
                                            id="name"
                                            required
                                            className="w-full bg-transparent border-b-2 border-gray-200 py-3 text-lg focus:outline-none focus:border-[#27BAA3] peer transition-colors"
                                            placeholder=" "
                                        />
                                        <label htmlFor="name" className="absolute left-0 top-3 text-gray-400 text-lg cursor-text peer-focus:-top-5 peer-focus:text-xs peer-focus:text-[#27BAA3] peer-valid:-top-5 peer-valid:text-xs transition-all font-medium">
                                            Votre Nom complet
                                        </label>
                                    </div>
                                    <div className="relative group">
                                        <input 
                                            type="email" 
                                            id="email"
                                            required
                                            className="w-full bg-transparent border-b-2 border-gray-200 py-3 text-lg focus:outline-none focus:border-[#27BAA3] peer transition-colors"
                                            placeholder=" "
                                        />
                                        <label htmlFor="email" className="absolute left-0 top-3 text-gray-400 text-lg cursor-text peer-focus:-top-5 peer-focus:text-xs peer-focus:text-[#27BAA3] peer-valid:-top-5 peer-valid:text-xs transition-all font-medium">
                                            Adresse Email
                                        </label>
                                    </div>
                                </div>

                                {/* Sélecteur de service (Style bouton radio custom) */}
                                <div className="pt-4">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Nature du besoin</p>
                                    <div className="flex flex-wrap gap-3">
                                        {['Développement Web', 'Design UI/UX', 'Identité Visuelle', 'Consulting IT'].map((service) => (
                                            <label key={service} className="cursor-pointer">
                                                <input type="radio" name="service" className="peer sr-only" />
                                                <span className="inline-block px-5 py-3 rounded-full border border-gray-200 text-sm font-bold text-gray-500 peer-checked:border-[#27BAA3] peer-checked:bg-[#27BAA3] peer-checked:text-white transition-all hover:border-gray-300">
                                                    {service}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="relative group pt-4">
                                    <textarea 
                                        id="message"
                                        rows={4}
                                        required
                                        className="w-full bg-transparent border-b-2 border-gray-200 py-3 text-lg focus:outline-none focus:border-[#27BAA3] peer transition-colors resize-none"
                                        placeholder=" "
                                    ></textarea>
                                    <label htmlFor="message" className="absolute left-0 top-6 text-gray-400 text-lg cursor-text peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#27BAA3] peer-valid:-top-2 peer-valid:text-xs transition-all font-medium">
                                        Détails du projet, budget estimé, délais...
                                    </label>
                                </div>

                                {/* Bouton Submit */}
                                <button 
                                    type="submit"
                                    className="group w-full md:w-auto inline-flex items-center justify-center gap-4 mt-6 px-10 py-5 rounded-full text-white font-black uppercase tracking-widest text-sm transition-all hover:scale-105 shadow-xl hover:shadow-[#27BAA3]/40"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    Envoyer la demande 
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </motion.div>
                    </div>

                </div>
            </main>

            {/* --- FOOTER --- */}
            <footer className="bg-white py-10 px-6 border-t border-gray-200 mt-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
                        © 2026 DASCOMMUNICATION
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Maryland • Virginia • Benin
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Contact;