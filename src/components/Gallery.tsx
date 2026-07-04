// src/components/Gallery.tsx
import React from 'react';
import type { Project } from '../types/Project';

interface GalleryProps {
  projects: Project[];
}

const Gallery: React.FC<GalleryProps> = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {projects.map((project) => (
        <div key={project.id} className="group relative overflow-hidden rounded-xl bg-slate-900 shadow-lg">
          {/* Image avec effet de zoom au survol */}
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay avec les infos au survol */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-4">
            <h3 className="text-xl font-bold uppercase">{project.title}</h3>
            <p className="text-sm mt-2 text-center">{project.description}</p>
            <div className="flex gap-2 mt-4">
              {project.tags.map(tag => (
                <span key={tag} className="text-xs border border-white px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;