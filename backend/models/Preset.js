const mongoose = require('mongoose');

const PresetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['summarize', 'rewrite', 'expand', 'tone'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
PresetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Preset', PresetSchema);
