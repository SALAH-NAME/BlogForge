const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  createPost, 
  getAllPosts, 
  getPostById, 
  updatePost, 
  deletePost 
} = require('../controllers/postController');

router.post('/', auth, createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);

module.exports = router;
