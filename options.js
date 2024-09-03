// options.js
document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveButton = document.getElementById('saveButton');
    const status = document.getElementById('status');

    // Load saved API key
    chrome.storage.sync.get(['openaiApiKey'], (result) => {
        if (result.openaiApiKey) {
            apiKeyInput.value = result.openaiApiKey;
        }
    });

    saveButton.addEventListener('click', () => {
        const apiKey = apiKeyInput.value;
        chrome.storage.sync.set({ openaiApiKey: apiKey }, () => {
            status.textContent = 'API key saved successfully!';
            setTimeout(() => {
                status.textContent = '';
            }, 3000);
        });
    });
});