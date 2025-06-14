const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController'); 
const { protect } = require('../middleware/authMiddleware'); 


router.get('/', protect, getUsers); 

module.exports = router;