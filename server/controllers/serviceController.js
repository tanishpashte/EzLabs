
const Service = require('../models/Service');

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (Admin only)
const createService = async (req, res) => {
  const { name, description, price, type } = req.body;

  if (!name || !description || !price || !type) {
    return res.status(400).json({ message: 'Please provide all service details.' });
  }

  try {
    const serviceExists = await Service.findOne({ name });
    if (serviceExists) {
      return res.status(400).json({ message: 'Service with this name already exists.' });
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
// @access  Public
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

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (Admin only)
const updateService = async (req, res) => {
  const { id } = req.params; 
  const { name, description, price, type, isActive } = req.body; 

  try {
    let service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if name is being changed and if new name already exists for another service
    if (name && name !== service.name) {
        const serviceExists = await Service.findOne({ name });
        
        if (serviceExists && serviceExists._id.toString() !== id) {
            return res.status(400).json({ message: 'Service with this name already exists.' });
        }
    }

    // Update fields if provided (use undefined check for optional fields)
    service.name = name !== undefined ? name : service.name;
    service.description = description !== undefined ? description : service.description;
    service.price = price !== undefined ? price : service.price;
    service.type = type !== undefined ? type : service.type;
    // Handle boolean isActive specifically, as false is a valid update
    if (typeof isActive === 'boolean') {
        service.isActive = isActive;
    }

    const updatedService = await service.save(); 

    res.status(200).json({
      message: 'Service updated successfully',
      data: updatedService,
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Server Error: Could not update service' });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (Admin only)
const deleteService = async (req, res) => {
  const { id } = req.params; 

  try {
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.deleteOne(); 

    res.status(200).json({
      message: 'Service removed successfully',
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Server Error: Could not delete service' });
  }
};

module.exports = {
  createService,
  getServices,
  updateService, 
  deleteService, 
};