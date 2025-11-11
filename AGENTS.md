# Agent Guide

## Commands

**Setup**: `npm install`

**Build**: `npm run build`

**Lint**: `npm run lint`

**Test**: `npm test`

**Dev Server**: `npm run dev`

## Tech Stack

- **Extension**: Manifest V3, HTML/CSS/JS, WebExtension APIs, Web Speech API, Gemini 2.0 Flash Lite via Google AI SDK (direct browser-to-API communication)
- **Backend**: Express.js, MongoDB (optional), Gemini 2.0 Flash Lite via Google AI SDK
- **Testing**: Jest, Supertest
- **Storage**: chrome.storage.sync for cross-device synchronization

## Structure

- `extension/`: Browser extension (popup, content scripts, background, manifest)
- `backend/`: Express server (routes, controllers, models, middleware, utils)
- `scripts/`: Build scripts (e.g., icon generation)

## Style

- 2-space indentation, single quotes, semicolons (enforced by ESLint)
- ES2021 syntax, Unix line endings
