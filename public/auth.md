# Authentication

Markdown to PDF does **not** require authentication.

- No user accounts
- No API keys
- No OAuth or OpenID Connect
- No hosted MCP server

The product is a client-only Progressive Web App. Markdown stays in the browser session. Agents drive the live UI with Playwriter and `window.md2pdf` (see `/llms.txt` and `/for-agents.html`).

There is no remote conversion endpoint to authorize.
