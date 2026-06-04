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
  build: {
    rollupOptions: {
      output: {
        // Split heavy vendors into their own long-lived, content-hashed chunks
        // so the initial paint is not blocked by libraries that are only needed
        // on demand. mermaid is dynamically imported (see Mermaid.jsx) and
        // self-splits its diagram engines into many small chunks; forcing it
        // into one manual chunk would coalesce those into a single >2MB file
        // that exceeds workbox's precache limit, so it is intentionally left
        // out of the rules below. The remaining large libs are kept out of the
        // main bundle and cached independently across deploys. All emitted
        // chunks match the PWA precache glob (**/*.js), so offline is unaffected.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/]node_modules[\\/]highlight\.js[\\/]/.test(id))
            return 'highlight';
          if (
            /[\\/]node_modules[\\/](@codemirror|@uiw|@lezer|codemirror)[\\/]/.test(
              id,
            )
          )
            return 'codemirror';
          if (
            /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)
          )
            return 'react';
          if (
            /[\\/]node_modules[\\/](react-markdown|remark-gfm|rehype-raw|rehype-sanitize|micromark|mdast-.*|hast-.*|unified|unist-.*)[\\/]/.test(
              id,
            )
          )
            return 'markdown';
          return undefined;
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  optimizeDeps: {
    // Vite 8's Rolldown dependency scanner parses `.js` as plain JS and chokes
    // on the JSX in our `src/**/*.js` files (the treat-js-as-jsx plugin only
    // runs in the main transform pipeline, not the pre-bundle scan). Tell the
    // scanner to load `.js` as JSX so `vite`/`vite optimize` don't fail.
    rolldownOptions: {
      moduleTypes: { '.js': 'jsx' },
    },
    entries: ['index.html'],
    include: [
      'mermaid',
      'react-markdown',
      'remark-gfm',
      'rehype-raw',
      'rehype-sanitize',
      'highlight.js',
      '@uiw/codemirror-theme-github',
    ],
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
