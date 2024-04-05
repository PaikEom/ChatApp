import React, { useContext } from "react";
import generateInitials from "../initials.jsx";
import "./Conversation.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../index.jsx";

function Conversation({ user, disableOnClick }) {
  const { setCurrentChatId, setCurrentChat, setMoveFriends, moveFriends } =
    useContext(AuthContext);
  const initials = generateInitials(user?.firstName, user?.lastName);
  const navigate = useNavigate();

  const showMeTheChat = () => {
    setCurrentChatId(user.user_groups_chat_id);
    navigate("/chats_message");
    setCurrentChat(user);
    console.log(user);
    localStorage.setItem("currentChatId", user.user_groups_chat_id);
    if (window.innerWidth <= 700) {
      setMoveFriends(!moveFriends);
    }
  };
  const rectrictiveChat = () => {
    if (!disableOnClick) {
      showMeTheChat();
    }
  };
  return (
    <div>
      <div
        className={`userInfos ${disableOnClick ? "transparentBackground" : ""}`}
        onClick={rectrictiveChat}
      >
        <img
          src={`https://placehold.it/40x40&text=${initials}`}
          alt="Profile"
          className="profilePicture"
        />
        <div className="profileUsername">
          <p>{user?.username}</p>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
