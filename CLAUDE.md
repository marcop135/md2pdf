# CLAUDE.md

Guidance for Claude Code when working in this repository. Read once at session start; the rules below override generic defaults when they conflict.

## What this project is

**Markdown2PDF** — a client-only React 19 + Vite PWA that converts Markdown to PDF in the browser via the print dialog. No backend; nothing leaves the user's session. Fork of [realdennis/md2pdf](https://github.com/realdennis/md2pdf) (MIT). Live app: https://md2pdf.marcopontili.com.

Hard scope rules (from `CONTRIBUTING.md`):

- **No server-side uploads or backends.** This is offline-first; conversion runs in the browser. Do not propose features that require a server for conversion.
- **Bundle size matters.** Don't add dependencies without a clear offline-first benefit.
- **Renderer pipeline:** `react-markdown` + `remark-gfm` + `rehype-raw` + `rehype-sanitize`, in that order. `rehype-raw` parses the raw HTML embedded in `.md` files (so users can include `<style>` blocks etc.); `rehype-sanitize` runs **after** it and strips anything not on the allow-list in `Preview.js#sanitizeSchema`. **Never reorder these two** (sanitize must run last) and **never remove `rehype-sanitize`** — that's the XSS guarantee.

## Common commands

This project uses **npm** (not yarn). The `packageManager` field plus a `preinstall` guard (`npx only-allow npm`) enforce it; a committed `.npmrc` sets `legacy-peer-deps=true` because some deps (e.g. `nonaction`) still declare React 16/17 peer ranges.

| Command                  | Purpose                                          |
| ------------------------ | ------------------------------------------------ |
| `npm start`              | Vite dev server on **port 5173** (fixed)         |
| `npm run build`          | Production build to `dist/`                      |
| `npm run preview`        | Serve the built `dist/`                          |
| `npm test`               | Run the Vitest suite once                        |
| `npm run test:watch`     | Vitest in watch mode                             |
| `npm run changelog:lint` | Validate `CHANGELOG.md` (run before changelog commits) |

If `npm start` fails because **5173 is already bound**, a previous Vite session is still running — quit it rather than picking a different port. The port being predictable matters for the manifest, debugger config (`.claude/launch.json`, `.vscode/tasks.json`), and the PWA service worker scope.

## Project layout (only the non-obvious bits)

- `src/App/Components/Header/` — toolbar (brand title, version chip, Import/Export, GitHub link). See **Header toolbar conventions** below.
- `src/App/Container/` — state via `nonaction` and hooks like `useIsMobile`, `useDrop`.
- `src/App/Lib/` — small utilities (e.g. upload helper).
- `public/.htaccess` — Apache security/caching headers used in production deploys.
- `public/static/og-img.png` — generated 1200x630 social-preview image; rendered from `docs/og-img.svg` by `scripts/sync-hero.mjs`. Separate from the README hero.
- `scripts/changelog-lint.mjs` — enforces the changelog format; do not bypass.

## Header toolbar conventions

The app uses **`system-ui, sans-serif`** globally (set in [`src/App/index.js`](src/App/index.js) and [`src/styles.css`](src/styles.css)).

- Brand title `Markdown to PDF` uses `.brand-title` at **`font-weight: 700`**.
- Version chip = `v` + `major.minor.patch` from `package.json`, rendered as `.version-chip` (color `#656d76`, weight `400`, slightly smaller). **Hide on `≤420px` width.**
- Import / Export buttons stay **`font-weight: 400`**, **`font-size: 14px`**, **`height: 32px`**.
- Prefer `font-family: inherit` on header and toolbar controls ([`Header/index.js`](src/App/Components/Header/index.js), [`Upload.js`](src/App/Components/Header/Upload.js)).
- If you change the header's `min-height` (currently **48px**), update [`Markdown/index.js`](src/App/Components/Markdown/index.js) `height: calc(100% - …px)` to match — the layout subtracts the header bar height.
- The GitHub icon-only control matches toolbar button height; **18px** icons align inside **32px** rows.
- If labels feel too light on a given OS, adjust `letter-spacing` or `font-size` before bumping weight above **400**.
- **PDF filename on export:** tab title stays `Markdown to PDF` while editing; `printFilenameSession.js` applies the first heading only for the print/save flow. Never reset `document.title`/URL synchronously after `window.print()` on mobile. See [`docs/print-filename.md`](docs/print-filename.md).

