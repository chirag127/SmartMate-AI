# Agent Instructions for SmartMate AI

## Commands

**Initial Setup:**
```bash
npm install
cp backend/.env.example backend/.env  # Edit with your API keys
```

**Build:** `npm run build`  
**Lint:** `npm run lint`  
**Test:** `npm test`  
**Dev Server:** `npm run dev`

## Tech Stack & Architecture

- **Frontend:** Manifest V3 browser extension (HTML/CSS/JS), WebExtension APIs, Web Speech API
- **Backend:** Express.js, MongoDB (optional), Gemini 2.0 Flash Lite via Google AI SDK (direct browser-to-API communication)
- **Testing:** Jest, Supertest
- **Storage:** chrome.storage.sync for cross-device synchronization
- **Structure:** `/backend` (server, API routes, models, middleware, utils), `/extension` (popup, content scripts, background, manifest), `/scripts` (build tools)

## Code Style

- **ESLint:** 2-space indent, single quotes, semicolons required, unix line breaks
- ES2021 syntax
- Follow existing patterns in neighboring files
- No comments unless complex logic requires explanation
