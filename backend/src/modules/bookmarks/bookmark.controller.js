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

async function getBookmarks(req,res,next) {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(
            Math.max(parseInt(req.query.limit, 10) || 6, 1), 24
        );

        const username = req.user.username;
        const result = await bookmarkService.getAllPosts(page, limit, username);
        res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
    }catch(error){
        next(error);
    }
}

module.exports = { useBookmark , getBookmarks }