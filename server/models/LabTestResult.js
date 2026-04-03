const mongoose = require('mongoose');

const labTestResultSchema = mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    testName: { // E.g., "Blood Glucose", "CBC", "Lipid Profile"
      type: String,
      required: [true, 'Please add the test name'],
    },
    testDate: { 
      type: Date,
      required: [true, 'Please add the test date'],
    },
    resultValue: { 
      type: String, 
      required: [true, 'Please add the result value'],
    },
    units: { 
      type: String,
      required: false, // Optional for qualitative tests
    },
    referenceRange: { 
      type: String,
      required: false,
      maxlength: [100, 'Reference range cannot be more than 100 characters'],
    },
    interpretation: { 
      type: String,
      required: false,
      maxlength: [500, 'Interpretation cannot be more than 500 characters'],
    },
    status: { 
      type: String,
      enum: ['pending review', 'finalized', 'published', 'archived'],
      default: 'pending review',
    },

    // Optional: Link to the booking if results are tied to a specific appointment
    // booking: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Booking',
    //   required: false,
    // },
  },
  {
    timestamps: true, 
  }
);

const LabTestResult = mongoose.model('LabTestResult', labTestResultSchema);

module.exports = LabTestResult;