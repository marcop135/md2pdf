# Changelog

- **Format:** Based on [Keep a Changelog](https://keepachangelog.com).
- **Voice:** Use the imperative, like a commit message. Write add, fix, increase, force, not added, fixed, increased, forced.
- **Length:** Keep each bullet on one line, max 120 characters (link URLs do not count toward the cap, only the visible text does).
- **Links:** Add inline markdown links for related PRs, docs, and external references when they help the reader.

## [Unreleased]

## [2.15.3] - 2026-10-04

### Changed

- Align the README with draw: desktop and phone side by side, Privacy and Security split, and a Built-with table.
- Move the npm command table to `docs/commands.md` and link it from Development.
- Rewrite the Security section as bullets that name each control.
- Capture a single Preview-tab phone shot into `docs/readme/` for the README row.

### Removed

- Drop the README badges and label the screenshot row as Desktop and Mobile.

### Fixed

- Recognize `Object.defineProperty(window, 'md2pdf')` in the agent-readiness check.

## [2.15.2] - 2026-10-02

### Changed

- Replace the arrow-based README, social, and og:image artwork with one editor-and-preview banner in light and dark.
- Retell the README around light and dark desktop and mobile screenshots, and move agent usage to `docs/agent-surface.md`.
- Add `npm run readme:screenshots` to recapture the README screenshots with Playwright.

## [2.15.1] - 2026-10-02

### Changed

- Keep the cPanel `.ftpquota` file out of the SFTP mirror's delete pass.

### Removed

- Drop `web-share` from the Permissions-Policy, which Chrome reports as an unrecognized feature.

### Fixed

- Revalidate HTML, text, Markdown, and JSON files on every request instead of caching them for a year.

## [2.15.0] - 2026-10-02

### Changed

- Separate the GitHub link from the in-app header controls with a thin divider.
- Apply the immutable cache rule to hashed `/assets/` files, which the old pattern never matched.
- Rewrite the README with a clearer structure, accurate security details, and a complete scripts table.
- Purge the Cloudflare cache for md2pdf after each successful production deploy.
- Run audit, changelog lint, tests, and build on pull requests to develop and main.

### Security

- Verify the FTPS certificate and pin the SFTP host key, so deploys cannot leak credentials to an impostor.
- Install from the committed lockfile and restrict workflow tokens to read-only repository contents.
- Strip `name` attributes from document HTML so imported Markdown cannot shadow page properties used by export.
- Cap `window.md2pdf.setMarkdown` by UTF-8 bytes like file import, and make the bridge read-only.
- Send HSTS, Permissions-Policy, and COOP headers, and stop caching plain-text agent files for a year.

## [2.14.1] - 2026-10-01

### Changed

- Move the app screenshot in the README below the live app link.

### Fixed

- Restore the previous phone header with the title text, wider Import and Export buttons, and no logo.

## [2.14.0] - 2026-10-01

### Changed

- Add unified README, og:image, and GitHub social images in the site fonts on a deep sky gradient.
- Render brand images from `.github/brand/` with `npm run brand:images`, replacing `hero:sync` and its SVG sources.

## [2.13.4] - 2026-10-01

### Changed

- Show For agents as a header icon beside the theme toggle, hidden on small screens.

## [2.13.3] - 2026-10-01

### Fixed

- Strip the CSP meta tag on the dev server as intended.

### Security

- Move CSP frame-ancestors from the meta tag to an HTTP header so browsers enforce it.

## [2.13.2] - 2026-10-01

### Changed

- Rebuild the header on measured breakpoints with a logo, short labels, and icon-only controls that never wrap.
- Refresh the README hero from the live app and redesign the og and GitHub social images.

### Fixed

- Ship a committed, cache-busted og:image so the deploy runner no longer renders it with fallback fonts.

## [2.13.1] - 2026-09-30

### Changed

- Take the npm minor/patch group: React 19.3, CodeMirror, Vitest, jsdom, and UIW.

### Fixed

- Hide the For agents header link below 600px so the toolbar stays usable.

### Security

- Patch brace-expansion and fast-uri advisories via npm audit fix.

## [2.13.0] - 2026-09-30

### Added

- Expose `window.md2pdf` so agents and Playwriter can set markdown and export PDFs.
- Publish agent discovery files, a For agents portal, OpenAPI, and an ARD catalog.

### Changed

- Document the agent surface in the README, portal, and `docs/agent-surface.md`.
- Narrow the SFTP `.well-known` exclude so agent catalogs reach production.

### Fixed

- Return HTTP 404 for missing agent static paths instead of the SPA shell.
- Deploy `.well-known` agent catalogs while still excluding ACME challenge paths.

## [2.12.1] - 2026-09-25

### Changed

- Lead the README with the app screenshot and add build, release, and license badges.
- Add a security policy, a code of conduct, issue forms, and a pull request template.
- Normalize line endings and mark binary assets through a new `.gitattributes`.

## [2.12.0] - 2026-09-09

### Changed

- Memoize the preview and defer its source so typing and splitter drags stop reparsing.
- Bump the npm minor/patch group: Mermaid 11.17, highlight.js 11.12, CodeMirror, styled-components, Playwright.
- Take Vitest 5, jsdom 30, Vite 8.2.2, and Babel runtime 8.
- Deploy over SFTP first with an FTPS fallback, fixing the strict-TLS hostname mismatch.

### Removed

- Drop the highlight.js language pack from the entry chunk, cutting 157 KB from first load.

### Fixed

- Print Mermaid diagrams in light colors so dark-mode exports stay readable on paper.
- Paginate wide tables with repeating headers instead of clipping them at the page edge.
- Wrap long code lines in exported PDFs rather than cutting them off.
- Split tall code blocks and tables across pages instead of overflowing and losing their bottoms.
- Give the export wait a deadline so a hidden tab no longer blocks the print dialog.
- Stop service worker updates from reloading the tab and discarding the unsaved document.
- Keep print listeners stable so typing cannot clear the suggested PDF filename mid-export.
- Give every Mermaid render a unique id so concurrent renders stop dropping diagrams.
- Align the layout breakpoint with the mobile query so zoomed viewports keep the preview visible.

### Security

- Patch brace-expansion, browserslist, fast-uri, nanoid, undici, DOMPurify, and Mermaid advisories.

## [2.11.7] - 2026-07-29

### Changed

- Tighten README structure with usage-first flow and trimmed feature copy.
- Import highlight.js common build to shrink the highlight vendor chunk for faster loads.

### Security

- Add tests for syntax-highlight HTML sanitization and unknown-language fenced code blocks.

## [2.11.6] - 2026-07-28

### Changed

- Bump the npm minor/patch group: React 19.2.8, Mermaid 11.16, CodeMirror, Playwright, and Vitest.
- Bump actions/setup-node from v6 to v7 in the deploy workflow.

### Security

- Patch brace-expansion, PostCSS, fast-uri, and DOMPurify advisories via npm audit fix.

## [2.11.5] - 2026-07-21

### Changed

- Add print-filename behavior spec for maintainers.

### Fixed

- Hold the heading in a guarded print session so Android save dialogs keep the suggested PDF filename.
- Restore the Firefox Android URL-slug hint and multi-signal session teardown.

## [2.11.4] - 2026-06-23

### Changed

- Bump the npm minor/patch group: CodeMirror, Playwright, Vitest, esbuild, and the Vite React plugin.
- Bump actions/checkout from v6 to v7 in the deploy workflow.

### Security

- Patch undici, Vite, DOMPurify, and Babel advisories via npm audit fix.

## [2.11.3] - 2026-06-10

### Removed

- Remove the Firefox Android URL-slug print hack that never controlled the PDF filename.

### Fixed

- Keep the browser tab titled "Markdown to PDF" and apply the heading only while exporting.

## [2.11.2] - 2026-06-09

### Changed

- Bump the npm minor/patch group: React 19.2.7, styled-components 6.4.2, CodeMirror, Workbox, and Vite/Vitest tooling.

## [2.11.1] - 2026-06-09

### Changed

- Add an SPA fallback rewrite so the temporary print-time URL still serves the app on reload.

### Fixed

- Briefly reflect the heading in the URL while printing so Firefox Android names the exported PDF correctly.

### Security

- Re-enable the http-to-https redirect in production so insecure requests are upgraded.

## [2.11.0] - 2026-06-04

### Changed

- Mark the mobile Editor/Preview switcher as an ARIA tablist with roving tabindex and arrow-key navigation.
- Add visible `:focus-visible` rings on toolbar controls and tabs via a theme `focusRing` token.
- Make the file-import control keyboard-focusable instead of a hidden, unreachable label.
- Add canonical, Open Graph url/type/site_name/locale, and JSON-LD WebApplication structured data.
- Complete the PWA manifest with id, scope, categories, lang, dir, and orientation.
- Dynamically import Mermaid so the print path no longer bundles the engine upfront.
- Split react, codemirror, highlight.js, and markdown libraries into separate cached vendor chunks.
- Cache hashed build assets as immutable for a year while keeping entry points no-cache.
- Document build chunking, accessibility, metadata, and audit conventions in CLAUDE.md.
- Add a Playwright audit screenshot script and an `/audit` skill for repeatable site reviews.

### Removed

- Remove dead code and normalize quotes across hooks, editor, and error boundaries.

### Fixed

- Darken the light active-tab blue so the tab label meets WCAG AA contrast.
- Log Previewer errors instead of silently swallowing them in the error boundary.

## [2.10.6] - 2026-06-02

### Changed

- Accept `.markdown`, `.mdown`, and `.mkd` files on import, not just `.md`.

### Fixed

- Failed or aborted file reads no longer lock out imports or fail silently.
- Dragging the divider no longer snaps the editor pane by up to 15px.
- Re-clamp the editor pane width on window resize so it cannot overflow.
- Keep `snake_case` underscores in the heading used as the suggested PDF filename.
- Print proceeds even when Mermaid rendering rejects, and async rejections are handled.

### Security

- Sanitize syntax-highlight output before injection so it cannot bypass the markdown sanitizer.

## [2.10.5] - 2026-06-02

### Changed

- Add `dependabot.yml` so npm and github-actions updates arrive as weekly grouped PRs after the npm migration.

## [2.10.4] - 2026-06-02

### Security

- Bump mermaid to 11.15.0, fixing CSS/HTML injection and Gantt-chart infinite-loop DoS advisories.
- Patch transitive fast-uri, `@babel/plugin-transform-modules-systemjs`, and brace-expansion advisories via npm audit fix.

## [2.10.3] - 2026-06-02

### Changed

- Collapse Import and Export buttons to icon-only squares at `≤355px` instead of `≤360px` for a tighter header.

## [2.10.2] - 2026-06-02

### Changed

- Migrate from yarn to npm: use `overrides` instead of `resolutions`, add a lockfile, and pin npm.
- Switch the deploy workflow to `npm install` / `npm run build` with npm caching.
- Update README, CONTRIBUTING, and CLAUDE command tables to npm scripts.

### Removed

- Drop the unused React-16-only `@testing-library/react-hooks` dep and set `legacy-peer-deps` for stale React peer ranges.

## [2.10.1] - 2026-06-02

### Changed

- Tell Vite's Rolldown dep scanner to load `.js` as JSX so `yarn start` no longer fails pre-bundling.

### Fixed

- Fill the mobile preview pane and theme the body so dark mode no longer leaves a light strip below content.

## [2.10.0] - 2026-06-01

### Added

- Add light/dark/system theme toggle with system-preference detection and localStorage persistence under `md2pdf-theme`.

### Changed

- Switch CodeMirror between `oneDark` and `githubLight` with a visible caret and a vivid markdown HighlightStyle.
- Re-initialize Mermaid between `default` and `dark` and swap github-markdown and highlight.js CSS per resolved theme.
- Convert header, preview, tab bar, and drag bar surfaces to theme tokens that flip with the toggle.
- Give Import and Export icon buttons wider 64px padding between 360 and 600px and tighten to 34px below 360.
- Reduce editor and gutter font sizes for a denser markdown view.
- Pre-include `mermaid` and the lazy renderer deps in Vite `optimizeDeps.include` to fix broken chunk URLs on re-bundle.

### Removed

- Drop the global force-light preview rules in `styles.css` that masked the dark variant.

### Fixed

- Stop overriding Mermaid label `line-height` and `white-space` so node text no longer clips vertically.
- Force the print output to light via `@media print` rules so dark-mode users still export a light PDF.

## [2.9.22] - 2026-05-10

### Fixed

- Load the light-only `github-markdown-css` variant so tables stay readable when the OS is in dark mode.

## [2.9.21] - 2026-05-08

### Fixed

- Sync `document.title` to the first heading on edit so Android Firefox and Brave save PDFs with a real name.

## [2.9.20] - 2026-05-08

### Changed

- Tighten changelog header legend and rewrite vague historical entries in an action-first style.

## [2.9.19] - 2026-05-08

### Changed

- Cover the browser's Ctrl/Cmd+P shortcut by deriving the PDF title via `beforeprint`/`afterprint` listeners.
- Fall back to `h2..h6` when no `h1` exists and strip filesystem-illegal characters from the suggested filename.

### Fixed

- Print dialog now uses the first heading as the suggested PDF filename (was always silently reset before printing).

## [2.9.18] - 2026-05-06

### Changed

- Render the Export action as a real `<button>` with `aria-label` so screen readers announce it as a control.

### Removed

- Drop `.claude/launch.json`; debugger config is no longer tracked in the repo.

### Fixed

- Keep `.preview` mounted during the lazy Preview chunk load so cold-load Export and the mobile print path work.

## [2.9.17] - 2026-05-05

### Changed

- Bigger headline, subtitle, and bullets in the GitHub social preview; drop the secondary copy line.
- Wrap the app in a top-level ErrorBoundary so a crash shows a recoverable Reload screen instead of white.
- Add `public/favicon.ico` for legacy clients and unfurl bots that still GET it from the root.
- Fix stale `.gitignore` comment and the `yarn hero:sync` row in the README scripts table.
- Migrate `transformWithEsbuild` to `transformWithOxc` and drop deprecated `optimizeDeps.esbuildOptions`.
- Add a regression test asserting the Previewer stays mounted from the editor tab on mobile.

### Removed

- Remove unmaintained `react-helmet` from dependencies; meta tags live in the static HTML head.

### Fixed

- `react-helmet` no longer downgrades the static `robots` meta at runtime; the stronger HTML tag stays intact.

### Security

- Document the actual preview pipeline (`rehype-raw` then `rehype-sanitize`) and lock the ordering invariant.

## [2.9.16] - 2026-05-05

### Changed

- Tighten title and meta description across head and `og:*`/`twitter:*` tags for stronger social previews.
- Refresh og:image: bigger card, lighter headline weight, secondary works-offline line, no CTA pill.
- Add 1280x640 GitHub social preview rendered from `docs/github-social.svg` without the CTA pill.
- Extend `scripts/sync-hero.mjs` to render both og:image and GitHub social preview from SVG sources.
- Document that `FTP_HOST` must be the host's shared FTPS hostname so strict TLS hostname verification passes.

### Removed

- Remove baked-in version chip from `docs/readme-hero.png` so semvers do not rot.

### Fixed

- Mobile `Export to .pdf` now renders the preview correctly when triggered from the editor tab.

### Security

- Tighten production deploy from `security: loose` to `security: strict` so the TLS cert is now validated.

## [2.9.15] - 2026-05-05

### Changed

- Render dedicated 1200x630 og:image from `docs/og-img.svg` with a "Try it now" CTA, under 600 KB.
- Add `og:image:width`, `og:image:height`, `og:image:type`, and `og:image:alt` for better unfurl rendering.
- Tighten og:title to 55 chars and og:description to 134 chars to match social-preview optimums.
- Restore `docs/readme-hero.png` to the un-stripped screenshot; og:image is now its own asset.

## [2.9.14] - 2026-05-04

### Changed

- Generate 192/512 PNG and maskable PWA icons so Android installs render the proper logo.
- Strip the baked-in version chip from the README hero so semvers don't rot.
- Document PWA icon generation in `CLAUDE.md`.

### Removed

- Drop the print-footer attribution line for cleaner exported PDFs.

### Fixed

- Allow social-preview bots in `robots.txt` so shared links unfurl with og:title and og:image.
- Hide mobile tab bar in print and force-print code highlighting and Mermaid colors.

## [2.9.13] - 2026-05-02

### Changed

- Align README, `package.json` description, and HTML meta with GitHub About.
- Add hero at `docs/readme-hero.png` and Open Graph at `public/static/og-img.png`.
- Add `CLAUDE.md` with project conventions and switch README hero to plain markdown for cross-previewer rendering.
- Auto-sync the README hero to `public/static/og-img.png` on dev and build.
- Narrow `.gitignore` so shared `.claude` config can be tracked.

### Removed

- Remove `.cursor/` rules; project conventions now live solely in `CLAUDE.md`.

## [2.9.12] - 2026-05-02

### Changed

- Shorten the README tagline.

## [2.9.11] - 2026-05-01

### Changed

- Show muted package version in the header, hidden on very narrow screens.

## [2.9.10] - 2026-05-01

### Changed

- Crop the README hero image for wide layouts.

### Removed

- Remove the version badge from the header.

## [2.9.9] - 2026-05-01

### Changed

- Bold the product name in the header and align onboarding casing.
- Use a system-ui stack and add emoji fallbacks in the preview.
- Pin dev server to port 5173 and relax CSP meta during Vite serve.
- Add a VS Code task to start the dev server.

## [2.9.8] - 2026-05-01

### Changed

- Taller toolbar, clearer action labels, larger icons, and matching header height.

## [2.9.7] - 2026-05-01

### Changed

- Show the GitHub control as icon-only after Export.

## [2.9.6] - 2026-05-01

### Changed

- Add a header link to the GitHub repository.

## [2.9.5] - 2026-05-01

### Changed

- Shorten default onboarding text using a bullet list.

## [2.9.4] - 2026-05-01

### Changed

- Refresh planned onboarding sample and shrink editor font below 768px width.

## [2.9.3] - 2026-05-01

### Changed

- Clarify onboarding, preview padding and wrapping, and editor line height.

## [2.9.2] - 2026-05-01

### Changed

- Tighten the default onboarding blurb.
- Add an accessible aria-label to the editor.

### Fixed

- Fix the product name typo in the default sample.

## [2.9.1] - 2026-04-30

### Changed

- Align header button font-weight across the toolbar.
- Add this changelog file.

### Removed

- Remove DOMPurify and rely on Mermaid strict-mode sanitization.

### Fixed

- Stop redundant sanitization from stripping Mermaid diagram labels.

## [2.9.0] - 2026-04-30

### Changed

- Set explicit font-weight on header buttons for consistency.

### Removed

- Remove stray root files and unused cross-env from devDependencies (#16).

### Fixed

- Restore missing Mermaid diagram text after label regressions.

## [2.8.0] - 2026-04-28

### Changed

- Adopt Bootstrap Icons in the header and widen the monospace editor.

### Fixed

- Make Mermaid unit tests resilient to jsdom mocking differences.

## [2.7.6] - 2026-04-28

### Security

- Sanitize Mermaid SVG output with DOMPurify and validate upload extensions.

## [2.7.5] - 2026-04-27

### Added

- Support `<style>` in markdown, add an SVG favicon, and improve cache busting.

## [2.7.4] - 2026-04-27

### Changed

- Upload production builds to the FTP site root.

## [2.7.3] - 2026-04-25

### Added

- Add rehype-sanitize, PDF watermark, bumped actions, and stop tracking dist.

## [2.7.2] - 2026-04-25

### Added

- Discourage search-engine indexing and AI training crawlers.

## [2.7.1] - 2026-04-25

### Changed

- Switch production deploy to FTP and FTPS and retire the Node 16 workflow (#5, #6).
- Bump runtime dependencies plus Vite and uuid to patched releases (#7, #8).
- Point release deploy workflows at the main branch.

### Security

- Add a Content-Security-Policy meta tag to the app shell.

## [2.7.0] - 2026-04-25

### Added

- Render Mermaid diagrams in preview and exported PDF (#3).

### Changed

- Publish GitHub Pages artifacts from the dist directory.

## [2.6.3] - 2026-04-28

### Changed

- Run deploy workflows against main instead of master.

## [2.6.2] - 2026-04-14

### Changed

- Sync committed dist output with the preview HTML fix.

## [2.6.1] - 2026-04-14

### Fixed

- Render embedded HTML and tel links correctly in Markdown preview (#2).

## [2.6.0] - 2026-04-03

### Changed

- Refresh branding, package the 2.6.0 release, and track dist for deploys.

## [2.5.1] - 2026-04-03

### Changed

- Polish README copy and document security maintenance notes.
- Migrate the markdown pipeline off vulnerable dependency chains.
- Stabilize Vite JSX transforms after merge dependency drift.

### Fixed

- Merge the Mermaid pie preview branch with chart rendering fixes.

## [2.5.0] - 2026-03-08

### Changed

- Ship a mobile-responsive shell layout.
- Refresh npm dependencies.

## [2.4.1] - 2026-02-09

### Changed

- Force light-mode preview styling via github-markdown-css.

## [2.4.0] - 2026-02-09

### Changed

- Upgrade the app to React 19 and refresh dependencies.

## [2.2.1] - 2025-06-24

### Changed

- Cut the 2.2.1 tag as a maintenance snapshot.

## [2.1.0] - 2025-04-23

### Removed

- Remove a typo from the Markdown preview output.

## [2.0.0] - 2025-04-11

### Changed

- Refresh the README for the 2.0.0 release tag.

## [1.0.0] - 2025-06-24

### Changed

- Stamp the 1.0.0 baseline tag for the fork; no code change versus 0.0.2.

## [0.0.2] - 2025-06-24

### Changed

- Stamp the 0.0.2 metadata baseline tag for the fork; no code change versus the upstream snapshot.
