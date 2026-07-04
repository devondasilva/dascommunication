import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './index.css';

import App from './App.tsx';
import Expertises from './pages/Expertises.tsx';
import Project from './pages/Project.tsx';
import About from './pages/About.tsx';
import Contact from './pages/Contact.tsx';
import Brand from './components/Brand.tsx';
import WebDesign from './components/Web.tsx';
import LogoShow from './components/logoshow.tsx';

import Nav from './components/Nav.tsx';
import Footer from './components/Footer.tsx'; // Corrigé : F majuscule pour l'import

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Router>
        {/* Nav s'affichera sur toutes les pages en haut */}
        <Nav />

        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/expertises" element={<Expertises />} />
          <Route path="/project" element={<Project />} />
          <Route path="/about" element={<About />} />
          <Route path="/Brand" element={<Brand />} />
          <Route path="/WebDesign" element={<WebDesign />} />
          <Route path="/LogoShow" element={<LogoShow />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        {/* Footer s'affichera sur toutes les pages en bas */}
        <Footer />
      </Router>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}