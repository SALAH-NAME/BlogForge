// routes/comments.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.post('/', auth, commentController.createComment);
router.get('/posts/:id/comments', commentController.getPostComments);

module.exports = router;
