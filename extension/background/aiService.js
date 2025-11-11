// AI Service for Browser Extension
// Uses Gemini API directly via fetch

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent';

/**
 * Get API key from storage
 */
async function getApiKey() {
  const result = await chrome.storage.sync.get(['apiKey']);
  return result.apiKey;
}

/**
 * Call Gemini API
 */
async function callGeminiAPI(prompt, apiKey) {
  const response = await fetch(`${GEMINI_API_BASE}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

/**
 * Summarize text using Gemini AI
 */
export async function summarize(text, length = 'medium') {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error('API key not configured. Please set your Gemini API key in settings.');
  }

  const lengthMap = {
    short: 'very concise (1-2 sentences)',
    medium: 'moderately detailed (3-5 sentences)',
    long: 'comprehensive (6-8 sentences)'
  };

  const lengthDescription = lengthMap[length] || lengthMap.medium;
  const prompt = `Summarize the following text in a ${lengthDescription} summary:\n\n${text}`;

  return await callGeminiAPI(prompt, apiKey);
}

/**
 * Rewrite text using Gemini AI
 */
export async function rewrite(text, tone = 'neutral') {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error('API key not configured. Please set your Gemini API key in settings.');
  }

  const prompt = `Rewrite the following text in a ${tone} tone, maintaining the original meaning:\n\n${text}`;
  return await callGeminiAPI(prompt, apiKey);
}

/**
 * Expand text using Gemini AI
 */
export async function expand(text, length = 'medium') {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error('API key not configured. Please set your Gemini API key in settings.');
  }

  const lengthMap = {
    medium: 'about twice the original length',
    long: 'about three times the original length',
    'very long': 'about four times the original length'
  };

  const lengthDescription = lengthMap[length] || lengthMap.medium;
  const prompt = `Expand the following text to be ${lengthDescription}, adding relevant details and elaboration while maintaining the original meaning:\n\n${text}`;

  return await callGeminiAPI(prompt, apiKey);
}

/**
 * Adjust tone of text using Gemini AI
 */
export async function adjustTone(text, tone) {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error('API key not configured. Please set your Gemini API key in settings.');
  }

  const prompt = `Rewrite the following text to have a ${tone} tone, while preserving the original meaning and content:\n\n${text}`;
  return await callGeminiAPI(prompt, apiKey);
}

/**
 * Check if online
 */
export function isOnline() {
  return navigator.onLine;
}
