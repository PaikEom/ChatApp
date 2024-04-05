import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../index";
import io from "socket.io-client";
const socket = io.connect("http://localhost:8800");

function Chat() {
  const { currentUser } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [prev, setPrev] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [prevToggle, setPrevToggle] = useState(false);
  const [editToggle, setEditToggle] = useState(false);
  const [editedMessage, setEditedMessage] = useState({
    message_id: "",
    message_text: "",
    message_chat_id: "",
  });

  const joinRoom = (chatId) => {
    socket.emit("joinRoom", chatId);
    setCurrentChatId(chatId);
    localStorage.setItem("currentChatId", chatId);
  };

  const sendMessage = async (messageContent, chatId, userId) => {
    try {
      const response = await axios.post(
        "http://localhost:8800/api/conv/send_message",
        {
          message_text: messageContent,
          message_chat_id: chatId,
          message_user_id: userId,
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const editMessages = (editData) => {
    console.log(`Edit messages ${editData}`);
    socket.emit("editMessage", editData);
  };
  const deleteMs = (message_id, message_chat_id) => {
    socket.emit("deleteMessage", message_id, message_chat_id);
  };

  useEffect(() => {
    socket.on("deletedMessage", (deletedMessageId) => {
      // Update the local state to remove the deleted message
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.message_id !== deletedMessageId)
      );
      setPrev((prevMessages) =>
        prevMessages.filter((msg) => msg.message_id !== deletedMessageId)
      );
    });

    // Cleanup the socket listener on component unmount
    return () => {
      socket.off("deletedMessage");
    };
  }, []);
  // Listen for incoming messages from the server
  useEffect(() => {
    socket.on("message", (data) => {
      // Update the local state with the received message
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup the socket listeners on component unmount
    return () => {
      socket.off("message");
    };
  }, [setMessages]);

  useEffect(() => {
    socket.on("previousMessages", (data) => {
      console.log(data);
      setPrev(data);
    });
    return () => {
      socket.off("previousMessages");
    };
  }, []);
  useEffect(() => {
    const storedChatId = localStorage.getItem("currentChatId");
    if (storedChatId) {
      joinRoom(parseInt(storedChatId, 10)); // Join the stored chat ID
    }
  }, []);

  useEffect(() => {
    socket.on("editedMessage", (editedMessage) => {
      // Update the local state with the edited message
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.message_id === editedMessage.message_id
            ? { ...msg, message_text: editedMessage.message_text }
            : msg
        )
      );
      setPrev((prevMessages) =>
        prevMessages.map((msg) =>
          msg.message_id === editedMessage.message_id
            ? { ...msg, message_text: editedMessage.message_text }
            : msg
        )
      );
    });

    // Cleanup the socket listener on component unmount
    return () => {
      socket.off("editedMessage");
    };
  }, [setMessages]);

  return (
    <div>
      <p>Message</p>
      <button onClick={() => joinRoom(21)}>JOIN ROOM 21</button>

      <input
        type="text"
        placeholder="Message..."
        name="message"
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={() => sendMessage(message, 21, currentUser.id)}>
        Send Message
      </button>
      <h1>Messages:</h1>
      <div>
        {prev.map((msg, index) => (
          <div key={index}>
            <p>User: {msg.message_user_id}</p>
            <p>{msg.message_text}</p>
            {currentUser.id === msg.message_user_id && (
              <div>
                <button onClick={() => setPrevToggle(msg.message_id)}>
                  Edit
                </button>
                <button onClick={() => setEditToggle(false)}>X</button>
                <button
                  onClick={() => deleteMs(msg.message_id, msg.message_chat_id)}
                >
                  Delete
                </button>
              </div>
            )}

            {prevToggle === msg.message_id && (
              <div>
                <input
                  type="text"
                  placeholder={msg.message_text}
                  name="editedMessage"
                  onChange={(e) =>
                    setEditedMessage({
                      message_id: msg.message_id,
                      message_text: e.target.value,
                      message_chat_id: msg.message_chat_id,
                    })
                  }
                />
                <button
                  onClick={() => {
                    editMessages(editedMessage);
                    setEditToggle(false);
                  }}
                >
                  Done
                </button>
                <button onClick={() => setEditToggle(false)}>X</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <p>{msg.message_text}</p>
            <p>{msg.message_user_id}</p>
            <p>{msg.message_id}</p>
            <p>Chat ID{msg.message_chat_id}</p>
            {currentUser.id === msg.message_user_id && (
              <button onClick={() => setEditToggle(msg.message_id)}>
                Edit
              </button>
            )}
            {editToggle === msg.message_id && (
              <div>
                <input
                  type="text"
                  placeholder={msg.message_text}
                  name="editedMessage"
                  onChange={(e) =>
                    setEditedMessage({
                      message_id: msg.message_id,
                      message_text: e.target.value,
                      message_chat_id: msg.message_chat_id,
                    })
                  }
                />
                <button
                  onClick={() => {
                    editMessages(editedMessage);
                    setEditToggle(false);
                  }}
                >
                  Done
                </button>
                <button onClick={() => setEditToggle(false)}>X</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chat;
