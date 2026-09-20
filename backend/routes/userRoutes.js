const express = require('express');
const router = express.Router();
const { getAllUsers, updateProfile } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getAllUsers);
router.put('/profile', protect, updateProfile);

module.exports = router;
