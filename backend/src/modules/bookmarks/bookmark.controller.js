const bookmarkService = require("./bookmark.service");
const { ApiResponse } = require('../../utils/ApiResponse');
const { HTTP_STATUS } = require('../../utils/constants');

async function useBookmark(req, res, next) {
    try{
    const username = req.user.username;
    const postId = req.params.id;
    const result = await bookmarkService.toggleBookmark(
        username,
        postId
    );
    res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
    }catch(err){
        next(err)
    }
}

module.exports = { useBookmark }