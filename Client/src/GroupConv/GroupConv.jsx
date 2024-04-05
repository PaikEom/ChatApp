import React, { useContext } from "react";
import generateInitials from "../initials.jsx";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../index.jsx";

function GroupConv({ user }) {
  const { setCurrentChatId, setCurrentChat, setMoveFriends, moveFriends } =
    useContext(AuthContext);
  const initials = generateInitials(user.firstName, user.lastName);
  const navigate = useNavigate();

  const showMeTheChat = () => {
    setCurrentChatId(user.chat_id);
    navigate("/chats_message");
    setCurrentChat(user);
    console.log(user);
    localStorage.setItem("currentChat", JSON.stringify(user));
    localStorage.setItem("currentChatId", user.chat_id);
    if (window.innerWidth <= 700) {
      setMoveFriends(!moveFriends);
    }
  };

  return (
    <div>
      <div className="userInfos" onClick={showMeTheChat}>
        <img
          src={`https://placehold.it/40x40&text=GC`}
          alt="Profile"
          className="profilePicture"
        />
        <div className="profileUsername">
          <p>{user.chat_topic}</p>
        </div>
      </div>
    </div>
  );
}

export default GroupConv;
