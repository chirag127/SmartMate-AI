// SmartMate AI Background Script
import * as aiService from './aiService.js';

// Initialize
(function () {
  // Create context menu items
  createContextMenuItems();

  // Listen for messages from content script
  chrome.runtime.onMessage.addListener(handleMessage);

  // Listen for context menu clicks
  chrome.contextMenus.onClicked.addListener(handleContextMenuClick);

  // Listen for installation
  chrome.runtime.onInstalled.addListener(handleInstalled);

  // Listen for online/offline events
  setupOfflineDetection();
})();

// Create context menu items
function createContextMenuItems() {
  // Parent menu item
  chrome.contextMenus.create({
    id: 'smartmate',
    title: 'SmartMate AI',
    contexts: ['selection'],
  });

  // Child menu items
  chrome.contextMenus.create({
    id: 'summarize',
    parentId: 'smartmate',
    title: 'Summarize',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'rewrite',
    parentId: 'smartmate',
    title: 'Rewrite',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'expand',
    parentId: 'smartmate',
    title: 'Expand',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'tone-adjust',
    parentId: 'smartmate',
    title: 'Adjust Tone',
    contexts: ['selection'],
  });
}

// Update context menu based on online status
function updateContextMenusForOffline(isOffline) {
  const title = isOffline ? 'SmartMate AI (Offline)' : 'SmartMate AI';
  chrome.contextMenus.update('smartmate', {
    title: title,
    enabled: !isOffline
  });
}

// Setup offline detection
function setupOfflineDetection() {
  // Initial check
  updateContextMenusForOffline(!aiService.isOnline());
}

// Handle context menu click
function handleContextMenuClick(info, tab) {
  if (
    info.menuItemId.startsWith('smartmate') ||
    info.menuItemId === 'summarize' ||
    info.menuItemId === 'rewrite' ||
    info.menuItemId === 'expand' ||
    info.menuItemId === 'tone-adjust'
  ) {
    // Check online status
    if (!aiService.isOnline()) {
      chrome.tabs.sendMessage(tab.id, {
        action: 'showError',
        data: {
          message: 'You are currently offline. Please check your internet connection.'
        }
      });
      return;
    }

    // Send message to content script
    chrome.tabs.sendMessage(tab.id, {
      action: 'contextMenuClicked',
      data: {
        menuItemId: info.menuItemId,
        selectionText: info.selectionText,
      },
    });
  }
}

// Handle messages from content script
function handleMessage(message, sender, sendResponse) {
  if (message.action === 'processText') {
    processText(message.data, sendResponse);
    return true; // Keep the message channel open for the async response
  } else if (message.action === 'checkOnline') {
    sendResponse({ online: aiService.isOnline() });
    return false;
  } else if (message.action === 'getSettings') {
    getSettings().then(settings => sendResponse(settings));
    return true;
  } else if (message.action === 'saveSettings') {
    saveSettings(message.data).then(() => sendResponse({ success: true }));
    return true;
  } else if (message.action === 'getPresets') {
    getPresets().then(presets => sendResponse(presets));
    return true;
  } else if (message.action === 'savePresets') {
    savePresets(message.data).then(() => sendResponse({ success: true }));
    return true;
  }
}

// Process text using the AI service
async function processText(data, sendResponse) {
  try {
    // Check online status
    if (!aiService.isOnline()) {
      throw new Error('You are currently offline. Please check your internet connection.');
    }

    const { text, action, tone } = data;
    let result;

    // Call appropriate AI service method
    switch (action) {
      case 'summarize':
        result = await aiService.summarize(text);
        break;
      case 'rewrite':
        result = await aiService.rewrite(text, tone);
        break;
      case 'expand':
        result = await aiService.expand(text);
        break;
      case 'tone-adjust':
        result = await aiService.adjustTone(text, tone);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Send response back to content script
    sendResponse({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error processing text:', error);

    // Send error response back to content script
    sendResponse({
      success: false,
      message: error.message || 'An error occurred while processing the text',
    });
  }
}

// Get settings from storage (chrome.storage.sync for cross-device sync)
async function getSettings() {
  const result = await chrome.storage.sync.get(['settings']);
  if (result.settings) {
    return result.settings;
  } else {
    // Default settings
    return {
      defaultTone: 'neutral',
      tts: {
        rate: 1.0,
        pitch: 1.0,
        voice: 'default',
      },
    };
  }
}

// Save settings to storage (chrome.storage.sync for cross-device sync)
async function saveSettings(settings) {
  await chrome.storage.sync.set({ settings });
}

// Get presets from storage (chrome.storage.sync for cross-device sync)
async function getPresets() {
  const result = await chrome.storage.sync.get(['presets']);
  return result.presets || [];
}

// Save presets to storage (chrome.storage.sync for cross-device sync)
async function savePresets(presets) {
  await chrome.storage.sync.set({ presets });
}

// Handle extension installation
function handleInstalled(details) {
  if (details.reason === 'install') {
    // Generate user ID
    const userId =
      'user_' +
      Date.now().toString(36) +
      Math.random().toString(36).substr(2, 9);

    // Save user ID to local storage (not synced)
    chrome.storage.local.set({ userId });

    // Initialize default settings in sync storage
    getSettings().then(settings => {
      chrome.storage.sync.set({ settings });
    });

    // Open welcome page
    chrome.tabs.create({
      url: chrome.runtime.getURL('popup/welcome.html'),
    });
  }
}
