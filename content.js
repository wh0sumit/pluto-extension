let modal = null;
let tailwindAdded = false;
let floatingButton = null;

function addTailwindCSS() {
  if (!tailwindAdded) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    document.head.appendChild(link);
    tailwindAdded = true;
  }
}

function createFloatingButton() {
  floatingButton = document.createElement('div');
  floatingButton.innerHTML = `
    <button class="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 transition duration-300 z-50 flex items-center">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
      </svg>
      AI Assistant
    </button>
  `;
  document.body.appendChild(floatingButton);

  floatingButton.querySelector('button').addEventListener('click', handleButtonClick);
}

function showFloatingButton() {
  if (!floatingButton) {
    createFloatingButton();
  }
  floatingButton.style.display = 'block';
}

function hideFloatingButton() {
  if (floatingButton) {
    floatingButton.style.display = 'none';
  }
}

function handleButtonClick() {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    showModal(selectedText);
  }
}

function showModal(selectedText) {
  if (modal) modal.remove();

  addTailwindCSS();

  modal = document.createElement('div');
  modal.innerHTML = `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50" id="aiModal">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 my-8 flex flex-col" id="modalContent" style="max-height: 80vh;">
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-xl font-semibold text-gray-900">What to do with the selected text?</h3>
          <div class="flex items-center">
            <button id="editBtn" class="text-gray-400 hover:text-gray-500 mr-2">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button id="closeModal" class="text-gray-400 hover:text-gray-500">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-4 overflow-y-auto flex-grow">
          <div class="mb-4">
            <p class="text-sm text-gray-500 truncate">${selectedText}</p>
          </div>
          <div class="space-y-2">
            <h4 class="text-sm font-medium text-gray-700">Actions for selected text</h4>
            <button class="action-btn" data-action="improve_writing">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
              Improve Writing
            </button>
            <button class="action-btn" data-action="fix_grammar">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Fix Grammar & Spelling
            </button>
            <button class="action-btn" data-action="make_longer">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Make Longer
            </button>
            <button class="action-btn" data-action="make_shorter">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
              Make Shorter
            </button>
            <button class="action-btn" data-action="simplify">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Simplify Language
            </button>
            <button class="action-btn" data-action="rephrase">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
              Rephrase
            </button>
          </div>
          <div id="resultArea" class="hidden mt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Result</h4>
            <div id="resultContent" class="bg-gray-100 p-3 rounded-md text-sm text-gray-700"></div>
          </div>
        </div>
        <div class="border-t p-2 text-xs text-gray-500 text-center" id="modalFooter">
          Drag here to move
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const modalContent = document.getElementById('modalContent');
  const modalFooter = document.getElementById('modalFooter');

  // Make the modal draggable
  let isDragging = false;
  let startX, startY;

  modalFooter.addEventListener('mousedown', startDragging);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDragging);

  function startDragging(e) {
    isDragging = true;
    startX = e.clientX - modalContent.getBoundingClientRect().left;
    startY = e.clientY - modalContent.getBoundingClientRect().top;
    modalContent.style.cursor = 'grabbing';
  }

  function drag(e) {
    if (isDragging) {
      const left = e.clientX - startX;
      const top = e.clientY - startY;
      modalContent.style.left = `${left}px`;
      modalContent.style.top = `${top}px`;
      modalContent.style.position = 'absolute';
    }
  }

  function stopDragging() {
    isDragging = false;
    modalContent.style.cursor = 'default';
  }

  document.getElementById('closeModal').addEventListener('click', () => {
    modal.remove();
    modal = null;
  });

  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => processText(selectedText, btn.dataset.action));
  });

  document.getElementById('aiModal').addEventListener('click', (e) => {
    if (e.target.id === 'aiModal') {
      modal.remove();
      modal = null;
    }
  });

  // Add styles for action buttons and modal
  const style = document.createElement('style');
  style.textContent = `
    .action-btn {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0.5rem 1rem;
      background-color: #f3f4f6;
      color: #374151;
      border-radius: 0.375rem;
      transition: all 0.2s;
      font-size: 0.875rem;
      border: 1px solid #e5e7eb;
      margin-bottom: 0.5rem;
    }
    .action-btn:hover {
      background-color: #e5e7eb;
    }
    .action-btn:active {
      background-color: #d1d5db;
    }
    .action-btn:focus {
      outline: 2px solid #a78bfa;
      outline-offset: 2px;
    }
    #modalContent {
      transition: all 0.3s ease;
    }
  `;
  document.head.appendChild(style);
}

function processText(text, action) {
  const resultArea = document.getElementById('resultArea');
  const resultContent = document.getElementById('resultContent');
  
  resultContent.textContent = 'Processing...';
  resultArea.classList.remove('hidden');

  chrome.runtime.sendMessage({action: action, text: text}, (response) => {
    if (response.error) {
      resultContent.textContent = `Something went wrong. Please try again.`;
    } else {
      resultContent.textContent = response.result;
    }
  });
}

document.addEventListener('selectionchange', () => {
  const selection = window.getSelection();
  if (selection.toString().trim().length > 0) {
    showFloatingButton();
  } else {
    hideFloatingButton();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'm') {
    handleButtonClick();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openModal") {
    const selectedText = window.getSelection().toString().trim();
    showModal(selectedText);
  }
  sendResponse({received: true});
  return true;
});