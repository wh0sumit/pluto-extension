console.log("Background script loaded");

if (chrome.action) {
    chrome.action.onClicked.addListener((tab) => {
        chrome.storage.sync.get(['openaiApiKey'], function(result) {
            if (result.openaiApiKey) {
                chrome.tabs.sendMessage(tab.id, {action: "openModal"});
            } else {
                chrome.tabs.sendMessage(tab.id, {action: "openApiKeyModal"});
            }
        });
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (["improve_writing", "fix_grammar", "make_longer", "make_shorter", "simplify", "rephrase"].includes(request.action)) {
        processText(request.text, request.action, sendResponse);
        return true;  // Indicates we want to send a response asynchronously
    } else if (request.action === "saveApiKey") {
        chrome.storage.sync.set({ openaiApiKey: request.apiKey }, () => {
            sendResponse({ success: true });
        });
        return true;
    }
});

async function processText(text, action, sendResponse) {
    try {
        const apiKeyResult = await chrome.storage.sync.get(['openaiApiKey']);
        const apiKey = apiKeyResult.openaiApiKey;

        if (!apiKey) {
            sendResponse({error: "API key not set. Please set your OpenAI API key in the extension options."});
            return;
        }

        const apiUrl = 'https://api.openai.com/v1/chat/completions';

        const promptMap = {
            improve_writing: "You are an expert editor with years of experience in enhancing written content. Your task is to improve the following text while maintaining its original meaning and tone. Focus on clarity, coherence, and impact. Enhance word choice, sentence structure, and overall flow. Do not add new information, but rather refine and polish the existing content:",

            fix_grammar: "As a professional proofreader and grammar expert, your job is to correct any grammatical errors, spelling mistakes, and punctuation issues in the following text. Ensure the text adheres to standard English language rules. Maintain the original meaning and style of the text, making only necessary corrections:",

            make_longer: "You are a skilled content developer tasked with expanding the following text. Elaborate on the existing ideas, add relevant examples or details, and provide deeper context. Ensure the expanded version maintains coherence and relevance to the original topic. Do not introduce unrelated information. Aim to approximately double the length of the original text:",

            make_shorter: "As an expert in concise writing, your task is to summarize the following text while retaining its key points and overall message. Eliminate redundancies, combine related ideas, and use more efficient language. The summary should be about half the length of the original text while still conveying the essential information:",

            simplify: "You are a communication specialist skilled in making complex information accessible to a general audience. Simplify the following text by using clearer, more straightforward language. Replace jargon or technical terms with simpler alternatives where possible. Maintain the core message and key points while making the text easier to understand for a reader with a middle-school reading level:",

            rephrase: "As a versatile writer, your task is to rephrase the following text in a different style while preserving its core meaning. Use synonyms, alter sentence structures, and vary the rhythm of the writing. The rephrased version should convey the same information but feel distinctly different from the original in terms of word choice and flow:"
        };

        const prompt = promptMap[action];

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

        const responseData = await response.json();
        const result = responseData.choices[0].message.content;

        sendResponse({result: result});
    } catch (error) {
        console.error('Error:', error);
        sendResponse({error: error.message || "An error occurred while processing the text."});
    }
}