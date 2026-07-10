const express = require("express");
const router = express.Router();

const postController = require("./feed.controller");

router.get("/", postController.getAllPosts);

module.exports = router;