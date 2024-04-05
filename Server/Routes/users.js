const express = require("express");
const router = express.Router();
const {
  getUser,
  getSingleUser,
  addUser,
  seeFriendsStatus,
  seeFriends,
  updateStatus,
  seeRequests,
  editUser,
} = require("../Controllers/usersController.js");
router.get("/:username", getSingleUser);
router.get("/", getUser);
router.get("/see/pending", seeFriendsStatus);
router.post("/add", addUser);
router.post("/update_status", updateStatus);
router.get("/friend/requests", seeRequests);
router.get("/see/friends", seeFriends);
router.put("/edit", editUser);
module.exports = router;
