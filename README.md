# Harrold - SAML Roles from HAR File

A client-side tool for inspecting SAML responses captured in HAR network traces. Works with any SAML identity provider — Keycloak, ADFS, Okta, Azure AD, Shibboleth, and others.

> This project was generated with [Claude](https://claude.ai) (Anthropic).

## What it does

When a tester exports a HAR file from browser DevTools during a SAML login, this tool:

1. Finds every POST request containing a `SAMLResponse` parameter
2. Decodes and parses the SAML XML
3. Displays the role claims and all other attributes in a readable format
4. Shows the full formatted XML for inspection

No data leaves the browser — everything is processed locally.

## Usage

Open the app and drop a HAR file onto the upload area (or click to browse). The tool will find SAML responses automatically.

If the HAR contains multiple SAML responses, you will be prompted to pick one.

**To export a HAR file from Chrome/Edge:**
1. Open DevTools → Network tab
2. Reproduce the login flow
3. Right-click any request → Save all as HAR with content

## Running locally

```bash
npm install
npm run dev
```

## Deploying to GitHub Pages

```bash
npm run deploy
```

Requires the `gh-pages` branch to exist and GitHub Pages to be configured to serve from it in the repository settings.

## Tech stack

- React + TypeScript + Vite
- No backend — runs entirely in the browser
