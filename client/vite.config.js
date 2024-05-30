import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
      proxy: {
        '/api': {
          target: 'https://rentify-server-satyavikas.vercel.app',
          changeOrigin: true,  // needed for virtual hosted sites
          secure: false,       // if you want to accept self-signed certificates
        }
      }
  },
  plugins: [react()],
})
