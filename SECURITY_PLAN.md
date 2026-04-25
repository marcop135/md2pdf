# Security plan for md2pdf.marcopontili.com

This is a **draft plan**, not implemented yet. The goal is to harden the public site against bad actors abusing it for XSS, content laundering, or social-engineering vectors. The app is purely client-side (no server, no auth, no DB), so the threat model is narrower than a typical webapp — but not empty.

## Threat model

The app accepts arbitrary markdown from the user and renders it client-side. There are three realistic abuse vectors:

1. **Stored / reflected XSS via shared markdown** — if a future feature lets users share a URL that contains markdown content (?source= param, gist import, etc.), a malicious `<script>` or `onerror=` attribute injected via [rehype-raw](https://github.com/rehypejs/rehype-raw) executes in the victim's browser. Currently the editor only ingests local input, so this is latent — but the `rehype-raw` plumbing means the *capability* to render raw HTML exists today.
2. **Phishing / brand-impersonation pages exported as PDF** — bad actors paste markdown that mimics a bank statement, government letter, etc., export to PDF, and share it. The site's URL appearing in the document footer (or in metadata) lends false authenticity. Mitigation: PDF metadata + visible watermark.
3. **Supply-chain via vulnerable transitive deps** — the Dependabot alerts (DOMPurify <3.4.0, postcss <8.5.10, uuid <14.0.0, vite <8.0.5) are real. DOMPurify in particular is the sanitizer mermaid uses for SVG output; a bypass = XSS via a crafted mermaid block. This is the highest-priority concrete risk.

What's **out of scope**:
- No login → no credential theft / session hijacking
- No backend → no SQL/SSRF/RCE
- No PII storage → no data exfiltration via the app itself
- The exported PDF runs in the user's PDF viewer, not in our origin → cross-origin escape from the PDF is the viewer's problem, not ours

## Layered hardening

### Layer 1 — patch known CVEs (do now, this PR)
- Bump `vite` to `^8.0.10` (fixes 3 dev-server CVEs — only affects developers, but free win)
- Add yarn `resolutions`:
  - `dompurify: ^3.4.0` — fixes 4 RCE/XSS bypasses; mermaid 11 declares `^3.3.1`, so 3.4.x satisfies semver
  - `postcss: ^8.5.10` — fixes the `</style>` stringify XSS; styled-components depends on `^8.x`, compatible
  - **Skip uuid for now**: the alert is for `uuid <14.0.0`, but mermaid pins `^11.1.0` and the bug is in the v3/v5/v6 buf-bounds path, which mermaid doesn't use (it uses v4). Force-bumping to v14 is a major version jump and risks breaking mermaid for an unexploitable code path. Document the deferral in the PR.

Verify by running `yarn audit --level moderate` and confirming the four fixed alerts disappear.

### Layer 2 — Content Security Policy (next PR)
Add a meta CSP in [index.html](index.html). Strict because the app is fully self-contained:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'wasm-unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'none';
  object-src 'none';
">
```

Notes:
- `'unsafe-inline'` for `style-src` is required by styled-components and react-markdown's inline-style codepaths. Acceptable: style injections can't run JS.
- `'wasm-unsafe-eval'` is needed by Vite's rolldown WASM binding in production (used by the build, not runtime — verify before shipping).
- `img-src https:` allows users to embed remote images in their markdown (a common need for a CV/document tool).
- `connect-src 'self'` blocks any future leak via `fetch()` to a third-party.
- `frame-ancestors 'none'` blocks clickjacking from being framed by attacker pages.

A real CSP via HTTP header is stronger than `<meta>`, but FTP hosting can't always set headers. If the FTP host allows `.htaccess`, add the same policy there as well — `.htaccess` already exists in the deploy artifacts for cache control, so adding `Header set Content-Security-Policy` is one line.

### Layer 3 — sanitize user-rendered HTML (next PR)
The `Preview.js` chain is `react-markdown → remark-gfm → rehype-raw`. `rehype-raw` lets any HTML through verbatim. Add `rehype-sanitize` after `rehype-raw` with a permissive-but-safe schema (allow tables, images, basic formatting; strip `<script>`, `on*` attributes, `javascript:` URLs):

```js
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes.a || []), 'target'],
    img: ['src', 'alt', 'title', 'width', 'height', 'style'],
    table: ['style'], tr: ['style'], td: ['style', 'colspan', 'rowspan'], th: ['style', 'colspan', 'rowspan'],
  },
  protocols: { ...defaultSchema.protocols, href: ['http', 'https', 'mailto', 'tel'] },
};
```

Caveat: this slightly tightens the existing CV-rendering use case (the embedded HTML in [Preview.test.js:52](src/App/Components/Markdown/Previewer/Preview.test.js)). The existing tests give us a regression net.

### Layer 4 — PDF watermark / attribution (next PR)
Add a small footer to the printed output (only visible in `@media print`):

```css
@media print {
  body::after {
    content: "Generated with md2pdf.marcopontili.com — verify authenticity";
    position: fixed; bottom: 4px; left: 0; right: 0;
    text-align: center; font: 10px/1 sans-serif; color: #999;
  }
}
```

Bad actors will strip it, but it raises the bar for casual phishing and gives recipients a verification cue. Pair with a `<meta name="generator">` so PDF metadata also shows the source.

### Layer 5 — robots / abuse posture (small ops items)
- Already done: `<meta name="robots" content="noindex, nofollow">` in [Header/index.js:28](src/App/Components/Header/index.js)
- Add a `/.well-known/security.txt` to the deploy with a contact email so researchers can report issues
- Add a public `SECURITY.md` in the repo with the same email + the threat model summary (lets researchers know what's in scope)

### Layer 6 — Subresource integrity for any future CDN scripts
Currently the app loads zero third-party scripts at runtime. Document this as a hard rule in `CONTRIBUTING.md`: any new `<script src="https://cdn...">` must include a `integrity=` and `crossorigin=` attribute. If the rule's documented now, future PRs that violate it stand out in review.

## Order of operations

| When | What | Why |
|---|---|---|
| **This PR (chore/security-deps)** | Layer 1 patches | Closes the actual open Dependabot alerts |
| Next PR | Layer 2 CSP + Layer 5 security.txt | Cheap, big risk reduction, no behavior change |
| Next PR | Layer 3 sanitization + tests | Behavior-affecting; needs careful verification of the CV use case |
| Later | Layer 4 watermark | Polish; adds value but not security-critical |

## Verification

For each layer, the verification steps:
1. **Layer 1**: `yarn audit --level moderate` shows zero results, all four GitHub alerts auto-close after the merge
2. **Layer 2**: Open DevTools → Security tab → confirm CSP active; try pasting `<script>alert(1)</script>` in editor → blocked, console shows CSP violation
3. **Layer 3**: paste known-malicious test vectors (e.g. `<img src=x onerror=alert(1)>`) → renders as `<img>` only (no `onerror`)
4. **Layer 4**: print preview the page, confirm watermark visible at bottom of every page
