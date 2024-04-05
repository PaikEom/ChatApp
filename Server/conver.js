const db = require("./dbConnection");

// Function to send a message
const sendMessage = async (req, res) => {
  try {
    const q =
      "INSERT INTO `message` (`message_text`, `message_chat_id`, `message_user_id`) VALUES (?, ?, ?)";
    const [data] = await db.query(q, [
      req.body.message_text,
      req.body.message_chat_id,
      req.body.message_user_id,
    ]);

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

// Function to get all messages from a chat
const getMessages = async (req, res) => {
  try {
    const q = "SELECT * FROM `message` WHERE `message_chat_id` = ?";
    const [data] = await db.query(q, [req.body.message_chat_id]);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

// Function to update a message
const updateMessage = async (req, res) => {
  try {
    const q =
      "UPDATE `message` SET `message_text` = ? WHERE `message_id` = ? AND `message_user_id` =?";
    const [data] = await db.query(q, [
      req.body.message_text,
      req.body.message_id,
      req.body.message_user_id,
    ]);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

// Function to delete a message
const deleteMessage = async (req, res) => {
  try {
    const q = "DELETE FROM `message` WHERE `message_id` = ?";
    const [data] = await db.query(q, [req.body.message_id]);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

module.exports = { sendMessage, getMessages, updateMessage, deleteMessage };
