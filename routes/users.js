// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const followController = require('../controllers/followController');
const auth = require('../middleware/auth');

router.get('/search', userController.searchUsers);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.patch('/profile', auth, userController.updateProfile);



router.post('/:id/follow', auth, followController.followUser);
router.post('/:id/unfollow', auth, followController.unfollowUser);
router.get('/:id/followers', followController.getFollowers);
router.get('/:id/following', followController.getFollowing);

module.exports = router;
