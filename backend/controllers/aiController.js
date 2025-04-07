const aiService = require('../utils/aiService');

/**
 * Summarize text using Gemini AI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.summarizeText = async (req, res, next) => {
  try {
    const { text, length = 'medium' } = req.body;
    
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }
    
    const result = await aiService.summarize(text, length);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Rewrite text using Gemini AI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.rewriteText = async (req, res, next) => {
  try {
    const { text, tone = 'neutral' } = req.body;
    
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }
    
    const result = await aiService.rewrite(text, tone);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Expand text using Gemini AI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.expandText = async (req, res, next) => {
  try {
    const { text, length = 'medium' } = req.body;
    
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }
    
    const result = await aiService.expand(text, length);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Adjust tone of text using Gemini AI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.adjustTone = async (req, res, next) => {
  try {
    const { text, tone } = req.body;
    
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }
    
    if (!tone) {
      return res.status(400).json({ success: false, message: 'Tone is required' });
    }
    
    const result = await aiService.adjustTone(text, tone);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
