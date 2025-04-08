// SmartMate AI Content Script

// State
let selectedText = "";
let fab = null;
let menu = null;
let modal = null;
let settings = {
    apiUrl: "http://localhost:3000/api",
    defaultTone: "neutral",
    tts: {
        rate: 1.0,
        pitch: 1.0,
        voice: "default",
    },
};

// Speech synthesis variables
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;

// Initialize
(function () {
    // Load settings
    chrome.storage.local.get(["settings"], function (result) {
        if (result.settings) {
            settings = JSON.parse(result.settings);
        }
    });

    // Listen for text selection
    document.addEventListener("mouseup", handleTextSelection);

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener(handleMessage);

    // Initialize speech synthesis
    if ("speechSynthesis" in window) {
        // Preload voices
        speechSynthesis.getVoices();
    }
})();

// Handle text selection
function handleTextSelection(event) {
    // Get selected text
    const selection = window.getSelection();
    selectedText = selection.toString().trim();

    // If text is selected, show FAB
    if (selectedText.length > 0) {
        showFab(event);
    } else {
        hideFab();
    }
}

// Show floating action button
function showFab(event) {
    // Remove existing FAB if any
    hideFab();

    // Create FAB
    fab = document.createElement("div");
    fab.className = "smartmate-fab";
    fab.innerHTML = `
    <svg class="smartmate-fab-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
    </svg>
  `;

    // Position FAB near the mouse
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    fab.style.left = `${rect.right + window.scrollX}px`;
    fab.style.top = `${rect.top + window.scrollY}px`;

    // Add click event listener
    fab.addEventListener("click", showMenu);

    // Add FAB to the page
    document.body.appendChild(fab);

    // Auto-hide FAB after 5 seconds
    setTimeout(() => {
        if (fab && document.body.contains(fab)) {
            hideFab();
        }
    }, 5000);
}

// Hide floating action button
function hideFab() {
    if (fab && document.body.contains(fab)) {
        document.body.removeChild(fab);
        fab = null;
    }
}

// Show menu
function showMenu(event) {
    // Prevent default action
    event.stopPropagation();

    // Remove existing menu if any
    hideMenu();

    // Create menu
    menu = document.createElement("div");
    menu.className = "smartmate-menu";
    menu.innerHTML = `
    <div class="smartmate-menu-item" data-action="summarize">
      <svg class="smartmate-menu-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"/>
      </svg>
      Summarize
    </div>
    <div class="smartmate-menu-item" data-action="rewrite">
      <svg class="smartmate-menu-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      </svg>
      Rewrite
    </div>
    <div class="smartmate-menu-item" data-action="expand">
      <svg class="smartmate-menu-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M4 20h16v-2H4v2zm0-4h16v-2H4v2zm0-4h16v-2H4v2zm0-4h16V6H4v2zm0-4h16V2H4v2z"/>
      </svg>
      Expand
    </div>
    <div class="smartmate-menu-item" data-action="tone">
      <svg class="smartmate-menu-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-1.46-5.47L8.41 11.4l-2.83 2.83 1.41 1.41L8.41 14.22l2.12 2.12 1.41-1.41L9.83 12.83l2.12-2.12-1.41-1.41-2.12 2.12-1.41-1.41 2.83-2.83-1.41-1.41-2.83 2.83L7.59 9.17l2.12-2.12-1.41-1.41L6.17 7.76l-1.41 1.41 2.83 2.83 1.41-1.41-2.12-2.12 1.41-1.41 1.41 1.41-2.12 2.12 2.12 2.12 1.41-1.41z"/>
      </svg>
      Adjust Tone
    </div>
  `;

    // Position menu near the FAB
    const fabRect = fab.getBoundingClientRect();
    menu.style.left = `${fabRect.left + window.scrollX}px`;
    menu.style.top = `${fabRect.bottom + window.scrollY + 5}px`;

    // Add click event listeners to menu items
    menu.querySelectorAll(".smartmate-menu-item").forEach((item) => {
        item.addEventListener("click", handleMenuItemClick);
    });

    // Add menu to the page
    document.body.appendChild(menu);

    // Add click event listener to document to hide menu when clicking outside
    setTimeout(() => {
        document.addEventListener("click", hideMenu);
    }, 0);
}

// Hide menu
function hideMenu(event) {
    if (event) {
        event.stopPropagation();
    }

    if (menu && document.body.contains(menu)) {
        document.body.removeChild(menu);
        menu = null;
    }

    document.removeEventListener("click", hideMenu);
}

