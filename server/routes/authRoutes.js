// EzLabs/server/routes/auth.js (or authRoutes.js) - This is the definitive version
const express = require('express');
const router = express.Router();
// Import the controller functions
const { registerUser, loginUser } = require('../controllers/authController');

// Define the routes and link them to the controller functions
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;