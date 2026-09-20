const Setting = require('../models/Setting');

// @desc    Get website global settings (Public)
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({
        brandName: 'Dipu Sah - Video Editor & AI Video Creator',
        domain: 'dipueditx.in',
        whatsappNumber: '7481968724',
        contactEmail: 'contact@dipueditx.in',
        formSubmitEmail: 'dipusah7481@gmail.com',
        upiId: '7481968724@upi',
        upiName: 'Dipu Sah',
        customQrUrl: '',
        startingPrice: 100,
        bannerNotice: '🔥 Special Offer: Professional AI Videos & Shorts Editing Starting @ Just ₹100! 24h Express Delivery.',
        enableNotice: true,
        tagline: 'Your Idea, My Editing & AI Magic',
        socialLinks: {
          youtube: 'https://youtube.com',
          instagram: 'https://instagram.com',
          facebook: 'https://facebook.com',
          telegram: 'https://t.me',
          linkedin: '',
        },
      });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update website settings (Admin)
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      settings = await Setting.findByIdAndUpdate(
        settings._id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
    }
    console.log(`[Settings Updated]: UPI ID set to "${settings.upiId}", Name: "${settings.upiName}"`);
    res.json({ success: true, message: 'Settings updated successfully', data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
