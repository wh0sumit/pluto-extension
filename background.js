// background.js
const OPENAI_API_KEY = 'sk-1234567890abcdefghijklmnopqrstuvwxyz123456';

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, {action: "openModal"});
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (["improve_writing", "fix_grammar", "make_longer", "make_shorter", "simplify", "rephrase"].includes(request.action)) {
    processText(request.text, request.action, sendResponse);
    return true;  // Indicates we want to send a response asynchronously
  }
});

async function processText(text, action, sendResponse) {
  const apiKey = OPENAI_API_KEY;
  if (!apiKey) {
    sendResponse({error: "API key not set. Please check the OPENAI_API_KEY variable in the background.js file."});
    return;
  }

  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  const promptMap = {
    improve_writing: "Improve the writing of the following text:",
    fix_grammar: "Fix the grammar and spelling in the following text:",
    make_longer: "Expand on the following text to make it longer:",
    make_shorter: "Summarize the following text to make it shorter:",
    simplify: "Simplify the language in the following text:",
    rephrase: "Rephrase the following text:"
  };

  const prompt = promptMap[action];

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {role: "system", content: prompt},
          {role: "user", content: text}
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
    }

    const { choices } = await response.json();
    const result = choices[0].message.content;

    sendResponse({result: result});
  } catch (error) {
    console.error('Error:', error);
    sendResponse({error: error.message || "An error occurred while processing the text."});
  }
}
