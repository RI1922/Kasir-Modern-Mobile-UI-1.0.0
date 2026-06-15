import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({

    plugins:[

        vue(),

        VitePWA({

            registerType:'autoUpdate',

            includeAssets:[

                'apple-touch-icon.png'

            ],

            manifest: {
  name: 'Kasir Modern',
  short_name: 'Kasir',
  description: 'Aplikasi Kasir Modern PWA',
  theme_color: '#0f172a',
  background_color: '#020617',
  display: 'standalone',
  orientation: 'portrait',
  start_url: '/',
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
  ],

  screenshots: [
    {
      src: 'screenshot-mobile.png',
      sizes: '360x740',
      type: 'image/png'
    },
    {
      src: 'screenshot-desktop.png',
      sizes: '1366x768',
      type: 'image/png',
      form_factor: 'wide'
    }
  ]
}

        })

    ]

})