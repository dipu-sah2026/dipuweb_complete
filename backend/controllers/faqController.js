const Faq = require('../models/Faq');

// @desc    Get all active FAQs (Public)
// @route   GET /api/faqs
// @access  Public
const getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({ active: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all FAQs (Admin)
// @route   GET /api/faqs/admin
// @access  Private/Admin
const getAdminFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create FAQ
// @route   POST /api/faqs
// @access  Private/Admin
const createFaq = async (req, res) => {
  try {
    const { question, answer, category, order, active } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required' });
    }

    const faq = await Faq.create({
      question,
      answer,
      category: category || 'General',
      order: order !== undefined ? Number(order) : 0,
      active: active !== undefined ? Boolean(active) : true,
    });

    res.status(201).json({ success: true, message: 'FAQ created successfully', data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update FAQ
// @route   PUT /api/faqs/:id
// @access  Private/Admin
const updateFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.json({ success: true, message: 'FAQ updated successfully', data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete FAQ
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
const deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.json({ success: true, message: 'FAQ removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFaqs,
  getAdminFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
};

