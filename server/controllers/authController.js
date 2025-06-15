
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const User = require('../models/User'); 

// Helper function to generate a JWT token

const generateToken = (id, role) => {
  // The payload contains the user's ID and role, crucial for middleware checks.
  return jwt.sign({ user: { id, role } }, process.env.JWT_SECRET, {
    expiresIn: '10d', // Token expires in 10 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields: name, email, password' });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    // The 'role' will default to 'user' as per the User model schema unless specified in body
    const user = await User.create({
      name,
      email,
      password, // Password will be hashed by the pre-save hook in the User model
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, 
        token: generateToken(user._id, user.role), // Generate token with user's ID and role
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Server Error during registration' });
  }
};

// @desc    Authenticate a user (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user by email
    const user = await User.findOne({ email });

    // Check password using the method defined in the User model
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, 
        token: generateToken(user._id, user.role), 
      });
    } else {
      res.status(400).json({ message: 'Invalid credentials' }); 
    }
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Server Error during login' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};