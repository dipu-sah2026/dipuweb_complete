const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      default: 'Dipu Sah - Video Editor & AI Video Creator',
    },
    domain: {
      type: String,
      default: 'dipueditx.in',
    },
    whatsappNumber: {
      type: String,
      default: '7481968724',
    },
    contactEmail: {
      type: String,
      default: 'contact@dipueditx.in',
    },
    formSubmitEmail: {
      type: String,
      default: 'dipusah7481@gmail.com',
    },
    upiId: {
      type: String,
      default: '7481968724@upi',
    },
    upiName: {
      type: String,
      default: 'Dipu Sah',
    },
    customQrUrl: {
      type: String,
      default: '',
    },
    startingPrice: {
      type: Number,
      default: 100,
    },
    bannerNotice: {
      type: String,
      default: '🔥 Special Offer: Professional AI Videos & Shorts Editing Starting @ Just ₹100! 24h Express Delivery.',
    },
    enableNotice: {
      type: Boolean,
      default: true,
    },
    bannerCtaText: {
      type: String,
      default: 'Order Now',
    },
    bannerCtaLink: {
      type: String,
      default: '/order',
    },
    tagline: {
      type: String,
      default: 'Your Idea, My Editing & AI Magic',
    },
    socialLinks: {
      youtube: {
        type: String,
        default: 'https://youtube.com',
      },
      instagram: {
        type: String,
        default: 'https://instagram.com',
      },
      facebook: {
        type: String,
        default: 'https://facebook.com',
      },
      telegram: {
        type: String,
        default: 'https://t.me',
      },
      linkedin: {
        type: String,
        default: '',
      },
    },
    urgencyHours: {
      type: Number,
      default: 48,
    },
    cloudinary: {
      cloudName: {
        type: String,
        trim: true,
        default: '',
      },
      apiKey: {
        type: String,
        trim: true,
        default: '',
      },
      apiSecret: {
        type: String,
        trim: true,
        default: '',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
