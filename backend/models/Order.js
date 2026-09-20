const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    invoiceNumber: {
      type: String,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    clientPhone: {
      type: String,
      required: true,
      trim: true,
    },
    serviceTitle: {
      type: String,
      required: true,
    },
    serviceCategory: {
      type: String,
      default: 'General Video Editing',
    },
    aspectRatio: {
      type: String,
      enum: ['9:16 (Shorts/Reels)', '16:9 (YouTube/Landscape)', '1:1 (Square/Post)', 'Custom'],
      default: '9:16 (Shorts/Reels)',
    },
    deliverySpeed: {
      type: String,
      default: 'Standard 24h',
    },
    addons: [
      {
        type: String,
      },
    ],
    scriptNotes: {
      type: String,
      default: '',
    },
    rawFilesLink: {
      type: String,
      default: '',
    },
    baseAmount: {
      type: Number,
      default: 100,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      required: true,
      default: 100,
    },
    utrNumber: {
      type: String,
      required: [true, 'UTR number is required'],
      trim: true,
      match: [/^\d{12}$/, 'UTR number must be exactly 12 numeric digits'],
    },
    paymentScreenshot: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending Verification', 'Payment Verified', 'In Production', 'Revision Requested', 'Completed', 'Cancelled'],
      default: 'Pending Verification',
    },
    deliveryLink: {
      type: String,
      default: '',
    },
    revisionNotes: {
      type: String,
      default: '',
    },
    revisionStatus: {
      type: String,
      default: 'None',
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
