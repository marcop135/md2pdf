[![Markdown to PDF: write Markdown, save a PDF, nothing leaves your browser](.github/brand/readme.png#gh-light-mode-only)](https://md2pdf.marcopontili.com)
[![Markdown to PDF: write Markdown, save a PDF, nothing leaves your browser](.github/brand/readme-dark.png#gh-dark-mode-only)](https://md2pdf.marcopontili.com)

# Markdown to PDF

[![CI](https://github.com/marcop135/md2pdf/actions/workflows/ci.yml/badge.svg)](https://github.com/marcop135/md2pdf/actions/workflows/ci.yml)
[![Deploy](https://github.com/marcop135/md2pdf/actions/workflows/deploy.yaml/badge.svg)](https://github.com/marcop135/md2pdf/actions/workflows/deploy.yaml)
[![Release](https://img.shields.io/github/v/release/marcop135/md2pdf)](https://github.com/marcop135/md2pdf/releases)
[![License: MIT](https://img.shields.io/github/license/marcop135/md2pdf)](./LICENSE)

You have a Markdown file and need a PDF: a report, a CV, meeting notes. Open the app, paste or drop the file, and save it as a PDF. No account, no upload, no install, and it keeps working offline.

**Live app: [md2pdf.marcopontili.com](https://md2pdf.marcopontili.com)**

## Write, preview, save

1. Type or paste Markdown, or import a `.md` file (button or drag and drop, up to 2 MB).
2. Watch the preview render as you type, styled like GitHub.
3. Click **Export to .pdf** and choose **Save as PDF** in the print dialog. The file is named after the document's first heading.

[![Editor and live preview side by side, with a table, task list, code block, and Mermaid diagram](docs/screenshots/desktop-light.png#gh-light-mode-only)](https://md2pdf.marcopontili.com)
[![Editor and live preview side by side, with a table, task list, code block, and Mermaid diagram](docs/screenshots/desktop-dark.png#gh-dark-mode-only)](https://md2pdf.marcopontili.com)

## On your phone too

On small screens the editor and preview become two tabs, so the same document fits a phone. The app follows your system theme, or pick light or dark from the toolbar.

![Editor and Preview tabs on a phone](docs/screenshots/mobile-light.png#gh-light-mode-only)
![Editor and Preview tabs on a phone](docs/screenshots/mobile-dark.png#gh-dark-mode-only)

## What it renders

- **GitHub-flavored Markdown**: tables, task lists, footnotes, and syntax-highlighted code.
- **Mermaid diagrams** from fenced `mermaid` code blocks.
- **Layout control** through allow-listed inline HTML and `<style>` blocks, for CVs and reports.
- **Installable and offline** as a PWA after the first visit.

Coding agents can drive the same app through `window.md2pdf`; see [`docs/agent-surface.md`](docs/agent-surface.md).

## Private by design

- **No backend.** Documents stay in the browser tab; nothing is sent anywhere for conversion or stored.
- **Sanitized rendering.** Raw HTML is parsed with `rehype-raw`, then `rehype-sanitize` keeps only an allow-list of tags and attributes. Scripts, event handlers, and `javascript:` links are removed.
- **Mermaid** runs with `securityLevel: 'strict'`.
- **Content Security Policy** allows scripts from the app's own origin only. Images with an `https` address in a document load from their host.
- **Hosting**: HTTPS behind Cloudflare, with HSTS, `nosniff`, `frame-ancestors 'none'`, and a strict Permissions-Policy.

Report vulnerabilities privately as described in [SECURITY.md](./SECURITY.md).

## Development

Requires Node.js 22 and npm.

```bash
git clone https://github.com/marcop135/md2pdf.git
cd md2pdf
npm install
npm start          # http://localhost:5173
```

| Command | Purpose |
| --- | --- |
| `npm start` | Dev server on port 5173 |
| `npm test` | Vitest suite |
| `npm run test:watch` | Vitest in watch mode |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run changelog:lint` | Validate `CHANGELOG.md` |
| `npm run verify:agent-readiness` | Check agent discovery files and the `window.md2pdf` wiring |
| `npm run icons:sync` | Render PWA icons from `public/favicon*.svg` |
| `npm run brand:images` | Render the README, og:image, and GitHub social images (`brand:images:check` reports stale ones) |
| `npm run readme:screenshots` | Recapture the README screenshots from the dev server |

`dist/` deploys to any static host. On Apache, the bundled `.htaccess` sets the security and caching headers.

## Built with

React 19, Vite, CodeMirror 6, react-markdown with remark-gfm, rehype-raw and rehype-sanitize, highlight.js, Mermaid, styled-components, and vite-plugin-pwa.

## Acknowledgements

Started as a fork of [realdennis/md2pdf](https://github.com/realdennis/md2pdf) (MIT); thanks to Dennis for the original app. This version adds Mermaid, GitHub-flavored Markdown, offline support, the agent bridge, tests, and CI.

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md), then [report a bug](https://github.com/marcop135/md2pdf/issues/new?template=bug.yml) or [request a feature](https://github.com/marcop135/md2pdf/issues/new?template=feature.yml). Participation follows the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Author

[Marco Pontili](https://marcopontili.com)

## License

[MIT](./LICENSE)
