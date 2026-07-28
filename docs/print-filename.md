# Print filename behavior

This document describes how the app suggests a PDF filename from the first markdown heading.

## User-visible behavior

- The browser tab stays titled **Markdown to PDF** while editing.
- On **Export to .pdf**, Ctrl/Cmd+P, or the browser print menu, the suggested save filename comes from the **first heading** in the markdown (`h1`..`h6`, Setext, or embedded HTML heading).
- If there is no heading, the fallback is **Markdown to PDF**.
- Filesystem-illegal characters in the heading are replaced with spaces before use.

## Browser matrix

| Platform | Primary hint | Notes |
| --- | --- | --- |
| Desktop Chromium / Brave / Edge | `document.title` | Read around print time; may be asynchronous after `print()` |
| Desktop Firefox | `document.title` | [Bug 1664332](https://bugzilla.mozilla.org/show_bug.cgi?id=1664332) |
| Android Brave / Chrome | `document.title` | `window.print()` is non-blocking; title must stay set until save |
| Android Firefox | `document.title` + URL path slug | `beforeprint` is unreliable; Export applies hints synchronously before `print()` |

## Architecture

The Header calls `beginPrintFilenameSession(heading)` from [`src/App/Lib/printFilenameSession.js`](../src/App/Lib/printFilenameSession.js) before `window.print()`.

The session:

1. Sets `document.title` and the `<title>` element to the heading.
2. Installs a `MutationObserver` on `<title>` so React or other code cannot reset the title before the browser reads it (Chromium async read pattern; see [Print.js #724](https://github.com/crabbly/Print.js/pull/724)).
3. Optionally rewrites the URL to `/${slug}` via `toFilenameSlug()` in [`printTitle.js`](../src/App/Lib/printTitle.js) for Firefox Android path-based naming.
4. Restores title and URL on `afterprint`, `window` `focus`, `visibilitychange` (visible), or a 30s safety timeout.

**Never** reset `document.title` or the URL synchronously after `window.print()` on mobile.

Heading text is parsed by `extractHeading()` in [`printTitle.js`](../src/App/Lib/printTitle.js).

## Regression history

| Version | Behavior |
| --- | --- |
| v2.10.3 | Continuous `document.title` sync; worked on mobile but tab showed the heading |
| v2.11.1 | Added URL slug for Firefox Android; slug derived from synced title |
| v2.11.3 | Steady tab title, but synchronous restore after `print()` broke Android saves |
| v2.11.5 | Guarded print session with deferred multi-signal restore |

## Known limitations

- **Cold load before React mounts:** `index.html` carries a long SEO `<title>`; export before hydration may suggest that string instead of a heading.
- **Tab flash during save:** The tab title or URL may briefly show the heading or slug until the session ends.
- **Firefox temp names:** Some builds may still emit `temp*.pdf` if the save dialog opens before hints apply; the Export path sets hints synchronously before `print()` to minimize this.

## Maintainer rules

- Route all print-time title/URL changes through `printFilenameSession.js`.
- Keep the SPA fallback in `public/.htaccess` and `navigateFallback` in `vite.config.js` so throwaway slug URLs still load the app.
- Run `npm test` after changes to `printTitle.js` or `printFilenameSession.js`.
