// controlleres/commentController.js
const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
  try {
    const comment = new Comment({
      content: req.body.content,
      post: req.body.postId,
      author: req.user._id
    });
    
    await comment.save();
    await comment.populate('author', 'username');
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
