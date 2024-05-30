import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,  // needed for virtual hosted sites
          secure: false,       // if you want to accept self-signed certificates
        }
      }
  },
  plugins: [react()],
})
