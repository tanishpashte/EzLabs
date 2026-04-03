const express = require('express');
const router = express.Router();
const { createTestResult, getMyTestResults } = require('../controllers/labTestController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/', protect, authorizeRoles('admin'), createTestResult);
router.get('/my', protect, getMyTestResults);

module.exports = router;