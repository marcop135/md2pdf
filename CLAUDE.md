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
| `npm run verify:agent-readiness` | Agent discovery files + `window.md2pdf` wiring |

If `npm start` fails because **5173 is already bound**, a previous Vite session is still running — quit it rather than picking a different port. The port being predictable matters for the manifest, debugger config (`.claude/launch.json`, `.vscode/tasks.json`), and the PWA service worker scope.

## Agent surface

Live agents drive https://md2pdf.marcopontili.com with Playwriter via `window.md2pdf` (no hosted MCP). Discovery: `/llms.txt`, `/for-agents.html`, `/auth.md`, `/openapi.json`, `/.well-known/ard.json`. Contract: [`docs/agent-surface.md`](docs/agent-surface.md). Skill: [`.claude/skills/md2pdf-export/SKILL.md`](.claude/skills/md2pdf-export/SKILL.md). Keep the privacy-first `robots.txt` `Disallow` for the app UI; only agent discovery paths are Allow-listed.

## Project layout (only the non-obvious bits)

- `src/App/Components/Header/` — toolbar (brand title, version chip, For agents link, Import/Export, GitHub link). See **Header toolbar conventions** below.
- `src/App/Container/` — state via `nonaction` and hooks like `useIsMobile`, `useDrop`.
- `src/App/Lib/` — utilities including `agentBridge.js` (`window.md2pdf`).
- `public/.htaccess` — Apache security/caching headers used in production deploys.
- `public/llms.txt`, `auth.md`, `for-agents.html`, `openapi.json`, `.well-known/` — agent discovery (must ship as real files, not SPA HTML).
- `public/static/og-img.png`: committed 1200x630 og:image; rendered from `.github/brand/og.svg` by `npm run brand:images`.
- `docs/readme/`: committed README screenshots from `scripts/readme-screenshots.mjs`.
- `scripts/changelog-lint.mjs` — enforces the changelog format; do not bypass.
- `scripts/verify-agent-readiness.mjs` — static agent-surface checks.

## Header toolbar conventions

The app uses **`system-ui, sans-serif`** globally (set in [`src/App/index.js`](src/App/index.js) and [`src/styles.css`](src/styles.css)).

- Brand = 24px `/favicon.svg` logo + `.brand-title` `Markdown to PDF` at **`font-weight: 700`** (truncates with an ellipsis rather than scrolling the bar).
- Version chip = `v` + `major.minor.patch` from `package.json`, rendered as `.version-chip` (color `#656d76`, weight `400`, slightly smaller).
- Breakpoints live in the `BP` constant in `Header/index.js`, each set from the measured width of the tier above it: For agents is an icon-only control between Export and the theme toggle; `≤768` short labels (`Import`, `Export PDF`), `≤640` logo and For agents hidden, Import/Export icon-only at 64px wide, title text kept and stepped down to 13px (`≤480`), 12px (`≤360`), 11px (`≤320`), chip hidden `≤420`, all buttons 34px `≤355`. After any header change, sweep 300-1280px and confirm no label wraps or clips.
- Every control keeps an `aria-label` and `title` independent of its visible label (`Header.test.jsx`).
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

## README images

Brand banners stay plain markdown light/dark pairs (`![alt](src#gh-light-mode-only)` then `src#gh-dark-mode-only`), with **no link around them**. GitHub does not hide a linked image by its `#gh-*-mode-only` fragment, so a linked pair shows both.

Product screenshots sit under the live app link as one centered desktop + phone row: two `<picture>` elements with `prefers-color-scheme` sources and `width="73%"` / `width="21%"` (same pattern as draw), then a caption line `<strong>Desktop</strong> (left) · <strong>Mobile</strong> (right)`. That HTML block is the exception to the plain-markdown rule; do not wrap the brand banners the same way. Paths: `docs/readme/desktop-{light,dark}.png` and `docs/readme/mobile-{light,dark}.png` (single Preview-tab phone frame). Recapture with `npm run readme:screenshots` while `npm start` runs (demo document lives in `scripts/readme-screenshots.mjs`). npm scripts for contributors live in [`docs/commands.md`](docs/commands.md); the README Development section links there.

## Brand images (README, og:image, GitHub social)

Sources live in `.github/brand/` (`readme-light.svg`, `readme-dark.svg`, `og.svg`, `brand.config.json`; the kit files there are vendored, do not edit them). `npm run brand:images` renders `.github/brand/readme-light.png` and `readme-dark.png` (2560x1280), `.github/brand/social.png` (1280x640, uploaded by hand in repo Settings > Social preview) and `public/static/og-img.png` (**1200x630**, under 300 KB). Fonts are embedded in the SVGs, so output does not depend on installed fonts. It is **manual only**, not part of dev/build; `npm run brand:images:check` exits 1 if anything is stale.

- **No CTA pill or URL on the artwork**; the platform shows the link separately.
- **No standalone arrows**: the md2pdf icon already carries a down arrow.
- The readme banners' window mock uses the app's own type: Selawik (open Segoe UI stand-in for `system-ui`) and Inconsolata (for Consolas), embedded between `@app-fonts` markers from `fonts/`.
- `social.png` renders from `readme-light.svg` at 1x (no separate source). `og.svg` is the light `readme-light.svg` artwork shifted by `translate(-40 -5)` into the 1200x630 safe area; regenerate it whenever `readme-light.svg` changes. Rename an image when its content changes: GitHub and browsers cache README images by path.
- After re-rendering, bump the `?v=` query on `og:image`, `og:image:secure_url`, and `twitter:image` in `index.html` so unfurl caches refetch.

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
