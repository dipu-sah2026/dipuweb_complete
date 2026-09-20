const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['AI Realistic', 'Doctor / Hospital', 'School / Education', 'Business / Brand', 'YouTube Shorts / Reels', 'Travel & Lifestyle'],
      default: 'AI Realistic',
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    aspectRatio: {
      type: String,
      enum: ['9:16', '16:9', '1:1'],
      default: '9:16',
    },
    description: {
      type: String,
      default: '',
    },
    toolsUsed: [
      {
        type: String,
      },
    ],
    featured: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);

