// middleware/security.js
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

exports.applySecurityMiddleware = (app) => {
  app.use(helmet()); // Set security HTTP headers
  app.use(mongoSanitize()); // Prevent NoSQL injection
  app.use(xss()); // Prevent XSS attacks
};