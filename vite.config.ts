import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves from /noah-training-arcade/ subpath
export default defineConfig({
  plugins: [react()],
  base: '/noah-training-arcade/',
})
