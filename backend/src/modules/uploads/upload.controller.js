const userService = require('../users/user.service');
const uploadService = require('./upload.service');
const { ApiResponse } = require('../../utils/ApiResponse');
const { HTTP_STATUS } = require('../../utils/constants');

async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, null, 'No file uploaded'));
    }
    const avatarUrl = uploadService.getAvatarUrl(req.file.filename);
    const result = await userService.updateAvatar(req.user.id, avatarUrl);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
  } catch (err) {
    next(err);
  }
}

async function uploadPostImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, null, 'No file uploaded'));
    }
    const imageUrl = uploadService.getPostImageUrl(req.file.filename);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, { imageUrl }));
  } catch (err) {
    next(err);
  }
}

async function uploadPostImages(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, null, 'No files uploaded'));
    }
    const imageUrls = uploadService.getPostImageUrls(req.files);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, { images: imageUrls }));
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadAvatar, uploadPostImage, uploadPostImages };
