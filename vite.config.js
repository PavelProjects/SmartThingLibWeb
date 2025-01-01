import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    polyfillModulePreload: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        minimal: resolve(__dirname, 'minimal/index.html'),
        minimalScript: resolve(__dirname, 'minimal/script.js')
      },
      output: {
        manualChunks: {},
        entryFileNames: (data) => {
          if (data.name === 'minimalScript') {
            return 'assets/minimal-script.js'
          }
          return 'assets/script.js'
        },
        assetFileNames: 'assets/styles.css',
        chunkFileNames: 'assets/[name].js'
      }
    },
    minify: 'terser',
  }
})
