const postService = require("./feed.service");
const {sendSuccess} = require("../../utils/ApiResponse")
const {sendError} = require("../../utils/ApiResponse")


const getAllPosts = async (req, res,next) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

        const limit = Math.min(
            Math.max(parseInt(req.query.limit, 10) || 6, 1),
            20
        );

        const result = await postService.getAllPosts(page, limit);

        sendSuccess(res,200,"Posts Fetched successfully",result.posts,{pagination:result.pagination})
    }catch(error){
        next(error);
    }
};

module.exports = {
    getAllPosts
};