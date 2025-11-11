const AI_PROVIDERS = {
  CEREBRAS: 'cerebras',
  GEMINI: 'gemini',
  GROQ: 'groq'
};

const API_ENDPOINTS = {
  [AI_PROVIDERS.CEREBRAS]: 'https://api.cerebras.ai/v1/chat/completions',
  [AI_PROVIDERS.GEMINI]: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  [AI_PROVIDERS.GROQ]: 'https://api.groq.com/openai/v1/chat/completions'
};

const STORAGE_KEYS = {
  API_KEYS: 'aiServiceApiKeys',
  ACTIVE_PROVIDER: 'aiServiceActiveProvider',
  RATE_LIMIT_DATA: 'aiServiceRateLimitData'
};

class AIService {
  constructor() {
    this.apiKeys = {};
    this.activeProvider = AI_PROVIDERS.CEREBRAS;
    this.rateLimitData = {};
  }

  async init() {
    await this.loadApiKeys();
    await this.loadActiveProvider();
    await this.loadRateLimitData();
  }

  async loadApiKeys() {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEYS.API_KEYS], (result) => {
        this.apiKeys = result[STORAGE_KEYS.API_KEYS] || {};
        resolve();
      });
    });
  }

  async loadActiveProvider() {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEYS.ACTIVE_PROVIDER], (result) => {
        this.activeProvider = result[STORAGE_KEYS.ACTIVE_PROVIDER] || AI_PROVIDERS.CEREBRAS;
        resolve();
      });
    });
  }

  async loadRateLimitData() {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEYS.RATE_LIMIT_DATA], (result) => {
        this.rateLimitData = result[STORAGE_KEYS.RATE_LIMIT_DATA] || {};
        resolve();
      });
    });
  }

  async saveApiKeys() {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEYS.API_KEYS]: this.apiKeys }, resolve);
    });
  }

  async saveActiveProvider() {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEYS.ACTIVE_PROVIDER]: this.activeProvider }, resolve);
    });
  }

  async saveRateLimitData() {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEYS.RATE_LIMIT_DATA]: this.rateLimitData }, resolve);
    });
  }

  async setApiKey(provider, apiKey) {
    this.apiKeys[provider] = apiKey;
    await this.saveApiKeys();
  }

  async getApiKey(provider) {
    return this.apiKeys[provider] || null;
  }

  async setActiveProvider(provider) {
    if (!Object.values(AI_PROVIDERS).includes(provider)) {
      throw new Error(`Invalid provider: ${provider}`);
    }
    this.activeProvider = provider;
    await this.saveActiveProvider();
  }

  getActiveProvider() {
    return this.activeProvider;
  }

  checkRateLimit(provider) {
    const rateLimitInfo = this.rateLimitData[provider];
    if (!rateLimitInfo) return { limited: false };

    const now = Date.now();
    if (rateLimitInfo.resetAt && now < rateLimitInfo.resetAt) {
      return {
        limited: true,
        resetAt: rateLimitInfo.resetAt,
        retryAfter: Math.ceil((rateLimitInfo.resetAt - now) / 1000)
      };
    }

    return { limited: false };
  }

  async setRateLimit(provider, resetAt) {
    this.rateLimitData[provider] = {
      resetAt: resetAt || Date.now() + 60000
    };
    await this.saveRateLimitData();
  }

  async clearRateLimit(provider) {
    delete this.rateLimitData[provider];
    await this.saveRateLimitData();
  }

  buildPrompt(action, text, tone = 'neutral') {
    const prompts = {
      summarize: `Summarize the following text concisely:\n\n${text}`,
      rewrite: `Rewrite the following text in a ${tone} tone:\n\n${text}`,
      expand: `Expand and elaborate on the following text:\n\n${text}`,
      'tone-adjust': `Adjust the tone of the following text to be ${tone}:\n\n${text}`
    };

    return prompts[action] || `Process the following text:\n\n${text}`;
  }

  async makeRequest(prompt, options = {}) {
    const provider = options.provider || this.activeProvider;
    const apiKey = await this.getApiKey(provider);

    if (!apiKey) {
      throw new Error(`No API key set for provider: ${provider}`);
    }

    const rateLimit = this.checkRateLimit(provider);
    if (rateLimit.limited) {
      throw new Error(`Rate limited. Retry after ${rateLimit.retryAfter} seconds`);
    }

    const endpoint = API_ENDPOINTS[provider];
    const requestBody = this.buildRequestBody(provider, prompt, options);
    const headers = this.buildHeaders(provider, apiKey);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        const resetAt = retryAfter
          ? Date.now() + parseInt(retryAfter) * 1000
          : Date.now() + 60000;
        await this.setRateLimit(provider, resetAt);
        throw new Error(`Rate limit exceeded. Retry after ${retryAfter || 60} seconds`);
      }

      if (response.status === 401) {
        throw new Error('Invalid API key');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
      }

      await this.clearRateLimit(provider);

      return await response.json();
    } catch (error) {
      if (error.message.includes('Rate limit')) {
        throw error;
      }
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  async *streamRequest(prompt, options = {}) {
    const provider = options.provider || this.activeProvider;
    const apiKey = await this.getApiKey(provider);

    if (!apiKey) {
      throw new Error(`No API key set for provider: ${provider}`);
    }

    const rateLimit = this.checkRateLimit(provider);
    if (rateLimit.limited) {
      throw new Error(`Rate limited. Retry after ${rateLimit.retryAfter} seconds`);
    }

    const endpoint = API_ENDPOINTS[provider];
    const requestBody = this.buildRequestBody(provider, prompt, { ...options, stream: true });
    const headers = this.buildHeaders(provider, apiKey);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        const resetAt = retryAfter
          ? Date.now() + parseInt(retryAfter) * 1000
          : Date.now() + 60000;
        await this.setRateLimit(provider, resetAt);
        throw new Error(`Rate limit exceeded. Retry after ${retryAfter || 60} seconds`);
      }

      if (response.status === 401) {
        throw new Error('Invalid API key');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
      }

      await this.clearRateLimit(provider);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;

          if (trimmedLine.startsWith('data: ')) {
            try {
              const jsonData = JSON.parse(trimmedLine.slice(6));
              const text = this.extractStreamText(provider, jsonData);
              if (text) {
                yield text;
              }
            } catch (e) {
              console.error('Error parsing stream chunk:', e);
            }
          }
        }
      }
    } catch (error) {
      if (error.message.includes('Rate limit')) {
        throw error;
      }
      throw new Error(`Stream request failed: ${error.message}`);
    }
  }

  buildHeaders(provider, apiKey) {
    const baseHeaders = {
      'Content-Type': 'application/json'
    };

    if (provider === AI_PROVIDERS.GEMINI) {
      return {
        ...baseHeaders,
        'x-goog-api-key': apiKey
      };
    }

    return {
      ...baseHeaders,
      'Authorization': `Bearer ${apiKey}`
    };
  }

  buildRequestBody(provider, prompt, options = {}) {
    if (provider === AI_PROVIDERS.GEMINI) {
      return {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 1024
        }
      };
    }

    return {
      model: options.model || this.getDefaultModel(provider),
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1024,
      stream: options.stream || false
    };
  }

  getDefaultModel(provider) {
    const models = {
      [AI_PROVIDERS.CEREBRAS]: 'llama3.1-8b',
      [AI_PROVIDERS.GROQ]: 'llama-3.1-8b-instant'
    };
    return models[provider] || 'llama3.1-8b';
  }

  extractText(provider, response) {
    if (provider === AI_PROVIDERS.GEMINI) {
      return response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    return response.choices?.[0]?.message?.content || '';
  }

  extractStreamText(provider, chunk) {
    if (provider === AI_PROVIDERS.GEMINI) {
      return chunk.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    return chunk.choices?.[0]?.delta?.content || '';
  }

  async processText(action, text, tone = 'neutral', options = {}) {
    const prompt = this.buildPrompt(action, text, tone);
    const response = await this.makeRequest(prompt, options);
    const provider = options.provider || this.activeProvider;
    return this.extractText(provider, response);
  }

  async *processTextStream(action, text, tone = 'neutral', options = {}) {
    const prompt = this.buildPrompt(action, text, tone);
    yield* this.streamRequest(prompt, options);
  }
}

const aiService = new AIService();
aiService.init();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AIService, aiService, AI_PROVIDERS };
}
