// controlleres/userController.js
const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { q, interests, location } = req.query;
    let query = {};

    if (q) {
      query.$or = [
        { username: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } }
      ];
    }

    if (interests) {
      query.interests = { $in: interests.split(',') };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const users = await User.find(query)
      .select('-password')
      .limit(20);

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['bio', 'location', 'website', 'interests'];
    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};