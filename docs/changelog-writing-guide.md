# Changelog writing guide

Use this guide for entries in `CHANGELOG.md`.

**Labels:** **Build**, **Chore**, **CI**, **Docs**, **Enhance**, **Feat**, **Fix**, **Perf**, **Revert**, **Sec**, **Style**; add **(WIP)** only for incomplete work.

## Rules

1. **One sentence** per bullet after the label.
2. **Max twenty words** in that sentence (count words, not code tokens).
3. **Order bullets** within a release: **Feat**, **Enhance**, **Fix**, **Sec**, **Perf**, **Style**, **Docs**, **Build**, **CI**, **Chore**, **Revert**.
4. End each sentence with **.** , **!** , or **?**
5. Release headings: `## [x.y.z] - YYYY-MM-DD` (ISO date).

Run `npm run changelog:lint` before committing changelog edits.
