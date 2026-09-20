const express = require('express');
const router = express.Router();
const {
  getFaqs,
  getAdminFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} = require('../controllers/faqController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getFaqs);
router.get('/admin', protect, adminOnly, getAdminFaqs);
router.post('/', protect, adminOnly, createFaq);
router.put('/:id', protect, adminOnly, updateFaq);
router.delete('/:id', protect, adminOnly, deleteFaq);

module.exports = router;
