# Contributing

Thanks for your interest in **Markdown2PDF**.

## Issues

Bug reports and feature requests are tracked on [GitHub Issues](https://github.com/marcop135/md2pdf/issues). Include steps to reproduce, expected vs actual behavior, and your browser or OS when reporting bugs.

## Pull requests

1. Fork the repo and create a focused branch (`feature/…` or `fix/…`).
2. Match existing code style (formatting, patterns, naming).
3. Run **`npm test`** before pushing; **`npm run build`** should succeed for UI changes when relevant. This project uses **npm** (not yarn); the `packageManager` field and a `preinstall` guard enforce it.
4. Keep commits and the PR description clear; link related issues when applicable.

## Attribution

This project derives from [realdennis/md2pdf](https://github.com/realdennis/md2pdf) (MIT). Respect upstream licensing and preserve copyright notices where you touch substantial upstream-derived files.

## What we are unlikely to merge

- Breaking changes without discussion.
- Dependencies that materially grow the bundle without clear benefit for this offline-first scope.
- Server-side uploads or backends (out of scope for this app).

Questions are welcome via issues before large refactors.
