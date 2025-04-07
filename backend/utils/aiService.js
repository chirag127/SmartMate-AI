const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the Gemini model (Flash Lite)
const getModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
};

/**
 * Summarize text using Gemini AI
 * @param {string} text - The text to summarize
 * @param {string} length - The desired length of the summary (short, medium, long)
 * @returns {Promise<string>} - The summarized text
 */
exports.summarize = async (text, length = 'medium') => {
  try {
    const model = getModel();
    
    // Define length parameters
    const lengthMap = {
      short: 'very concise (1-2 sentences)',
      medium: 'moderately detailed (3-5 sentences)',
      long: 'comprehensive (6-8 sentences)'
    };
    
    const lengthDescription = lengthMap[length] || lengthMap.medium;
    
    const prompt = `Summarize the following text in a ${lengthDescription} summary:
    
    ${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in summarize:', error);
    throw new Error('Failed to summarize text: ' + error.message);
  }
};

/**
 * Rewrite text using Gemini AI
 * @param {string} text - The text to rewrite
 * @param {string} tone - The desired tone of the rewritten text
 * @returns {Promise<string>} - The rewritten text
 */
exports.rewrite = async (text, tone = 'neutral') => {
  try {
    const model = getModel();
    
    const prompt = `Rewrite the following text in a ${tone} tone, maintaining the original meaning:
    
    ${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in rewrite:', error);
    throw new Error('Failed to rewrite text: ' + error.message);
  }
};

/**
 * Expand text using Gemini AI
 * @param {string} text - The text to expand
 * @param {string} length - The desired length of the expanded text (medium, long, very long)
 * @returns {Promise<string>} - The expanded text
 */
exports.expand = async (text, length = 'medium') => {
  try {
    const model = getModel();
    
    // Define length parameters
    const lengthMap = {
      medium: 'about twice the original length',
      long: 'about three times the original length',
      'very long': 'about four times the original length'
    };
    
    const lengthDescription = lengthMap[length] || lengthMap.medium;
    
    const prompt = `Expand the following text to be ${lengthDescription}, adding relevant details and elaboration while maintaining the original meaning:
    
    ${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in expand:', error);
    throw new Error('Failed to expand text: ' + error.message);
  }
};

/**
 * Adjust tone of text using Gemini AI
 * @param {string} text - The text to adjust tone
 * @param {string} tone - The desired tone
 * @returns {Promise<string>} - The tone-adjusted text
 */
exports.adjustTone = async (text, tone) => {
  try {
    const model = getModel();
    
    const prompt = `Rewrite the following text to have a ${tone} tone, while preserving the original meaning and content:
    
    ${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in adjustTone:', error);
    throw new Error('Failed to adjust tone of text: ' + error.message);
  }
};
