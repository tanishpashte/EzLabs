const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    service: { 
      type: String,
      required: [true, 'Please add a service'],
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    time: {
      type: String, 
      required: [true, 'Please add a time slot'],
    },
    address: { 
      street: {
        type: String,
        required: [true, 'Please add street address'],
      },
      city: {
        type: String,
        required: [true, 'Please add city'],
      },
      state: {
        type: String,
        required: [true, 'Please add state'],
      },
      zipCode: {
        type: String,
        required: [true, 'Please add zip code'],
      },
      country: {
        type: String,
        required: [true, 'Please add country'],
        default: 'India'
      },
    },
    status: { 
      type: String,
      enum: [
        'pending',             // Initial state after booking
        'confirmed',           // Lab confirms the slot
        'assigned',            // Lab person assigned for visit
        'on the way',          // Lab person is en route
        'sample collected',    // Sample has been collected
        'sample processing',   // Sample is being processed in lab
        'reports generation',  // Reports are being prepared
        'completed',           // Reports are ready/delivered
        'cancelled',           // Booking cancelled by user/admin
        'rescheduled'          // Booking has been rescheduled
      ],
      default: 'pending',
    },
    notes: {
      type: String,
      maxlength: [200, 'Notes cannot be more than 200 characters'],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;