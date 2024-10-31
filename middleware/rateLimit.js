// middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later'
});

exports.apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000 // 1000 requests per hour
});
