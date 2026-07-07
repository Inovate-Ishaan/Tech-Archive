const userRepository = require('./user.repository');
const ApiError = require('../../utils/ApiError');
const { HTTP_STATUS } = require('../../utils/constants');

async function getProfile(userId) {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }
  return user;
}

async function getProfileByUsername(username) {
  const user = await userRepository.findUserByUsername(username);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }
  return user;
}

async function updateProfile(userId, data) {
  const allowedFields = ['displayname', 'bio', 'branch', 'year', 'github', 'linkedin', 'website'];
  const updateData = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }
  if (Object.keys(updateData).length === 0) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'No valid fields to update');
  }
  return userRepository.updateUser(userId, updateData);
}

async function updateAvatar(userId, avatarPath) {
  return userRepository.updateAvatar(userId, avatarPath);
}

module.exports = { getProfile, getProfileByUsername, updateProfile, updateAvatar };
