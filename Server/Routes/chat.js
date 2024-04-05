const express = require("express");
const router = express.Router();
const chatUser = require("../Controllers/chatController.js");
router.get("/", chatUser);
router.get("/:id", chatUser);
module.exports = router;
