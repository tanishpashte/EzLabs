const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware'); 

// Route to get all users - now requires 'admin' role
// authorizeRoles('admin') MUST BE CALLED WITH PARENTHESES
router.get('/', protect, authorizeRoles('admin'), getUsers);

module.exports = router;