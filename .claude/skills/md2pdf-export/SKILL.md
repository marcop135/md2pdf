---
name: md2pdf-export
description: Export local Markdown, an open draft, or a .mmd body, saved as a PDF named from the first heading.
---

# md2pdf-export

Browser-only Markdown to PDF at https://md2pdf.marcopontili.com (or `http://127.0.0.1:5173` in development).

Read `/llms.txt` and `/for-agents.html` on the target origin for the live contract.

Print CSS forces a white page and a light Mermaid copy. Do not change the app theme.

## Prerequisites

- Playwriter attached to Chrome (extension mode preferred).
- Prefer the Playwriter CLI (`playwriter -s <id> -e "..."`). Use `-f` for the fence step: backticks and dollar signs break inline `-e`.
- `state` persists across calls on the same session. Create the session in the directory that should receive the PDF, or write under `os.tmpdir()` and move the file afterwards.

## Procedure

1. Open the app and wait for the bridge:

```bash
playwriter -s SESSION_ID --timeout 30000 -e "await page.goto('http://127.0.0.1:5173/'); await page.waitForFunction(() => window.md2pdf && typeof window.md2pdf.setMarkdown === 'function');"
```

Use `https://md2pdf.marcopontili.com/` when the document is not on the local server.

2. Load one document. Pick the first case that applies.

Open draft (the document already in the tab). Read it and do not call `setMarkdown`:

```bash
playwriter -s SESSION_ID --timeout 30000 -e "state.markdown = await page.evaluate(() => window.md2pdf.getMarkdown()); console.log(state.markdown.length);"
```

Local file. Set `state.sourcePath` and run the block below. Stop when the file is over 2 MB. A `.md` file is stored as-is. A `.mmd` file is stripped of a leading BOM, CRLF is turned into LF, and the body is wrapped in one `mermaid` fence: at least three backticks, and one longer than any backtick run in the body. A `.mmd` file that is already a single `mermaid` fence is kept as that text.

```javascript
const fs = await import('node:fs');
const buf = fs.readFileSync(state.sourcePath);
if (buf.length > 2 * 1024 * 1024) throw new Error('markdown exceeds the 2MB limit');
let body = buf.toString('utf8');
if (state.sourcePath.toLowerCase().endsWith('.mmd')) {
  body = body.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = body.split('\n');
  const trimmed = lines[lines.length - 1] === '' ? lines.slice(0, -1) : lines;
  const open = trimmed[0] && trimmed[0].match(/^(`{3,})mermaid[ \t]*$/);
  const closeRe = open && new RegExp('^`{' + open[1].length + ',}[ \\t]*$');
  let single = false;
  if (closeRe && trimmed.length >= 2 && closeRe.test(trimmed[trimmed.length - 1])) {
    single = true;
    for (let i = 1; i < trimmed.length - 1; i += 1) {
      if (closeRe.test(trimmed[i])) single = false;
    }
  }
  if (!single) {
    let max = 0;
    for (const run of body.matchAll(/`+/g)) max = Math.max(max, run[0].length);
    const fence = '`'.repeat(Math.max(3, max + 1));
    if (!body.endsWith('\n')) body += '\n';
    body = fence + 'mermaid\n' + body + fence + '\n';
  }
}
state.markdown = body;
console.log(state.markdown.length);
```

Then replace the editor, unless this pass is the open draft. Stop when `setMarkdown` throws, including `markdown exceeds the 2MB limit`. Do not print.

```bash
playwriter -s SESSION_ID --timeout 30000 -e "console.log(await page.evaluate((m) => window.md2pdf.setMarkdown(m), state.markdown));"
```

3. Settle the preview and read the PDF name in the same `page.evaluate` as `prepareExport`. A later focus change, a visible `visibilitychange`, or the 30s timer restores the title `Markdown to PDF`, so do not read `document.title` again.

```bash
playwriter -s SESSION_ID --timeout 30000 -e "state.export = await page.evaluate(async () => { await window.md2pdf.prepareExport(); return { title: document.title, failed: document.querySelectorAll('pre code.language-mermaid').length, loading: document.querySelectorAll('.mermaid-loading').length }; }); console.log(JSON.stringify(state.export));"
```

`failed` counts `pre code.language-mermaid` (a diagram that did not render). `loading` counts `.mermaid-loading`. Ignore the SVG count. If either count is above zero, run this evaluate once more. If either count is still above zero, stop before print and report both counts.

4. Write the PDF. `printToPDF` is the next call after the evaluate that returned the title. `Markdown to PDF` means there was no heading: use `md2pdf-export.pdf`. Any other title is already safe as a basename.

```javascript
const fs = await import('node:fs');
const path = await import('node:path');
const os = await import('node:os');
const cdp = await getCDPSession({ page });
const { data } = await cdp.send('Page.printToPDF', {
  printBackground: true,
  preferCSSPageSize: true,
});
const base = state.export.title === 'Markdown to PDF' ? 'md2pdf-export' : state.export.title;
const out = path.join(os.tmpdir(), base + '.pdf');
fs.writeFileSync(out, Buffer.from(data, 'base64'));
console.log(out);
```

The calling agent moves the file when the user names a destination.

5. Several files: repeat steps 2–4 for each file. One combined `prepareExport` evaluate and one `printToPDF` per file.

6. Fallback when CDP print is unavailable: the system print dialog. This step does not return the heading to the caller.

```bash
playwriter -s SESSION_ID --timeout 30000 -e "await page.evaluate(() => window.md2pdf.exportPdf());"
```

Or click `getByRole('button', { name: 'Export to .pdf' })`.

## API

| Method | Role |
| --- | --- |
| `getMarkdown()` | Current editor source |
| `setMarkdown(string)` | Replace source (controlled CodeMirror). Throws over 2 MB. |
| `prepareExport()` | Deferred preview settle, Mermaid wait, then the print filename |
| `exportPdf()` | `prepareExport` then `window.print()` |

## Notes

- No hosted MCP and no upload API.
- Keep discovery pages (`/llms.txt`, `/auth.md`) in mind when explaining the product to users.
