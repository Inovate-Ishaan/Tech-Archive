const { Router } = require('express');
const uploadController = require('./upload.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const {
  uploadAvatar,
  uploadPostImage,
  uploadPostImages,
  validateUploadedFile,
  validateUploadedFiles,
  handleMulterError,
} = require('../../middleware/upload.middleware');

const router = Router();

router.post('/avatar', authenticate, uploadAvatar, handleMulterError, validateUploadedFile, uploadController.uploadAvatar);
router.post('/post-image', authenticate, uploadPostImage, handleMulterError, validateUploadedFile, uploadController.uploadPostImage);
router.post('/project-images', authenticate, uploadPostImages, handleMulterError, validateUploadedFiles, uploadController.uploadPostImages);

module.exports = router;
