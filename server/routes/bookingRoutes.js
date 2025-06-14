// EzLabs/server/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware

// Route to create a new booking (requires user to be logged in)
router.post('/', protect, createBooking);

// Route to get all bookings for the logged-in user (requires user to be logged in)
router.get('/my', protect, getUserBookings);

module.exports = router;