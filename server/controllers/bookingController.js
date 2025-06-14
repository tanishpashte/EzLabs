// EzLabs/server/controllers/bookingController.js
const Booking = require('../models/Booking'); // Import the Booking model
const User = require('../models/User');     // Import User model to populate user data (optional)
const Service = require('../models/Service'); // Import Service model to validate service exists

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (User)
const createBooking = async (req, res) => {
  // Get user ID from the `req.user` object, set by `protect` middleware
  const userId = req.user;
  const { service, date, time, address, notes } = req.body;

  // Basic validation
  if (!service || !date || !time || !address || !address.street || !address.city || !address.state || !address.zipCode) {
    return res.status(400).json({ message: 'Please provide all required booking details including full address.' });
  }

  // Optional: Verify the service exists and is active
  const existingService = await Service.findOne({ name: service, isActive: true });
  if (!existingService) {
      return res.status(400).json({ message: 'Selected service is not valid or available.' });
  }

  try {
    const booking = await Booking.create({
      user: userId,
      service,
      date,
      time,
      address,
      notes,
      status: 'pending', // Default status upon creation
    });

    res.status(201).json({
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server Error: Could not create booking' });
  }
};

// @desc    Get all bookings for the logged-in user
// @route   GET /api/bookings/my
// @access  Private (User)
const getUserBookings = async (req, res) => {
  try {
    // Find bookings where the 'user' field matches the ID from the token
    const bookings = await Booking.find({ user: req.user })
                                  .populate('user', 'name email') // Optionally populate user name/email
                                  .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server Error: Could not fetch user bookings' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
};