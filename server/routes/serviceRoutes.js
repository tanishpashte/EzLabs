// EzLabs/server/routes/serviceRoutes.js - Double-check this file
const express = require('express');
const router = express.Router();
const { createService, getServices } = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware'); // Ensure this import is correct

// Route to create a new service - now requires 'admin' role
// authorizeRoles('admin') MUST BE CALLED WITH PARENTHESES
router.post('/', protect, authorizeRoles('admin'), createService);

// Route to get all services - remains public
router.get('/', getServices);

module.exports = router;