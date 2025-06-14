const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a service name'],
      unique: true, 
    },
    description: {
      type: String,
      required: [true, 'Please add a service description'],
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    price: { 
      type: Number,
      required: [true, 'Please add a price for the service'],
      min: [0, 'Price cannot be negative'],
    },
    type: { 
      type: String,
      required: [true, 'Please specify the type of service'],
      enum: ['Blood Test', 'Urine Test', 'ECG', 'Health Package', 'Other'],
      default: 'Other',
    },
    isActive: { 
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;