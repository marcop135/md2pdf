# Changelog

**Labels:** **Build**, **Chore**, **CI**, **Docs**, **Enhance**, **Feat**, **Fix**, **Perf**, **Revert**, **Sec**, **Style**; add **(WIP)** for incomplete work.

## [2.10.3] - 2026-06-02

- **Style:** Collapse Import and Export buttons to icon-only squares at `≤355px` instead of `≤360px` for a tighter header.

## [2.10.2] - 2026-06-02

- **Build:** Migrate from yarn to npm: replace `resolutions` with `overrides`, add a `package-lock.json`, and pin npm via `packageManager`.
- **Build:** Drop the unused React-16-only `@testing-library/react-hooks` dep and set `legacy-peer-deps` for stale React peer ranges.
- **CI:** Switch the deploy workflow to `npm install` / `npm run build` with npm caching.
- **Docs:** Update README, CONTRIBUTING, and CLAUDE command tables to npm scripts.

## [2.10.1] - 2026-06-02

- **Fix:** Fill the mobile preview pane and theme the body so dark mode no longer leaves a light strip below content.
- **Build:** Tell Vite's Rolldown dep scanner to load `.js` as JSX so `yarn start` no longer fails pre-bundling.

## [2.10.0] - 2026-06-01

- **Feat:** Add light/dark/system theme toggle with system-preference detection and localStorage persistence under `md2pdf-theme`.
- **Enhance:** Switch CodeMirror between `oneDark` and `githubLight` with a visible caret and a vivid markdown HighlightStyle.
- **Enhance:** Re-initialize Mermaid between `default` and `dark` and swap github-markdown and highlight.js CSS per resolved theme.
- **Enhance:** Convert header, preview, tab bar, and drag bar surfaces to theme tokens that flip with the toggle.
- **Enhance:** Give Import and Export icon buttons wider 64px padding between 360 and 600px and tighten to 34px below 360.
- **Fix:** Stop overriding Mermaid label `line-height` and `white-space` so node text no longer clips vertically.
- **Fix:** Force the print output to light via `@media print` rules so dark-mode users still export a light PDF.
- **Fix:** Drop the global force-light preview rules in `styles.css` that masked the dark variant.
- **Style:** Reduce editor and gutter font sizes for a denser markdown view.
- **Build:** Pre-include `mermaid` and the lazy renderer deps in Vite `optimizeDeps.include` to fix broken chunk URLs on re-bundle.

## [2.9.22] - 2026-05-10

- **Fix:** Load the light-only `github-markdown-css` variant so tables stay readable when the OS is in dark mode.

## [2.9.21] - 2026-05-08

- **Fix:** Sync `document.title` to the first heading on edit so Android Firefox and Brave save PDFs with a real name.

## [2.9.20] - 2026-05-08

- **Docs:** Tighten changelog header legend and rewrite vague historical entries in an action-first style.

## [2.9.19] - 2026-05-08

- **Enhance:** Cover the browser's Ctrl/Cmd+P shortcut by deriving the PDF title via `beforeprint`/`afterprint` listeners.
- **Enhance:** Fall back to `h2..h6` when no `h1` exists and strip filesystem-illegal characters from the suggested filename.
- **Fix:** Print dialog now uses the first heading as the suggested PDF filename (was always silently reset before printing).

## [2.9.18] - 2026-05-06

- **Fix:** Keep `.preview` mounted during the lazy Preview chunk load so cold-load Export and the mobile print path work.
- **Style:** Render the Export action as a real `<button>` with `aria-label` so screen readers announce it as a control.
- **Chore:** Drop `.claude/launch.json`; debugger config is no longer tracked in the repo.

## [2.9.17] - 2026-05-05

- **Enhance:** Bigger headline, subtitle, and bullets in the GitHub social preview; drop the secondary copy line.
- **Enhance:** Wrap the app in a top-level ErrorBoundary so a crash shows a recoverable Reload screen instead of white.
- **Fix:** `react-helmet` no longer downgrades the static `robots` meta at runtime; the stronger HTML tag stays intact.
- **Sec:** Document the actual preview pipeline (`rehype-raw` then `rehype-sanitize`) and lock the ordering invariant.
- **Style:** Add `public/favicon.ico` for legacy clients and unfurl bots that still GET it from the root.
- **Docs:** Fix stale `.gitignore` comment and the `yarn hero:sync` row in the README scripts table.
- **Build:** Migrate `transformWithEsbuild` to `transformWithOxc` and drop deprecated `optimizeDeps.esbuildOptions`.
- **Build:** Remove unmaintained `react-helmet` from dependencies; meta tags live in the static HTML head.
- **Chore:** Add a regression test asserting the Previewer stays mounted from the editor tab on mobile.

