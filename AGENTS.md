# AGENTS.md

Entry point for AI agents in this repository. Detailed maintainer rules live in [`CLAUDE.md`](CLAUDE.md); read that file for renderer pipeline, changelog format, PWA constraints, and release workflow.

**Cursor CLI:** [Official docs](https://cursor.com/docs/cli/overview). Run headless from the repo root with this file and `CLAUDE.md` in context.

## Stack

Client-only **React 19 + Vite PWA**. Markdown renders via `react-markdown`, `remark-gfm`, `rehype-raw`, `rehype-sanitize` (sanitize last). PDF export uses the browser print dialog; no backend.

## Build / test

Uses **npm** only (`packageManager` + `preinstall` guard).

| Command                  | Purpose                    |
| ------------------------ | -------------------------- |
| `npm start`              | Dev server on port **5173** |
| `npm test`               | Vitest (run before push)   |
| `npm run build`          | Production build to `dist/` |
| `npm run changelog:lint` | Validate `CHANGELOG.md`    |

Run `npm test` before pushing; run `npm run build` for UI-touching changes.

## Git

- **`main`:** production; push triggers [deploy workflow](.github/workflows/deploy.yaml).
- **`develop`:** integration branch for features and fixes.
- Branch names: `feature/…` or `fix/…` (see [`CONTRIBUTING.md`](CONTRIBUTING.md)).
- Do not force-push shared branches unless explicitly requested.

## Do not

- Commit secrets (`.env`, credentials).
- Add server-side conversion or uploads (offline-first scope).
- Reorder or remove `rehype-sanitize` in the markdown pipeline.
- Include agent attribution in commit messages (`Co-authored-by: Cursor`, etc.).

## Cursor CLI

- Model: Composer 2.5 standard (`maxMode: false`).
- Headless: `agent -p --force` from repo root with this file in context.
