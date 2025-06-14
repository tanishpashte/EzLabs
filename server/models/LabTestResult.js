// EzLabs/server/models/LabTestResult.js
const mongoose = require('mongoose');

const labTestResultSchema = mongoose.Schema(
  {
    user: { // The user (patient) this result belongs to
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    testName: { // E.g., "Blood Glucose", "CBC", "Lipid Profile"
      type: String,
      required: [true, 'Please add the test name'],
    },
    testDate: { // When the sample was collected or test performed
      type: Date,
      required: [true, 'Please add the test date'],
    },
    resultValue: { // The numerical or qualitative result
      type: String, // Storing as String to accommodate qualitative results (e.g., "Positive", "Negative")
      required: [true, 'Please add the result value'],
    },
    units: { // E.g., "mg/dL", "%", "mmol/L"
      type: String,
      required: false, // Optional for qualitative tests
    },
    referenceRange: { // Normal range for the test
      type: String,
      required: false,
      maxlength: [100, 'Reference range cannot be more than 100 characters'],
    },
    interpretation: { // Any notes or interpretation from the lab/doctor
      type: String,
      required: false,
      maxlength: [500, 'Interpretation cannot be more than 500 characters'],
    },
    status: { // Status of the report generation/availability
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
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const LabTestResult = mongoose.model('LabTestResult', labTestResultSchema);

module.exports = LabTestResult;