## [2.9.16] - 2026-05-05

- **Enhance:** Tighten title and meta description across head and `og:*`/`twitter:*` tags for stronger social previews.
- **Enhance:** Refresh og:image: bigger card, lighter headline weight, secondary works-offline line, no CTA pill.
- **Fix:** Mobile `Export to .pdf` now renders the preview correctly when triggered from the editor tab.
- **Style:** Add 1280x640 GitHub social preview rendered from `docs/github-social.svg` without the CTA pill.
- **Docs:** Remove baked-in version chip from `docs/readme-hero.png` so semvers do not rot.
- **Build:** Extend `scripts/sync-hero.mjs` to render both og:image and GitHub social preview from SVG sources.
- **Sec:** Tighten production deploy from `security: loose` to `security: strict` so the TLS cert is now validated.
- **Chore:** Document that `FTP_HOST` must be the host's shared FTPS hostname so strict TLS hostname verification passes.

## [2.9.15] - 2026-05-05

- **Enhance:** Render dedicated 1200x630 og:image from `docs/og-img.svg` with a "Try it now" CTA, under 600 KB.
- **Enhance:** Add `og:image:width`, `og:image:height`, `og:image:type`, and `og:image:alt` for better unfurl rendering.
- **Style:** Tighten og:title to 55 chars and og:description to 134 chars to match social-preview optimums.
- **Revert:** Restore `docs/readme-hero.png` to the un-stripped screenshot; og:image is now its own asset.

## [2.9.14] - 2026-05-04

- **Enhance:** Generate 192/512 PNG and maskable PWA icons so Android installs render the proper logo.
- **Fix:** Allow social-preview bots in `robots.txt` so shared links unfurl with og:title and og:image.
- **Fix:** Hide mobile tab bar in print and force-print code highlighting and Mermaid colors.
- **Style:** Drop the print-footer attribution line for cleaner exported PDFs.
- **Docs:** Strip the baked-in version chip from the README hero so semvers don't rot.
- **Docs:** Document PWA icon generation in `CLAUDE.md`.

## [2.9.13] - 2026-05-02

- **Docs:** Align README, `package.json` description, and HTML meta with GitHub About.
- **Docs:** Add hero at `docs/readme-hero.png` and Open Graph at `public/static/og-img.png`.
- **Docs:** Add `CLAUDE.md` with project conventions and switch README hero to plain markdown for cross-previewer rendering.
- **Build:** Auto-sync the README hero to `public/static/og-img.png` on dev and build.
- **Chore:** Narrow `.gitignore` so shared `.claude` config can be tracked.
- **Chore:** Remove `.cursor/` rules; project conventions now live solely in `CLAUDE.md`.

## [2.9.12] - 2026-05-02

- **Docs:** Shorten the README tagline.

## [2.9.11] - 2026-05-01

- **Enhance:** Show muted package version in the header, hidden on very narrow screens.

## [2.9.10] - 2026-05-01

- **Style:** Remove the version badge from the header.
- **Docs:** Crop the README hero image for wide layouts.

## [2.9.9] - 2026-05-01

- **Style:** Bold the product name in the header and align onboarding casing.
- **Style:** Use a system-ui stack and add emoji fallbacks in the preview.
- **Chore:** Pin dev server to port 5173 and relax CSP meta during Vite serve.
- **Chore:** Add a VS Code task to start the dev server.

## [2.9.8] - 2026-05-01

- **Style:** Taller toolbar, clearer action labels, larger icons, and matching header height.

## [2.9.7] - 2026-05-01

- **Style:** Show the GitHub control as icon-only after Export.

## [2.9.6] - 2026-05-01

- **Enhance:** Add a header link to the GitHub repository.

## [2.9.5] - 2026-05-01

- **Enhance:** Shorten default onboarding text using a bullet list.

## [2.9.4] - 2026-05-01

- **Enhance:** Refresh planned onboarding sample and shrink editor font below 768px width.

