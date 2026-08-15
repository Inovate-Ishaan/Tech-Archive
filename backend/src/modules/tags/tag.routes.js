const express = require("express");
const router = express.Router();
const { authenticate } = require('../../middleware/auth.middleware');


const tagController = require("./tag.controller");


router.get("/",authenticate, tagController.getAllTags);
router.get("/tagz",authenticate,tagController.getTagSpecificPosts);


module.exports = router;