import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
export default defineConfig({
  // optimizeDeps: { 
  //   exclude: ['fsevents']
  // },
  plugins: [react()],
  // esbuild: {
  //   loader: 'jsx',
  //   include: [
  //     "src/*.jsx",
  //     "src/**/*.jsx",
  //   ],
  //   exclude: /node_modules/,
  // },
 server: {
    proxy: {
      "/": {
        target: "https://code-editor-eusldaqlhq-zf.a.run.app",
        changeOrigin: true,
      },
      },
    https: {
      key : fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    },
  },
})
