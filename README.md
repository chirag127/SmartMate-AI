# 📘 SmartMate AI - Your AI-Powered Browser Sidekick

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

SmartMate AI is a multi-browser compatible extension that enhances user productivity and personalization by integrating Cerebras AI for intelligent content generation, summarization, and contextual assistance directly in the browser.

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

## 🛠️ Tech Stack & Architecture

### Client-Side Architecture

SmartMate AI now operates entirely client-side with **no backend required**, providing:
-   **Enhanced Privacy**: All AI processing happens directly between your browser and Cerebras API
-   **Zero Latency**: No intermediate server hops
-   **Simplified Deployment**: Just load the extension and add your API key
-   **Reduced Costs**: No backend hosting required

### Technology Components

-   **Browser Extension**
    -   Manifest V3 for modern browser compatibility
    -   HTML/CSS/JavaScript
    -   WebExtension APIs for cross-browser support (Chrome, Edge, Brave, Firefox)
    -   Popup UI + content script integration
    -   Web Speech API for text-to-speech functionality
    -   Local storage for user preferences and API key management

-   **AI Integration**
    -   **Cerebras API** (direct browser-to-API communication)
    -   Ultra-fast inference powered by Cerebras hardware
    -   Tasks: summarization, paraphrasing, tone adjustment, content generation
    -   Secure API key storage in browser's local storage

## 📋 Requirements

-   Modern web browser (Chrome, Edge, Brave, or Firefox)
-   Cerebras API key ([Get one here](https://cerebras.ai/))
-   Node.js (v18 or higher) - only for development/building

## 🔧 Installation

### 1. Get Your Cerebras API Key

1. Visit [Cerebras Cloud](https://cerebras.ai/) and sign up for an account
2. Navigate to your API dashboard and generate a new API key
3. Keep this key secure - you'll need it in step 3

### 2. Install the Extension

#### Chrome / Edge / Brave

1. Clone or download this repository:
    ```bash
    git clone https://github.com/chirag127/SmartMate-AI.git
    cd SmartMate-AI
    ```

2. Install dependencies and build:
    ```bash
    npm install
    npm run build
    ```

3. Open your browser and navigate to:
    - Chrome: `chrome://extensions/`
    - Edge: `edge://extensions/`
    - Brave: `brave://extensions/`

4. Enable "Developer mode" (toggle in the top-right corner)

5. Click "Load unpacked" and select the `extension` folder from the project

6. The SmartMate AI extension should now be installed and visible in your browser toolbar

#### Firefox

1. Clone or download this repository:
    ```bash
    git clone https://github.com/chirag127/SmartMate-AI.git
    cd SmartMate-AI
    ```

2. Install dependencies and build:
    ```bash
    npm install
    npm run build
    ```

3. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`

4. Click "Load Temporary Add-on..."

5. Navigate to the project directory and select the `extension/manifest.json` file

6. The SmartMate AI extension should now be installed and visible in your browser toolbar

### 3. Configure Your API Key

1. Click the SmartMate AI extension icon in your browser toolbar
2. Navigate to the "Settings" tab
3. Enter your Cerebras API key in the API Key field
4. Click "Save" to store your key securely in the browser

**Note**: Your API key is stored locally in your browser and is never sent to any server except Cerebras API for processing your requests.

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

-   **Cerebras API Key**: Your personal API key for AI processing
-   **Default Tone**: Preferred tone for text processing (formal, casual, professional, friendly)
-   **Default Language**: Language preference for generated content
-   **Theme**: Choose between light, dark, or system theme
-   **Save History**: Toggle prompt history saving

## 📸 Screenshots

![SmartMate AI in action](https://raw.githubusercontent.com/chirag127/SmartMate-AI/main/screenshots/smartmate-demo.png)

## 🔒 Privacy & Security

-   **No Backend**: Your data never passes through our servers
-   **Direct API Communication**: All AI requests go directly from your browser to Cerebras API
-   **Local Storage**: API keys and preferences are stored locally in your browser
-   **No Data Collection**: We don't collect, store, or analyze your usage data
-   **Open Source**: Review our code to verify our privacy commitments

## 🧪 Testing

Run tests with:

```bash
npm test
```

## 🛠️ Development

### Build Extension Icons

```bash
npm run generate-icons
```

### Run Linter

```bash
npm run lint
```

### Build for Production

```bash
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 🙏 Acknowledgements

-   [Cerebras AI](https://cerebras.ai/) for ultra-fast inference capabilities
-   The open-source community for browser extension development tools and best practices

## 📚 Additional Resources

-   [Migration Guide](MIGRATION.md) - For users upgrading from the backend-based version
-   [Privacy Policy](privacy-policy.html)
-   [Contributing Guidelines](CONTRIBUTING.md)
