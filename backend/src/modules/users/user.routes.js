const { Router } = require('express');
const userController = require('./user.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validate.middleware');
const { validateUpdateProfile } = require('./user.validation');

const router = Router();

router.get('/me', authenticate, userController.getMe);
router.put('/me', authenticate, validate(validateUpdateProfile), userController.updateMe);
router.get('/:username', userController.getUserByUsername);

module.exports = router;