// Handle menu item click
function handleMenuItemClick(event) {
    event.stopPropagation();

    const action = event.currentTarget.dataset.action;

    if (action === "tone") {
        showToneSelector();
    } else {
        processText(action);
    }

    hideMenu();
    hideFab();
}

// Show tone selector
function showToneSelector() {
    // Create modal
    modal = document.createElement("div");
    modal.className = "smartmate-modal";
    modal.innerHTML = `
    <div class="smartmate-modal-content">
      <div class="smartmate-modal-header">
        <div class="smartmate-modal-title">Select Tone</div>
        <button class="smartmate-modal-close">
          <svg class="smartmate-modal-close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      <div class="smartmate-modal-body">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <button class="smartmate-btn smartmate-btn-secondary tone-btn" data-tone="formal">Formal</button>
          <button class="smartmate-btn smartmate-btn-secondary tone-btn" data-tone="casual">Casual</button>
          <button class="smartmate-btn smartmate-btn-secondary tone-btn" data-tone="professional">Professional</button>
          <button class="smartmate-btn smartmate-btn-secondary tone-btn" data-tone="friendly">Friendly</button>
          <button class="smartmate-btn smartmate-btn-secondary tone-btn" data-tone="persuasive">Persuasive</button>
          <button class="smartmate-btn smartmate-btn-secondary tone-btn" data-tone="neutral">Neutral</button>
        </div>
      </div>
    </div>
  `;

    // Add click event listener to close button
    modal
        .querySelector(".smartmate-modal-close")
        .addEventListener("click", hideModal);

    // Add click event listeners to tone buttons
    modal.querySelectorAll(".tone-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const tone = event.currentTarget.dataset.tone;
            processText("tone-adjust", tone);
            hideModal();
        });
    });

    // Add modal to the page
    document.body.appendChild(modal);
}

// Process text
function processText(action, tone = settings.defaultTone) {
    // Show loading modal
    showLoadingModal(action);

    // Get user ID from storage
    chrome.storage.local.get(["userId"], function (result) {
        let userId = result.userId;

        // If no user ID, generate one
        if (!userId) {
            userId =
                "user_" +
                Date.now().toString(36) +
                Math.random().toString(36).substr(2, 9);
            chrome.storage.local.set({ userId });
        }

        // Send message to background script
        chrome.runtime.sendMessage(
            {
                action: "processText",
                data: {
                    text: selectedText,
                    action,
                    tone,
                    userId,
                },
            },
            function (response) {
                if (response && response.success) {
                    showResultModal(action, response.data);
                } else {
                    showErrorModal(
                        response ? response.message : "Failed to process text"
                    );
                }
            }
        );
    });
}

// Show loading modal
function showLoadingModal(action) {
    // Create modal
    modal = document.createElement("div");
    modal.className = "smartmate-modal";

    // Set action title
    let actionTitle = "Processing";
    switch (action) {
        case "summarize":
            actionTitle = "Summarizing";
            break;
        case "rewrite":
            actionTitle = "Rewriting";
            break;
        case "expand":
            actionTitle = "Expanding";
            break;
        case "tone-adjust":
            actionTitle = "Adjusting Tone";
            break;
    }

    modal.innerHTML = `
    <div class="smartmate-modal-content">
      <div class="smartmate-modal-header">
        <div class="smartmate-modal-title">SmartMate AI</div>
        <button class="smartmate-modal-close">
          <svg class="smartmate-modal-close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      <div class="smartmate-modal-body">
        <div class="smartmate-loading">
          <div class="smartmate-spinner"></div>
          <div class="smartmate-loading-text">${actionTitle}...</div>
        </div>
      </div>
    </div>
  `;

    // Add click event listener to close button
    modal
        .querySelector(".smartmate-modal-close")
        .addEventListener("click", hideModal);

    // Add modal to the page
    document.body.appendChild(modal);
}

