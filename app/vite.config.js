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
        // The app shell, the knot and leader art, and the icons are precached:
        // a few MB, and the app works offline the moment it is installed.
        //
        // The 300-odd fly and bug photographs are NOT — they are 90 MB, and
        // precaching them made every install and every update a cellular
        // download. They live in a runtime cache instead: each picture is kept
        // the first time it is seen, and Plan's "Save pictures offline" fills
        // the same cache with everything a trip needs before you lose signal
        // (see src/state/pack.js). Same cache name on both sides — that is
        // what makes the two meet.
        globPatterns: ['**/*.{js,css,html,json,png,svg,webp,woff2}', 'assets/panels/**/*.jpg'],
        globIgnores: ['assets/*.jpg', 'assets/bugs/*.jpg'],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        navigateFallback: `${base}index.html`.replace('//', '/'),
        runtimeCaching: [
          {
            urlPattern: ({ url }) => /\/assets\/(bugs\/)?[^/]+\.jpg$/.test(url.pathname),
            handler: 'CacheFirst',
            options: {
              cacheName: 'fly-art',
              expiration: { maxEntries: 600, maxAgeSeconds: 365 * 24 * 3600 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
