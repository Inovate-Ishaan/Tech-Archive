const express = require("express");
const router = express.Router();

const searchController = require("./search.controller")

router.get("/search", searchController.getsearchPosts)

module.exports = router;