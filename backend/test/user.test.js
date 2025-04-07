const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const Preset = require('../models/Preset');

// Mock data
const mockUserId = 'test_user_123';
const mockSettings = {
  userId: mockUserId,
  defaultTone: 'professional',
  defaultLanguage: 'en',
  saveHistory: true,
  theme: 'dark'
};

const mockPreset = {
  userId: mockUserId,
  name: 'Test Preset',
  prompt: 'Summarize this in a tweet format',
  type: 'summarize'
};

// Setup and teardown
beforeAll(async () => {
  // Connect to test database if not connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartmate-test');
  }
});

beforeEach(async () => {
  // Clear test data
  await User.deleteMany({});
  await Preset.deleteMany({});
});

afterAll(async () => {
  // Disconnect from test database
  await mongoose.connection.close();
});

describe('User Controller', () => {
  describe('GET /api/settings', () => {
    it('should return default settings if user does not exist', async () => {
      const res = await request(app)
        .get('/api/settings')
        .query({ userId: mockUserId });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('defaultTone', 'neutral');
      expect(res.body.data).toHaveProperty('defaultLanguage', 'en');
      expect(res.body.data).toHaveProperty('saveHistory', true);
      expect(res.body.data).toHaveProperty('theme', 'light');
    });

    it('should return user settings if user exists', async () => {
      // Create a user
      await User.create(mockSettings);
      
      const res = await request(app)
        .get('/api/settings')
        .query({ userId: mockUserId });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('defaultTone', 'professional');
      expect(res.body.data).toHaveProperty('defaultLanguage', 'en');
      expect(res.body.data).toHaveProperty('saveHistory', true);
      expect(res.body.data).toHaveProperty('theme', 'dark');
    });

    it('should return 400 if userId is not provided', async () => {
      const res = await request(app)
        .get('/api/settings');
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'User ID is required');
    });
  });

  describe('POST /api/settings', () => {
    it('should create new user settings if user does not exist', async () => {
      const res = await request(app)
        .post('/api/settings')
        .send(mockSettings);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('defaultTone', 'professional');
      expect(res.body.data).toHaveProperty('defaultLanguage', 'en');
      expect(res.body.data).toHaveProperty('saveHistory', true);
      expect(res.body.data).toHaveProperty('theme', 'dark');
      
      // Check if user was created in database
      const user = await User.findOne({ userId: mockUserId });
      expect(user).toBeTruthy();
      expect(user.defaultTone).toEqual('professional');
    });

    it('should update existing user settings', async () => {
      // Create a user
      await User.create(mockSettings);
      
      // Update settings
      const updatedSettings = {
        userId: mockUserId,
        defaultTone: 'casual',
        theme: 'light'
      };
      
      const res = await request(app)
        .post('/api/settings')
        .send(updatedSettings);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('defaultTone', 'casual');
      expect(res.body.data).toHaveProperty('defaultLanguage', 'en'); // Unchanged
      expect(res.body.data).toHaveProperty('saveHistory', true); // Unchanged
      expect(res.body.data).toHaveProperty('theme', 'light');
      
      // Check if user was updated in database
      const user = await User.findOne({ userId: mockUserId });
      expect(user).toBeTruthy();
      expect(user.defaultTone).toEqual('casual');
      expect(user.theme).toEqual('light');
    });

    it('should return 400 if userId is not provided', async () => {
      const res = await request(app)
        .post('/api/settings')
        .send({ defaultTone: 'formal' });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'User ID is required');
    });
  });

  describe('Preset Routes', () => {
    it('should create a new preset', async () => {
      const res = await request(app)
        .post('/api/presets')
        .send(mockPreset);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('name', 'Test Preset');
      expect(res.body.data).toHaveProperty('prompt', 'Summarize this in a tweet format');
      expect(res.body.data).toHaveProperty('type', 'summarize');
      
      // Check if preset was created in database
      const preset = await Preset.findOne({ userId: mockUserId });
      expect(preset).toBeTruthy();
      expect(preset.name).toEqual('Test Preset');
    });

    it('should get user presets', async () => {
      // Create a preset
      await Preset.create(mockPreset);
      
      const res = await request(app)
        .get('/api/presets')
        .query({ userId: mockUserId });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toEqual(1);
      expect(res.body.data[0]).toHaveProperty('name', 'Test Preset');
    });

    it('should update a preset', async () => {
      // Create a preset
      const preset = await Preset.create(mockPreset);
      
      const res = await request(app)
        .put(`/api/presets/${preset._id}`)
        .send({
          name: 'Updated Preset',
          prompt: 'New prompt'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('name', 'Updated Preset');
      expect(res.body.data).toHaveProperty('prompt', 'New prompt');
      expect(res.body.data).toHaveProperty('type', 'summarize'); // Unchanged
      
      // Check if preset was updated in database
      const updatedPreset = await Preset.findById(preset._id);
      expect(updatedPreset).toBeTruthy();
      expect(updatedPreset.name).toEqual('Updated Preset');
      expect(updatedPreset.prompt).toEqual('New prompt');
    });

    it('should delete a preset', async () => {
      // Create a preset
      const preset = await Preset.create(mockPreset);
      
      const res = await request(app)
        .delete(`/api/presets/${preset._id}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'Preset deleted successfully');
      
      // Check if preset was deleted from database
      const deletedPreset = await Preset.findById(preset._id);
      expect(deletedPreset).toBeNull();
    });
  });
});
