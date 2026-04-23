
import Img1 from '../assets/img/Web/w1.png';
import Img2 from '../assets/img/Web/w2.png';
import Img3 from '../assets/img/Web/W3.png';


interface WebProject {
  id: number;
  title: string;
  desc: string;
  tags: string[];
  img: string;
  link: string;
}


export const WEB_PROJECTS: WebProject[] = [
  { 
    id: 1, 
    img: Img1, 
    title: "JILO Services App", 
    desc: "Chatbot-powered service platform for seamless customer interactions.", 
    tags: ["Figma", "React Native"], 
    link: "https://www.figma.com/design/OBH27pCqCDZeAhiA14lUcu/Projet_app_JILO?node-id=0-1&p=f&t=anouCKtSoX5bjY7F-0"
  },
  { 
    id: 2, 
    img: Img2, 
    title: "Tennis Connect", 
    desc: "Tennis lesson booking app with real-time court availability and player matching.", 
    tags: ["UI/UX", "Next.js"], 
    link: "https://www.figma.com/design/5mHUn8AJUQH8COCBdCHoLP/Projet_Site_MADES?node-id=0-1&p=f&t=7H9MKHJE8YKw69rG-0"
  },
  { 
    id: 3, 
    img: Img3, 
    title: "MADES", 
    desc: "Sport event management platform with live updates, ticketing, and interactive fan engagement.", 
    tags: ["React tsx,", "Tailwind"], 
    link: "https://www.figma.com/design/5mHUn8AJUQH8COCBdCHoLP/Projet_Site_MADES?node-id=0-1&p=f&t=7H9MKHJE8YKw69rG-0"
  }
];