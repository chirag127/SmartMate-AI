

## 📝 Product Requirements Document (PRD)

### 📌 Project Name: **SmartMate AI – Your AI-Powered Browser Sidekick**

---

### 🧠 1. Overview

**SmartMate AI** is a multi-browser compatible extension that enhances user productivity and personalization by integrating Gemini 2.0 Flash Lite for intelligent content generation, summarization, and contextual assistance directly in the browser. It serves as an AI companion that works seamlessly across websites.

---

### 🎯 2. Goals

- Provide AI-powered contextual content generation (summaries, rewrites, expansions) directly within the browser.
- Enable support across Chrome, Edge, Firefox, Safari, and other major browsers.
- Allow users to interact with AI via a non-intrusive, fast UI embedded in web pages.
- Offer voice, tone, and format customization options for generated content.
- Store minimal user data locally or securely in the backend.

---

### 🛠️ 3. Tech Stack

- **Frontend (Browser Extension)**
  - Manifest V3
  - HTML/CSS/JavaScript
  - WebExtension APIs for cross-browser compatibility
  - Popup UI + content script integration

- **ML & AI**
  - Gemini 2.0 Flash Lite (via OpenRouter API or hosted endpoint)
  - Tasks: summarization, paraphrasing, tone adjustment, etc.

- **Backend**
  - Express.js
  - API endpoints for:
    - AI prompt forwarding to Gemini
    - User settings and tone profiles
  - Optional: MongoDB for storing user preferences and logs

- **Project Structure**
  ```
  /extension/
    ├── manifest.json
    ├── popup.html / popup.js / popup.css
    ├── content.js
    ├── background.js
    └── icons/
  /backend/
    ├── server.js
    ├── routes/
    ├── controllers/
    └── utils/
  ```

---

### ⚙️ 4. Features

#### Core Features:
| Feature | Description |
|--------|-------------|
| 🔍 **Highlight-to-Act** | Select any text → SmartMate popup shows options (Summarize, Rewrite, Expand, etc.) |
| ✍️ **Tone Tweaker** | Adjust selected content to match a different tone (formal, casual, persuasive) |
| 📄 **On-Page Summarizer** | Summarize full articles or sections with one click |
| 🧠 **Quick Prompts** | Mini text editor with AI assistance for writing (e.g., emails, posts) |
| ⚙️ **Settings Panel** | User settings: preferred tone, language, prompt history |

#### Bonus (Optional):
| Feature | Description |
|--------|-------------|
| 🗂️ **Prompt Presets** | Save custom prompt templates (e.g., “Summarize like a tweet”) |
| 🧑‍🎤 **Persona Mode** | AI responses as a persona (e.g., Shakespeare, Tech Blogger) |
| 📚 **Context Memory** | Recent site-specific prompt history for continuity |

---

### 👥 5. Target Audience

- Professionals looking to streamline writing
- Students summarizing articles or papers
- Content creators needing quick rewrites
- Anyone who browses and wants smart in-page AI help

---

### ✅ 6. Requirements

#### Functional Requirements:
- Browser extension must detect selected text
- Provide contextual menu on selection
- Communicate with backend API
- Display response in a styled popup
- Work across major browsers (Chrome, Firefox, Edge, Safari)

#### Non-Functional Requirements:
- Fast response time (<2s for AI)
- Lightweight (minimal resource usage)
- Secure communication with backend (HTTPS)
- Adherence to privacy best practices (no unauthorized data collection)

---

### 📦 7. Deliverables

- Fully functional browser extension in `/extension/`
- Express.js backend with AI routing in `/backend/`
- Documentation:
  - Setup Guide
  - Deployment Guide
  - API Reference

---

### 📆 8. Milestones & Timeline

| Week | Milestone |
|------|-----------|
| 1    | Project setup, manifest + basic popup |
| 2    | Highlight-to-Act + content script |
| 3    | Backend API + Gemini integration |
| 4    | Core AI features implemented |
| 5    | UI polishing + settings panel |
| 6    | Cross-browser testing (Safari, Firefox) |
| 7    | Bug fixes, final testing |
| 8    | Launch & feedback loop |

what the user prefers that you do not wait for the user to confirm the detailed plan. My github username is chirag127. Use the web search if any help is needed in the implementation of this software. Also use the sequential thinking mcp server extensively wherever possible. implement everything from a to z, don't leave anything for future development. follow best practices for coding. Use the latest version of all libraries and frameworks. if you tried to call a tool, but provided too large of an input, You would proceed by calling the tool again the input into smaller parts and calling the tool multiple times. You would then combine the results of each call into a single response. You would also ensure that the final output is coherent and logical, even if it means rephrasing or restructuring the information. You would not ask for user confirmation before proceeding with this approach.



### **AI Coding Agent Execution Guidelines**

#### **General Principles**
1. **Autonomous Execution**:
   - Do **not** wait for user confirmation before proceeding with planning or implementation.
   - Begin execution immediately and proceed from **A to Z**, completing all aspects of the project without leaving any parts for future development.

2. **Code Quality & Best Practices**:
   - Follow **industry-standard coding best practices** (e.g., clean code, modularity, proper error handling, reusable components, security, scalability).
   - Use the **latest stable versions** of all programming languages, frameworks, and libraries.
   - Structure code and files according to modern conventions (e.g., proper naming, separation of concerns, environment configuration).

3. **GitHub Integration**:
   - User’s GitHub username: `chirag127`. Use this identity when initializing or configuring repos or pushing code.

#### **Research & Resources**
4. **Web Search**:
   - Use **web search autonomously** whenever needed to resolve implementation details, debug issues, or understand library updates or documentation.

5. **Tool Usage & Limits**:
   - When invoking tools (e.g., file processors, summarizers, code generators), if the input exceeds tool limitations:
     - **Split the input** into smaller parts.
     - **Invoke the tool multiple times** with each part.
     - **Aggregate the results** into a single, coherent output.
     - If needed, **restructure or rephrase** combined results for logic, readability, and consistency.

#### **Thinking & Strategy**
6. **Sequential Reasoning MCP Server**:
   - Utilize **sequential thinking MCP server** extensively for:
     - Step-by-step planning
     - Breaking down complex workflows
     - Dependency resolution
     - Optimal implementation ordering

7. **No Future TODOs**:
   - Do **not** defer tasks or add future "TODO" notes.
   - Every deliverable should be **fully implemented, functional, and production-ready**.

8. **Documentation**:
   - Provide **comprehensive documentation** for all code, including:
     - Code comments
     - README files
     - API documentation (if applicable)
   - Ensure documentation is clear, concise, and easy to follow.

9. **Hyperbrowser**:
   - Use **Hyperbrowser** for all web-related tasks, including:
     - Web scraping
     - Data extraction
     - API interactions

   - Ensure compliance with web scraping best practices and respect robots.txt.
10. **firecrawler**:
    - Use **firecrawler** for all web crawling tasks, including:
      - Data extraction
      - API interactions
    - Ensure compliance with web crawling best practices and respect robots.txt.
11. **Code Review**:
    - Perform **self-code reviews** before finalizing any code.
    - Ensure code is clean, efficient, and adheres to best practices.
12. **Testing**:
    - Implement **unit tests** and **integration tests** for all code.
    - Ensure all tests pass before finalizing any code.
    - Use modern testing frameworks and libraries.