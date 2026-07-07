const userService = require('./user.service');
const ApiResponse = require('../../utils/ApiResponse');
const { HTTP_STATUS } = require('../../utils/constants');

async function getMe(req, res, next) {
  try {
    const user = await userService.getProfile(req.user.id);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, user));
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, user));
  } catch (err) {
    next(err);
  }
}

async function getUserByUsername(req, res, next) {
  try {
    const user = await userService.getProfileByUsername(req.params.username);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, user));
  } catch (err) {
    next(err);
  }
}

module.exports = { getMe, updateMe, getUserByUsername };
