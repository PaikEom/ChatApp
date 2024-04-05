const express = require("express");
const router = express.Router();
const {
  createPrivateChat,
  createGroupChat,
  addToGroupChat,
  leaveGroupChat,
  seePrivateGroups,
  seeNonPrivateGroups,
  seeGroupMembers,
  sendMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} = require("../Controllers/convController");
router.post("/create/private/group", createPrivateChat);
router.post("/create_group", createGroupChat);
router.post("/add_to_group", addToGroupChat);
router.post("/remove_from_group", leaveGroupChat);
router.get("/see/get/groups", seePrivateGroups);
router.get("/see/nonPrivateGroups", seeNonPrivateGroups);
router.get("/see/nonPrivateGroups/Members", seeGroupMembers);
router.post("/send_message", sendMessage);
router.get("/get_messages", getMessages);
router.put("/update_message", updateMessage);
router.delete("/delete_message", deleteMessage);
module.exports = router;
