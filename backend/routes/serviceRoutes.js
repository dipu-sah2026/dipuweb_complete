const express = require('express');
const router = express.Router();
const {
  getServices,
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getServices);
router.get('/admin', protect, adminOnly, getAllServicesAdmin);
router.post('/', protect, adminOnly, createService);
router.put('/:id', protect, adminOnly, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;

