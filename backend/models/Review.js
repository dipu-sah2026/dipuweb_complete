const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    roleOrCompany: {
      type: String,
      default: 'Content Creator',
    },
    serviceType: {
      type: String,
      default: 'AI Video Editing',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    approved: {
      type: Boolean,
      default: true,
    },
    verifiedBuyer: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);

