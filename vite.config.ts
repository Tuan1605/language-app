/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json}'],
        maximumFileSizeToCacheInBytes: 5000000,
      },
      manifest: {
        name: 'LingoMaster',
        short_name: 'LingoMaster',
        description: 'Professional Language Learning App for TOEIC and JLPT N2',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  // GitLab Pages serves this project under /<project>/, so assets must be
  // resolved relative to that base path. Change if the project path changes.
  base: '/',
  server: {
    host: true,
    allowedHosts: true,
    cors: true,
    watch: {
      usePolling: true,
      interval: 1000,
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-dexie': ['dexie', 'dexie-react-hooks'],
          'vendor-ui': ['framer-motion', 'react-hot-toast', 'lucide-react'],
        }
      }
    }
  }
})
