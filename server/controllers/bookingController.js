// server/controllers/bookingController.js

const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking'); // Assuming your Booking model is here
const User = require('../models/User'); // To find user by ID for email

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (User)
const createBooking = asyncHandler(async (req, res) => {
  // Destructure all expected fields from the request body
  const {
    serviceName,       // Frontend sends this
    appointmentDate,   // Frontend sends this
    timeSlot,          // Frontend sends this
    streetAddress,     // Frontend sends this
    city,              // Frontend sends this
    state,             // Frontend sends this
    zipCode,           // Frontend sends this
    country,           // Frontend sends this
    notes
  } = req.body;

  // Basic validation (ensure required fields are present)
  if (!serviceName || !appointmentDate || !timeSlot || !streetAddress || !city || !state || !zipCode || !country) {
    res.status(400);
    // Be specific about what's missing
    throw new Error('Please provide all required booking details: service name, date, time slot, and all address components (street, city, state, zip code, country).');
  }

  // Get the user ID from the protect middleware (req.user.id)
  const userId = req.user.id;

  // Check if the user exists
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  // Create the booking in the database
  const booking = await Booking.create({
    user: userId,
    service: serviceName,        // Mapped from serviceName to 'service'
    date: appointmentDate,       // Mapped from appointmentDate to 'date'
    time: timeSlot,              // Mapped from timeSlot to 'time'
    address: {                   // Construct the address OBJECT as per schema
      street: streetAddress,
      city: city,
      state: state,
      zipCode: zipCode,
      country: country,
    },
    notes,
    status: 'pending', // Default status for new bookings (lowercase for enum consistency)
  });

  if (booking) {
    res.status(201).json({
      message: 'Booking booked successfully!',
      booking: {
        _id: booking._id,
        service: booking.service, // Return 'service' as per schema
        date: booking.date,       // Return 'date' as per schema
        time: booking.time,       // Return 'time' as per schema
        address: booking.address,
        notes: booking.notes,
        status: booking.status,
        user: booking.user,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid booking data received.');
  }
});

// @desc    Get all bookings for the logged-in user
// @route   GET /api/bookings/my
// @access  Private (User)
const getUserBookings = asyncHandler(async (req, res) => {
  // The 'service' and 'date' fields are named correctly in the schema,
  // so no change needed here for fetching.
  const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: bookings }); // Added success and data keys for frontend consistency
});

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings/all
// @access  Private (Admin)
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: bookings }); // Added success and data keys for frontend consistency
});

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin)
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // Expects 'status' in body
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Basic validation for status (ensure lowercase for enum consistency)
  const validStatuses = [
    'pending', 'confirmed', 'assigned', 'on the way',
    'sample collected', 'sample processing', 'reports generation',
    'completed', 'cancelled', 'rescheduled'
  ];
  if (!validStatuses.includes(status.toLowerCase())) { // Convert incoming status to lowercase for comparison
    res.status(400);
    throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
  }

  booking.status = status.toLowerCase(); // Save status as lowercase
  const updatedBooking = await booking.save();

  res.status(200).json({
    message: `Booking status updated to ${updatedBooking.status}`,
    booking: updatedBooking,
  });
});


module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
};
