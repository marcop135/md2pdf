# Changelog

- **Format:** Based on [Keep a Changelog](https://keepachangelog.com).
- **Voice:** Use the imperative, like a commit message. Write add, fix, increase, force, not added, fixed, increased, forced.
- **Length:** Keep each bullet on one line, max 120 characters (link URLs do not count toward the cap, only the visible text does).
- **Links:** Add inline markdown links for related PRs, docs, and external references when they help the reader.

## [Unreleased]

### Changed

- Update compatible editor, Markdown, and build dependencies ([#145](https://github.com/marcop135/md2pdf/pull/145)).

### Security

- Fix Undici and fast-uri vulnerabilities with compatible updates ([#146](https://github.com/marcop135/md2pdf/issues/146)).

## [2.17.1] - 2026-10-30

### Changed

- Serve the Codex md2pdf-export skill from a link to the Claude copy instead of a duplicate ([#143](https://github.com/marcop135/md2pdf/pull/143), [#142](https://github.com/marcop135/md2pdf/issues/142)).

### Fixed

- Keep a Mermaid diagram with a pinned light theme readable in dark mode by drawing it on a white card ([#141](https://github.com/marcop135/md2pdf/pull/141), [#140](https://github.com/marcop135/md2pdf/issues/140)).

## [2.17.0] - 2026-10-30

### Added

- Accept `.mmd` files, wrapping each as one Mermaid diagram ([#137](https://github.com/marcop135/md2pdf/pull/137), [#139](https://github.com/marcop135/md2pdf/issues/139)).
- Publish the md2pdf-export skill for Codex, identical to the Claude copy ([#137](https://github.com/marcop135/md2pdf/pull/137)).

### Changed

- Name an agent PDF from the first heading, or `md2pdf-export.pdf` when there is none ([#137](https://github.com/marcop135/md2pdf/pull/137)).
- Skip an agent PDF when a Mermaid diagram fails to render ([#137](https://github.com/marcop135/md2pdf/pull/137)).

### Fixed

- Restore the default print filename when a document has no heading ([#137](https://github.com/marcop135/md2pdf/pull/137)).

## [2.16.2] - 2026-10-23

### Changed

- Link the README banner to the live app ([#120](https://github.com/marcop135/md2pdf/pull/120)).
- Bump the npm minor/patch group: React 19.3.1, styled-components 6.6, CodeMirror, Playwright, and Vitest ([#120](https://github.com/marcop135/md2pdf/pull/120)).

### Security

- Update Vite to 8.3.5, DOMPurify to 3.4.17, source-map-js to 1.2.2, and serialize-javascript to 7.1.3 ([#120](https://github.com/marcop135/md2pdf/pull/120)).

## [2.16.1] - 2026-10-16

### Fixed

- Report analytics to md2pdf's own Matomo site and refresh cached `/matomo.js` copies ([#113](https://github.com/marcop135/md2pdf/pull/113), [#135](https://github.com/marcop135/md2pdf/issues/135)).

## [2.16.0] - 2026-10-16

### Added

- Add cookieless, self-hosted Matomo as `/matomo.js` and allow it in the CSP ([#111](https://github.com/marcop135/md2pdf/pull/111), [#135](https://github.com/marcop135/md2pdf/issues/135)).
- Add a [`/privacy`](https://md2pdf.marcopontili.com/privacy) notice, linked from the header, For agents, `llms.txt`, and the README ([#111](https://github.com/marcop135/md2pdf/pull/111), [#135](https://github.com/marcop135/md2pdf/issues/135)).
- Add a `404.html` error page for hard 404s and a `/.well-known/security.txt` ([#111](https://github.com/marcop135/md2pdf/pull/111)).

## [2.15.5] - 2026-10-10

### Changed

- Replace the repo `audit` skill with an `## Audit contract` in CLAUDE.md for the global `site-audit` skill ([#108](https://github.com/marcop135/md2pdf/pull/108)).

## [2.15.4] - 2026-10-05

### Changed

- Use Keep a Changelog sections, Format/Voice/Length/Links preamble and inline links ([#98](https://github.com/marcop135/md2pdf/pull/98), [#102](https://github.com/marcop135/md2pdf/pull/102)).

## [2.15.3] - 2026-10-04

### Changed

- Align the README with draw: desktop and phone side by side, Privacy and Security split, and a Built-with table ([#96](https://github.com/marcop135/md2pdf/pull/96)).
- Move the npm command table to [`docs/commands.md`](https://github.com/marcop135/md2pdf/blob/develop/docs/commands.md) and link it from Development ([#96](https://github.com/marcop135/md2pdf/pull/96)).
- Rewrite the Security section as bullets that name each control ([#96](https://github.com/marcop135/md2pdf/pull/96)).
- Capture a single Preview-tab phone shot into [`docs/readme/`](https://github.com/marcop135/md2pdf/blob/develop/docs/readme/) for the README row ([#96](https://github.com/marcop135/md2pdf/pull/96)).

### Removed

- Drop the README badges and label the screenshot row as Desktop and Mobile ([#96](https://github.com/marcop135/md2pdf/pull/96)).

### Fixed

- Recognize `Object.defineProperty(window, 'md2pdf')` in the agent-readiness check ([#96](https://github.com/marcop135/md2pdf/pull/96)).

## [2.15.2] - 2026-10-02

### Changed

- Replace the arrow-based README, social, and og:image artwork with one editor-and-preview banner in light and dark ([#94](https://github.com/marcop135/md2pdf/pull/94)).
- Lead the README with light/dark desktop and mobile screenshots; move agent usage to [`docs/agent-surface.md`](https://github.com/marcop135/md2pdf/blob/develop/docs/agent-surface.md) ([#94](https://github.com/marcop135/md2pdf/pull/94)).
- Add `npm run readme:screenshots` to recapture the README screenshots with Playwright ([#94](https://github.com/marcop135/md2pdf/pull/94)).

## [2.15.1] - 2026-10-02

### Changed

- Keep the cPanel `.ftpquota` file out of the SFTP mirror's delete pass ([#92](https://github.com/marcop135/md2pdf/pull/92), [#133](https://github.com/marcop135/md2pdf/issues/133)).

### Removed

- Drop `web-share` from the Permissions-Policy, which Chrome reports as an unrecognized feature ([#92](https://github.com/marcop135/md2pdf/pull/92)).

### Fixed

- Revalidate HTML, text, Markdown, and JSON files on every request instead of caching them for a year ([#92](https://github.com/marcop135/md2pdf/pull/92), [#133](https://github.com/marcop135/md2pdf/issues/133)).

## [2.15.0] - 2026-10-02

### Changed

- Separate the GitHub link from the in-app header controls with a thin divider ([#89](https://github.com/marcop135/md2pdf/pull/89)).
- Apply the immutable cache rule to hashed `/assets/` files, which the old pattern never matched ([#88](https://github.com/marcop135/md2pdf/pull/88)).
- Rewrite the README with a clearer structure, accurate security details, and a complete scripts table ([#90](https://github.com/marcop135/md2pdf/pull/90)).
- Purge the Cloudflare cache for md2pdf after each successful production deploy ([#87](https://github.com/marcop135/md2pdf/pull/87), [#133](https://github.com/marcop135/md2pdf/issues/133)).
- Run audit, changelog lint, tests, and build on pull requests to develop and main ([#87](https://github.com/marcop135/md2pdf/pull/87)).

### Security

- Verify the FTPS certificate and pin the SFTP host key, so deploys cannot leak credentials to an impostor ([#87](https://github.com/marcop135/md2pdf/pull/87), [#133](https://github.com/marcop135/md2pdf/issues/133)).
- Install from the committed lockfile and restrict workflow tokens to read-only repository contents ([#87](https://github.com/marcop135/md2pdf/pull/87), [#133](https://github.com/marcop135/md2pdf/issues/133)).
- Strip `name` attributes from document HTML so imported Markdown cannot shadow page properties used by export ([#88](https://github.com/marcop135/md2pdf/pull/88)).
- Cap `window.md2pdf.setMarkdown` by UTF-8 bytes like file import, and make the bridge read-only ([#88](https://github.com/marcop135/md2pdf/pull/88), [#134](https://github.com/marcop135/md2pdf/issues/134), [#126](https://github.com/marcop135/md2pdf/issues/126)).
- Send HSTS, Permissions-Policy, and COOP headers, and stop caching plain-text agent files for a year ([#88](https://github.com/marcop135/md2pdf/pull/88), [#134](https://github.com/marcop135/md2pdf/issues/134)).

## [2.14.1] - 2026-10-01

### Changed

- Move the app screenshot in the README below the live app link ([#85](https://github.com/marcop135/md2pdf/pull/85)).

### Fixed

- Restore the previous phone header with the title text, wider Import and Export buttons, and no logo ([#85](https://github.com/marcop135/md2pdf/pull/85), [#136](https://github.com/marcop135/md2pdf/issues/136)).

## [2.14.0] - 2026-10-01

### Changed

- Add unified README, og:image, and GitHub social images in the site fonts on a deep sky gradient ([#84](https://github.com/marcop135/md2pdf/pull/84)).
- Render brand images from [`.github/brand/`](https://github.com/marcop135/md2pdf/blob/develop/.github/brand/) with `npm run brand:images`, replacing `hero:sync` and its SVG sources ([#84](https://github.com/marcop135/md2pdf/pull/84)).

## [2.13.4] - 2026-10-01

### Changed

- Show For agents as a header icon beside the theme toggle, hidden on small screens ([#82](https://github.com/marcop135/md2pdf/pull/82), [#136](https://github.com/marcop135/md2pdf/issues/136)).

## [2.13.3] - 2026-10-01

### Fixed

- Strip the CSP meta tag on the dev server as intended ([#80](https://github.com/marcop135/md2pdf/pull/80), [#126](https://github.com/marcop135/md2pdf/issues/126)).

### Security

- Move CSP frame-ancestors from the meta tag to an HTTP header so browsers enforce it ([#80](https://github.com/marcop135/md2pdf/pull/80), [#126](https://github.com/marcop135/md2pdf/issues/126)).

## [2.13.2] - 2026-10-01

### Changed

- Rebuild the header on measured breakpoints with a logo, short labels and non-wrapping icon controls ([#78](https://github.com/marcop135/md2pdf/pull/78), [#136](https://github.com/marcop135/md2pdf/issues/136)).
- Refresh the README hero from the live app and redesign the og and GitHub social images ([#78](https://github.com/marcop135/md2pdf/pull/78)).

### Fixed

- Ship a committed, cache-busted og:image so the deploy runner no longer renders it with fallback fonts ([#78](https://github.com/marcop135/md2pdf/pull/78)).

## [2.13.1] - 2026-09-30

### Changed

- Take the npm minor/patch group: React 19.3, CodeMirror, Vitest, jsdom, and UIW ([#75](https://github.com/marcop135/md2pdf/pull/75)).

### Fixed

- Hide the For agents header link below 600px so the toolbar stays usable ([#76](https://github.com/marcop135/md2pdf/pull/76), [#136](https://github.com/marcop135/md2pdf/issues/136)).

### Security

- Patch brace-expansion and fast-uri advisories via npm audit fix ([#75](https://github.com/marcop135/md2pdf/pull/75)).

## [2.13.0] - 2026-09-30

### Added

- Expose `window.md2pdf` so agents and Playwriter can set markdown and export PDFs ([#73](https://github.com/marcop135/md2pdf/pull/73), [#134](https://github.com/marcop135/md2pdf/issues/134)).
- Publish agent discovery files, a For agents portal, OpenAPI, and an ARD catalog ([#73](https://github.com/marcop135/md2pdf/pull/73), [#134](https://github.com/marcop135/md2pdf/issues/134)).

### Changed

- Document the agent surface in the README, portal, and [`docs/agent-surface.md`](https://github.com/marcop135/md2pdf/blob/develop/docs/agent-surface.md) ([#73](https://github.com/marcop135/md2pdf/pull/73), [#134](https://github.com/marcop135/md2pdf/issues/134)).
- Narrow the SFTP `.well-known` exclude so agent catalogs reach production ([#73](https://github.com/marcop135/md2pdf/pull/73), [#134](https://github.com/marcop135/md2pdf/issues/134)).

### Fixed

- Return HTTP 404 for missing agent static paths instead of the SPA shell ([#73](https://github.com/marcop135/md2pdf/pull/73), [#134](https://github.com/marcop135/md2pdf/issues/134)).
- Deploy `.well-known` agent catalogs while still excluding ACME challenge paths ([#73](https://github.com/marcop135/md2pdf/pull/73), [#134](https://github.com/marcop135/md2pdf/issues/134)).

## [2.12.1] - 2026-09-25

### Changed

- Lead the README with the app screenshot and add build, release, and license badges ([#70](https://github.com/marcop135/md2pdf/pull/70)).
- Add a security policy, a code of conduct, issue forms, and a pull request template ([#70](https://github.com/marcop135/md2pdf/pull/70)).
- Normalize line endings and mark binary assets through a new [`.gitattributes`](https://github.com/marcop135/md2pdf/blob/develop/.gitattributes) ([#70](https://github.com/marcop135/md2pdf/pull/70)).

## [2.12.0] - 2026-09-09

### Changed

- Memoize the preview and defer its source so typing and splitter drags stop reparsing ([#61](https://github.com/marcop135/md2pdf/pull/61), [#131](https://github.com/marcop135/md2pdf/issues/131)).
- Bump the npm minor/patch group: Mermaid 11.17, highlight.js 11.12, CodeMirror, styled-components, Playwright ([#62](https://github.com/marcop135/md2pdf/pull/62)).
- Take Vitest 5, jsdom 30, Vite 8.2.2, and Babel runtime 8 ([#62](https://github.com/marcop135/md2pdf/pull/62)).
- Deploy over SFTP first with an FTPS fallback, fixing the strict-TLS hostname mismatch ([#65](https://github.com/marcop135/md2pdf/pull/65), [#133](https://github.com/marcop135/md2pdf/issues/133)).

### Removed

- Drop the highlight.js language pack from the entry chunk, cutting 157 KB from first load ([#61](https://github.com/marcop135/md2pdf/pull/61)).

### Fixed

- Print Mermaid diagrams in light colors so dark-mode exports stay readable on paper ([#61](https://github.com/marcop135/md2pdf/pull/61), [#128](https://github.com/marcop135/md2pdf/issues/128), [#125](https://github.com/marcop135/md2pdf/issues/125)).
- Paginate wide tables with repeating headers instead of clipping them at the page edge ([#61](https://github.com/marcop135/md2pdf/pull/61), [#128](https://github.com/marcop135/md2pdf/issues/128)).
- Wrap long code lines in exported PDFs rather than cutting them off ([#61](https://github.com/marcop135/md2pdf/pull/61), [#128](https://github.com/marcop135/md2pdf/issues/128)).
- Split tall code blocks and tables across pages instead of overflowing and losing their bottoms ([#61](https://github.com/marcop135/md2pdf/pull/61), [#128](https://github.com/marcop135/md2pdf/issues/128)).
- Give the export wait a deadline so a hidden tab no longer blocks the print dialog ([#61](https://github.com/marcop135/md2pdf/pull/61), [#127](https://github.com/marcop135/md2pdf/issues/127)).
- Stop service worker updates from reloading the tab and discarding the unsaved document ([#61](https://github.com/marcop135/md2pdf/pull/61), [#130](https://github.com/marcop135/md2pdf/issues/130)).
- Keep print listeners stable so typing cannot clear the suggested PDF filename mid-export ([#61](https://github.com/marcop135/md2pdf/pull/61), [#129](https://github.com/marcop135/md2pdf/issues/129)).
- Give every Mermaid render a unique id so concurrent renders stop dropping diagrams ([#61](https://github.com/marcop135/md2pdf/pull/61), [#125](https://github.com/marcop135/md2pdf/issues/125)).
- Align the layout breakpoint with the mobile query so zoomed viewports keep the preview visible ([#61](https://github.com/marcop135/md2pdf/pull/61)).

### Security

- Patch brace-expansion, browserslist, fast-uri, nanoid, undici, DOMPurify, and Mermaid advisories ([#62](https://github.com/marcop135/md2pdf/pull/62)).

## [2.11.7] - 2026-07-29

### Changed

- Tighten README structure with usage-first flow and trimmed feature copy ([#52](https://github.com/marcop135/md2pdf/pull/52)).
- Import highlight.js common build to shrink the highlight vendor chunk for faster loads ([#52](https://github.com/marcop135/md2pdf/pull/52), [#131](https://github.com/marcop135/md2pdf/issues/131)).

### Security

- Add tests for syntax-highlight HTML sanitization and unknown-language fenced code blocks ([#52](https://github.com/marcop135/md2pdf/pull/52)).

## [2.11.6] - 2026-07-28

### Changed

- Bump the npm minor/patch group: React 19.2.8, Mermaid 11.16, CodeMirror, Playwright, and Vitest ([#50](https://github.com/marcop135/md2pdf/pull/50)).
- Bump actions/setup-node from v6 to v7 in the deploy workflow ([#42](https://github.com/marcop135/md2pdf/pull/42)).

### Security

- Patch brace-expansion, PostCSS, fast-uri, and DOMPurify advisories via npm audit fix ([#50](https://github.com/marcop135/md2pdf/pull/50)).

## [2.11.5] - 2026-07-21

### Changed

- Add print-filename behavior spec for maintainers ([#45](https://github.com/marcop135/md2pdf/pull/45), [#129](https://github.com/marcop135/md2pdf/issues/129)).

### Fixed

- Hold the heading in a guarded print session so Android save dialogs keep the suggested PDF filename ([#45](https://github.com/marcop135/md2pdf/pull/45), [#129](https://github.com/marcop135/md2pdf/issues/129)).
- Restore the Firefox Android URL-slug hint and multi-signal session teardown ([#45](https://github.com/marcop135/md2pdf/pull/45), [#129](https://github.com/marcop135/md2pdf/issues/129)).

## [2.11.4] - 2026-06-23

### Changed

- Bump the npm minor/patch group: CodeMirror, Playwright, Vitest, esbuild, and the Vite React plugin ([#37](https://github.com/marcop135/md2pdf/pull/37)).
- Bump actions/checkout from v6 to v7 in the deploy workflow ([#37](https://github.com/marcop135/md2pdf/pull/37)).

### Security

- Patch undici, Vite, DOMPurify, and Babel advisories via npm audit fix ([#37](https://github.com/marcop135/md2pdf/pull/37)).

## [2.11.3] - 2026-06-10

### Removed

- Remove the Firefox Android URL-slug print hack that never controlled the PDF filename ([#32](https://github.com/marcop135/md2pdf/pull/32), [#129](https://github.com/marcop135/md2pdf/issues/129)).

### Fixed

- Keep the browser tab titled "Markdown to PDF" and apply the heading only while exporting ([#32](https://github.com/marcop135/md2pdf/pull/32), [#129](https://github.com/marcop135/md2pdf/issues/129)).

## [2.11.2] - 2026-06-09

### Changed

- Update compatible npm packages: React 19.2.7, styled-components 6.4.2, CodeMirror, Workbox and Vite/Vitest ([#29](https://github.com/marcop135/md2pdf/pull/29)).

## [2.11.1] - 2026-06-09

### Changed

- Add an SPA fallback rewrite so the temporary print-time URL still serves the app on reload ([#31](https://github.com/marcop135/md2pdf/pull/31)).

### Fixed

- Briefly reflect the heading in the URL while printing so Firefox Android names the exported PDF correctly ([#31](https://github.com/marcop135/md2pdf/pull/31)).

### Security

- Re-enable the http-to-https redirect in production so insecure requests are upgraded ([#31](https://github.com/marcop135/md2pdf/pull/31)).

## [2.11.0] - 2026-06-04

### Changed

- Mark the mobile Editor/Preview switcher as an ARIA tablist with roving tabindex and arrow-key navigation ([#30](https://github.com/marcop135/md2pdf/pull/30), [#131](https://github.com/marcop135/md2pdf/issues/131)).
- Add visible `:focus-visible` rings on toolbar controls and tabs via a theme `focusRing` token ([#30](https://github.com/marcop135/md2pdf/pull/30), [#131](https://github.com/marcop135/md2pdf/issues/131)).
- Make the file-import control keyboard-focusable instead of a hidden, unreachable label ([#30](https://github.com/marcop135/md2pdf/pull/30), [#131](https://github.com/marcop135/md2pdf/issues/131)).
- Add canonical, Open Graph url/type/site_name/locale, and JSON-LD WebApplication structured data ([#30](https://github.com/marcop135/md2pdf/pull/30)).
- Complete the PWA manifest with id, scope, categories, lang, dir, and orientation ([#30](https://github.com/marcop135/md2pdf/pull/30)).
- Dynamically import Mermaid so the print path no longer bundles the engine upfront ([#30](https://github.com/marcop135/md2pdf/pull/30)).
- Split react, codemirror, highlight.js, and markdown libraries into separate cached vendor chunks ([#30](https://github.com/marcop135/md2pdf/pull/30)).
- Cache hashed build assets as immutable for a year while keeping entry points no-cache ([#30](https://github.com/marcop135/md2pdf/pull/30)).
- Document build chunking, accessibility, metadata, and audit conventions in CLAUDE.md ([#30](https://github.com/marcop135/md2pdf/pull/30)).
- Add a Playwright audit screenshot script and an `/audit` skill for repeatable site reviews ([#30](https://github.com/marcop135/md2pdf/pull/30)).

### Removed

- Remove dead code and normalize quotes across hooks, editor, and error boundaries ([#30](https://github.com/marcop135/md2pdf/pull/30)).

### Fixed

- Darken the light active-tab blue so the tab label meets WCAG AA contrast ([#30](https://github.com/marcop135/md2pdf/pull/30)).
- Log Previewer errors instead of silently swallowing them in the error boundary ([#30](https://github.com/marcop135/md2pdf/pull/30)).

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

- Migrate from yarn to npm: use `overrides` instead of `resolutions`, add a lockfile, and pin npm ([#28](https://github.com/marcop135/md2pdf/pull/28)).
- Switch the deploy workflow to `npm install` / `npm run build` with npm caching ([#28](https://github.com/marcop135/md2pdf/pull/28)).
- Update README, CONTRIBUTING, and CLAUDE command tables to npm scripts ([#28](https://github.com/marcop135/md2pdf/pull/28)).

### Removed

- Drop unused `@testing-library/react-hooks`; set `legacy-peer-deps` for stale React peer ranges ([#28](https://github.com/marcop135/md2pdf/pull/28)).

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

- Load the light-only `github-markdown-css` variant so tables stay readable when the OS is in dark mode ([#27](https://github.com/marcop135/md2pdf/pull/27), [#132](https://github.com/marcop135/md2pdf/issues/132)).

## [2.9.21] - 2026-05-08

### Fixed

- Sync `document.title` to the first heading on edit so Android Firefox and Brave save PDFs with a real name ([#25](https://github.com/marcop135/md2pdf/pull/25), [#129](https://github.com/marcop135/md2pdf/issues/129)).

## [2.9.20] - 2026-05-08

### Changed

- Tighten changelog header legend and rewrite vague historical entries in an action-first style ([#24](https://github.com/marcop135/md2pdf/pull/24)).

## [2.9.19] - 2026-05-08

### Changed

- Cover the browser's Ctrl/Cmd+P shortcut by deriving the PDF title via `beforeprint`/`afterprint` listeners ([#23](https://github.com/marcop135/md2pdf/pull/23), [#129](https://github.com/marcop135/md2pdf/issues/129)).
- Fall back to `h2..h6` when no `h1` exists and strip illegal filesystem characters from the filename ([#23](https://github.com/marcop135/md2pdf/pull/23), [#129](https://github.com/marcop135/md2pdf/issues/129)).

### Fixed

- Use the first heading as the PDF filename instead of resetting it before printing ([#23](https://github.com/marcop135/md2pdf/pull/23), [#129](https://github.com/marcop135/md2pdf/issues/129)).

## [2.9.18] - 2026-05-06

### Changed

- Render the Export action as a real `<button>` with `aria-label` so screen readers announce it as a control ([#22](https://github.com/marcop135/md2pdf/pull/22)).

### Removed

- Drop `.claude/launch.json`; debugger config is no longer tracked in the repo ([#22](https://github.com/marcop135/md2pdf/pull/22)).

### Fixed

- Keep `.preview` mounted during lazy Preview loading so cold-load Export and mobile printing work ([#22](https://github.com/marcop135/md2pdf/pull/22), [#127](https://github.com/marcop135/md2pdf/issues/127)).

## [2.9.17] - 2026-05-05

### Changed

- Bigger headline, subtitle, and bullets in the GitHub social preview; drop the secondary copy line ([#21](https://github.com/marcop135/md2pdf/pull/21)).
- Wrap the app in a top-level ErrorBoundary so a crash shows a recoverable Reload screen instead of white ([#21](https://github.com/marcop135/md2pdf/pull/21)).
- Add [`public/favicon.ico`](https://github.com/marcop135/md2pdf/blob/develop/public/favicon.ico) for legacy clients and unfurl bots that still GET it from the root ([#21](https://github.com/marcop135/md2pdf/pull/21)).
- Fix stale [`.gitignore`](https://github.com/marcop135/md2pdf/blob/develop/.gitignore) comment and the `yarn hero:sync` row in the README scripts table ([#21](https://github.com/marcop135/md2pdf/pull/21)).
- Migrate `transformWithEsbuild` to `transformWithOxc` and drop deprecated `optimizeDeps.esbuildOptions` ([#21](https://github.com/marcop135/md2pdf/pull/21)).
- Add a regression test asserting the Previewer stays mounted from the editor tab on mobile ([#21](https://github.com/marcop135/md2pdf/pull/21), [#127](https://github.com/marcop135/md2pdf/issues/127)).

### Removed

- Remove unmaintained `react-helmet` from dependencies; meta tags live in the static HTML head ([#21](https://github.com/marcop135/md2pdf/pull/21)).

### Fixed

- `react-helmet` no longer downgrades the static `robots` meta at runtime; the stronger HTML tag stays intact ([#21](https://github.com/marcop135/md2pdf/pull/21)).

### Security

- Document the actual preview pipeline (`rehype-raw` then `rehype-sanitize`) and lock the ordering invariant ([#21](https://github.com/marcop135/md2pdf/pull/21)).

## [2.9.16] - 2026-05-05

### Changed

- Tighten title and meta description across head and `og:*`/`twitter:*` tags for stronger social previews ([#20](https://github.com/marcop135/md2pdf/pull/20)).
- Refresh og:image: bigger card, lighter headline weight, secondary works-offline line, no CTA pill ([#20](https://github.com/marcop135/md2pdf/pull/20)).
- Add 1280x640 GitHub social preview rendered from `docs/github-social.svg` without the CTA pill ([#20](https://github.com/marcop135/md2pdf/pull/20)).
- Extend `scripts/sync-hero.mjs` to render both og:image and GitHub social preview from SVG sources ([#20](https://github.com/marcop135/md2pdf/pull/20)).
- Document that `FTP_HOST` must be the host's shared FTPS hostname so strict TLS hostname verification passes ([#20](https://github.com/marcop135/md2pdf/pull/20)).

### Removed

- Remove baked-in version chip from `docs/readme-hero.png` so semvers do not rot ([#20](https://github.com/marcop135/md2pdf/pull/20)).

### Fixed

- Mobile `Export to .pdf` now renders the preview correctly when triggered from the editor tab ([#20](https://github.com/marcop135/md2pdf/pull/20), [#127](https://github.com/marcop135/md2pdf/issues/127)).

### Security

- Tighten production deploy from `security: loose` to `security: strict` so the TLS cert is now validated ([#20](https://github.com/marcop135/md2pdf/pull/20)).

## [2.9.15] - 2026-05-05

### Changed

- Render dedicated 1200x630 og:image from `docs/og-img.svg` with a "Try it now" CTA, under 600 KB ([#19](https://github.com/marcop135/md2pdf/pull/19)).
- Add `og:image:width`, `og:image:height`, `og:image:type`, and `og:image:alt` for better unfurl rendering ([#19](https://github.com/marcop135/md2pdf/pull/19)).
- Tighten og:title to 55 chars and og:description to 134 chars to match social-preview optimums ([#19](https://github.com/marcop135/md2pdf/pull/19)).
- Restore `docs/readme-hero.png` to the un-stripped screenshot; og:image is now its own asset ([#19](https://github.com/marcop135/md2pdf/pull/19)).

## [2.9.14] - 2026-05-04

### Changed

- Generate 192/512 PNG and maskable PWA icons so Android installs render the proper logo ([#18](https://github.com/marcop135/md2pdf/pull/18)).
- Strip the baked-in version chip from the README hero so semvers don't rot ([#18](https://github.com/marcop135/md2pdf/pull/18)).
- Document PWA icon generation in [`CLAUDE.md`](https://github.com/marcop135/md2pdf/blob/develop/CLAUDE.md) ([#18](https://github.com/marcop135/md2pdf/pull/18)).

### Removed

- Drop the print-footer attribution line for cleaner exported PDFs ([#18](https://github.com/marcop135/md2pdf/pull/18)).

### Fixed

- Allow social-preview bots in `robots.txt` so shared links unfurl with og:title and og:image ([#18](https://github.com/marcop135/md2pdf/pull/18)).
- Hide mobile tab bar in print and force-print code highlighting and Mermaid colors ([#18](https://github.com/marcop135/md2pdf/pull/18)).

## [2.9.13] - 2026-05-02

### Changed

- Align README, [`package.json`](https://github.com/marcop135/md2pdf/blob/develop/package.json) description, and HTML meta with GitHub About.
- Add hero at `docs/readme-hero.png` and Open Graph at [`public/static/og-img.png`](https://github.com/marcop135/md2pdf/blob/develop/public/static/og-img.png).
- Add [`CLAUDE.md`](https://github.com/marcop135/md2pdf/blob/develop/CLAUDE.md) with project conventions and switch README hero to plain markdown for cross-previewer rendering.
- Auto-sync the README hero to [`public/static/og-img.png`](https://github.com/marcop135/md2pdf/blob/develop/public/static/og-img.png) on dev and build.
- Narrow [`.gitignore`](https://github.com/marcop135/md2pdf/blob/develop/.gitignore) so shared `.claude` config can be tracked.

### Removed

- Remove `.cursor/` rules; project conventions now live solely in [`CLAUDE.md`](https://github.com/marcop135/md2pdf/blob/develop/CLAUDE.md).

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

- Set explicit font-weight on header buttons for consistency ([#17](https://github.com/marcop135/md2pdf/pull/17)).

### Removed

- Remove stray root files and unused cross-env from devDependencies ([#16](https://github.com/marcop135/md2pdf/pull/16)).

### Fixed

- Restore missing Mermaid diagram text after label regressions ([#17](https://github.com/marcop135/md2pdf/pull/17), [#125](https://github.com/marcop135/md2pdf/issues/125)).

## [2.8.0] - 2026-04-28

### Changed

- Adopt Bootstrap Icons in the header and widen the monospace editor ([#15](https://github.com/marcop135/md2pdf/pull/15)).

### Fixed

- Make Mermaid unit tests resilient to jsdom mocking differences ([#15](https://github.com/marcop135/md2pdf/pull/15)).

## [2.7.6] - 2026-04-28

### Security

- Sanitize Mermaid SVG output with DOMPurify and validate upload extensions ([#14](https://github.com/marcop135/md2pdf/pull/14), [#126](https://github.com/marcop135/md2pdf/issues/126)).

## [2.7.5] - 2026-04-27

### Added

- Support `<style>` in markdown, add an SVG favicon, and improve cache busting ([#12](https://github.com/marcop135/md2pdf/pull/12), [#124](https://github.com/marcop135/md2pdf/issues/124)).

## [2.7.4] - 2026-04-27

### Changed

- Upload production builds to the FTP site root ([#11](https://github.com/marcop135/md2pdf/pull/11)).

## [2.7.3] - 2026-04-25

### Added

- Add rehype-sanitize, PDF watermark, bumped actions, and stop tracking dist ([#10](https://github.com/marcop135/md2pdf/pull/10), [#126](https://github.com/marcop135/md2pdf/issues/126)).

## [2.7.2] - 2026-04-25

### Added

- Discourage search-engine indexing and AI training crawlers ([#9](https://github.com/marcop135/md2pdf/pull/9)).

## [2.7.1] - 2026-04-25

### Changed

- Switch production deploy to FTP and FTPS and retire the Node 16 workflow ([#5](https://github.com/marcop135/md2pdf/pull/5), [#6](https://github.com/marcop135/md2pdf/pull/6)) ([#133](https://github.com/marcop135/md2pdf/issues/133)).
- Bump runtime dependencies plus Vite and uuid to patched releases ([#7](https://github.com/marcop135/md2pdf/pull/7), [#8](https://github.com/marcop135/md2pdf/pull/8)).
- Point release deploy workflows at the main branch ([#6](https://github.com/marcop135/md2pdf/pull/6), [#133](https://github.com/marcop135/md2pdf/issues/133)).

### Security

- Add a Content-Security-Policy meta tag to the app shell ([#6](https://github.com/marcop135/md2pdf/pull/6)).

## [2.7.0] - 2026-04-25

### Added

- Render Mermaid diagrams in preview and exported PDF ([#3](https://github.com/marcop135/md2pdf/pull/3)) ([#125](https://github.com/marcop135/md2pdf/issues/125)).

### Changed

- Publish GitHub Pages artifacts from the dist directory ([#3](https://github.com/marcop135/md2pdf/pull/3)).

## [2.6.3] - 2026-04-28

### Changed

- Run deploy workflows against main instead of master.

## [2.6.2] - 2026-04-14

### Changed

- Sync committed dist output with the preview HTML fix.

## [2.6.1] - 2026-04-14

### Fixed

- Render embedded HTML and tel links correctly in Markdown preview ([#2](https://github.com/marcop135/md2pdf/pull/2)) ([#124](https://github.com/marcop135/md2pdf/issues/124)).

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