// Show result modal
function showResultModal(action, result) {
    // Hide loading modal
    hideModal();

    // Set action title
    let actionTitle = "Result";
    switch (action) {
        case "summarize":
            actionTitle = "Summary";
            break;
        case "rewrite":
            actionTitle = "Rewritten Text";
            break;
        case "expand":
            actionTitle = "Expanded Text";
            break;
        case "tone-adjust":
            actionTitle = "Tone Adjusted Text";
            break;
    }

    // Create modal
    modal = document.createElement("div");
    modal.className = "smartmate-modal";
    modal.innerHTML = `
    <div class="smartmate-modal-content">
      <div class="smartmate-modal-header">
        <div class="smartmate-modal-title">${actionTitle}</div>
        <button class="smartmate-modal-close">
          <svg class="smartmate-modal-close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      <div class="smartmate-modal-body">
        ${result}
      </div>
      <div class="smartmate-modal-footer">
        <div class="smartmate-footer-actions">
          <button class="smartmate-btn smartmate-btn-secondary" id="smartmate-copy-btn">Copy</button>
          <button class="smartmate-btn smartmate-btn-secondary" id="smartmate-speak-btn">
            <svg class="smartmate-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
            Speak
          </button>
          <div class="smartmate-tts-settings" id="smartmate-tts-settings" style="display: none;">
            <div class="smartmate-tts-setting">
              <label for="smartmate-tts-rate">Rate:</label>
              <input type="range" id="smartmate-tts-rate" min="0.5" max="2" step="0.1" value="1">
              <span id="smartmate-tts-rate-value">1.0</span>
            </div>
            <div class="smartmate-tts-setting">
              <label for="smartmate-tts-pitch">Pitch:</label>
              <input type="range" id="smartmate-tts-pitch" min="0.5" max="2" step="0.1" value="1">
              <span id="smartmate-tts-pitch-value">1.0</span>
            </div>
            <div class="smartmate-tts-setting">
              <label for="smartmate-tts-voice">Voice:</label>
              <select id="smartmate-tts-voice"></select>
            </div>
          </div>
        </div>
        <button class="smartmate-btn smartmate-btn-primary" id="smartmate-replace-btn">Replace Selected Text</button>
      </div>
    </div>
  `;

    // Add click event listener to close button
    modal
        .querySelector(".smartmate-modal-close")
        .addEventListener("click", hideModal);

    // Add click event listener to copy button
    modal.querySelector("#smartmate-copy-btn").addEventListener("click", () => {
        navigator.clipboard
            .writeText(result)
            .then(() => {
                const copyBtn = modal.querySelector("#smartmate-copy-btn");
                copyBtn.textContent = "Copied!";
                setTimeout(() => {
                    copyBtn.textContent = "Copy";
                }, 2000);
            })
            .catch((err) => {
                console.error("Failed to copy text: ", err);
            });
    });

    // Add click event listener to speak button
    modal
        .querySelector("#smartmate-speak-btn")
        .addEventListener("click", () => {
            const speakBtn = modal.querySelector("#smartmate-speak-btn");

            if (speechSynthesis.speaking) {
                // Stop speaking if already speaking
                stopSpeaking();
                speakBtn.innerHTML = `
                <svg class="smartmate-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
                Speak
            `;

                // Hide TTS settings
                modal.querySelector("#smartmate-tts-settings").style.display =
                    "none";
            } else {
                // Start speaking
                speakText(result);
                speakBtn.innerHTML = `
                <svg class="smartmate-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                    <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
                </svg>
                Stop
            `;

                // Show TTS settings
                modal.querySelector("#smartmate-tts-settings").style.display =
                    "block";

                // Add event listeners to TTS settings
                const rateInput = modal.querySelector("#smartmate-tts-rate");
                const rateValue = modal.querySelector(
                    "#smartmate-tts-rate-value"
                );
                const pitchInput = modal.querySelector("#smartmate-tts-pitch");
                const pitchValue = modal.querySelector(
                    "#smartmate-tts-pitch-value"
                );
                const voiceSelect = modal.querySelector("#smartmate-tts-voice");

                // Set initial values from settings
                rateInput.value = settings.tts.rate;
                rateValue.textContent = settings.tts.rate;
                pitchInput.value = settings.tts.pitch;
                pitchValue.textContent = settings.tts.pitch;

                // Populate voices
                populateVoiceOptions(voiceSelect);

                // Set selected voice if available
                if (settings.tts.voice && settings.tts.voice !== "default") {
                    const voiceOption = Array.from(voiceSelect.options).find(
                        (option) => option.value === settings.tts.voice
                    );
                    if (voiceOption) {
                        voiceSelect.value = settings.tts.voice;
                    }
                }

                // Add event listeners
                rateInput.addEventListener("input", () => {
                    rateValue.textContent = rateInput.value;
                    settings.tts.rate = parseFloat(rateInput.value);
                    if (speechSynthesis.speaking) {
                        stopSpeaking();
                        speakText(result);
                    }
                });

                pitchInput.addEventListener("input", () => {
                    pitchValue.textContent = pitchInput.value;
                    settings.tts.pitch = parseFloat(pitchInput.value);
                    if (speechSynthesis.speaking) {
                        stopSpeaking();
                        speakText(result);
                    }
                });

                voiceSelect.addEventListener("change", () => {
                    settings.tts.voice = voiceSelect.value;
                    if (speechSynthesis.speaking) {
                        stopSpeaking();
                        speakText(result);
                    }
                });
            }
        });

    // Add click event listener to replace button
    modal
        .querySelector("#smartmate-replace-btn")
        .addEventListener("click", () => {
            replaceSelectedText(result);
            hideModal();
        });

    // Add modal to the page
    document.body.appendChild(modal);
}

