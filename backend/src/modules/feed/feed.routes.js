const express = require("express");
const router = express.Router();
const { authenticate } = require('../../middleware/auth.middleware');

const postController = require("./feed.controller");

router.get("/",authenticate, postController.getAllPosts);

module.exports = router;