## Changelog format (enforced by lint)

`docs/changelog-writing-guide.md` is the spec. Summary:

- Bullet form: `- **<Label>:** <one sentence ending in . ! or ?>`
- Allowed labels: **Build, Chore, CI, Docs, Enhance, Feat, Fix, Perf, Revert, Sec, Style** (append `(WIP)` for incomplete work).
- **Max 20 words** in the sentence after the label.
- Within a release, order bullets: Feat, Enhance, Fix, Sec, Perf, Style, Docs, Build, CI, Chore, Revert.
- Release heading: `## [x.y.z] - YYYY-MM-DD`.
- GitHub release **name** and tag: `vX.Y.Z`; release **notes** are the changelog bullets only (no `##` heading). See [`docs/changelog-writing-guide.md`](docs/changelog-writing-guide.md).
- Run `npm run changelog:lint` before committing changelog changes.

## README hero image

The hero uses plain markdown image+link form (`[![alt](src)](url)`), with **no surrounding `<div>` or `<p>` wrapper**. Markdown-inside-HTML rendering is inconsistent across local previewers (VS Code, JetBrains, etc.) even when GitHub handles it, so we keep it pure markdown.

`docs/readme-hero.png` is the README screenshot. It is referenced directly from the README and is **not** the social-preview image — those are separate assets with different aspect ratios and design constraints.

## Social preview (og:image)

`docs/og-img.svg` is the source for the social-preview image. `scripts/sync-hero.mjs` (run on `npm start` / `npm run dev` / `npm run build`, or manually via `npm run hero:sync`) renders it to `public/static/og-img.png` at **1200x630** (the Open Graph standard) so unfurls render correctly across WhatsApp, Slack, Twitter, LinkedIn, Discord, etc.

Constraints:

- **Dimensions:** 1200x630 (16:8.4 ratio that all major unfurl bots target).
- **File size:** keep under **600 KB** — WhatsApp drops larger images.
- **No CTA pill or URL on the artwork** — keep the unfurl composition clean; the platform shows the link separately.
- The destination is gitignored; to update, edit `docs/og-img.svg` and re-run dev/build.

## PWA icons

PNG icons under `public/icons/` are **generated**, not hand-edited. Sources:

- `public/favicon.svg` — full-bleed icon (rounded square; used for `purpose: any` in the manifest).
- `public/favicon-maskable.svg` — same artwork with a generous safe-zone (~60% of canvas) for Android maskable cropping (`purpose: maskable`).

`scripts/sync-icons.mjs` (run on `npm start` / `npm run dev` / `npm run build`, or manually via `npm run icons:sync`) renders three PNGs into `public/icons/`: `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`. The destination folder is gitignored. PNGs are required because Android Firefox/Chrome/Brave do not always honor SVG manifest icons (Firefox falls back to a letter; Chromium can clip the SVG).

To change the icon, edit the appropriate SVG source and re-run dev/build (or `npm run icons:sync`). Don't commit PNGs into the repo.

## Build chunking and lazy loading

`vite.config.js` defines `build.rollupOptions.output.manualChunks` that splits heavy vendors into their own content-hashed chunks: `react` (react/react-dom/scheduler), `codemirror` (@codemirror/@uiw/@lezer/codemirror), `highlight` (highlight.js), and `markdown` (react-markdown + the remark/rehype/micromark/unified stack). This keeps the initial entry chunk small.

