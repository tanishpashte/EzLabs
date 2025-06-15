const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getAllBookings,     
  updateBookingStatus 
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware'); 

// User-specific routes
router.post('/', protect, createBooking);
router.get('/my', protect, getUserBookings);

// Admin-specific routes
// Get all bookings - requires admin role
router.get('/all', protect, authorizeRoles('admin'), getAllBookings);

// Update booking status - requires admin role
router.put('/:id/status', protect, authorizeRoles('admin'), updateBookingStatus);

module.exports = router;