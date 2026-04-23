import './index.css'
import App from './App.tsx';
import Expertises from './pages/Expertises.tsx';
import Projet from './pages/Projets.tsx';
import About from './pages/About.tsx';
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/expertises" element={<Expertises />} />
        <Route path="/Projets" element={<Projet />} />
        <Route path="/About" element={<About />} />
        
      </Routes>
    </Router>
  );
} else {
  <div>Not found</div>
  console.error("Root element not found");
}