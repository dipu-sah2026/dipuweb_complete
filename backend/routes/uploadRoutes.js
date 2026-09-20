const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const upload = require('../middleware/uploadMiddleware');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getCloudinaryConfig } = require('../config/cloudinary');

// @desc    Universal media upload to Cloudinary (Video, Image)
// @route   POST /api/upload/media
// @access  Private/Admin
router.post('/media', protect, adminOnly, upload.videoUpload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select a file to upload' });
  }

  const filePath = req.file.path;
  const folder = req.body.folder || req.query.folder || 'dipueditx_media';

  try {
    const config = await getCloudinaryConfig();
    if (!config.configured) {
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }
      return res.status(400).json({
        success: false,
        message: 'Cloudinary credentials /admin/settings mein configure nahi hain. Kripya Site & UPI Settings me jakar Cloud Name, API Key, aur API Secret save karein.',
      });
    }

    // Determine resource type
    const isVideo = req.file.mimetype.startsWith('video/') || /\.(mp4|mov|avi|mkv|webm|m4v)$/i.test(req.file.originalname);
    const resourceType = isVideo ? 'video' : 'auto';
    const uniquePublicId = `${isVideo ? 'vid' : 'media'}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    console.log(`[Upload API] Uploading ${req.file.originalname} (${(req.file.size / (1024 * 1024)).toFixed(2)} MB) to Cloudinary folder: ${folder}...`);

    let uploadRes;
    const uploadOptions = {
      folder,
      resource_type: resourceType,
      public_id: uniquePublicId,
    };

    if (isVideo && req.file.size > 20 * 1024 * 1024 && typeof config.cloudinary.uploader.upload_large === 'function') {
      uploadRes = await config.cloudinary.uploader.upload_large(filePath, {
        ...uploadOptions,
        chunk_size: 6000000, // 6MB chunks
      });
    } else {
      uploadRes = await config.cloudinary.uploader.upload(filePath, uploadOptions);
    }

    // Remove local temp file
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) {}
    }

    // Derive auto-thumbnail for videos
    let thumbnailUrl = uploadRes.secure_url;
    if (uploadRes.resource_type === 'video') {
      thumbnailUrl = uploadRes.secure_url.replace(/\.[^/.]+$/, '.jpg');
    }

    res.json({
      success: true,
      message: 'File uploaded to Cloudinary successfully',
      url: uploadRes.secure_url,
      thumbnailUrl,
      publicId: uploadRes.public_id,
      resourceType: uploadRes.resource_type,
      format: uploadRes.format,
      duration: uploadRes.duration || null,
      bytes: uploadRes.bytes,
    });
  } catch (error) {
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) {}
    }
    console.error('[Upload API Error]:', error);

    let errorMsg = error.message || 'Failed to upload media to Cloudinary';
    if (errorMsg.includes('Invalid Signature')) {
      errorMsg = 'Cloudinary "Invalid Signature" error: Aapka Cloudinary API Secret galat hai ya match nahi ho raha. Kripya /admin/settings me jakar sahi API Secret dalein aur "Test Connection" karein.';
    } else if (errorMsg.includes('Invalid API Key') || errorMsg.includes('Unknown API key')) {
      errorMsg = 'Cloudinary "Invalid API Key" error: Aapki API Key match nahi hui. Kripya /admin/settings me check karein.';
    } else if (errorMsg.includes('Must supply api_secret')) {
      errorMsg = 'Cloudinary API Secret missing hai. Kripya /admin/settings me jakar API Secret dalein.';
    } else if (errorMsg.includes('403') || errorMsg.includes('unexpected status code - 403')) {
      errorMsg = 'Cloudinary 403 Forbidden Error: Aapka Cloud Name, API Key, ya API Secret galat hai ya account active nahi hai. Kripya /admin/settings me jakar Cloud Name (lower-case), API Key, aur Secret verify karein.';
    }

    res.status(400).json({
      success: false,
      message: errorMsg,
    });
  }
});

module.exports = router;

