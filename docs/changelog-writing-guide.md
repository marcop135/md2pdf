# Changelog writing guide

Use this guide for entries in `CHANGELOG.md`.

**Sections:** **Added**, **Changed**, **Removed**, **Fixed**, **Security** (omit empty ones).

## Rules

1. **One sentence** per bullet.
2. **Max twenty words** per bullet (count words, not code tokens).
3. **Order sections** within a release: **Added** → **Changed** → **Removed** → **Fixed** → **Security**.
4. End each sentence with **.** , **!** , or **?**
5. Release headings: `## [x.y.z] - YYYY-MM-DD` (ISO date).
6. Use the imperative voice (add, fix, remove), not past tense.

Run `npm run changelog:lint` before committing changelog edits.

## GitHub releases and tags

Keep three surfaces aligned for each version:

| Surface | Format |
| ------- | ------ |
| Git tag | `vX.Y.Z` (annotated tag message: `vX.Y.Z`) |
| GitHub release **name** | `vX.Y.Z` (same as the tag) |
| GitHub release **notes** | Copy that version’s `###` sections and bullets from `CHANGELOG.md` only; **do not** repeat the `## [x.y.z] - YYYY-MM-DD` heading |

Create or edit releases with:

```bash
gh release create vX.Y.Z --title "vX.Y.Z" --notes "$(sed -n '/^## \[X.Y.Z\]/,/^## \[/p' CHANGELOG.md | sed '1d;$d')"
```

(or paste the section bullets manually after linting the changelog entry).
