/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(() => {
  const base = process.env.BASE || '/'

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      proxy: {
        '/api': 'http://localhost:3001',
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom') || id.includes('react/')) {
                return 'vendor-react'
              }
              if (id.includes('react-router')) {
                return 'vendor-router'
              }
              if (id.includes('framer-motion')) {
                return 'vendor-framer'
              }
              if (id.includes('lucide-react')) {
                return 'vendor-lucide'
              }
              if (id.includes('react-markdown') || id.includes('mdast') || id.includes('unist') || id.includes('vfile') || id.includes('micromark')) {
                return 'vendor-markdown'
              }
              if (id.includes('supabase')) {
                return 'vendor-supabase'
              }
              return 'vendor-others'
            }
          },
        },
      },
    },
  }
})
