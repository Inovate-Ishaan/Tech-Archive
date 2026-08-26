const userService = require('./user.service');
const { ApiResponse } = require('../../utils/ApiResponse');
const { HTTP_STATUS } = require('../../utils/constants');

async function getMe(req, res, next) {
  try {
    const user = await userService.getProfile(req.user.id);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, { ...user, edit_access: true }));
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
    const edit_access = req.user?.username === req.params.username;
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, { ...user, edit_access }));
  } catch (err) {
    next(err);
  }
}

async function updateUsername(req, res, next) {
  try {
    const user = await userService.updateUsername(req.user.id, req.params.username, req.body.username);
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, user));
  } catch (err) {
    next(err);
  }
}

module.exports = { getMe, updateMe, getUserByUsername, updateUsername };
