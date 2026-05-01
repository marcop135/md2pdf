# Changelog

## 2.9.11

- feat(ui): show **`package.json` semver** in the header again (muted **v** tag; hidden on very narrow viewports)

## 2.9.10

- refactor(ui): remove version badge from the header bar (fewer crumbs; semver stays in repo only)
- docs: readme hero PNG replaced with centered window on neutral margin (reads less edge-stretched on wide layouts)

## 2.9.9

- style(ui): bold product name **Markdown to PDF** in the header (toolbar actions stay regular weight)
- copy: default onboarding uses **Markdown to PDF** casing to match the header
- style(ui): default `system-ui, sans-serif`; preview body uses the same stack with emoji fallbacks
- fix(dev): Vite `strictPort` on port 5173; strip strict CSP meta during `vite serve` so HMR is reliable
- chore: `.vscode` task to run the Vite dev server from the editor

## 2.9.8

- style(ui): taller header toolbar, stronger action labels (\`font-weight: 600\`, 15px), larger icons; fix main layout \`calc\` to match bar height

## 2.9.7

- fix(ui): GitHub toolbar control is icon-only and placed after Export
- style(ui): header actions use inherited app font-family and font-weight 500 on labels

## 2.9.6

- feat(ui): GitHub icon in header linking to repository source (`target=_blank`)

## 2.9.5

- refactor(copy): default onboarding uses short intro plus bullet list (easier to read in editor and preview)

## 2.9.4

- feat(copy): default sample uses planned onboarding paragraph (GFM, Mermaid fences, export path)
- style(editor): slightly smaller monospace on screens ≤768px for comfortable wrapping

## 2.9.3

- refactor(copy): clearer default onboarding: short intro plus bullet list (no cramped one-liners)
- style(preview): roomier padding, calmer typography, safer wrapping so content does not clip
- style(editor): slightly looser editor line-height for wrapped paragraphs

## 2.9.2

- feat(copy): tighter default onboarding blurb (GFM, Mermaid fences, `.md` import, export flow)
- fix(copy): repair product name typo in initial editor sample (`Markdown2DPF`)
- chore: patch version bump

## 2.9.1

- fix(mermaid): remove redundant DOMPurify pass that stripped all text labels from diagrams
- fix(ui): set explicit font-weight on header buttons for consistent rendering
- chore: remove `dompurify` dependency (Mermaid strict mode already sanitizes internally)

## 2.9.0

- chore: version bump

## 2.8.0

- feat(ui): bootstrap-icons header + larger monospace editor
- fix(test): make Mermaid tests resilient to mock/jsdom differences
- fix(security): sanitize mermaid SVG with DOMPurify and validate upload extension
- chore: remove stray root files and unused cross-env devDep

## 2.7.5

- feat: `<style>` blocks render, fresh SVG favicon, fast cache invalidation

## 2.7.4

- fix(ci): upload to FTP root instead of /md2pdf.marcopontili.com/

## 2.7.3

- feat(security+ci+repo): rehype-sanitize, PDF watermark, action bumps, untrack dist

## 2.7.2

- feat(privacy): block search engines and AI training crawlers

## 2.7.1

- chore(release): switch deploy trigger to main
- feat(security): add Content-Security-Policy meta tag
