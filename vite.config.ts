import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server:{
        proxy:{
            "/back":{
                target: "178.128.3.209",
                changeOrigin: true,
            }
        }
    }
})
