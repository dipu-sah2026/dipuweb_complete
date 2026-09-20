require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Setting = require('./models/Setting');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const s = await Setting.findOne();
    if (!s) {
      console.log('No settings document found in DB.');
    } else {
      console.log('Cloudinary settings:', JSON.stringify(s.cloudinary, null, 2));
    }
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await mongoose.disconnect();
  }
})();