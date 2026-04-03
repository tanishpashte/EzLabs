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

router.post('/', protect, createBooking);
router.get('/my', protect, getUserBookings);


router.get('/all', protect, authorizeRoles('admin'), getAllBookings);
router.put('/:id/status', protect, authorizeRoles('admin'), updateBookingStatus);

module.exports = router;