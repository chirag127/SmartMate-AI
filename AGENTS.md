# AGENTS.md - SmartMate AI Developer Guide

## Commands

**Setup:** `npm install` (creates node_modules/)
**Build:** `npm run build` (generates icons)
**Lint:** `npm run lint`
**Test:** `npm test`
**Dev Server:** `npm run dev` (starts nodemon backend server)

## Tech Stack

- **Extension:** Manifest V3, HTML/CSS/JS, WebExtension APIs, Web Speech API
- **Backend:** Express.js, MongoDB, Gemini 2.0 Flash Lite via Google AI SDK
- **Testing:** Jest, Supertest

## Architecture

- `extension/` - Browser extension (popup, content scripts, background, icons)
- `backend/` - Express API server (routes, controllers, models, middleware)
- `scripts/` - Build scripts (icon generation)

## Code Style

- 2-space indentation, single quotes, semicolons (enforced by ESLint)
- Unix line endings
- ES2021+ syntax
- Minimal console logging in production code
