const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, testCloudinaryConnection } = require('../controllers/settingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getSettings);
router.put('/', protect, adminOnly, updateSettings);
router.post('/test-cloudinary', protect, adminOnly, testCloudinaryConnection);

module.exports = router;

