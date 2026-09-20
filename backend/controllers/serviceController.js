const Service = require('../models/Service');

// @desc    Get all active services (Public)
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ basePrice: 1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all services including inactive (Admin)
// @route   GET /api/services/admin
// @access  Private/Admin
const getAllServicesAdmin = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res) => {
  try {
    const { title, category, description, basePrice, deliveryTime, features, popular, iconName } = req.body;

    if (!title || !description || !basePrice) {
      return res.status(400).json({ success: false, message: 'Title, description, and basePrice are required' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const service = await Service.create({
      title,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      category: category || 'Video Editing',
      description,
      basePrice: Number(basePrice),
      deliveryTime: deliveryTime || '24 Hours',
      features: Array.isArray(features) ? features : (features ? features.split(',').map(f => f.trim()) : []),
      popular: Boolean(popular),
      iconName: iconName || 'Video',
      active: true,
    });

    res.status(201).json({ success: true, message: 'Service created successfully', data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, message: 'Service updated successfully', data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getServices,
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
};

