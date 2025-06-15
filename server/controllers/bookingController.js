const Booking = require('../models/Booking');
const User = require('../models/User'); 
const Service = require('../models/Service'); 

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (User)
const createBooking = async (req, res) => {
  const userId = req.user.id; 
  const { service, date, time, address, notes } = req.body;

  if (!service || !date || !time || !address || !address.street || !address.city || !address.state || !address.zipCode) {
    return res.status(400).json({ message: 'Please provide all required booking details including full address.' });
  }

  try {
    const existingService = await Service.findOne({ name: service, isActive: true });
    if (!existingService) {
        return res.status(400).json({ message: 'Selected service is not valid or currently available.' });
    }

    const booking = await Booking.create({
      user: userId,
      service,
      date,
      time,
      address,
      notes,
      status: 'pending',
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
    const bookings = await Booking.find({ user: req.user.id }) 
                                  .populate('user', 'name email')
                                  .sort({ createdAt: -1 });

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

// @desc    Get all bookings (for Admin)
// @route   GET /api/bookings/all
// @access  Private (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
                                  .populate('user', 'name email')
                                  .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ message: 'Server Error: Could not fetch all bookings' });
  }
};

// @desc    Update booking status (for Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin only)
const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    'pending',
    'confirmed',
    'assigned',
    'on the way',
    'sample collected',
    'sample processing',
    'reports generation',
    'completed',
    'cancelled',
    'rescheduled'
  ];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Please provide a valid booking status.' });
  }

  try {
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      message: 'Booking status updated successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Server Error: Could not update booking status' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
};