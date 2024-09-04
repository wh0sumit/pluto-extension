let modal = null;
let floatingButton = null;
let speechSynthesisUtterance = null;

function addTailwindCSS() {
  if (!document.getElementById('tailwind-css')) {
    const link = document.createElement('link');
    link.id = 'tailwind-css';
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    document.head.appendChild(link);
  }
}


function createFloatingButton() {
  if (floatingButton) return;

  floatingButton = document.createElement('button');
  floatingButton.className = `
    fixed bottom-4 right-4 
    bg-gradient-to-b from-blue-500 to-blue-600 
    text-white 
    px-4 py-2 
    rounded-lg 
    shadow-md 
    hover:brightness-110 
    active:brightness-90 active:shadow 
    transition-all 
    z-50 
    flex items-center justify-center 
    text-sm font-medium tracking-tight 
    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
  `;
  floatingButton.innerHTML = `
    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
    </svg>
    <span>Pluto</span>
  `;
  document.body.appendChild(floatingButton);
  floatingButton.addEventListener('click', handleButtonClick);
}

function toggleFloatingButton(show) {
  if (!floatingButton) createFloatingButton();
  floatingButton.style.display = show ? 'flex' : 'none';
}

function handleButtonClick() {
  const selectedText = window.getSelection().toString().trim();
  chrome.storage.sync.get(['openaiApiKey'], function (result) {
    if (result.openaiApiKey) {
      showModal(selectedText);
    } else {
      showApiKeyModal();
    }
  });
}


function showApiKeyModal() {
  if (modal) modal.remove();
  addTailwindCSS();

  modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 relative">
      <button id="closeApiKeyModal" class="absolute top-2 right-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h3 class="text-2xl font-semibold text-gray-900 mb-4">Enter OpenAI API Key</h3>
      <p class="mb-4 text-gray-600">Please enter your OpenAI API key to use Pluto AI Assistant:</p>
      <input type="text" id="apiKeyInput" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" placeholder="Enter API Key">
      <div class="flex justify-end space-x-2">
        <button id="cancelApiKey" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-300">Cancel</button>
        <button id="saveApiKey" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-300">Save API Key</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('closeApiKeyModal').addEventListener('click', closeModal);
  document.getElementById('cancelApiKey').addEventListener('click', closeModal);

  document.getElementById('saveApiKey').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (apiKey) {
      chrome.runtime.sendMessage({action: "saveApiKey", apiKey: apiKey}, (response) => {
        if (response.success) {
          alert('API key saved successfully!');
          closeModal();
        } else {
          alert('Error saving API key. Please try again.');
        }
      });
    } else {
      alert('Please enter a valid API key.');
    }
  });

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}


function showModal(selectedText) {
  if (modal) modal.remove();
  addTailwindCSS();

  modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-50 bg-black/80 flex items-center justify-center overflow-y-auto';
  modal.innerHTML = `
    <div class="relative w-full max-w-lg mx-auto bg-white rounded-lg shadow-xl flex flex-col max-h-[90vh] h-[600px]">
      <div class="flex justify-between items-center p-4 border-b">
        <div>
          <h2 class="text-lg font-semibold leading-none tracking-tight text-gray-900">Pluto AI Assistant</h2>
          <p class="text-sm text-gray-500">AI-powered text processing and analysis</p>
        </div>
        <button id="closeModal" class="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span class="sr-only">Close</span>
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-4">
        <div class="space-y-4">
          <div class="p-3 bg-gray-50 rounded-md border border-gray-200 max-h-40 overflow-y-auto">
            <p class="text-sm text-gray-600">${selectedText}</p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-2">Actions</h4>
            <div class="grid grid-cols-2 gap-2">
              ${createActionButtons()}
            </div>
          </div>
          <div id="resultArea" class="hidden space-y-2">
            <h4 class="text-sm font-medium text-gray-900">Result</h4>
            <div id="resultContent" class="bg-gray-50 p-3 rounded-md text-sm text-gray-700 border border-gray-200 max-h-60 overflow-y-auto"></div>
            <div id="utilityButtons" class="flex flex-wrap gap-2 hidden">
              ${createUtilityButtons()}
            </div>
          </div>
        </div>
      </div>
      <div class="border-t p-4">
        <button id="resetApiKey" class="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
          Reset API Key
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  setupModalInteractions();
}


function createActionButtons() {
  const actions = [
    { action: 'improve_writing', text: 'Improve Writing', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
    { action: 'fix_grammar', text: 'Fix Grammar & Spelling', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { action: 'make_longer', text: 'Make Longer', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
    { action: 'make_shorter', text: 'Make Shorter', icon: 'M20 12H4' },
    { action: 'simplify', text: 'Simplify Language', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { action: 'rephrase', text: 'Rephrase', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' }
  ];

  return actions.map(({ action, text, icon }) => `
    <button class="action-btn flex items-center justify-start w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors" data-action="${action}">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${icon}"></path>
      </svg>
      ${text}
    </button>
  `).join('');
}

function createUtilityButtons() {
  const buttons = [
    { id: 'copyButton', text: 'Copy', icon: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { id: 'readAloudButton', text: 'Read Aloud', icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z' },
    { id: 'regenerateButton', text: 'Regenerate', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
    { id: 'translateButton', text: 'Translate', icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129' }
  ];

  return buttons.map(({ id, text, icon }) => `
    <button id="${id}" class="flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${icon}"></path>
      </svg>
      ${text}
    </button>
  `).join('');
}

function setupModalInteractions() {
  document.getElementById('closeModal').addEventListener('click', closeModal);

  document.getElementById('resetApiKey').addEventListener('click', resetApiKey);

  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => processText(window.getSelection().toString().trim(), btn.dataset.action));
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.getElementById('copyButton').addEventListener('click', copyToClipboard);
  document.getElementById('readAloudButton').addEventListener('click', toggleReadAloud);
  document.getElementById('regenerateButton').addEventListener('click', regenerateResponse);
  document.getElementById('translateButton').addEventListener('click', translateText);
  document.getElementById('runCustomPrompt').addEventListener('click', runCustomPrompt);
}

function resetApiKey() {
  if (confirm("Are you sure you want to reset your API key? You'll need to enter a new one to use the extension.")) {
    chrome.storage.sync.remove('openaiApiKey', function () {
      if (chrome.runtime.lastError) {
        alert('Error resetting API key. Please try again.');
      } else {
        alert('API key has been reset. You will now be prompted to enter a new one.');
        closeModal();
        showApiKeyModal();
      }
    });
  }
}

function closeModal() {
  if (speechSynthesisUtterance) {
    window.speechSynthesis.cancel();
    speechSynthesisUtterance = null;
  }
  modal.remove();
  modal = null;
}

function copyToClipboard() {
  const resultContent = document.getElementById('resultContent');
  navigator.clipboard.writeText(resultContent.textContent)
    .then(() => alert('Copied to clipboard!'))
    .catch(err => console.error('Failed to copy: ', err));
}

function toggleReadAloud() {
  const resultContent = document.getElementById('resultContent');
  const readAloudButton = document.getElementById('readAloudButton');

  if (speechSynthesisUtterance) {
    window.speechSynthesis.cancel();
    speechSynthesisUtterance = null;
    readAloudButton.innerHTML = `
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
      </svg>
      Read Aloud
    `;
  } else {
    speechSynthesisUtterance = new SpeechSynthesisUtterance(resultContent.textContent);
    window.speechSynthesis.speak(speechSynthesisUtterance);
    readAloudButton.innerHTML = `
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
      </svg>
      Stop Reading
    `;

    speechSynthesisUtterance.onend = () => {
      speechSynthesisUtterance = null;
      readAloudButton.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
        </svg>
        Read Aloud
      `;
    };
  }
}

