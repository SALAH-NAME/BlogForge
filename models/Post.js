// modles/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  tags: [String],
  visibility: {
    type: String,
    enum: ['public', 'followers', 'private'],
    default: 'public'
  },
  views: {
    type: Number,
    default: 0
  },
  shareCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

postSchema.index({ 
  title: 'text', 
  content: 'text',
  tags: 'text' 
});

module.exports = mongoose.model('Post', postSchema);
