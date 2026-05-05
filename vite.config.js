import { defineConfig, transformWithOxc } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const treatJsFilesAsJsx = {
  name: 'treat-js-files-as-jsx',
  enforce: 'pre',
  async transform(code, id) {
    if (id.includes('node_modules')) {
      return null;
    }
    if (!/src[\\/].*\.js$/.test(id)) {
      return null;
    }

    return transformWithOxc(code, id, {
      lang: 'jsx',
      jsx: { runtime: 'automatic' },
    });
  },
};

const stripCspMetaInDev = {
  name: 'strip-csp-meta-in-dev',
  transformIndexHtml(html) {
    // Production CSP stays in built index.html; Vite/HMR overlays can violate
    // the meta policy in serve mode and leave an empty-looking page.
    return html.replace(
      /\s*<meta\s+http-equiv=["']Content-Security-Policy["'][^>]*\/>\s*/i,
      '\n'
    );
  },
};

export default defineConfig(({ command }) => ({
  plugins: [
    treatJsFilesAsJsx,
    react({
      include: /\.[jt]sx?$/,
    }),
    ...(command === 'serve' ? [stripCspMetaInDev] : []),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,txt,json}'],
        // Take over open tabs immediately when a new SW activates and
        // skip the waiting phase so the next refresh always serves the
        // latest build.
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ request, url }) =>
              request.destination === 'image' &&
              url.origin === self.location.origin,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    strictPort: true,
  },
  optimizeDeps: {
    entries: ['index.html'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    server: {
      deps: {
        inline: ['mermaid'],
      },
    },
  },
}));
