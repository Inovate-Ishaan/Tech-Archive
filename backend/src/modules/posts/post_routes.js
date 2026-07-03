const express = require("express");
const router = express.Router();

const postController = require("./post_controller");

router.get("/", postController.getAllPosts);

module.exports = router;