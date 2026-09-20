const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'file-' + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|pdf/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;
  if (allowedTypes.test(ext) || allowedTypes.test(mime)) {
    return cb(null, true);
  }
  cb(new Error('Only images (jpg, png, webp) or pdf files are allowed'));
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter,
});

const videoFileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|mov|avi|mkv|webm|m4v|jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;
  if (allowedTypes.test(ext) || allowedTypes.test(mime) || mime.startsWith('video/')) {
    return cb(null, true);
  }
  cb(new Error('Only video files (mp4, mov, mkv, webm, avi) or images are allowed'));
};

const videoUpload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB limit for video delivery
  fileFilter: videoFileFilter,
});

upload.videoUpload = videoUpload;

module.exports = upload;

