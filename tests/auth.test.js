// tests/auth.test.js
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(Array.isArray(res.body.message)).toBeTruthy();
    });

    it('should validate email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'test',
          email: 'invalid-email',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('valid email');
    });

    it('should prevent duplicate emails', async () => {
      await User.create({
        username: 'existing',
        email: 'test@test.com',
        password: 'password123'
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'new',
          email: 'test@test.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Duplicate');
    });
  });
});
