/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const commentRoutes = require('./routes/comments');
const helmet = require('helmet');
const rateLimit = require('./middleware/rateLimit');
// const securityMiddleware = require('./middleware/security');
const { applySecurityMiddleware } = require('./middleware/security');


const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());

app.use(helmet());
app.use('/api/auth', rateLimit.authLimiter);
app.use('/api', rateLimit.apiLimiter);
// app.use(...securityMiddleware);
applySecurityMiddleware(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
