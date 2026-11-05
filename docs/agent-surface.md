# Agent surface

How a coding agent drives Markdown to PDF, and what maintainers keep in place for it (since v2.13.0).

## Drive the app

There is no hosted API: conversion always runs in the browser.

1. Open [md2pdf.marcopontili.com](https://md2pdf.marcopontili.com) in a browser the agent controls, for example with Playwriter.
2. Call `window.md2pdf.setMarkdown(markdown)`.
3. Get the PDF one of two ways:
   - `window.md2pdf.exportPdf()` opens the print dialog.
   - `window.md2pdf.prepareExport()`, then the Chrome DevTools Protocol `Page.printToPDF` with `printBackground: true` and `preferCSSPageSize: true`, saves a file without a dialog. Agents should use this path.

Entry points for agents: [`/llms.txt`](https://md2pdf.marcopontili.com/llms.txt) and [`/for-agents.html`](https://md2pdf.marcopontili.com/for-agents.html). The export skill is [`.claude/skills/md2pdf-export/SKILL.md`](../.claude/skills/md2pdf-export/SKILL.md), copied byte for byte to [`.agents/skills/md2pdf-export/SKILL.md`](../.agents/skills/md2pdf-export/SKILL.md).

## `window.md2pdf`

Available once the app has mounted. Each method throws until then.

| Method | Behavior |
| --- | --- |
| `getMarkdown()` | Returns the editor text. |
| `setMarkdown(string)` | Replaces the editor text, up to 2 MB of UTF-8. |
| `prepareExport()` | Waits two animation frames and for Mermaid diagrams, then sets the PDF filename from the first heading. |
| `exportPdf()` | Runs `prepareExport()`, then `window.print()`. |

Source: [`src/App/Lib/agentBridge.js`](../src/App/Lib/agentBridge.js), registered from [`src/App/Components/Header/index.js`](../src/App/Components/Header/index.js).

## Discovery files

| Path | Contents |
| --- | --- |
| `/llms.txt` | When to use the app and how to control it |
| `/auth.md` | States that no auth and no hosted MCP exist |
| `/for-agents.html` | Agent portal; `/docs`, `/developers` and `/api` serve the same page |
| `/openapi.json` | OpenAPI description of the static files only |
| `/.well-known/ard.json` | ARD catalog; `/.well-known/ai-catalog.json` holds the same data |
| `/.well-known/agent-skills/index.json` | Skills index |

## Hosting

- [`public/.htaccess`](../public/.htaccess) returns a real HTTP 404 for missing `.md`, `.txt`, `.json` and `/.well-known/*` paths. Other unknown paths still fall back to the app, which the print filename flow needs.
- Cloudflare proxies the host. Browser Integrity Check, Email Obfuscation, Rocket Loader and AI bot blocking stay off, so agents get through and the CSP holds. Each deploy purges the edge cache.
- The deploy mirror skips only the ACME, cPanel DCV and PKI validation files under `.well-known/`, so the agent catalogs ship with `dist/`.

## Known agent-readiness gaps

These privacy choices keep some agent-readiness checks failing on purpose:

- `robots.txt` blocks AI training and search crawlers from the app UI.
- There is no REST conversion API, hosted MCP server or WebMCP.
- The homepage is a JavaScript app shell, not a static article.

## Verify

```bash
npm run verify:agent-readiness
```

Checks the discovery files and the `window.md2pdf` wiring, locally or against a base URL.
