/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        fontFamily: {
        // On définit Inter comme police sans-serif prioritaire
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      // C'est ici que tu pourras ajouter tes propres couleurs de designer
      colors: {
        brand: '#0066FF', 
      },
    },
  },
  plugins: [],
}