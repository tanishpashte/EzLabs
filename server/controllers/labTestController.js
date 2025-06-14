// EzLabs/server/controllers/labTestController.js
const LabTestResult = require('../models/LabTestResult');
const User = require('../models/User'); // To check if user exists for result assignment

// @desc    Create/Upload a new lab test result (Admin only)
// @route   POST /api/labresults
// @access  Private (Admin only)
const createTestResult = async (req, res) => {
  const { userEmail, testName, testDate, resultValue, units, referenceRange, interpretation, status } = req.body;

  // Basic validation
  if (!userEmail || !testName || !testDate || !resultValue) {
    return res.status(400).json({ message: 'Please provide user email, test name, test date, and result value.' });
  }

  try {
    // Find the user by email to associate the result
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found with the provided email.' });
    }

    const labTestResult = await LabTestResult.create({
      user: user._id, // Store the user's ObjectId
      testName,
      testDate,
      resultValue,
      units,
      referenceRange,
      interpretation,
      status: status || 'pending review',
    });

    res.status(201).json({
      message: 'Lab test result created successfully',
      data: labTestResult,
    });
  } catch (error) {
    console.error('Error creating lab test result:', error);
    res.status(500).json({ message: 'Server Error: Could not create lab test result' });
  }
};

// @desc    Get lab test results for the logged-in user
// @route   GET /api/labresults/my
// @access  Private (User)
const getMyTestResults = async (req, res) => {
  try {
    // req.user.id holds the ID of the logged-in user
    const results = await LabTestResult.find({ user: req.user.id })
                                        .populate('user', 'name email') // Optionally populate user details
                                        .sort({ testDate: -1, createdAt: -1 }); // Sort by test date, then creation date

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error('Error fetching user lab test results:', error);
    res.status(500).json({ message: 'Server Error: Could not fetch your lab test results' });
  }
};

module.exports = {
  createTestResult,
  getMyTestResults,
};