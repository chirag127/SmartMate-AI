const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const userController = require('../controllers/userController');

// AI routes
router.post('/summarize', aiController.summarizeText);
router.post('/rewrite', aiController.rewriteText);
router.post('/expand', aiController.expandText);
router.post('/tone-adjust', aiController.adjustTone);

// User settings routes
router.get('/settings', userController.getSettings);
router.post('/settings', userController.updateSettings);

// Prompt presets routes
router.get('/presets', userController.getPresets);
router.post('/presets', userController.createPreset);
router.put('/presets/:id', userController.updatePreset);
router.delete('/presets/:id', userController.deletePreset);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

module.exports = router;
