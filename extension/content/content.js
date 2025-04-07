// SmartMate AI Content Script

// State
let selectedText = '';
let fab = null;
let menu = null;
let modal = null;
let settings = {
  apiUrl: 'http://localhost:3000/api',
  defaultTone: 'neutral'
};

// Initialize
(function() {
  // Load settings
  chrome.storage.local.get(['settings'], function(result) {
    if (result.settings) {
      settings = JSON.parse(result.settings);
    }
  });
  
  // Listen for text selection
  document.addEventListener('mouseup', handleTextSelection);
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener(handleMessage);
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
  fab = document.createElement('div');
  fab.className = 'smartmate-fab';
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
  fab.addEventListener('click', showMenu);
  
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
  menu = document.createElement('div');
  menu.className = 'smartmate-menu';
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
  menu.querySelectorAll('.smartmate-menu-item').forEach(item => {
    item.addEventListener('click', handleMenuItemClick);
  });
  
  // Add menu to the page
  document.body.appendChild(menu);
  
  // Add click event listener to document to hide menu when clicking outside
  setTimeout(() => {
    document.addEventListener('click', hideMenu);
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
  
  document.removeEventListener('click', hideMenu);
}

// Handle menu item click
function handleMenuItemClick(event) {
  event.stopPropagation();
  
  const action = event.currentTarget.dataset.action;
  
  if (action === 'tone') {
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
  modal = document.createElement('div');
  modal.className = 'smartmate-modal';
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
  modal.querySelector('.smartmate-modal-close').addEventListener('click', hideModal);
  
  // Add click event listeners to tone buttons
  modal.querySelectorAll('.tone-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const tone = event.currentTarget.dataset.tone;
      processText('tone-adjust', tone);
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
  chrome.storage.local.get(['userId'], function(result) {
    let userId = result.userId;
    
    // If no user ID, generate one
    if (!userId) {
      userId = 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
      chrome.storage.local.set({ userId });
    }
    
    // Send message to background script
    chrome.runtime.sendMessage({
      action: 'processText',
      data: {
        text: selectedText,
        action,
        tone,
        userId
      }
    }, function(response) {
      if (response && response.success) {
        showResultModal(action, response.data);
      } else {
        showErrorModal(response ? response.message : 'Failed to process text');
      }
    });
  });
}

// Show loading modal
function showLoadingModal(action) {
  // Create modal
  modal = document.createElement('div');
  modal.className = 'smartmate-modal';
  
  // Set action title
  let actionTitle = 'Processing';
  switch (action) {
    case 'summarize':
      actionTitle = 'Summarizing';
      break;
    case 'rewrite':
      actionTitle = 'Rewriting';
      break;
    case 'expand':
      actionTitle = 'Expanding';
      break;
    case 'tone-adjust':
      actionTitle = 'Adjusting Tone';
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
  modal.querySelector('.smartmate-modal-close').addEventListener('click', hideModal);
  
  // Add modal to the page
  document.body.appendChild(modal);
}

// Show result modal
function showResultModal(action, result) {
  // Hide loading modal
  hideModal();
  
  // Set action title
  let actionTitle = 'Result';
  switch (action) {
    case 'summarize':
      actionTitle = 'Summary';
      break;
    case 'rewrite':
      actionTitle = 'Rewritten Text';
      break;
    case 'expand':
      actionTitle = 'Expanded Text';
      break;
    case 'tone-adjust':
      actionTitle = 'Tone Adjusted Text';
      break;
  }
  
  // Create modal
  modal = document.createElement('div');
  modal.className = 'smartmate-modal';
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
        <button class="smartmate-btn smartmate-btn-secondary" id="smartmate-copy-btn">Copy</button>
        <button class="smartmate-btn smartmate-btn-primary" id="smartmate-replace-btn">Replace Selected Text</button>
      </div>
    </div>
  `;
  
  // Add click event listener to close button
  modal.querySelector('.smartmate-modal-close').addEventListener('click', hideModal);
  
  // Add click event listener to copy button
  modal.querySelector('#smartmate-copy-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(result)
      .then(() => {
        const copyBtn = modal.querySelector('#smartmate-copy-btn');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  });
  
  // Add click event listener to replace button
  modal.querySelector('#smartmate-replace-btn').addEventListener('click', () => {
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
  modal = document.createElement('div');
  modal.className = 'smartmate-modal';
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
  modal.querySelector('.smartmate-modal-close').addEventListener('click', hideModal);
  
  // Add click event listener to OK button
  modal.querySelector('#smartmate-ok-btn').addEventListener('click', hideModal);
  
  // Add modal to the page
  document.body.appendChild(modal);
}

// Hide modal
function hideModal() {
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

// Handle messages from background script
function handleMessage(message, sender, sendResponse) {
  if (message.action === 'contextMenuClicked') {
    processText(message.data.menuItemId);
  }
  
  return true;
}
