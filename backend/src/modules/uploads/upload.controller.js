const userService = require('../users/user.service');
const { ApiResponse } = require('../../utils/ApiResponse');
const { HTTP_STATUS } = require('../../utils/constants');

async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(HTTP_STATUS.BAD_REQUEST, null, 'No file uploaded'));
    }
    const avatarUrl = req.file.path;
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
    const imageUrl = req.file.path;
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
    const imageUrls = req.files.map((f) => f.path);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, { images: imageUrls }));
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadAvatar, uploadPostImage, uploadPostImages };
