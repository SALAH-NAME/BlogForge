// routes/posts.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

router.get('/search', postController.searchPosts);
router.get('/', postController.getPosts);
router.post('/', auth, postController.createPost);
router.get('/:id', postController.getPost);
router.put('/:id', auth, postController.updatePost);
router.delete('/:id', auth, postController.deletePost);
router.post('/:id/like', auth, postController.likePost);


module.exports = router;