- **Mermaid is intentionally NOT in `manualChunks`.** It is dynamically imported in [`Mermaid.jsx`](src/App/Components/Markdown/Previewer/Mermaid.jsx) (`import('mermaid')`) and self-splits its diagram engines into many small chunks. Forcing it into one manual chunk coalesces those into a single >2 MB file that exceeds workbox's default `maximumFileSizeToCacheInBytes` (2 MiB) and **fails the build**. Leave mermaid out of the chunk rules.
- The `waitForMermaidRenders()` export in `Mermaid.jsx` is imported by the Header's print handler; keep it exported. Because mermaid is dynamically imported, the Header no longer pulls the mermaid engine into the entry bundle.
- All emitted chunks match the PWA precache glob (`**/*.js`), so offline support holds. If you add a vendor that produces a single chunk >2 MB, either let it self-split or raise `workbox.maximumFileSizeToCacheInBytes`.
- `public/.htaccess` caches hashed `assets/*` as `immutable, max-age=31536000`; `index.html` / `sw.js` / `workbox-*.js` / `manifest.json` stay `no-cache`. Don't give entry points long-lived caching.

## Accessibility conventions

- The mobile/tablet (≤768px) Editor/Preview switcher in [`Markdown/index.js`](src/App/Components/Markdown/index.js) is a real ARIA tablist: `role="tablist"` on the bar, `role="tab"` + `aria-selected` + roving `tabIndex` + arrow/Home/End key nav on each tab, and `role="tabpanel"` + `aria-labelledby` on the panes. Keep this markup when editing the tabs; both panes stay mounted (print needs the Previewer in the DOM, hidden via screen-only `display:none`).
- Interactive controls use `:focus-visible` outlines driven by the `focusRing` theme token (`src/App/Theme/index.js`: `#0969da` light, `#58a6ff` dark). Don't strip focus outlines.
- The Upload control ([`Upload.js`](src/App/Components/Header/Upload.js)) is a visually-hidden but **keyboard-focusable** file `<input>` (absolute, `opacity:0`, in tab order), not `display:none`. Keep it focusable; `styles.css` gives `.button.upload:focus-within` a ring.
- Theme colors are tuned to WCAG 2.1 AA; the light active-tab blue is `#0969da` (white label 5.19:1). Re-check contrast before changing palette values.
- `prefers-reduced-motion` disables tab/button transitions and the active-press scale. Respect it for new animated controls.

## SEO and metadata

- `index.html` is **deliberately `noindex, nofollow`** (plus per-bot noindex for Google/Bing/GPTBot/ClaudeBot/etc.) and `public/robots.txt` `Disallow: /`s crawlers. This is intentional; **do not make the site indexable.** Metadata work here is about unfurl/install correctness, not ranking.
- `index.html` carries a `canonical`, full Open Graph set (`og:title/description/image/url/type/site_name/locale`), Twitter card tags, and a JSON-LD `WebApplication` block. The JSON-LD is `type="application/ld+json"` (data, not executable JS) so it is allowed under the CSP `script-src 'self' 'wasm-unsafe-eval'`. **Never add `'unsafe-inline'` to `script-src`** to accommodate scripts.
- `public/manifest.json` is complete (`id`, `scope`, `start_url: '/'`, `categories`, `lang`, `dir`, `orientation`, `theme_color` `#0d6efd` matching the meta). Keep `start_url`/`scope`/`id` consistent with the canonical root.

## Auditing (performance / a11y / SEO / code quality)

- `scripts/audit-screenshots.mjs` (Playwright, a devDependency) captures the key views at desktop (1280), tablet (768), and mobile (375) breakpoints, toggling the mobile Editor/Preview tabs. Usage: `node scripts/audit-screenshots.mjs <outDir> [baseUrl]` with the dev server running on 5173. Output (`screenshots/`) is gitignored.
- The `/audit` skill (`.claude/skills/audit/`) reruns the full workflow: baseline screenshots, four parallel audit agents with disjoint file ownership, central `npm test` + `npm run build`, and a post-change screenshot comparison.

## Style and tooling

- `.prettierrc` is the formatting source of truth.
- VS Code linker: `markdown.validate.fileLinks` is set to `warning` — broken relative links in markdown surface as warnings, not errors.
- Tests use Vitest + Testing Library (jsdom). New tests go alongside the component or in a `__tests__` sibling directory matching the existing pattern.

## Workflow expectations

- Branch naming: `feature/…` or `fix/…` (per `CONTRIBUTING.md`).
- Run `npm test` before pushing. For UI-touching changes, also run `npm run build`.
- Don't amend or force-push without explicit user instruction.
- Don't propose adding a backend, server-side conversion, or features that break the offline-first guarantee.
