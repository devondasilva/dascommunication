
import l1 from '../assets/img/log.svg';
import l2 from '../assets/img/logheri.png';
import l3 from '../assets/img/logcal.jpg';
import l4 from '../assets/img/logomades.png';
import l5 from '../assets/img/log1.jpeg';
import l6 from '../assets/img/log2.jpeg';

interface Logo {
  id: number;
  img: string;
  title: string;
  client: string;
  category: string;
}



const LOGOS: Logo[] = [
  { id: 1, img: l1, title: "Visual Identity", client: "DAS COMMUNICATION", category: "Agency" },
  { id: 2, img: l2, title: "Fashion Branding", client: "Heritage", category: "Mode Fashion Brand" },
  { id: 3, img: l3, title: "General services", client: "Benin", category: "Transit" },
  { id: 4, img: l4, title: "Minimalist Mark", client: "MADES", category: "Sport management" },
  { id: 5, img: l5, title: "Creative Logo", client: "DesignPro", category: "Design Studio" },
  { id: 6, img: l6, title: "Modern Emblem", client: "TechNova", category: "Technology Company" },
];

export  { LOGOS };