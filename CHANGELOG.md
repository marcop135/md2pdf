# Changelog

## 2.9.4

- feat(copy): default sample uses planned onboarding paragraph—GFM, Mermaid fences, export path
- style(editor): slightly smaller monospace on screens ≤768px for comfortable wrapping

## 2.9.3

- refactor(copy): clearer default onboarding—short intro plus bullet list (no cramped one-liners)
- style(preview): roomier padding, calmer typography, safer wrapping so content does not clip
- style(editor): slightly looser editor line-height for wrapped paragraphs

## 2.9.2

- feat(copy): tighter default onboarding blurb—GFM, Mermaid fences, `.md` import, export flow
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
