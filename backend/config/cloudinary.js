const cloudinary = require('cloudinary').v2;
const Setting = require('../models/Setting');

// Helper to clean and sanitize credential strings
const cleanStr = (val) => {
  if (!val || typeof val !== 'string') return '';
  return val.trim().replace(/^['"]|['"]$/g, '').replace(/[\r\n\t\s]/g, '');
};

// Dynamically configure Cloudinary from Admin DB Settings or process.env
const getCloudinaryConfig = async (overrideSettings = null) => {
  let cloud_name = cleanStr(process.env.CLOUDINARY_CLOUD_NAME);
  let api_key = cleanStr(process.env.CLOUDINARY_API_KEY);
  let api_secret = cleanStr(process.env.CLOUDINARY_API_SECRET);

  if (overrideSettings?.cloudName && overrideSettings?.apiKey && overrideSettings?.apiSecret) {
    cloud_name = cleanStr(overrideSettings.cloudName);
    api_key = cleanStr(overrideSettings.apiKey);
    api_secret = cleanStr(overrideSettings.apiSecret);
  } else {
    try {
      const setting = await Setting.findOne();
      if (setting?.cloudinary?.cloudName && setting?.cloudinary?.apiKey && setting?.cloudinary?.apiSecret) {
        cloud_name = cleanStr(setting.cloudinary.cloudName);
        api_key = cleanStr(setting.cloudinary.apiKey);
        api_secret = cleanStr(setting.cloudinary.apiSecret);
      }
    } catch (err) {
      console.error('Error fetching Cloudinary settings from DB:', err.message);
    }
  }

  // Handle accidental pasting of CLOUDINARY_URL (cloudinary://<key>:<secret>@<cloud_name>)
  const findUrl = [cloud_name, api_key, api_secret].find((s) => s.startsWith('cloudinary://'));
  if (findUrl) {
    try {
      const parsed = new URL(findUrl);
      api_key = cleanStr(parsed.username);
      api_secret = cleanStr(parsed.password);
      cloud_name = cleanStr(parsed.hostname);
    } catch (e) {}
  }

  if (cloud_name && api_key && api_secret) {
    cloudinary.config({
      cloud_name,
      api_key,
      api_secret,
      secure: true,
    });
    return { configured: true, cloudinary, cloudName: cloud_name, apiKey: api_key, apiSecret: api_secret };
  }

  return { configured: false, error: 'Cloudinary credentials not configured. Please add in Admin Settings or .env' };
};

module.exports = {
  cloudinary,
  getCloudinaryConfig,
};

