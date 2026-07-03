const express = require("express");
const router = express.Router();

const postRoutes = require("../modules/posts/post_routes");

router.use("/posts", postRoutes);

module.exports = router;