import { defineConfig } from 'vite'
export default defineConfig({
  server: {
    proxy: {
      "/": {
        target: "https://thesis-backend-eusldaqlhq-uc.a.run.app",
        changeOrigin: true,
      },
    },
  },
})
