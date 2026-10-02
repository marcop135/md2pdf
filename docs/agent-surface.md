# Agent surface

Maintainer notes for opening Markdown to PDF to coding agents (v2.13.0+).

## Control contract

After the app mounts, the page exposes `window.md2pdf`:

| Method | Behavior |
| --- | --- |
| `getMarkdown()` | Current editor markdown |
| `setMarkdown(string)` | Replace source (max 2 MB); syncs CodeMirror |
| `prepareExport()` | Double `requestAnimationFrame`, `waitForMermaidRenders`, print filename session |
| `exportPdf()` | `prepareExport` then `window.print()` |

Implementation: [`src/App/Lib/agentBridge.js`](../src/App/Lib/agentBridge.js), registered from [`Header`](../src/App/Components/Header/index.js).

Preferred PDF path for agents: CDP `Page.printToPDF` with `printBackground: true` and `preferCSSPageSize: true` (see `.claude/skills/md2pdf-export/SKILL.md`).

## Discovery URLs

| URL | Role |
| --- | --- |
| `/llms.txt` | When-to-use + control overview |
| `/auth.md` | No auth / no hosted MCP |
| `/for-agents.html` | Portal (aliases: `/docs`, `/developers`, `/api`) |
| `/openapi.json` | Honest OpenAPI for static surfaces only |
| `/.well-known/ard.json` | ARD catalog (twin: `ai-catalog.json`) |
| `/.well-known/agent-skills/index.json` | Skills index |

## Soft-404 and deploy

- Apache: missing `.md` / `.txt` / `.json` and `/.well-known/*` return HTTP 404; other unknown paths still SPA-fallback for print slugs ([`public/.htaccess`](../public/.htaccess)).
- The host is proxied by Cloudflare; Browser Integrity Check, Email Obfuscation, Rocket Loader and AI bot blocking stay off for it so agents and the CSP are unaffected. Each deploy purges the `md2pdf.marcopontili.com` edge cache.
- Deploy SFTP mirror excludes only ACME / cPanel DCV / PKI validation under `.well-known/`, so agent catalogs ship with `dist/`.

## Ora score debt (intentional)

Privacy-first product choices that keep some Ora checks red:

- `robots.txt` still blocks AI training/search crawlers on the app UI
- No REST convert API, hosted MCP, or WebMCP
- SPA shell is JS-rendered (homepage body is not a long static article)

`npm run verify:agent-readiness` checks files and bridge presence locally / against a base URL.
