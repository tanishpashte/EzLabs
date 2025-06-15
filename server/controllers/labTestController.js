// server/controllers/labtestController.js

// Import asyncHandler to wrap your async functions and automatically catch errors.
// This prevents crashing your server for unhandled promise rejections.
const asyncHandler = require('express-async-handler');

// Import your Mongoose models
const LabTestResult = require('../models/LabTestResult');
const User = require('../models/User'); // We need the User model to find the user by email

// @desc    Create a new lab test result
// @route   POST /api/labresults
// @access  Private (Admin) - Only administrators should be able to upload results
const createTestResult = asyncHandler(async (req, res) => {
  // --- STEP 1: Authorization Check ---
  // The 'protect' middleware (used in your routes) adds a 'user' object to 'req'
  // if a valid token is provided. We check its 'role'.
  if (req.user.role !== 'admin') {
    res.status(403); // HTTP 403 Forbidden
    throw new Error('Not authorized to upload lab test results. Admin access required.');
  }

  // --- STEP 2: Destructure incoming data from the frontend form ---
  const {
    userEmail,       // This is the email from the frontend form
    testName,
    testDate,
    resultValue,
    units,
    referenceRange,
    interpretation,
    status
  } = req.body;

  // --- STEP 3: Basic Input Validation ---
  // Check if the essential fields required by your LabTestResult schema are present.
  if (!userEmail || !testName || !testDate || !resultValue) {
    res.status(400); // HTTP 400 Bad Request
    throw new Error('Please provide user email, test name, test date, and result value.');
  }

  // --- STEP 4: Find the User by Email ---
  // Your LabTestResult schema requires a 'user' field (ObjectId).
  // We receive 'userEmail' from the frontend, so we must find the User's ObjectId.
  const user = await User.findOne({ email: userEmail });

  if (!user) {
    res.status(404); // HTTP 404 Not Found
    throw new Error(`User not found with the provided email: ${userEmail}. Please ensure the email is correct.`);
  }

  // --- STEP 5: Create the Lab Test Result in the Database ---
  // Now we have all the data, including the user's _id.
  const labTestResult = await LabTestResult.create({
    user: user._id, // Assign the found user's ObjectId here! This is CRITICAL.
    testName,
    testDate,       // Mongoose will attempt to parse this date string into a Date object
    resultValue,
    units,
    referenceRange,
    interpretation,
    status: status ? status.toLowerCase() : 'pending review' // Use provided status (lowercase for enum) or default
  });

  // --- STEP 6: Send Response Back to Frontend ---
  if (labTestResult) {
    res.status(201).json({ // HTTP 201 Created
      message: 'Lab test result created successfully',
      data: labTestResult, // Send back the created document
    });
  } else {
    res.status(400); // HTTP 400 Bad Request if creation somehow fails without specific error
    throw new Error('Invalid lab test result data received. Could not create result.');
  }
});

// @desc    Get lab test results for the logged-in user
// @route   GET /api/labresults/my
// @access  Private (User)
const getMyTestResults = asyncHandler(async (req, res) => {
  // req.user.id is populated by the 'protect' middleware
  const results = await LabTestResult.find({ user: req.user.id })
                                    .populate('user', 'name email') // Optionally populate user details
                                    .sort({ testDate: -1, createdAt: -1 }); // Sort newest first

  res.status(200).json({
    success: true,
    count: results.length,
    data: results,
  });
});

// @desc    Get all lab test results (Admin only)
// @route   GET /api/labresults/all
// @access  Private (Admin)
const getAllTestResults = asyncHandler(async (req, res) => {
  // Ensure the logged-in user is an admin for this specific route
  if (req.user.role !== 'admin') {
    res.status(403); // Forbidden
    throw new Error('Not authorized to view all lab test results. Admin access required.');
  }
  const results = await LabTestResult.find({})
                                    .populate('user', 'name email')
                                    .sort({ testDate: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: results.length,
    data: results,
  });
});

// @desc    Update lab test result status (Admin only)
// @route   PUT /api/labresults/:id/status
// @access  Private (Admin)
const updateTestResultStatus = asyncHandler(async (req, res) => {
  // Ensure the logged-in user is an admin
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update lab test result status. Admin access required.');
  }

  const { status } = req.body;
  const labResult = await LabTestResult.findById(req.params.id);

  if (!labResult) {
    res.status(404);
    throw new Error('Lab test result not found');
  }

  // Validate and normalize status for enum
  const validStatuses = ['pending review', 'finalized', 'published', 'archived'];
  const lowerCaseStatus = status.toLowerCase();

  if (!validStatuses.includes(lowerCaseStatus)) {
    res.status(400);
    throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
  }

  labResult.status = lowerCaseStatus;
  const updatedLabResult = await labResult.save();

  res.status(200).json({
    message: `Lab test result status updated to ${updatedLabResult.status}`,
    labResult: updatedLabResult,
  });
});


// Export all functions that your router will use
module.exports = {
  createTestResult,
  getMyTestResults,
  getAllTestResults,
  updateTestResultStatus,
};
