# Security Policy

## Supported versions

Only the latest published release receives security fixes.

## Reporting a vulnerability

Report vulnerabilities privately through GitHub Security Advisories:
[github.com/marcop135/md2pdf/security/advisories/new](https://github.com/marcop135/md2pdf/security/advisories/new).

Do not open a public issue for security reports.

Expect an acknowledgement within 7 days and a status update within 14 days.

## Scope

The app is client-only: Markdown is rendered and printed in the browser, and no document is sent to a server. Reports that matter most here are ones that break that boundary, for example script execution from untrusted Markdown (the `rehype-raw` -> `rehype-sanitize` pipeline in `src/App/Components/Markdown/Previewer/Preview.js`), service-worker cache poisoning, or a bypass of the `.htaccess` security headers shipped in `public/`.
