const express = require('express');
const router = express.Router();
const { createService, getServices, updateService, deleteService } = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// console.log('Type of protect function inside serviceRoutes.js:', typeof protect);
// // NEW LOGS:
// console.log('Type of authorizeRoles (the function itself):', typeof authorizeRoles);
// console.log('Type of authorizeRoles("admin") (the returned middleware):', typeof authorizeRoles('admin'));
// console.log('Type of updateService function:', typeof updateService);
// console.log('Type of deleteService function:', typeof deleteService);


router.get('/', getServices);
router.post('/', protect, authorizeRoles('admin'), createService);

router.put('/:id', protect, authorizeRoles('admin'), updateService);
router.delete('/:id', protect, authorizeRoles('admin'), deleteService);

module.exports = router;