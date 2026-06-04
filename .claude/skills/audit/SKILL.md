---
name: audit
description: Run a full site optimization pass on md2pdf across performance/build, accessibility, SEO, and code quality, with before/after screenshot verification at desktop/tablet/mobile breakpoints. Use when the user asks to "audit", "optimize the site", "improve performance/a11y/SEO/code quality", or "run the audit workflow".
---

# Site audit and optimization workflow

Orchestrate a four-track audit of this React 19 + Vite PWA, applying safe fixes in parallel and proving nothing broke visually. Follow these steps in order. Use the task tools to track progress.

## Non-negotiable scope rules (read `CLAUDE.md` first)

- Offline-first, client-only: no backend, no server-side conversion, no new network deps.
- Never reorder `rehype-raw` -> `rehype-sanitize` and never remove `rehype-sanitize`. Never edit `src/App/Components/Markdown/Previewer/Preview.js` during cleanup.
- `index.html` is deliberately `noindex, nofollow`: do NOT make the site indexable.
- Mermaid must stay OUT of `manualChunks` (it self-splits; coalescing produces a >2 MB chunk that breaks the workbox precache and fails the build).
- Don't add the em-dash character (U+2014).

## Step 1 — Baseline screenshots

1. Ensure the dev server is running: `npm start` (port 5173, fixed). If 5173 is bound, a Vite session is already up; reuse it.
2. If Playwright is not installed: `npm install -D playwright @playwright/test && npx playwright install chromium`.
3. Capture baselines: `node scripts/audit-screenshots.mjs screenshots/baseline`
4. Read a couple of the PNGs to confirm the app rendered (not a blank/error page) before proceeding.

## Step 2 — Four parallel audit agents (disjoint file ownership)

Launch four `general-purpose` agents in a SINGLE message so they run concurrently. Give each a self-contained brief with the scope rules above and a STRICT, disjoint file-ownership list. Disjoint ownership is what makes parallel edits safe; never let two agents own the same file. Tell every agent: do NOT run `npm run build` / `npm start` / `npm run dev` (one dev server only; a central build runs afterward).

Suggested ownership (adjust if the file tree changed):

- **Performance / build** — `vite.config.js`, `public/.htaccess`, `src/serviceWorkerRegistration.js`, `src/App/Components/Markdown/Previewer/{index.js,Mermaid.jsx,Loading.js}`. Goals: vendor chunk splitting (NOT mermaid), lazy-load heavy deps, cache headers for hashed assets, keep PWA precache valid.
- **Accessibility** — `src/App/Components/Header/{index.js,Upload.js}`, `src/App/Components/Markdown/index.js`, `src/App/Theme/index.js`, `src/styles.css`. Goals: ARIA tablist for the Editor/Preview tabs, `:focus-visible` rings, WCAG AA contrast, keyboard-focusable upload control, `prefers-reduced-motion`.
- **SEO / metadata** — `index.html`, `public/manifest.json`, `public/robots.txt`. Goals: canonical, full OG/Twitter tags, JSON-LD `WebApplication` (data, CSP-safe; never add `'unsafe-inline'`), complete manifest. PRESERVE the noindex decision.
- **Code quality** — the remaining `src/` files (hooks, `Lib/`, error boundaries, `Editor/`, `DragBar.js`, `src/index.js`). Explicitly off-limits: every file owned above, `Preview.js`, and `src/App/index.js` (print CSS). Behavior-preserving cleanup only; run `npm test` after.

Tell each agent to report (under ~350 words): files changed, what changed, and anything deliberately skipped or that the central build should verify.

## Step 3 — Central verification

Run after all agents finish (avoids concurrent `dist/` writes):

1. `npm test` — must stay green (35 tests at time of writing).
2. `npm run build` — must succeed. Watch for the workbox `maximumFileSizeToCacheInBytes` error: if a chunk >2 MB appears, a vendor was over-coalesced in `manualChunks` (most often mermaid). Fix by letting it self-split or raising the limit, then rebuild.

## Step 4 — Post-change screenshots and comparison

1. `node scripts/audit-screenshots.mjs screenshots/after`
2. Read the `after/*.png` and compare against `baseline/*.png` at all three breakpoints, including both mobile/tablet tab states.
3. The screenshot script matches the Preview control as either `role="tab"` or `role="button"`, so an a11y change from button to tab won't silently drop the preview capture. If a `-preview.png` is missing, the tab toggle selector failed; fix the script rather than skipping the comparison.
4. Any visual delta must be explained (e.g. an intentional AA contrast color shift). Unexplained layout/spacing changes are regressions to fix.

## Step 5 — Document

Update `CLAUDE.md` with any new conventions introduced (chunking strategy, a11y markup contracts, metadata constraints) so future sessions don't regress them. Keep additions free of em-dashes.

## Notes

- `screenshots/` is gitignored; it is scratch output, not committed.
- Do not commit or push unless the user explicitly asks.
