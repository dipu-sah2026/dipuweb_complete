const express = require('express');
const router = express.Router();
const {
  getPortfolio,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} = require('../controllers/portfolioController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getPortfolio);
router.post('/', protect, adminOnly, createPortfolioItem);
router.put('/:id', protect, adminOnly, updatePortfolioItem);
router.delete('/:id', protect, adminOnly, deletePortfolioItem);

module.exports = router;

