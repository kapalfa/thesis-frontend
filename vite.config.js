import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

const env = loadEnv('', process.cwd())
export default defineConfig({
  optimizeDeps: { 
    exclude: ['fsevents']
  },
  define: {
    'process.env.REACT_APP_RAPID_API_HOST': JSON.stringify(env.REACT_APP_RAPID_API_HOST),
    'process.env.REACT_APP_RAPID_API_KEY': JSON.stringify(env.REACT_APP_RAPID_API_KEY),
  },
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: [
      "src/*.jsx",
      "src/**/*.jsx",
    ],
    exclude: /node_modules/,
  },
 server: {
   https: {
     key : fs.readFileSync('/home/andromachi/Documents/go/backend/localhost-key.pem'),
      cert: fs.readFileSync('/home/andromachi/Documents/go/backend/localhost.pem'),
    }
  },
})
