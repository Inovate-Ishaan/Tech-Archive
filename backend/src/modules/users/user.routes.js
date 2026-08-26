const { Router } = require('express');
const userController = require('./user.controller');
const { authenticate, optionalAuth } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validate.middleware');
const { validateUpdateProfile, validateUpdateUsername } = require('./user.validation');

const router = Router();

router.get('/me', authenticate, userController.getMe);
router.put('/me', authenticate, validate(validateUpdateProfile), userController.updateMe);
router.get('/:username', optionalAuth, userController.getUserByUsername);
router.put('/:username', authenticate, validate(validateUpdateUsername), userController.updateUsername);

module.exports = router;
