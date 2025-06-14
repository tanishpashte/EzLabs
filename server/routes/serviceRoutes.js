// EzLabs/server/routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const { createService, getServices } = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware'); // For protecting routes

// For now, let's assume `createService` is accessible by any logged-in user,
// but we will add the `isAdmin` middleware here once it's created.
router.post('/', protect, createService); // Protected: only logged-in users can create. Will be admin-only.
router.get('/', getServices); // Publicly accessible to view services

module.exports = router;