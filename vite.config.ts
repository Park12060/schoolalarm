import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server:{
        proxy:{
            "/back":{
                target: "162.159.140.98",
                changeOrigin: true,
            }
        }
    }
})
