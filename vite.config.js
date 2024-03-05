import { defineConfig } from 'vite'
export default defineConfig({
  server: {
    proxy: {
      "/": {
        target: "https://code-editor-eusldaqlhq-zf.a.run.app",
        changeOrigin: true,
      },
    },
  },
})
