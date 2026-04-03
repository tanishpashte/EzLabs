const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking'); 
const User = require('../models/User'); 

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (User)
const createBooking = asyncHandler(async (req, res) => {
  const {
    serviceName,       
    appointmentDate,   
    timeSlot,          
    streetAddress,     
    city,              
    state,             
    zipCode,           
    country,           
    notes
  } = req.body;

  if (!serviceName || !appointmentDate || !timeSlot || !streetAddress || !city || !state || !zipCode || !country) {
    res.status(400);

    throw new Error('Please provide all required booking details: service name, date, time slot, and all address components (street, city, state, zip code, country).');
  }

  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  const booking = await Booking.create({
    user: userId,
    service: serviceName,        
    date: appointmentDate,       
    time: timeSlot,              
    address: {                   
      street: streetAddress,
      city: city,
      state: state,
      zipCode: zipCode,
      country: country,
    },
    notes,
    status: 'pending', // default status for new bookings 
  });

  if (booking) {
    res.status(201).json({
      message: 'Booking booked successfully!',
      booking: {
        _id: booking._id,
        service: booking.service, 
        date: booking.date,       
        time: booking.time,       
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

  const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: bookings });
});

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings/all
// @access  Private (Admin)
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: bookings }); 
});

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin)
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; 
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const validStatuses = [
    'pending', 'confirmed', 'assigned', 'on the way',
    'sample collected', 'sample processing', 'reports generation',
    'completed', 'cancelled', 'rescheduled'
  ];
  if (!validStatuses.includes(status.toLowerCase())) {
    res.status(400);
    throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
  }

  booking.status = status.toLowerCase(); 
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
