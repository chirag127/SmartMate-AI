const User = require('../models/User');
const Preset = require('../models/Preset');

/**
 * Get user settings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getSettings = async (req, res, next) => {
  try {
    // For now, we'll use a simple userId from query params
    // In a real app, this would come from authentication
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    
    // Try to find user settings
    let user = await User.findOne({ userId });
    
    // If user doesn't exist, return default settings
    if (!user) {
      return res.status(200).json({
        success: true,
        data: {
          defaultTone: 'neutral',
          defaultLanguage: 'en',
          saveHistory: true,
          theme: 'light'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        defaultTone: user.defaultTone,
        defaultLanguage: user.defaultLanguage,
        saveHistory: user.saveHistory,
        theme: user.theme
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user settings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateSettings = async (req, res, next) => {
  try {
    // For now, we'll use a simple userId from body
    // In a real app, this would come from authentication
    const { userId, defaultTone, defaultLanguage, saveHistory, theme } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    
    // Find user or create if doesn't exist
    let user = await User.findOne({ userId });
    
    if (!user) {
      user = new User({ userId });
    }
    
    // Update settings
    if (defaultTone !== undefined) user.defaultTone = defaultTone;
    if (defaultLanguage !== undefined) user.defaultLanguage = defaultLanguage;
    if (saveHistory !== undefined) user.saveHistory = saveHistory;
    if (theme !== undefined) user.theme = theme;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: {
        defaultTone: user.defaultTone,
        defaultLanguage: user.defaultLanguage,
        saveHistory: user.saveHistory,
        theme: user.theme
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user prompt presets
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getPresets = async (req, res, next) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    
    const presets = await Preset.find({ userId });
    
    res.status(200).json({
      success: true,
      data: presets
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new prompt preset
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createPreset = async (req, res, next) => {
  try {
    const { userId, name, prompt, type } = req.body;
    
    if (!userId || !name || !prompt || !type) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID, name, prompt, and type are required' 
      });
    }
    
    const preset = new Preset({
      userId,
      name,
      prompt,
      type
    });
    
    await preset.save();
    
    res.status(201).json({
      success: true,
      data: preset
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a prompt preset
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updatePreset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, prompt, type } = req.body;
    
    const preset = await Preset.findById(id);
    
    if (!preset) {
      return res.status(404).json({ success: false, message: 'Preset not found' });
    }
    
    // Update preset
    if (name) preset.name = name;
    if (prompt) preset.prompt = prompt;
    if (type) preset.type = type;
    
    await preset.save();
    
    res.status(200).json({
      success: true,
      data: preset
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a prompt preset
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deletePreset = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const preset = await Preset.findById(id);
    
    if (!preset) {
      return res.status(404).json({ success: false, message: 'Preset not found' });
    }
    
    await preset.remove();
    
    res.status(200).json({
      success: true,
      message: 'Preset deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
