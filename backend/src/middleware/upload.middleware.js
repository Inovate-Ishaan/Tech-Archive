const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS } = require('../utils/constants');

const IMAGE_MAGIC_BYTES = [
  { offset: 0, bytes: [0xFF, 0xD8, 0xFF] },
  { offset: 0, bytes: [0x89, 0x50, 0x4E, 0x47] },
  { offset: 0, bytes: [0x47, 0x49, 0x46, 0x38] },
  { offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] },
];

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads/avatars');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar-${crypto.randomUUID()}${ext}`);
  },
});

const postImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads/posts');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `post-${crypto.randomUUID()}${ext}`);
  },
});

const ALLOWED_EXTENSIONS = /\.(jpeg|jpg|png|gif|webp)$/i;

function fileFilter(req, file, cb) {
  if (!ALLOWED_EXTENSIONS.test(path.extname(file.originalname).toLowerCase())) {
    return cb(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Only image files are allowed (jpeg, jpg, png, gif, webp)'), false);
  }
  cb(null, true);
}

function validateImageMagicBytes(filepath) {
  try {
    const fd = fs.openSync(filepath, 'r');
    const buffer = Buffer.alloc(4);
    fs.readSync(fd, buffer, 0, 4, 0);
    fs.closeSync(fd);
    return IMAGE_MAGIC_BYTES.some((sig) =>
      sig.bytes.every((byte, i) => buffer[sig.offset + i] === byte)
    );
  } catch {
    return false;
  }
}

function validateUploadedFile(req, res, next) {
  if (!req.file) return next();
  const filepath = req.file.path;
  if (!validateImageMagicBytes(filepath)) {
    fs.unlink(filepath, () => {});
    return next(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid image file'));
  }
  next();
}

function validateUploadedFiles(req, res, next) {
  if (!req.files || req.files.length === 0) return next();
  for (const file of req.files) {
    if (!validateImageMagicBytes(file.path)) {
      fs.unlink(file.path, () => {});
      return next(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid image file: ' + file.originalname));
    }
  }
  next();
}

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
