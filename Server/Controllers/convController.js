const db = require("../dbConnection.js");

const createPrivateChat = (req, res) => {
  const chat_topic = "Private Conversation";
  const chat_type = "private";
  const q =
    "SELECT user_groups_chat_id FROM user_groups WHERE user_groups_user_id IN (?, ?) AND user_groups_type=? GROUP BY user_groups_chat_id HAVING COUNT(DISTINCT user_groups_user_id) = 2;";
  db.query(
    q,
    [req.body.user_id_1, req.body.user_id_2, chat_type],
    (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length > 0) return res.status(200).json(data);
      const insertChatQuery =
        "INSERT INTO chat (chat_topic, chat_type,user_chat_user_id) VALUES (?,?, ?)";

      db.query(
        insertChatQuery,
        [chat_topic, chat_type, req.body.user_id_1],
        (err, chatData) => {
          if (err) return res.status(500).json(err);

          const userGroupsChatId = chatData.insertId;

          const insertUserGroupsQuery =
            "INSERT INTO user_groups (user_groups_chat_id, user_groups_user_id,user_groups_type) VALUES (?, ?,?)";
          db.query(
            insertUserGroupsQuery,
            [userGroupsChatId, req.body.user_id_1, chat_type],
            (err, userGroupsData1) => {
              if (err) return res.status(500).json(err);

              // The first user_groups query has been executed

              const insertUserGroupsQuery2 =
                "INSERT INTO user_groups (user_groups_chat_id, user_groups_user_id,user_groups_type) VALUES (?, ?,?)";
              db.query(
                insertUserGroupsQuery2,
                [userGroupsChatId, req.body.user_id_2, chat_type],
                (err, userGroupsData2) => {
                  if (err) return res.status(500).json(err);

                  // Both user_groups queries have been executed successfully
                  return res.status(200).json([
                    {
                      user_groups_chat_id: userGroupsChatId,
                    },
                  ]);
                }
              );
            }
          );
        }
      );
    }
  );
};

