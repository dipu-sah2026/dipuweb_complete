const cloudinary = require('cloudinary').v2;
const Setting = require('../models/Setting');

// Dynamically configure Cloudinary from Admin DB Settings or process.env
const getCloudinaryConfig = async () => {
  let cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  let api_key = process.env.CLOUDINARY_API_KEY;
  let api_secret = process.env.CLOUDINARY_API_SECRET;

  try {
    const setting = await Setting.findOne();
    if (setting?.cloudinary?.cloudName && setting?.cloudinary?.apiKey && setting?.cloudinary?.apiSecret) {
      cloud_name = setting.cloudinary.cloudName;
      api_key = setting.cloudinary.apiKey;
      api_secret = setting.cloudinary.apiSecret;
    }
  } catch (err) {
    console.error('Error fetching Cloudinary settings from DB:', err.message);
  }

  if (cloud_name && api_key && api_secret) {
    cloudinary.config({
      cloud_name,
      api_key,
      api_secret,
      secure: true,
    });
    return { configured: true, cloudinary, cloudName: cloud_name };
  }

  return { configured: false, error: 'Cloudinary credentials not configured. Please add in Admin Settings or .env' };
};

module.exports = {
  cloudinary,
  getCloudinaryConfig,
};
