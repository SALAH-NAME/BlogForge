const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      throw new AppError('User not found', 404);
    }

    if (userToFollow._id.toString() === currentUser._id.toString()) {
      throw new AppError('You cannot follow yourself', 400);
    }

    // Check if already following
    if (currentUser.following.includes(userToFollow._id)) {
      throw new AppError('You are already following this user', 400);
    }

    // Add to following/followers
    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await Promise.all([currentUser.save(), userToFollow.save()]);

    res.status(200).json({
      status: 'success',
      message: `You are now following ${userToFollow.username}`
    });
  } catch (err) {
    res.status(err.statusCode || 400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow) {
      throw new AppError('User not found', 404);
    }

    // Remove from following/followers
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== userToUnfollow._id.toString()
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== currentUser._id.toString()
    );

    await Promise.all([currentUser.save(), userToUnfollow.save()]);

    res.status(200).json({
      status: 'success',
      message: `You have unfollowed ${userToUnfollow.username}`
    });
  } catch (err) {
    res.status(err.statusCode || 400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'username bio');

    res.status(200).json({
      status: 'success',
      data: user.followers
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('following', 'username bio');

    res.status(200).json({
      status: 'success',
      data: user.following
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};
