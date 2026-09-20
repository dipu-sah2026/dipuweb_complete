const Review = require('../models/Review');

// @desc    Get approved reviews (Public)
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews/admin
// @access  Private/Admin
const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit client review / feedback
// @route   POST /api/reviews
// @access  Public
const submitReview = async (req, res) => {
  try {
    const { clientName, roleOrCompany, serviceType, rating, comment } = req.body;

    if (!clientName || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide name and comment' });
    }

    const review = await Review.create({
      clientName,
      roleOrCompany: roleOrCompany || 'Creator / Client',
      serviceType: serviceType || 'Video Editing',
      rating: rating ? Number(rating) : 5,
      comment,
      approved: true, // Auto-approved or can be set to false if strict moderation desired
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! Review published.',
      data: review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update / Approve review (Admin)
// @route   PATCH /api/reviews/:id
// @access  Private/Admin
const updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({ success: true, message: 'Review updated', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review (Admin)
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReviews,
  getAllReviewsAdmin,
  submitReview,
  updateReview,
  deleteReview,
};

