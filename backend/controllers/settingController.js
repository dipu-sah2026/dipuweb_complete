const Setting = require('../models/Setting');
const { cloudinary, getCloudinaryConfig } = require('../config/cloudinary');

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

// @desc    Test Cloudinary connection & credentials
// @route   POST /api/settings/test-cloudinary
// @access  Private/Admin
const testCloudinaryConnection = async (req, res) => {
  try {
    const { cloudName, apiKey, apiSecret } = req.body;
    const configResult = await getCloudinaryConfig({ cloudName, apiKey, apiSecret });

    if (!configResult.configured) {
      return res.status(400).json({
        success: false,
        message: configResult.error || 'Cloudinary credentials missing or incomplete',
      });
    }

    // Call Cloudinary ping API to verify signature and credentials
    // Use configResult.cloudinary (freshly configured with DB credentials), not the bare global import
    const pingRes = await configResult.cloudinary.api.ping();
    res.json({
      success: true,
      message: `✅ Cloudinary connected successfully for cloud: "${configResult.cloudName}"! (Ping status: ${pingRes.status})`,
      cloudName: configResult.cloudName,
    });
  } catch (err) {
    console.error('[Cloudinary Test Error]:', err);
    let errMsg = err.message || 'Connection failed';
    if (errMsg.includes('Invalid Signature')) {
      errMsg = 'Invalid Signature: Cloudinary API Secret galat hai ya match nahi ho raha. Kripya Cloudinary Console Dashboard se dobara copy karein.';
    } else if (errMsg.includes('Invalid API Key') || errMsg.includes('Unknown API key')) {
      errMsg = 'Invalid API Key: API Key match nahi hui. Kripya check karein.';
    } else if (errMsg.includes('Must supply api_secret')) {
      errMsg = 'API Secret missing hai. Kripya API Secret dalein.';
    } else if (errMsg.includes('403') || errMsg.includes('unexpected status code - 403')) {
      errMsg = 'Cloudinary 403 Forbidden: Cloud Name, API Key ya Secret incorrect hai. Kripya Dashboard se teeno values cross-check karke dalein.';
    }
    res.status(400).json({
      success: false,
      message: errMsg,
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  testCloudinaryConnection,
};
