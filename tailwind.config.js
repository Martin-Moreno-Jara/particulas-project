/** @type {import('tailwindcss').Config} */
// Configuración de Tailwind con la paleta y tipografías del portal.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        cosmos: '#0d1b4b',
        relativity: '#2d1200',
        quantum: '#001a0d',
        standard: '#1a0010',
        'text-primary': '#e8e8e8',
        'text-secondary': '#a0a0a0',
        accent: '#60a5fa',
        glossary: '#fbbf24',
        simbg: '#0a0a0a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
