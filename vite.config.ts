import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { stripCrossoriginPlugin } from './src/vite-plugin-crossorigin'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    tailwindcss(),
    react(), 
    stripCrossoriginPlugin()
  ],
})
