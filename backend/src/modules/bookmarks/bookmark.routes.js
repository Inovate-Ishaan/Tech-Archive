const { Router } = require('express');
const bookmarkcontroller = require('./bookmark.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = Router();

router.post("/:id/bookmarks",authenticate,bookmarkcontroller.useBookmark);
router.post("/me/bookmarks",authenticate,bookmarkcontroller.getBookmarks);

module.exports = router