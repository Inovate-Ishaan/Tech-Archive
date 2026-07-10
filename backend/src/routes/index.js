const express = require("express");
const router = express.Router();

const postRoutes = require("../modules/feed/feed.routes");

router.use("/feed", postRoutes);

module.exports = router;