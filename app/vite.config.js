import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages serves a project site from /<repo-name>/, so the build needs to
// know that prefix. CI sets BASE_PATH; a local build falls back to relative
// paths, which is what `npm run preview` and a LAN test want.
const base = process.env.BASE_PATH || './';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Fly Box',
        short_name: 'Fly Box',
        description: 'Plan, learn, fish, log.',
        theme_color: '#14605b',
        background_color: '#f1f4f0',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // The fly and bug images are the bulk of the app and have to be there
        // on a flat with no signal. Precache them rather than hoping.
        globPatterns: ['**/*.{js,css,html,json,png,jpg,svg,webp,woff2}'],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        navigateFallback: `${base}index.html`.replace('//', '/'),
      },
    }),
  ],
});
