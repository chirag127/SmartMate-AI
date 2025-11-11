# Agent Instructions for SmartMate AI

## Commands

**Setup**: `npm install`  
**Build**: `npm run build`  
**Lint**: `npm run lint`  
**Test**: `npm test`

## Tech Stack & Architecture

- **Frontend**: Manifest V3 browser extension (HTML/CSS/JS), WebExtension APIs, Web Speech API
- **AI**: Cerebras API for ultra-fast inference (direct browser-to-API communication)
- **Structure**: `/extension` (popup, background, content scripts), `/scripts` (build tools)
- **Storage**: Browser local storage for settings and API key management

## Code Style

- **Linting**: ESLint (2-space indent, single quotes, semicolons required)
- **Conventions**: Follow ESLint config, write clear commit messages, test new features
