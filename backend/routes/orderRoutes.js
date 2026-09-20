const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getMyOrders,
  trackOrder,
  updateOrderStatus,
  requestRevision,
  exportOrdersCsv,
  deleteOrder,
  getMetrics,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public endpoints
router.post('/', upload.single('paymentScreenshot'), createOrder);
router.get('/track/:identifier', trackOrder);

// Client private endpoints
router.get('/my-orders', protect, getMyOrders);
router.post('/:id/revision', protect, requestRevision);

// Admin private endpoints
router.get('/export-csv', protect, adminOnly, exportOrdersCsv);
router.get('/metrics', protect, adminOnly, getMetrics);
router.get('/', protect, adminOnly, getOrders);
router.patch('/:id', protect, adminOnly, updateOrderStatus);
router.delete('/:id', protect, adminOnly, deleteOrder);

module.exports = router;
