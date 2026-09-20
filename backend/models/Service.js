const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      default: 'Video Editing',
    },
    description: {
      type: String,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
      default: 100,
    },
    deliveryTime: {
      type: String,
      default: '24 Hours',
    },
    features: [
      {
        type: String,
      },
    ],
    popular: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    iconName: {
      type: String,
      default: 'Video',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);

