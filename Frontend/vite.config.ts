import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Change this to your desired port number
    open: true, // Optional: opens the browser automatically
  },css: {
    postcss: './postcss.config.js',
  },
})
