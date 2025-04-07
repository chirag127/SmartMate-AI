// SmartMate AI Background Script

// Initialize
(function() {
  // Create context menu items
  createContextMenuItems();
  
  // Listen for messages from content script
  chrome.runtime.onMessage.addListener(handleMessage);
  
  // Listen for context menu clicks
  chrome.contextMenus.onClicked.addListener(handleContextMenuClick);
  
  // Listen for installation
  chrome.runtime.onInstalled.addListener(handleInstalled);
})();

// Create context menu items
function createContextMenuItems() {
  // Parent menu item
  chrome.contextMenus.create({
    id: 'smartmate',
    title: 'SmartMate AI',
    contexts: ['selection']
  });
  
  // Child menu items
  chrome.contextMenus.create({
    id: 'summarize',
    parentId: 'smartmate',
    title: 'Summarize',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'rewrite',
    parentId: 'smartmate',
    title: 'Rewrite',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'expand',
    parentId: 'smartmate',
    title: 'Expand',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'tone-adjust',
    parentId: 'smartmate',
    title: 'Adjust Tone',
    contexts: ['selection']
  });
}

// Handle context menu click
function handleContextMenuClick(info, tab) {
  if (info.menuItemId.startsWith('smartmate') || 
      info.menuItemId === 'summarize' || 
      info.menuItemId === 'rewrite' || 
      info.menuItemId === 'expand' || 
      info.menuItemId === 'tone-adjust') {
    
    // Send message to content script
    chrome.tabs.sendMessage(tab.id, {
      action: 'contextMenuClicked',
      data: {
        menuItemId: info.menuItemId,
        selectionText: info.selectionText
      }
    });
  }
}

// Handle messages from content script
function handleMessage(message, sender, sendResponse) {
  if (message.action === 'processText') {
    processText(message.data, sendResponse);
    return true; // Keep the message channel open for the async response
  }
}

// Process text using the API
async function processText(data, sendResponse) {
  try {
    // Get settings from storage
    const settings = await getSettings();
    
    // Make API request
    const response = await fetch(`${settings.apiUrl}/${data.action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: data.text,
        tone: data.tone,
        userId: data.userId
      })
    });
    
    const responseData = await response.json();
    
    if (!responseData.success) {
      throw new Error(responseData.message || 'Failed to process text');
    }
    
    // Send response back to content script
    sendResponse({
      success: true,
      data: responseData.data
    });
  } catch (error) {
    console.error('Error processing text:', error);
    
    // Send error response back to content script
    sendResponse({
      success: false,
      message: error.message || 'An error occurred while processing the text'
    });
  }
}

// Get settings from storage
function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['settings'], function(result) {
      if (result.settings) {
        resolve(JSON.parse(result.settings));
      } else {
        // Default settings
        resolve({
          apiUrl: 'http://localhost:3000/api',
          defaultTone: 'neutral'
        });
      }
    });
  });
}

// Handle extension installation
function handleInstalled(details) {
  if (details.reason === 'install') {
    // Generate user ID
    const userId = 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    
    // Save user ID to storage
    chrome.storage.local.set({ userId });
    
    // Open welcome page
    chrome.tabs.create({
      url: chrome.runtime.getURL('popup/welcome.html')
    });
  }
}
