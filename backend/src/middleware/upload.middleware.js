const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS } = require('../utils/constants');

const ALLOWED_EXTENSIONS = /\.(jpeg|jpg|png|gif|webp)$/i;

function fileFilter(req, file, cb) {
  if (!ALLOWED_EXTENSIONS.test(path.extname(file.originalname).toLowerCase())) {
    return cb(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Only image files are allowed (jpeg, jpg, png, gif, webp)'), false);
  }
  cb(null, true);
}

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'tech-archive/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 256, height: 256, crop: 'fill' }],
    public_id: (req, file) => {
      const ext = path.extname(file.originalname).toLowerCase();
      return `avatar-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    },
  },
});

const postImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'tech-archive/posts',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    public_id: (req, file) => {
      const ext = path.extname(file.originalname).toLowerCase();
      return `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    },
  },
});

const uploadPostImages = multer({
  storage: postImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).array('images', 5);

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
}).single('avatar');

const uploadPostImage = multer({
  storage: postImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).single('image');

const uploadPostThumbnail = multer({
  storage: postImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).single('thumbnail');

function validateUploadedFile(req, res, next) {
  next();
}

function validateUploadedFiles(req, res, next) {
  next();
}

function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new ApiError(HTTP_STATUS.BAD_REQUEST, 'File too large'));
    }
    return next(new ApiError(HTTP_STATUS.BAD_REQUEST, err.message));
  }
  if (err) return next(err);
  next();
}

module.exports = {
  uploadAvatar,
  uploadPostImage,
  uploadPostThumbnail,
  uploadPostImages,
  validateUploadedFile,
  validateUploadedFiles,
  handleMulterError,
};
