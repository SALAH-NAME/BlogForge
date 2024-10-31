// controlleres/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token, user: { id: user._id, username, email } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // Find user and explicitly select password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Remove password from output
    user.password = undefined;

    res.json({
      status: 'success',
      token,
      user
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error logging in',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
