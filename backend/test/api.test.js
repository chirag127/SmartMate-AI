const request = require('supertest');
const app = require('../server');

describe('API Routes', () => {
  describe('GET /api/health', () => {
    it('should return status 200 and health check message', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('message', 'API is running');
    });
  });

  describe('POST /api/summarize', () => {
    it('should return 400 if text is not provided', async () => {
      const res = await request(app)
        .post('/api/summarize')
        .send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Text is required');
    });
  });

  describe('POST /api/rewrite', () => {
    it('should return 400 if text is not provided', async () => {
      const res = await request(app)
        .post('/api/rewrite')
        .send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Text is required');
    });
  });

  describe('POST /api/expand', () => {
    it('should return 400 if text is not provided', async () => {
      const res = await request(app)
        .post('/api/expand')
        .send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Text is required');
    });
  });

  describe('POST /api/tone-adjust', () => {
    it('should return 400 if text is not provided', async () => {
      const res = await request(app)
        .post('/api/tone-adjust')
        .send({ tone: 'formal' });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Text is required');
    });

    it('should return 400 if tone is not provided', async () => {
      const res = await request(app)
        .post('/api/tone-adjust')
        .send({ text: 'Sample text' });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Tone is required');
    });
  });
});
