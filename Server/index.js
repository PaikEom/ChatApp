const express = require("express"); // inporting express
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express(); // using express
const http = require("http");
const { Server } = require("socket.io");
const db = require("./dbConnection.js");
const server = http.createServer(app);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
app.use((req, res, next) => {
  req.io = io;
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(cookieParser());

// midlewhale
const userRoutes = require("./Routes/users.js");
const chatRoutes = require("./Routes/chat.js");
const authRoutes = require("./Routes/auth.js");
const convRoutes = require("./Routes/conv.js");

app.use("/api/finduser", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/conv", convRoutes);

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinRoom", (chatId) => {
    // Leave the current room
    if (socket.room) {
      socket.leave(socket.room);
      console.log(`User left room: ${socket.room}`);
    }

    // Join the new room
    socket.join(chatId);
    socket.room = chatId;
    console.log(`User joined room: ${chatId}`);
    // Now we need to get the previously sent messages
    db.query(
      "SELECT u.id, u.firstName, u.lastName, u.username, u.email, u.profilePic, m.message_id, CONVERT_TZ(m.message_datetime, '+00:00', @@global.time_zone) AS message_datetime, m.message_text, m.message_chat_id, m.message_user_id FROM users u JOIN message m ON u.id = m.message_user_id WHERE m.message_chat_id = ? ORDER BY m.message_datetime ASC",
      [chatId],
      (err, messages) => {
        if (err) {
          console.error("Error fetching previous messages:", err);
        } else {
          // Emit previous messages to the newly connected user
          socket.emit("previousMessages", messages);
        }
      }
    );
  });

  socket.on("sendMessage", (data) => {
    io.to(data.message_chat_id).emit("message", data);
    console.log(data);
  });
  socket.on("editMessage", async (editedMessage) => {
    // Update the message in the database
    const { message_id, message_text } = editedMessage;

    try {
      await db.query(
        "UPDATE `message` SET `message_text` = ? WHERE `message_id` = ?",
        [message_text, message_id]
      );

      // Broadcast the updated message to all users in the chat room
      io.to(editedMessage.message_chat_id).emit("editedMessage", editedMessage);
    } catch (error) {
      console.error("Error updating message:", error);
    }
  });
  socket.on("deleteMessage", async (message_id, message_chat_id) => {
    console.log(message_id, message_chat_id);
    try {
      await db.query("DELETE FROM `message` WHERE `message_id` = ?", [
        message_id,
      ]);

      // Broadcast the deleted message ID to all users in the chat room
      io.to(message_chat_id).emit("deletedMessage", message_id);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(8800, "0.0.0.0", () => {
  console.log("server is running on port 8800");
});
