const Portfolio = require('../models/Portfolio');

// @desc    Get all portfolio items (Public, with optional category filter)
// @route   GET /api/portfolio
// @access  Public
const getPortfolio = async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    const items = await Portfolio.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new portfolio item
// @route   POST /api/portfolio
// @access  Private/Admin
const createPortfolioItem = async (req, res) => {
  try {
    const { title, category, videoUrl, thumbnailUrl, aspectRatio, description, toolsUsed, featured } = req.body;

    if (!title || !category || !videoUrl) {
      return res.status(400).json({ success: false, message: 'Title, category, and videoUrl are required' });
    }

    const item = await Portfolio.create({
      title,
      category,
      videoUrl,
      thumbnailUrl: thumbnailUrl || '',
      aspectRatio: aspectRatio || '9:16',
      description: description || '',
      toolsUsed: Array.isArray(toolsUsed) ? toolsUsed : (toolsUsed ? toolsUsed.split(',').map(t => t.trim()) : ['CapCut', 'AI Tools']),
      featured: featured !== undefined ? Boolean(featured) : true,
    });

    res.status(201).json({ success: true, message: 'Portfolio item added successfully', data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update portfolio item
// @route   PUT /api/portfolio/:id
// @access  Private/Admin
const updatePortfolioItem = async (req, res) => {
  try {
    const item = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }
    res.json({ success: true, message: 'Portfolio item updated', data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete portfolio item
// @route   DELETE /api/portfolio/:id
// @access  Private/Admin
const deletePortfolioItem = async (req, res) => {
  try {
    const item = await Portfolio.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }
    res.json({ success: true, message: 'Portfolio item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPortfolio,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
};

