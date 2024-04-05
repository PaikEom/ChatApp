const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../Controllers/authController.js");

router.post("/find/register", register);
router.post("/find/login", login);
router.post("/find/logout", logout);
module.exports = router;
