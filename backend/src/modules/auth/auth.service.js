const bcrypt = require('bcryptjs');
const authRepository = require('./auth.repository');
const { signToken } = require('../../config/jwt');
const { sendEmail } = require('../../config/mail');
const { OTP_CONFIG } = require('../../utils/constants');
const ApiError = require('../../utils/ApiError');
const { HTTP_STATUS } = require('../../utils/constants');
const env = require('../../config/env');

async function requestOtp(email) {
  await authRepository.invalidateOtps(email);
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + OTP_CONFIG.EXPIRY_MINUTES * 60 * 1000);
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'No account found with this email.');
  }
  await authRepository.createOtp({ email, code, expiresAt, userId: user.id });

  console.log(`\n[DEV] OTP for ${email}: ${code}\n`);

  const subject = 'Your Tech Archive OTP';
  const text = `Your one-time sign-in code is: ${code}. It expires in ${OTP_CONFIG.EXPIRY_MINUTES} minutes.`;
  const html = `<p>Your one-time sign-in code is: <strong>${code}</strong>.</p><p>It expires in ${OTP_CONFIG.EXPIRY_MINUTES} minutes.</p>`;
  const result = await sendEmail({ to: email, subject, text, html });

  return { ...(env.NODE_ENV === 'development' && { devCode: code }), previewUrl: result?.previewUrl };
}

async function verifyOtp(email, code) {
  const lastOtp = await authRepository.findLatestOtpByEmail(email);
  if (!lastOtp) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'No OTP was requested for this email. Please request a new code.');
  }

  if (lastOtp.used) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'This OTP has already been used. Please request a new code.');
  }

  if (lastOtp.expiresAt <= new Date()) {
    await authRepository.markOtpUsed(lastOtp.id);
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'OTP has expired. Please request a new code.');
  }

  if (lastOtp.code !== code) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Incorrect OTP code.');
  }

  await authRepository.markOtpUsed(lastOtp.id);

  const user = await authRepository.findUserByEmail(email);
  if (user) {
    await authRepository.markEmailVerified(user.id);
    if (user.password) {
      const payload = { id: user.id, email: user.email, tokenVersion: user.tokenVersion };
      const token = signToken(payload);
      return {
        token,
        user: { id: user.id, email: user.email, username: user.username },
      };
    }
    return { verified: true, email };
  }

  return { verified: true, email };
}

async function register(body) {
  const { email, username, instituteId, firstName, lastName } = body;

  const existing = await authRepository.findUserByEmailOrUsername(email, username, instituteId);
  if (existing) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'User already exists');
  }

  const displayname = `${firstName.trim()} ${lastName.trim()}`;
  const user = await authRepository.createUser({ email, username, instituteId, displayname });

  const otpResult = await requestOtp(email);

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    message: 'OTP sent to your email',
    ...(env.NODE_ENV === 'development' && { devCode: otpResult.devCode }),
  };
}

async function setPassword(email, password) {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'No account found with this email.');
  }
  if (!user.emailVerified) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Email not verified. Please verify your OTP first.');
  }
  if (user.password) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Password already set. Use forgot password to reset.');
  }

  const hashed = await bcrypt.hash(password, 10);
  await authRepository.updateUserPassword(user.id, hashed);

  return { message: 'Password set successfully' };
}

async function signin(email, password) {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'No account found with this email address.');
  }

  if (!user.emailVerified) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Email not verified. Please verify your OTP first.');
  }

  if (!user.password) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Password not set. Please set your password first.');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Incorrect password. Please try again.');
  }

  const payload = { id: user.id, email: user.email, tokenVersion: user.tokenVersion };
  const token = signToken(payload);
  return {
    token,
    user: { id: user.id, email: user.email, username: user.username },
  };
}

async function resetPassword(email, password) {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'No account found with this email.');
  }
  if (!user.password) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'No password set. Please register first.');
  }

  const otpVerified = await authRepository.hasRecentVerifiedOtp(email);
  if (!otpVerified) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'OTP verification required. Please verify your email first.');
  }

  const hashed = await bcrypt.hash(password, 10);
  const { prisma } = require('../../config/prisma');
  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { password: hashed } }),
    prisma.user.update({ where: { id: user.id }, data: { tokenVersion: { increment: 1 } } }),
  ]);

  return { message: 'Password reset successfully' };
}

module.exports = { requestOtp, verifyOtp, register, signin, setPassword, resetPassword };
