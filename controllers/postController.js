/* eslint-disable no-undef */
// controlleres/postController.js
const Post = require('../models/Post');

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      author: req.user._id,
    });
    await post.save();
    await post.populate('author', 'username');
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('author', 'username');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const index = post.likes.indexOf(req.user._id);
    if (index === -1) {
      // Like post
      post.likes.push(req.user._id);
      post.likesCount += 1;
    } else {
      // Unlike post
      post.likes.splice(index, 1);
      post.likesCount -= 1;
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.searchPosts = async (req, res) => {
  try {
    const { q, tags, author, dateFrom, dateTo, sort } = req.query;
    let query = {};

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Tags filter
    if (tags) {
      query.tags = { $all: tags.split(',') };
    }

    // Author filter
    if (author) {
      const authorUser = await User.findOne({ username: author });
      if (authorUser) {
        query.author = authorUser._id;
      }
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Build sort options
    let sortOptions = {};
    switch (sort) {
    case 'recent':
      sortOptions = { createdAt: -1 };
      break;
    case 'popular':
      sortOptions = { likesCount: -1 };
      break;
    case 'views':
      sortOptions = { views: -1 };
      break;
    default:
      sortOptions = { createdAt: -1 };
    }

    const posts = await Post.find(query)
      .sort(sortOptions)
      .populate('author', 'username')
      .limit(20);

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: posts
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};