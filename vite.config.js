import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'favicon-96x96.png',
        'apple-touch-icon.png',
        'web-app-manifest-192x192.png',
        'web-app-manifest-512x512.png',
        'og-image.svg',
      ],
      manifest: {
        name: 'CeritaKita — Kartu Percakapan untuk Pasangan',
        short_name: 'CeritaKita',
        description: 'Perdalam percakapan bersama pasanganmu dengan kartu pertanyaan digital. Pilih tema, jawab bersama, atau terima tantangan dare.',
        theme_color: '#8f3425',
        background_color: '#fcf9f3',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'id',
        categories: ['lifestyle', 'entertainment'],
        icons: [
          {
            src: 'web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,webp}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      }
    })
  ]
})
