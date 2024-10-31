const request = require('supertest');
const app = require('../server');
const Post = require('../models/Post');
const { generateToken } = require('../utils/auth');

describe('Post Endpoints', () => {
  let token;
  let userId;

  beforeEach(async () => {
    // Create test user and generate token
    const user = await User.create({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123'
    });
    userId = user._id;
    token = generateToken(userId);
  });

  describe('GET /api/posts', () => {
    it('should return all posts', async () => {
      await Post.create([
        { title: 'Post 1', content: 'Content 1', author: userId },
        { title: 'Post 2', content: 'Content 2', author: userId }
      ]);

      const res = await request(app).get('/api/posts');

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Post',
          content: 'Test Content'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('title', 'Test Post');
    });
  });
});