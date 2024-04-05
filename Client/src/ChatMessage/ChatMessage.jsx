import { useState, useEffect, useContext, useRef } from "react";
import { IoIosSend } from "react-icons/io";
import { AuthContext } from "../index";
import SingleMessage from "./SingleMessage/SingleMessage";
import ChatNav from "../ConvMessageNav/ConvMessageNav";
import io from "socket.io-client";
import axios from "axios";
import "./ChatMessage.css";
const socket = io.connect("http://localhost:8800");

function ChatMessage() {
  const { currentUser, currentChatId, setCurrentChatId } =
    useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [prev, setPrev] = useState([]);
  // const [singleUser, setSingleUser] = useState(null);
  // const [prevToggle, setPrevToggle] = useState(false);
  // const [editToggle, setEditToggle] = useState(false);
  const [toggleUser, setToggleUser] = useState(false);
  // const [disableOnClick, setDisableOnClick] = useState(true);
  const [editedMessage, setEditedMessage] = useState({
    message_id: "",
    message_text: "",
    message_chat_id: "",
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, prev]);
  // Function to join the room
  const joinRoom = (chatId) => {
    socket.emit("joinRoom", chatId);
    setCurrentChatId(chatId); // Set the current chat ID in state
    localStorage.setItem("currentChatId", chatId); // Store the current chat ID in localStorage
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

      // Handle the response as needed
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };
  const editMessages = (editData) => {
    // Emit the edited message to the server
    socket.emit("editMessage", editData);
  };
  const deleteMs = (message_id, message_chat_id) => {
    socket.emit("deleteMessage", message_id, message_chat_id);
  };
  //Listen for deleted messages
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
      setPrev(data);
    });
    return () => {
      socket.off("previousMessages");
    };
  }, [currentChatId]);

  useEffect(() => {
    const storedChatId = localStorage.getItem("currentChatId");
    if (storedChatId) {
      joinRoom(parseInt(storedChatId, 10));
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
    <div className="convMainDiv">
      <ChatNav />

      <div className="chatConversation">
        {prev.map((msg, index) => (
          <SingleMessage
            msg={msg}
            deleteMs={deleteMs}
            editMessages={editMessages}
            editedMessage={editedMessage}
            setEditedMessage={setEditedMessage}
            setToggleUser={setToggleUser}
            key={index}
          />
        ))}
        {messages.map((msg, index) => (
          <SingleMessage
            msg={msg}
            deleteMs={deleteMs}
            editMessages={editMessages}
            editedMessage={editedMessage}
            setEditedMessage={setEditedMessage}
            setToggleUser={setToggleUser}
            key={index}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="send_message">
        <div className="send_inputDiv">
          <input
            type="text"
            placeholder="Message..."
            className="send_message_input"
            name="message"
            autoComplete="off"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && message.length > 0) {
                e.preventDefault();
                sendMessage(message, currentChatId, currentUser.id);
                setMessage("");
              }
            }}
          />
          <IoIosSend
            className="sendMessageIcon"
            size={30}
            onClick={() => {
              if (message.length > 0) {
                sendMessage(message, currentChatId, currentUser.id);
                setMessage("");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
