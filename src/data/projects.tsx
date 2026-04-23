// src/data/projects.ts
import type { Project } from '../types/Project';
import img1 from '../../src/assets/img/img1.png';
import img2 from '../../src/assets/img/img2.png';

export const myProjects: Project[] = [
  {
    id: '1',
    title: 'Modern Branding Fashion',
    category: 'Branding',
    description: 'Une refonte complète pour une startup Fintech.',
    imageUrl: img1, // Chemin vers ton image
    tags: ['Illustrator', 'Strategy', 'Logo']
  },
  {
    id: '2',
    title: 'General Company',
    category: 'UI/UX',
    description: 'Interface utilisateur minimaliste pour gestion de wallet.',
    imageUrl: img2,
    tags: ['Figma', 'Prototyping', 'React']
  }
];