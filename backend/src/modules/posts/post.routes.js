const { Router } = require('express');
const postController = require('./post.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validate.middleware');
const { uploadPostThumbnail, validateUploadedFile, handleMulterError } = require('../../middleware/upload.middleware');
const { validateCreatePost, validateUpdatePost } = require('./post.validation');

const router = Router();

router.get('/', postController.listPosts);
router.post('/fetch-readme', authenticate, postController.fetchReadme);
router.get('/:id', postController.getPost);
router.post(
  '/',
  authenticate,
  uploadPostThumbnail,
  handleMulterError,
  validateUploadedFile,
  validate(validateCreatePost),
  postController.createPost
);
router.put(
  '/:id',
  authenticate,
  uploadPostThumbnail,
  handleMulterError,
  validateUploadedFile,
  validate(validateUpdatePost),
  postController.updatePost
);
router.delete('/:id', authenticate, postController.deletePost);

module.exports = router;
