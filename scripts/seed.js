require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});

    // Create test data
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    await Post.create([
      {
        title: 'Test Post 1',
        content: 'Content 1',
        author: user._id
      },
      {
        title: 'Test Post 2',
        content: 'Content 2',
        author: user._id
      }
    ]);

    console.log('Database seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
