const User = require('../models/User'); 

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only - for future, currently any authenticated user)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Exclude password field

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server Error: Could not fetch users' });
  }
};

module.exports = {
  getUsers,
};