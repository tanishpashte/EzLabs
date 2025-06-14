// EzLabs/server/controllers/serviceController.js
const Service = require('../models/Service'); // Import the Service model

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (Admin only)
const createService = async (req, res) => {
  const { name, description, price, type } = req.body;

  // Basic validation
  if (!name || !description || !price || !type) {
    return res.status(400).json({ message: 'Please enter all required fields: name, description, price, type' });
  }

  try {
    // Check if service already exists
    const serviceExists = await Service.findOne({ name });
    if (serviceExists) {
      return res.status(400).json({ message: 'Service with this name already exists' });
    }

    const service = await Service.create({
      name,
      description,
      price,
      type,
    });

    res.status(201).json({
      message: 'Service created successfully',
      data: service,
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Server Error: Could not create service' });
  }
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public (or Private if preferred, but public for browsing)
const getServices = async (req, res) => {
  try {
    const services = await Service.find({});
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server Error: Could not fetch services' });
  }
};

module.exports = {
  createService,
  getServices,
};