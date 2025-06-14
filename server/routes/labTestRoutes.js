// EzLabs/server/routes/labTestRoutes.js
const express = require('express');
const router = express.Router();
const { createTestResult, getMyTestResults } = require('../controllers/labTestController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Route for admin to create/upload a new test result
router.post('/', protect, authorizeRoles('admin'), createTestResult);

// Route for logged-in users to get their own test results
router.get('/my', protect, getMyTestResults);

module.exports = router;