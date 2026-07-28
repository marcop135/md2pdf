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

## GitHub releases and tags

Keep three surfaces aligned for each version:

| Surface | Format |
| ------- | ------ |
| Git tag | `vX.Y.Z` (annotated tag message: `vX.Y.Z`) |
| GitHub release **name** | `vX.Y.Z` (same as the tag) |
| GitHub release **notes** | Copy the release bullets from `CHANGELOG.md` only; **do not** repeat the `## [x.y.z] - YYYY-MM-DD` heading |

Example for 2.11.5: the release at `releases/tag/v2.11.5` lists the three changelog bullets under the title `v2.11.5`, with no date heading in the notes body.

Create or edit releases with:

```bash
gh release create vX.Y.Z --title "vX.Y.Z" --notes "$(sed -n '/^## \[X.Y.Z\]/,/^## \[/p' CHANGELOG.md | sed '1d;$d')"
```

(or paste the bullets manually after linting the changelog entry).