// Show error modal
function showErrorModal(message) {
    // Hide loading modal
    hideModal();

    // Create modal
    modal = document.createElement("div");
    modal.className = "smartmate-modal";
    modal.innerHTML = `
    <div class="smartmate-modal-content">
      <div class="smartmate-modal-header">
        <div class="smartmate-modal-title">Error</div>
        <button class="smartmate-modal-close">
          <svg class="smartmate-modal-close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      <div class="smartmate-modal-body">
        <div style="color: #ef4444;">${message}</div>
      </div>
      <div class="smartmate-modal-footer">
        <button class="smartmate-btn smartmate-btn-primary" id="smartmate-ok-btn">OK</button>
      </div>
    </div>
  `;

    // Add click event listener to close button
    modal
        .querySelector(".smartmate-modal-close")
        .addEventListener("click", hideModal);

    // Add click event listener to OK button
    modal
        .querySelector("#smartmate-ok-btn")
        .addEventListener("click", hideModal);

    // Add modal to the page
    document.body.appendChild(modal);
}

// Hide modal
function hideModal() {
    // Stop speaking if active
    if (speechSynthesis.speaking) {
        stopSpeaking();
    }

    if (modal && document.body.contains(modal)) {
        document.body.removeChild(modal);
        modal = null;
    }
}

// Replace selected text
function replaceSelectedText(newText) {
    const selection = window.getSelection();

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(newText));
    }
}

// Text-to-speech functions

// Speak text using the Web Speech API
function speakText(text) {
    if (!("speechSynthesis" in window)) {
        console.error("Text-to-speech not supported in this browser");
        return;
    }

    // Stop any current speech
    stopSpeaking();

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Set properties from settings
    utterance.rate = settings.tts.rate;
    utterance.pitch = settings.tts.pitch;

    // Set voice if specified and available
    if (settings.tts.voice && settings.tts.voice !== "default") {
        const voices = speechSynthesis.getVoices();
        const voice = voices.find((v) => v.name === settings.tts.voice);
        if (voice) {
            utterance.voice = voice;
        }
    }

    // Add event listeners
    utterance.onend = () => {
        currentUtterance = null;

        // Update button if modal still exists
        const modal = document.querySelector(".smartmate-modal");
        if (modal) {
            const speakBtn = modal.querySelector("#smartmate-speak-btn");
            if (speakBtn) {
                speakBtn.innerHTML = `
                    <svg class="smartmate-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                    Speak
                `;

                // Hide TTS settings
                modal.querySelector("#smartmate-tts-settings").style.display =
                    "none";
            }
        }
    };

    utterance.onerror = (event) => {
        console.error("SpeechSynthesis Error:", event);
        currentUtterance = null;
    };

    // Store the utterance and speak
    currentUtterance = utterance;
    speechSynthesis.speak(utterance);
}

// Stop speaking
function stopSpeaking() {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    currentUtterance = null;
}

// Populate voice options in a select element
function populateVoiceOptions(selectElement) {
    // Clear existing options except default
    while (selectElement.options.length > 0) {
        selectElement.remove(0);
    }

    // Add default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "default";
    defaultOption.textContent = "Default";
    selectElement.appendChild(defaultOption);

    // Get available voices
    const voices = speechSynthesis.getVoices();

    if (voices.length === 0) {
        // If voices aren't loaded yet, wait for them
        speechSynthesis.addEventListener(
            "voiceschanged",
            () => {
                populateVoiceOptions(selectElement);
            },
            { once: true }
        );
        return;
    }

    // Add voices to select element
    voices.forEach((voice) => {
        const option = document.createElement("option");
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        selectElement.appendChild(option);
    });
}

// Handle messages from background script
function handleMessage(message, sender, sendResponse) {
    if (message.action === "contextMenuClicked") {
        processText(message.data.menuItemId);
    }

    return true;
}
