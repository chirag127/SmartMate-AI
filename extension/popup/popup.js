// DOM Elements
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const promptInput = document.getElementById("prompt-input");
const summarizeBtn = document.getElementById("summarize-btn");
const rewriteBtn = document.getElementById("rewrite-btn");
const expandBtn = document.getElementById("expand-btn");
const toneBtn = document.getElementById("tone-btn");
const toneSelector = document.getElementById("tone-selector");
const toneSelect = document.getElementById("tone-select");
const applyToneBtn = document.getElementById("apply-tone-btn");
const resultContainer = document.querySelector(".result-container");
const resultContent = document.getElementById("result-content");
const copyResultBtn = document.getElementById("copy-result-btn");
const backBtn = document.getElementById("back-btn");
const loading = document.getElementById("loading");
const addPresetBtn = document.getElementById("add-preset-btn");
const presetsList = document.getElementById("presets-list");
const presetForm = document.getElementById("preset-form");
const presetFormTitle = document.getElementById("preset-form-title");
const presetName = document.getElementById("preset-name");
const presetType = document.getElementById("preset-type");
const presetPrompt = document.getElementById("preset-prompt");
const savePresetBtn = document.getElementById("save-preset-btn");
const cancelPresetBtn = document.getElementById("cancel-preset-btn");
const defaultTone = document.getElementById("default-tone");
const defaultLanguage = document.getElementById("default-language");
const saveHistory = document.getElementById("save-history");
const theme = document.getElementById("theme");
const apiUrl = document.getElementById("api-url");
const ttsRate = document.getElementById("tts-rate");
const ttsRateValue = document.getElementById("tts-rate-value");
const ttsPitch = document.getElementById("tts-pitch");
const ttsPitchValue = document.getElementById("tts-pitch-value");
const ttsVoice = document.getElementById("tts-voice");
const saveSettingsBtn = document.getElementById("save-settings-btn");

// State
let currentPresetId = null;
let settings = {
    defaultTone: "neutral",
    defaultLanguage: "en",
    saveHistory: true,
    theme: "light",
    apiUrl: "https://smartmate-ai.onrender.com/api",
    tts: {
        rate: 1.0,
        pitch: 1.0,
        voice: "default",
    },
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    // Load settings
    loadSettings();

    // Load presets
    loadPresets();

    // Apply theme
    applyTheme();

    // Generate a random user ID if not exists
    if (!localStorage.getItem("userId")) {
        localStorage.setItem("userId", generateUserId());
    }
});

// Tab switching
tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        // Remove active class from all tabs
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabContents.forEach((content) => content.classList.remove("active"));

        // Add active class to clicked tab
        button.classList.add("active");
        document.getElementById(button.dataset.tab).classList.add("active");
    });
});

// Quick Prompts Tab
summarizeBtn.addEventListener("click", () => {
    processText("summarize");
});

rewriteBtn.addEventListener("click", () => {
    processText("rewrite");
});

expandBtn.addEventListener("click", () => {
    processText("expand");
});

toneBtn.addEventListener("click", () => {
    toneSelector.style.display = "flex";
    toneSelect.value = settings.defaultTone;
});

applyToneBtn.addEventListener("click", () => {
    processText("tone-adjust", toneSelect.value);
    toneSelector.style.display = "none";
});

copyResultBtn.addEventListener("click", () => {
    navigator.clipboard
        .writeText(resultContent.textContent)
        .then(() => {
            copyResultBtn.textContent = "Copied!";
            setTimeout(() => {
                copyResultBtn.textContent = "Copy";
            }, 2000);
        })
        .catch((err) => {
            console.error("Failed to copy text: ", err);
        });
});

backBtn.addEventListener("click", () => {
    resultContainer.style.display = "none";
    document.querySelector(".prompt-container").style.display = "flex";
});

// Presets Tab
addPresetBtn.addEventListener("click", () => {
    showPresetForm();
});

savePresetBtn.addEventListener("click", () => {
    savePreset();
});

cancelPresetBtn.addEventListener("click", () => {
    hidePresetForm();
});

// Settings Tab
saveSettingsBtn.addEventListener("click", () => {
    saveSettings();
});