## [2.9.3] - 2026-05-01

- **Enhance:** Clarify onboarding, preview padding and wrapping, and editor line height.

## [2.9.2] - 2026-05-01

- **Enhance:** Tighten the default onboarding blurb.
- **Enhance:** Add an accessible aria-label to the editor.
- **Fix:** Fix the product name typo in the default sample.

## [2.9.1] - 2026-04-30

- **Fix:** Stop redundant sanitization from stripping Mermaid diagram labels.
- **Style:** Align header button font-weight across the toolbar.
- **Docs:** Add this changelog file.
- **Chore:** Remove DOMPurify and rely on Mermaid strict-mode sanitization.

## [2.9.0] - 2026-04-30

- **Fix:** Restore missing Mermaid diagram text after label regressions.
- **Style:** Set explicit font-weight on header buttons for consistency.
- **Chore:** Remove stray root files and unused cross-env from devDependencies (#16).

## [2.8.0] - 2026-04-28

- **Fix:** Make Mermaid unit tests resilient to jsdom mocking differences.
- **Style:** Adopt Bootstrap Icons in the header and widen the monospace editor.

## [2.7.6] - 2026-04-28

- **Sec:** Sanitize Mermaid SVG output with DOMPurify and validate upload extensions.

## [2.7.5] - 2026-04-27

- **Feat:** Support `<style>` in markdown, add an SVG favicon, and improve cache busting.

## [2.7.4] - 2026-04-27

- **CI:** Upload production builds to the FTP site root.

## [2.7.3] - 2026-04-25

- **Feat:** Add rehype-sanitize, PDF watermark, bumped actions, and stop tracking dist.

## [2.7.2] - 2026-04-25

- **Feat:** Discourage search-engine indexing and AI training crawlers.

## [2.7.1] - 2026-04-25

- **Sec:** Add a Content-Security-Policy meta tag to the app shell.
- **CI:** Switch production deploy to FTP and FTPS and retire the Node 16 workflow (#5, #6).
- **Chore:** Bump runtime dependencies plus Vite and uuid to patched releases (#7, #8).
- **Chore:** Point release deploy workflows at the main branch.

## [2.7.0] - 2026-04-25

- **Feat:** Render Mermaid diagrams in preview and exported PDF (#3).
- **CI:** Publish GitHub Pages artifacts from the dist directory.

## [2.6.3] - 2026-04-28

- **CI:** Run deploy workflows against main instead of master.

## [2.6.2] - 2026-04-14

- **Chore:** Sync committed dist output with the preview HTML fix.

## [2.6.1] - 2026-04-14

- **Fix:** Render embedded HTML and tel links correctly in Markdown preview (#2).

## [2.6.0] - 2026-04-03

- **Chore:** Refresh branding, package the 2.6.0 release, and track dist for deploys.

## [2.5.1] - 2026-04-03

- **Fix:** Merge the Mermaid pie preview branch with chart rendering fixes.
- **Docs:** Polish README copy and document security maintenance notes.
- **Build:** Migrate the markdown pipeline off vulnerable dependency chains.
- **Build:** Stabilize Vite JSX transforms after merge dependency drift.

## [2.5.0] - 2026-03-08

- **Style:** Ship a mobile-responsive shell layout.
- **Chore:** Refresh npm dependencies.

## [2.4.1] - 2026-02-09

- **Style:** Force light-mode preview styling via github-markdown-css.

## [2.4.0] - 2026-02-09

- **Chore:** Upgrade the app to React 19 and refresh dependencies.

## [2.2.1] - 2025-06-24

- **Chore:** Cut the 2.2.1 tag as a maintenance snapshot.

## [2.1.0] - 2025-04-23

- **Fix:** Remove a typo from the Markdown preview output.

## [2.0.0] - 2025-04-11

- **Docs:** Refresh the README for the 2.0.0 release tag.

## [1.0.0] - 2025-06-24

- **Chore:** Stamp the 1.0.0 baseline tag for the fork; no code change versus 0.0.2.

## [0.0.2] - 2025-06-24

- **Chore:** Stamp the 0.0.2 metadata baseline tag for the fork; no code change versus the upstream snapshot.

---

Forked from [realdennis/md2pdf](https://github.com/realdennis/md2pdf) (MIT) in April 2025; releases above cover this fork only.
