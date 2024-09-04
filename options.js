document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('apiKey');
    const saveButton = document.getElementById('saveButton');
    const status = document.getElementById('status');

    // Load saved API key
    chrome.storage.sync.get(['openaiApiKey'], function(result) {
        if (result.openaiApiKey) {
            apiKeyInput.value = result.openaiApiKey;
        }
    });

    saveButton.addEventListener('click', function() {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            chrome.storage.sync.set({ openaiApiKey: apiKey }, function() {
                if (chrome.runtime.lastError) {
                    status.textContent = 'Error saving API key: ' + chrome.runtime.lastError.message;
                } else {
                    status.textContent = 'API key saved successfully!';
                    setTimeout(() => {
                        status.textContent = '';
                    }, 3000);
                }
            });
        } else {
            status.textContent = 'Please enter a valid API key.';
        }
    });
});