// Functions
function loadSettings() {
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
        settings = JSON.parse(savedSettings);

        // Apply settings to form
        defaultTone.value = settings.defaultTone || "neutral";
        defaultLanguage.value = settings.defaultLanguage || "en";
        saveHistory.checked = settings.saveHistory !== false;
        theme.value = settings.theme || "light";
        apiUrl.value =
            settings.apiUrl || "https://smartmate-ai.onrender.com/api";

        // Apply TTS settings
        if (settings.tts) {
            ttsRate.value = settings.tts.rate || 1.0;
            ttsRateValue.textContent = settings.tts.rate || 1.0;
            ttsPitch.value = settings.tts.pitch || 1.0;
            ttsPitchValue.textContent = settings.tts.pitch || 1.0;

            // Populate available voices
            populateVoices();

            // Set selected voice if available
            if (settings.tts.voice && settings.tts.voice !== "default") {
                // Find the voice in the list
                const voiceOption = Array.from(ttsVoice.options).find(
                    (option) => option.value === settings.tts.voice
                );
                if (voiceOption) {
                    ttsVoice.value = settings.tts.voice;
                }
            }
        }
    } else {
        // Populate available voices with default settings
        populateVoices();
    }

    // Add event listeners for range inputs
    ttsRate.addEventListener("input", () => {
        ttsRateValue.textContent = ttsRate.value;
    });

    ttsPitch.addEventListener("input", () => {
        ttsPitchValue.textContent = ttsPitch.value;
    });
}

function saveSettings() {
    settings = {
        defaultTone: defaultTone.value,
        defaultLanguage: defaultLanguage.value,
        saveHistory: saveHistory.checked,
        theme: theme.value,
        apiUrl: apiUrl.value,
        tts: {
            rate: parseFloat(ttsRate.value),
            pitch: parseFloat(ttsPitch.value),
            voice: ttsVoice.value,
        },
    };

    localStorage.setItem("settings", JSON.stringify(settings));

    // Save settings to chrome.storage.local for use in content script
    chrome.storage.local.set({ settings: JSON.stringify(settings) });
    applyTheme();

    // Show success message
    const successMessage = document.createElement("div");
    successMessage.className = "success-message";
    successMessage.textContent = "Settings saved successfully!";
    successMessage.style.color = "var(--success-color)";
    successMessage.style.marginTop = "8px";

    const settingsForm = document.querySelector(".settings-form");
    settingsForm.appendChild(successMessage);

    setTimeout(() => {
        settingsForm.removeChild(successMessage);
    }, 3000);
}

function applyTheme() {
    if (settings.theme === "dark") {
        document.body.setAttribute("data-theme", "dark");
    } else if (settings.theme === "light") {
        document.body.removeAttribute("data-theme");
    } else if (settings.theme === "system") {
        if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            document.body.setAttribute("data-theme", "dark");
        } else {
            document.body.removeAttribute("data-theme");
        }
    }
}

function loadPresets() {
    const presets = JSON.parse(localStorage.getItem("presets") || "[]");

    if (presets.length === 0) {
        presetsList.innerHTML =
            '<p class="empty-message">No presets yet. Create one to get started!</p>';
        return;
    }

    presetsList.innerHTML = "";

    presets.forEach((preset) => {
        const presetItem = document.createElement("div");
        presetItem.className = "preset-item";
        presetItem.innerHTML = `
      <div class="preset-header">
        <span class="preset-title">${preset.name}</span>
        <div class="preset-actions">
          <button class="small-btn edit-preset" data-id="${preset.id}">Edit</button>
          <button class="small-btn delete-preset" data-id="${preset.id}">Delete</button>
        </div>
      </div>
      <span class="preset-type">${preset.type}</span>
      <p class="preset-prompt">${preset.prompt}</p>
    `;

        presetsList.appendChild(presetItem);
    });

    // Add event listeners to edit and delete buttons
    document.querySelectorAll(".edit-preset").forEach((button) => {
        button.addEventListener("click", () => {
            editPreset(button.dataset.id);
        });
    });

    document.querySelectorAll(".delete-preset").forEach((button) => {
        button.addEventListener("click", () => {
            deletePreset(button.dataset.id);
        });
    });
}

