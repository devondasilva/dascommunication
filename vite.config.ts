import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    include: ['react-pageflip']
  },
  // Si tu utilises un framework ou un plugin qui fait du SSR/Prerendering, ajoute aussi ceci :
  ssr: {
    noExternal: ['react-pageflip']
  }
})