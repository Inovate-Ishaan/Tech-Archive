const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('./auth.controller');
const { validate } = require('../../middleware/validate.middleware');
const {
  validateRegister,
  validateRequestOtp,
  validateVerifyOtp,
  validateSignin,
  validateSetPassword,
  validateResetPassword,
} = require('./auth.validation');
const { RATE_LIMITS } = require('../../utils/constants');

const router = Router();

const otpLimiter = rateLimit({
  windowMs: RATE_LIMITS.OTP.windowMs,
  max: RATE_LIMITS.OTP.max,
  message: { success: false, message: 'Too many OTP requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: RATE_LIMITS.AUTH.windowMs,
  max: RATE_LIMITS.AUTH.max,
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const strictLimiter = rateLimit({
  windowMs: RATE_LIMITS.STRICT.windowMs,
  max: RATE_LIMITS.STRICT.max,
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', strictLimiter, validate(validateRegister), authController.register);
router.post('/request-otp', otpLimiter, validate(validateRequestOtp), authController.requestOtp);
router.post('/verify-otp', strictLimiter, validate(validateVerifyOtp), authController.verifyOtp);
router.post('/signin', authLimiter, validate(validateSignin), authController.signin);
router.post('/set-password', authLimiter, validate(validateSetPassword), authController.setPassword);
router.post('/reset-password', authLimiter, validate(validateResetPassword), authController.resetPassword);

module.exports = router;