function showPresetForm(preset = null) {
    if (preset) {
        presetFormTitle.textContent = "Edit Preset";
        presetName.value = preset.name;
        presetType.value = preset.type;
        presetPrompt.value = preset.prompt;
        currentPresetId = preset.id;
    } else {
        presetFormTitle.textContent = "Add New Preset";
        presetName.value = "";
        presetType.value = "summarize";
        presetPrompt.value = "";
        currentPresetId = null;
    }

    presetForm.style.display = "flex";
    document.getElementById("presets-list").style.display = "none";
    document.querySelector(".presets-header").style.display = "none";
}

function hidePresetForm() {
    presetForm.style.display = "none";
    document.getElementById("presets-list").style.display = "flex";
    document.querySelector(".presets-header").style.display = "flex";
}

function savePreset() {
    const name = presetName.value.trim();
    const type = presetType.value;
    const prompt = presetPrompt.value.trim();

    if (!name || !prompt) {
        alert("Please fill in all fields");
        return;
    }

    const presets = JSON.parse(localStorage.getItem("presets") || "[]");

    if (currentPresetId) {
        // Edit existing preset
        const index = presets.findIndex((p) => p.id === currentPresetId);
        if (index !== -1) {
            presets[index] = {
                id: currentPresetId,
                name,
                type,
                prompt,
            };
        }
    } else {
        // Add new preset
        presets.push({
            id: generateId(),
            name,
            type,
            prompt,
        });
    }

    localStorage.setItem("presets", JSON.stringify(presets));
    loadPresets();
    hidePresetForm();
}

function editPreset(id) {
    const presets = JSON.parse(localStorage.getItem("presets") || "[]");
    const preset = presets.find((p) => p.id === id);

    if (preset) {
        showPresetForm(preset);
    }
}

function deletePreset(id) {
    if (confirm("Are you sure you want to delete this preset?")) {
        const presets = JSON.parse(localStorage.getItem("presets") || "[]");
        const filteredPresets = presets.filter((p) => p.id !== id);

        localStorage.setItem("presets", JSON.stringify(filteredPresets));
        loadPresets();
    }
}

async function processText(action, tone = settings.defaultTone) {
    const text = promptInput.value.trim();

    if (!text) {
        alert("Please enter some text");
        return;
    }

    // Show loading
    loading.style.display = "flex";

    try {
        const response = await fetch(`${settings.apiUrl}/${action}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text,
                tone,
                userId: localStorage.getItem("userId"),
            }),
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Failed to process text");
        }

        // Show result
        resultContent.textContent = data.data;
        document.querySelector(".prompt-container").style.display = "none";
        resultContainer.style.display = "flex";

        // Save to history if enabled
        if (settings.saveHistory) {
            saveToHistory(action, text, data.data);
        }
    } catch (error) {
        console.error("Error processing text:", error);
        alert(`Error: ${error.message}`);
    } finally {
        // Hide loading
        loading.style.display = "none";
    }
}

function saveToHistory(action, input, output) {
    const history = JSON.parse(localStorage.getItem("history") || "[]");

    history.unshift({
        id: generateId(),
        action,
        input,
        output,
        timestamp: new Date().toISOString(),
    });

    // Limit history to 50 items
    if (history.length > 50) {
        history.pop();
    }

    localStorage.setItem("history", JSON.stringify(history));
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function generateUserId() {
    return (
        "user_" +
        Date.now().toString(36) +
        Math.random().toString(36).substr(2, 9)
    );
}

// Populate available voices for text-to-speech
function populateVoices() {
    // Clear existing options except default
    while (ttsVoice.options.length > 1) {
        ttsVoice.remove(1);
    }

    // Get available voices
    const voices = window.speechSynthesis.getVoices();

    if (voices.length === 0) {
        // If voices aren't loaded yet, wait for them
        window.speechSynthesis.addEventListener(
            "voiceschanged",
            () => {
                populateVoices();
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
        ttsVoice.appendChild(option);
    });
}