function regenerateResponse() {
  const selectedText = window.getSelection().toString().trim();
  const lastAction = document.querySelector('.action-btn[disabled]').dataset.action;

  if (speechSynthesisUtterance) {
    window.speechSynthesis.cancel();
    speechSynthesisUtterance = null;
    document.getElementById('readAloudButton').innerHTML = `
   <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
      </svg>
      Read Aloud
    `;
  }

  processText(selectedText, lastAction);
}

function translateText() {
  const resultContent = document.getElementById('resultContent').textContent;
  const targetLanguage = prompt('Enter the target language (e.g., Spanish, French, German):');
  if (targetLanguage) {
    processText(resultContent, 'translate', targetLanguage);
  }
}

function runCustomPrompt() {
  const customPrompt = document.getElementById('customPrompt').value;
  const selectedText = window.getSelection().toString().trim();
  if (customPrompt) {
    processText(selectedText, 'custom_prompt', customPrompt);
  }
}

function processText(text, action, additionalData = null) {
  const resultArea = document.getElementById('resultArea');
  const resultContent = document.getElementById('resultContent');
  const utilityButtons = document.getElementById('utilityButtons');

  resultContent.textContent = 'Processing...';
  resultArea.classList.remove('hidden');
  utilityButtons.classList.add('hidden');

  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.disabled = btn.dataset.action === action;
    btn.classList.toggle('opacity-50', btn.disabled);
    btn.classList.toggle('cursor-not-allowed', btn.disabled);
  });

  chrome.runtime.sendMessage({ action: action, text: text, additionalData: additionalData }, (response) => {
    if (response.error) {
      resultContent.textContent = `Error: ${response.error}`;
      resultContent.classList.add('text-red-500');
    } else {
      resultContent.textContent = response.result;
      resultContent.classList.remove('text-red-500');
      utilityButtons.classList.remove('hidden');
    }
  });
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedToggleFloatingButton = debounce((show) => {
  toggleFloatingButton(show);
}, 200);

document.addEventListener('selectionchange', () => {
  const selection = window.getSelection().toString().trim();
  debouncedToggleFloatingButton(selection.length > 0);
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'm') {
    handleButtonClick();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openModal") {
    chrome.storage.sync.get(['openaiApiKey'], function (result) {
      if (result.openaiApiKey) {
        const selectedText = window.getSelection().toString().trim();
        showModal(selectedText);
      } else {
        showApiKeyModal();
      }
    });
  } else if (request.action === "openApiKeyModal") {
    showApiKeyModal();
  }
  sendResponse({ received: true });
  return true;
});

function initializeExtension() {
  createFloatingButton();
  const initialSelection = window.getSelection().toString().trim();
  toggleFloatingButton(initialSelection.length > 0);
}

initializeExtension();