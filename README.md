# 📘 SmartMate AI - Your AI-Powered Browser Sidekick

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

SmartMate AI is a multi-browser compatible extension that enhances user productivity and personalization by integrating Gemini 2.0 Flash Lite for intelligent content generation, summarization, and contextual assistance directly in the browser.

## 🚀 Live Demo

Visit our [SmartMate AI Website](https://chirag127.github.io/SmartMate-AI/) to learn more about the extension and its features.

## 🚀 Features

-   **Highlight-to-Act**: Select any text → SmartMate popup shows options (Summarize, Rewrite, Expand, etc.)
-   **Tone Tweaker**: Adjust selected content to match a different tone (formal, casual, persuasive)
-   **On-Page Summarizer**: Summarize full articles or sections with one click
-   **Quick Prompts**: Mini text editor with AI assistance for writing (e.g., emails, posts)
-   **Settings Panel**: User settings: preferred tone, language, prompt history
-   **Prompt Presets**: Save custom prompt templates (e.g., "Summarize like a tweet")
-   **Text-to-Speech**: Listen to AI-generated content with adjustable speech rate, voice, and pitch settings, including word-by-word highlighting as text is being read

## 🛠️ Tech Stack

-   **Frontend (Browser Extension)**

    -   Manifest V3
    -   HTML/CSS/JavaScript
    -   WebExtension APIs for cross-browser compatibility
    -   Popup UI + content script integration
    -   Web Speech API for text-to-speech functionality

-   **ML & AI**

    -   Gemini 2.0 Flash Lite (via Google AI JavaScript SDK)
    -   Tasks: summarization, paraphrasing, tone adjustment, etc.

-   **Backend**
    -   Express.js
    -   API endpoints for AI prompt forwarding to Gemini
    -   User settings and tone profiles
    -   MongoDB for storing user preferences and logs

## 📋 Requirements

-   Node.js (v18 or higher)
-   MongoDB (optional, for user data storage)
-   Google AI API key (for Gemini 2.0 Flash Lite)

## 🔧 Installation

### Backend Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/chirag127/SmartMate-AI.git
    cd SmartMate-AI
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the backend directory (copy from `.env.example`):

    ```bash
    cp backend/.env.example backend/.env
    ```

4. Update the `.env` file with your Gemini API key and MongoDB URI (if using MongoDB).

5. Start the backend server:
    ```bash
    npm start
    ```

### Browser Extension Setup

#### Chrome / Edge / Brave

1. Open Chrome/Edge/Brave and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top-right corner)
3. Click "Load unpacked" and select the `extension` folder from the project
4. The SmartMate AI extension should now be installed and visible in your browser toolbar

#### Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on..."
3. Navigate to the project directory and select the `extension/manifest.json` file
4. The SmartMate AI extension should now be installed and visible in your browser toolbar

## 🔍 Usage

1. **Text Selection**: Select any text on a webpage
2. **Access SmartMate**: Either:
    - Click the SmartMate AI icon that appears near your selection
    - Right-click and select SmartMate AI from the context menu
    - Click the extension icon in your browser toolbar
3. **Choose Action**: Select an action (Summarize, Rewrite, Expand, Adjust Tone)
4. **View Result**: The AI-processed text will appear in a modal
5. **Apply or Copy**: Copy the result or replace the selected text directly

## ⚙️ Configuration

Access the extension settings by clicking the extension icon in your browser toolbar and selecting the "Settings" tab. Here you can configure:

-   Default tone for text processing
-   Default language
-   Theme (light/dark/system)
-   API URL (if you're hosting the backend on a different server)
-   Save history preference

## 📸 Screenshots

![SmartMate AI in action](https://raw.githubusercontent.com/chirag127/SmartMate-AI/main/screenshots/smartmate-demo.png)

## 🧪 Testing

Run tests with:

```bash
npm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgements

-   [Google AI JavaScript SDK](https://github.com/google-gemini/generative-ai-js) for Gemini integration
-   [Express.js](https://expressjs.com/) for the backend framework
-   [MongoDB](https://www.mongodb.com/) for database storage
