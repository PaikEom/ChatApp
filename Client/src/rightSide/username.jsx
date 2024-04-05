import React, { useContext, useState } from "react";
import { IoMdChatboxes, IoMdPersonAdd } from "react-icons/io";
import "./username.css";
import axios from "axios";
import { AuthContext } from "../index";
import { useNavigate } from "react-router-dom";
import { IoIosRemoveCircle } from "react-icons/io";
import SingleUserInfo from "../singleUserInfo/singleUserInfo";
function Username(props) {
  // This will be used to display friends
  const navigate = useNavigate();
  const [showRemoveF, setShowRemoveF] = useState(false);
  const [toggleUser, setToggleUser] = useState(false);
  const [toSeeUser, setToSeeUser] = useState("");
  const [hideAdd, setHideAdd] = useState(false);
  const { currentUser, setCurrentChatId, addUser, setCurrentChat } =
    useContext(AuthContext);
  const createPrivateChat = async (user_id_1, user_id_2) => {
    try {
      const res = await axios.post(
        "http://localhost:8800/api/conv/create/private/group",
        {
          user_id_1,
          user_id_2,
        },
        {
          withCredentials: true,
        }
      );

      setCurrentChatId(res.data[0].user_groups_chat_id);
      navigate("/chats_message");
      setCurrentChat(props.data);
      console.log(res.data[0].user_groups_chat_id);
      localStorage.setItem("currentChatId", res.data[0].user_groups_chat_id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <div className="mainPeopleDiv">
      <div
        className="userI"
        onClick={() => {
          setToggleUser(true), setToSeeUser(props.data?.username);
        }}
      >
        <img
          src={`https://placehold.it/40x40&text=AB`}
          alt="Profile"
          className="profilePicture"
        />
        <div className="onlineDot"></div>

        <div className="profileUsername">
          <p>{props.data?.username}</p>
        </div>
      </div>
      <div>
        {showRemoveF && (
          <div>
            <div
              className="overlay"
              onClick={() => setShowRemoveF(false)}
            ></div>
            <div className="popupMenu">
              <p className="userInfoHead">
                Are you sure you want to unfriend {props.data?.username}
              </p>
              <div className="createDiv">
                <button
                  onClick={() =>
                    props.updateStatus("rejected", props.id, props.data.id)
                  }
                  className="createBtnDefault createBtn"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowRemoveF(false)}
                  className="cancelBtn createBtnDefault"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="actionsDiv">
          <IoMdChatboxes
            size={30}
            className="personIcons"
            title="Conversation"
            onClick={() => {
              createPrivateChat(currentUser.id, props.data.id);
            }}
          />

          {props.data?.status === "accepted" && (
            <IoIosRemoveCircle
              size={30}
              onClick={() => setShowRemoveF(true)}
              className="personIcons"
              title="Unfriend"
            />
          )}
          {props.data?.status === "pending" && null}
          {props.data?.status === "rejected" && null}
          {!["accepted", "pending", "rejected"].includes(
            props.data?.status
          ) && (
            <IoMdPersonAdd
              size={30}
              onClick={() => {
                addUser(currentUser.id, props.data.id);
                setHideAdd(true);
              }}
              title="Add User"
              className={hideAdd ? "hide" : "personIcons"}
            />
          )}
        </div>

        {toggleUser && (
          <div>
            <div
              className="overlay"
              onClick={() => {
                setToggleUser(false), setToSeeUser("");
              }}
            ></div>
            <SingleUserInfo
              username={toSeeUser}
              setToggleUser={setToggleUser}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Username;
