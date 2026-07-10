const { prisma } = require('../../config/prisma');

async function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function findUserByEmailOrUsername(email, username, instituteId) {
  return prisma.user.findFirst({
    where: { OR: [{ email }, { username }, { instituteId }] },
  });
}

async function createUser(data) {
  return prisma.user.create({ data });
}

async function markEmailVerified(userId) {
  return prisma.user.update({
    where: { id: userId },
    data: { emailVerified: true },
  });
}

async function findLatestOtp(email, code) {
  return prisma.otp.findFirst({
    where: { email, code, used: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });
}

async function findLatestOtpByEmail(email) {
  return prisma.otp.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' },
  });
}

async function createOtp(data) {
  return prisma.otp.create({ data });
}

async function invalidateOtps(email) {
  return prisma.otp.updateMany({
    where: { email, used: false },
    data: { used: true },
  });
}

async function markOtpUsed(id) {
  return prisma.otp.update({ where: { id }, data: { used: true } });
}

async function updateUserPassword(userId, hashedPassword) {
  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

async function cleanExpiredOtps() {
  const { count } = await prisma.otp.deleteMany({
    where: { OR: [{ expiresAt: { lte: new Date() } }, { used: true }] },
  });
  if (count > 0) console.log(`Cleaned ${count} OTP(s)`);
  return count;
}

module.exports = {
  findUserByEmail,
  findUserByEmailOrUsername,
  createUser,
  markEmailVerified,
  findLatestOtp,
  updateUserPassword,
  findLatestOtpByEmail,
  createOtp,
  invalidateOtps,
  markOtpUsed,
  cleanExpiredOtps,
};
