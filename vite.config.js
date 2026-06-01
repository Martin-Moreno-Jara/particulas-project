import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite: base '/' para despliegue raíz en Vercel.
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    // Aumentamos el límite de aviso de chunk: Three.js y p5 son pesados pero los
    // cargamos de forma diferida con React.lazy por sección.
    chunkSizeWarningLimit: 1200,
  },
})
