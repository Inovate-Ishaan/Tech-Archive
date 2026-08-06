const { Router } = require('express');
const bookmarkcontroller = require('./bookmark.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = Router();

router.post("/:id/bookmark",authenticate,bookmarkcontroller.useBookmark);
router.post("/me/bookmark",authenticate,bookmarkcontroller.getBookmarks);

module.exports = router