const createGroupChat = (req, res) => {
  const insertChatQuery =
    "INSERT INTO chat (chat_topic, chat_type,user_chat_user_id) VALUES (?,?, ?)";
  const chatTopic = req.body.chat_topic;
  const chat_type = "group";
  db.query(
    insertChatQuery,
    [chatTopic, chat_type, req.body.user_id],
    (err, chatData) => {
      if (err) return res.status(500).json(err);

      const userGroupsChatId = chatData.insertId;

      const insertUserGroupsQuery =
        "INSERT INTO user_groups (user_groups_chat_id, user_groups_user_id,user_groups_type) VALUES (?, ?,?)";
      db.query(
        insertUserGroupsQuery,
        [userGroupsChatId, req.body.user_id, chat_type],
        (err, data) => {
          if (err) return res.status(500).json(err);

          // The first user_groups query has been executed
          return res.status(200).json({
            chat_id: userGroupsChatId,
            chat_topic: chatTopic,
            user_chat_user_id: req.body.user_id,
          });
        }
      );
    }
  );
};
const addToGroupChat = (req, res) => {
  const q =
    "INSERT INTO user_groups (user_groups_chat_id, user_groups_user_id,user_groups_type) VALUES (?, ?,?)";

  const chat_type = "group";
  db.query(q, [req.body.chat_id, req.body.user_id, chat_type], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
const leaveGroupChat = (req, res) => {
  const q =
    "DELETE FROM user_groups WHERE user_groups_chat_id = ? AND user_groups_user_id = ? ";
  db.query(q, [req.body.chat_id, req.body.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// I need to make one to see all the groups that Im in
// To see the groups that im in ( privates ones aka DMS ) is a get request
const seePrivateGroups = (req, res) => {
  const q =
    "SELECT ug.user_groups_chat_id, u.id, u.firstName, u.middleName, u.lastName, u.username, u.mobile, u.email FROM user_groups ug JOIN users u ON ug.user_groups_user_id = u.id WHERE ug.user_groups_chat_id IN (SELECT user_groups_chat_id FROM user_groups WHERE user_groups_user_id = ?) AND ug.user_groups_user_id != ? AND ug.user_groups_type = 'private';";

  db.query(q, [req.query.user_id, req.query.user_id], (err, data) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json(err);
    }

    res.status(200).json(data);
  });
};
// This is to see the groups ( multiple ppl groups ) is a Get request
const seeNonPrivateGroups = (req, res) => {
  const groupType = "group";
  const q =
    "SELECT ug.user_groups_chat_id AS chat_id, c.chat_topic, c.user_chat_user_id, ug.profilePic FROM user_groups ug JOIN chat c ON ug.user_groups_chat_id = c.chat_id WHERE ug.user_groups_user_id = ? AND ug.user_groups_type = ?";
  db.query(q, [req.query.user_id, groupType], (err, data) => {
    if (err) return res.status(err).json(err);

    res.status(200).json(data);
  });
};
// See who's in the group Im in
const seeGroupMembers = (req, res) => {
  const q =
    "SELECT u.*, c.*, us.id,us.firstName,us.middleName,us.lastName,us.username,us.email,u.profilePic FROM user_groups u JOIN chat c ON c.chat_id = u.user_groups_chat_id JOIN users us ON us.id = u.user_groups_user_id WHERE u.user_groups_chat_id = ? ;";

  db.query(q, [req.query.groupId], (err, data) => {
    if (err) return res.status(err).json(err);

    res.status(200).json(data);
  });
};
// need to add a way to send messages and to eddit them // need to make sure the one that edits them is the one that sent them
const sendMessage = (req, res) => {
  const userId = req.body.message_user_id;
  const q =
    "INSERT INTO `message` (`message_text`, `message_chat_id`, `message_user_id`) VALUES (?, ?, ?)";
  db.query(
    q,
    [req.body.message_text, req.body.message_chat_id, req.body.message_user_id],
    (err, data) => {
      if (err) return res.status(500).json(err);

      const messageId = data.insertId;

      // Fetch user data based on message_user_id
      const getUserQuery =
        "SELECT m.message_id, CONVERT_TZ(m.message_datetime, '+00:00', @@global.time_zone) AS message_datetime, m.message_text, m.message_chat_id, m.message_user_id, u.id, u.firstName, u.middleName, u.lastName, u.username, u.email, u.profilePic FROM message m JOIN users u WHERE m.message_id = ? AND u.id = ?";
      db.query(getUserQuery, [messageId, userId], (err, userData) => {
        if (err) return res.status(500).json(err);

        const user = userData[0]; // Assuming there's only one user with this ID
        console.log(user);
        console.log();
        // console.log(res.data.message_datetime);
        // Emit the new message along with user data to the chat room
        req.io.to(req.body.message_chat_id).emit("message", {
          message_id: messageId,
          message_text: user.message_text,
          message_chat_id: user.message_chat_id,
          message_datetime: user.message_datetime,
          message_user_id: user.message_user_id,
          id: user.id,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          profilePic: user.profilePic,
        });

        return res.status(200).json(data);
      });
    }
  );
};

// Function to get all messages from a chat
const getMessages = (req, res) => {
  const q =
    "SELECT * FROM `message` WHERE `message_chat_id` = ? ORDER BY `message_datetime` ASC";
  db.query(q, [req.body.message_chat_id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// Function to update a message
const updateMessage = (req, res) => {
  const q =
    "UPDATE `message` SET `message_text` = ? WHERE `message_id` = ? AND `message_user_id` =?";
  db.query(
    q,
    [req.body.message_text, req.body.message_id, req.body.message_user_id],
    (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    }
  );
};

// Function to delete a message
const deleteMessage = (req, res) => {
  const q = "DELETE FROM `message` WHERE `message_id` = ?";
  db.query(q, [req.body.message_id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

module.exports = {
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
};
