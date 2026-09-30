---
name: md2pdf-export
description: Drive Markdown to PDF (md2pdf.marcopontili.com or local :5173) with Playwriter. Set markdown via window.md2pdf, wait for preview, export PDF with CDP printToPDF. Use when converting Markdown to PDF through the live app.
---

# md2pdf-export

Browser-only Markdown → PDF at https://md2pdf.marcopontili.com (or `http://127.0.0.1:5173` in development).

Read `/llms.txt` and `/for-agents.html` on the target origin for the live contract.

## Prerequisites

- Playwriter attached to Chrome (extension mode preferred).
- Prefer the **Playwriter CLI** (`playwriter -s <id> -e "..."`).

## Procedure

1. Open the app and wait for the bridge:

```bash
playwriter -s 1 -e "await page.goto('https://md2pdf.marcopontili.com/'); await page.waitForFunction(() => window.md2pdf && typeof window.md2pdf.setMarkdown === 'function');"
```

2. Load markdown (string, max 2 MB). Prefer `setMarkdown` over typing into CodeMirror:

```bash
playwriter -s 1 -e "const md = state.markdown; console.log(await page.evaluate((m) => window.md2pdf.setMarkdown(m), md));"
```

Put the document on `state.markdown` in a prior step, or pass a literal string into `evaluate`.

3. Wait for preview readiness:

```bash
playwriter -s 1 -e "console.log(await page.evaluate(() => window.md2pdf.prepareExport()));"
```

4. Export PDF with CDP (preferred):

```bash
playwriter -s 1 -e "const cdp = await getCDPSession({ page }); const { data } = await cdp.send('Page.printToPDF', { printBackground: true, preferCSSPageSize: true }); const fs = await import('fs'); const out = '/tmp/md2pdf-export.pdf'; fs.writeFileSync(out, Buffer.from(data, 'base64')); console.log(out);"
```

Write under an allowed Playwriter path (session temp / workspace). Move the file with the shell if the user needs it elsewhere.

5. Fallback: system print dialog:

```bash
playwriter -s 1 -e "await page.evaluate(() => window.md2pdf.exportPdf());"
```

Or click `getByRole('button', { name: 'Export to .pdf' })`.

## API

| Method | Role |
| --- | --- |
| `getMarkdown()` | Current editor source |
| `setMarkdown(string)` | Replace source (controlled CodeMirror) |
| `prepareExport()` | Deferred preview settle + Mermaid + filename session |
| `exportPdf()` | `prepareExport` then `window.print()` |

## Notes

- No hosted MCP; no upload API.
- Import also accepts `.md` via `#mdFile` (same 2 MB cap).
- Keep discovery pages (`/llms.txt`, `/auth.md`) in mind when explaining the product to users.
