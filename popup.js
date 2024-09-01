document.addEventListener('DOMContentLoaded', () => {
    const summarizeBtn = document.getElementById('summarizeBtn');
    const summaryLength = document.getElementById('summaryLength');
    const summaryType = document.getElementById('summaryType');
  
    // Load saved preferences
    chrome.storage.sync.get(['length', 'type'], (result) => {
      if (result.length) summaryLength.value = result.length;
      if (result.type) summaryType.value = result.type;
    });
  
    summarizeBtn.addEventListener('click', () => {
      // Save preferences
      chrome.storage.sync.set({
        length: summaryLength.value,
        type: summaryType.value
      });
  
      chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => {
        chrome.tabs.sendMessage(tab.id, {
          action: "summarize",
          length: summaryLength.value,
          type: summaryType.value
        });
      });
  
      // Close the popup
      window.close();
    });
  });