# CLAUDE.md

Guidance for Claude Code when working in this repository. Read once at session start; the rules below override generic defaults when they conflict.

## What this project is

**Markdown2PDF** — a client-only React 19 + Vite PWA that converts Markdown to PDF in the browser via the print dialog. No backend; nothing leaves the user's session. Fork of [realdennis/md2pdf](https://github.com/realdennis/md2pdf) (MIT). Live app: https://md2pdf.marcopontili.com.

Hard scope rules (from `CONTRIBUTING.md`):

- **No server-side uploads or backends.** This is offline-first; conversion runs in the browser. Do not propose features that require a server for conversion.
- **Bundle size matters.** Don't add dependencies without a clear offline-first benefit.
- **No raw HTML execution in markdown preview** (XSS surface) — the renderer pipeline is `react-markdown` + `remark-gfm` + `rehype-sanitize`. Don't introduce `rehype-raw` into the preview path without explicit sign-off.

## Common commands

| Command                  | Purpose                                          |
| ------------------------ | ------------------------------------------------ |
| `yarn start`             | Vite dev server on **port 5173** (fixed)         |
| `yarn build`             | Production build to `dist/`                      |
| `yarn preview`           | Serve the built `dist/`                          |
| `yarn test`              | Run the Vitest suite once                        |
| `yarn test:watch`        | Vitest in watch mode                             |
| `yarn changelog:lint`    | Validate `CHANGELOG.md` (run before changelog commits) |

If `yarn start` fails because **5173 is already bound**, a previous Vite session is still running — quit it rather than picking a different port. The port being predictable matters for the manifest, debugger config (`.claude/launch.json`, `.vscode/tasks.json`), and the PWA service worker scope.

## Project layout (only the non-obvious bits)

- `src/App/Components/Header/` — toolbar (brand title, version chip, Import/Export, GitHub link). See **Header toolbar conventions** below.
- `src/App/Container/` — state via `nonaction` and hooks like `useIsMobile`, `useDrop`.
- `src/App/Lib/` — small utilities (e.g. upload helper).
- `public/.htaccess` — Apache security/caching headers used in production deploys.
- `public/static/og-img.png` — must mirror `docs/readme-hero.png` so README, social meta, and deploy stay in sync.
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

## Changelog format (enforced by lint)

`docs/changelog-writing-guide.md` is the spec. Summary:

- Bullet form: `- **<Label>:** <one sentence ending in . ! or ?>`
- Allowed labels: **Build, Chore, CI, Docs, Enhance, Feat, Fix, Perf, Revert, Sec, Style** (append `(WIP)` for incomplete work).
- **Max 20 words** in the sentence after the label.
- Within a release, order bullets: Feat, Enhance, Fix, Sec, Perf, Style, Docs, Build, CI, Chore, Revert.
- Release heading: `## [x.y.z] - YYYY-MM-DD`.
- Run `yarn changelog:lint` before committing changelog changes.

## README hero image

The hero uses plain markdown image+link form (`[![alt](src)](url)`), with **no surrounding `<div>` or `<p>` wrapper**. Markdown-inside-HTML rendering is inconsistent across local previewers (VS Code, JetBrains, etc.) even when GitHub handles it, so we keep it pure markdown.

`docs/readme-hero.png` is the single source of truth. `scripts/sync-hero.mjs` (run automatically on `yarn start` / `yarn dev` / `yarn build`, or manually via `yarn hero:sync`) copies it to `public/static/og-img.png` for social meta and the PWA. The destination is gitignored — to update, just replace the source and re-run dev/build.

The hero must **not** show the toolbar version chip — semvers rot. The chip stays visible in the live app; if you re-shoot the hero, edit the chip out before saving over `docs/readme-hero.png`.

## PWA icons

PNG icons under `public/icons/` are **generated**, not hand-edited. Sources:

- `public/favicon.svg` — full-bleed icon (rounded square; used for `purpose: any` in the manifest).
- `public/favicon-maskable.svg` — same artwork with a generous safe-zone (~60% of canvas) for Android maskable cropping (`purpose: maskable`).

`scripts/sync-icons.mjs` (run on `yarn start` / `yarn dev` / `yarn build`, or manually via `yarn icons:sync`) renders three PNGs into `public/icons/`: `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`. The destination folder is gitignored. PNGs are required because Android Firefox/Chrome/Brave do not always honor SVG manifest icons (Firefox falls back to a letter; Chromium can clip the SVG).

To change the icon, edit the appropriate SVG source and re-run dev/build (or `yarn icons:sync`). Don't commit PNGs into the repo.

## Style and tooling

- `.prettierrc` is the formatting source of truth.
- VS Code linker: `markdown.validate.fileLinks` is set to `warning` — broken relative links in markdown surface as warnings, not errors.
- Tests use Vitest + Testing Library (jsdom). New tests go alongside the component or in a `__tests__` sibling directory matching the existing pattern.

## Workflow expectations

- Branch naming: `feature/…` or `fix/…` (per `CONTRIBUTING.md`).
- Run `yarn test` before pushing. For UI-touching changes, also run `yarn build`.
- Don't amend or force-push without explicit user instruction.
- Don't propose adding a backend, server-side conversion, or features that break the offline-first guarantee.
