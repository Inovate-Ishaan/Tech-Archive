const { Router } = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const postRoutes = require('../modules/posts/post.routes');
const userRoutes = require('../modules/users/user.routes');
const uploadRoutes = require('../modules/uploads/upload.routes');
const feedRoutes = require('../modules/feed/feed.routes');
const boomarkRoutes = require('../modules/bookmarks/bookmark.routes');
const searchRoutes = require("../modules/search/search.routes");
const tagRoutes = require("../modules/tags/tag.routes")


const router = Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/uploads', uploadRoutes);
router.use("/feed", feedRoutes);
router.use("/bookmark",boomarkRoutes);
router.use("/searches",searchRoutes);
router.use("/tags", tagRoutes);

module.exports = router;


// const postService = require('../modules/posts/post.service');
// const { HTTP_STATUS } = require('../utils/constants');
// const { ApiResponse } = require('../utils/ApiResponse');

// router.get('/feed', async (req, res, next) => {
//   try {
//     const result = await postService.listPosts(req.query);
//     res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
//   } catch (err) {
//     next(err);
//   }
// });


