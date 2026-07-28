const { Router } = require('express');
const bookmarkcontroller = require('./bookmark.controller');
const { authenticate } = require('../../middleware/auth.middleware');

const router = Router();

router.post("/:id/bookmark",authenticate,bookmarkcontroller.useBookmark);

module.exports = router