import React, { useState, useContext } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoIosRemoveCircle } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { AuthContext } from "../../index";
import SingleUserInfo from "../../singleUserInfo/singleUserInfo";
import generateInitials from "../../initials";
import "./SingleMessage.css";
function formatDate(dateString) {
  const date = new Date(dateString);

  const currentDate = new Date();

  const diffTime = Math.abs(currentDate - date);

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "UTC",
  };

  if (diffDays === 0) {
    return `Today ${date.toLocaleTimeString("en-US", options)}`;
  } else if (diffDays === 1) {
    return `Yesterday ${date.toLocaleTimeString("en-US", options)}`;
  } else {
    return `${date.toLocaleDateString("en-US", options)} `;
  }
}

function SingleMessage(props) {
  const { currentUser } = useContext(AuthContext);
  const [editMerror, setEditMerror] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [toggleUser, setToggleUser] = useState(false);
  const [toSeeUser, setToSeeUser] = useState("");

  const initials = generateInitials(props.msg.firstName, props.msg.lastName);
  const formattedDate = formatDate(props.msg.message_datetime);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  const toggleEditMenu = () => {
    setShowEdit(!showEdit);
  };
  const toggleDeleteMenu = () => {
    setShowDelete(!showDelete);
  };

  return (
    <div className="mainMessageDiv">
      <div className="singleM-iDiv">
        <img
          src={`https://placehold.it/40x40&text=${initials}`}
          alt="Profile"
          className="profilePicture"
          onClick={() => {
            setToggleUser(true), setToSeeUser(props.msg?.username);
          }}
        />
      </div>
      <div className="userMessageData">
        <div className="messageUserEdit">
          <div className="singleUserTime">
            <div>
              <p className="usernamePtag">{props.msg.username}</p>
            </div>
            <div>
              <p className="datePtag">{formattedDate}</p>
            </div>
          </div>
          <div className="singleMessageEdit">
            {currentUser.id == props.msg.message_user_id && (
              <HiOutlineDotsHorizontal
                className="settings"
                size={30}
                onClick={toggleMenu}
              />
            )}
          </div>
        </div>
        <div>
          <p className="messagePtag">{props.msg.message_text}</p>
        </div>
      </div>

      <div>
        {showMenu && (
          <>
            <div className="overlay" onClick={toggleMenu}></div>
            <div className="popupMenu">
              <ul style={{ fontSize: "28px" }}>
                <li
                  onClick={() => {
                    toggleEditMenu(true), toggleMenu(false);
                  }}
                >
                  <span>
                    <FaRegEdit />
                  </span>
                  {"  "}
                  Edit Message
                </li>
                <li
                  onClick={() => {
                    toggleDeleteMenu(true), toggleMenu(false);
                  }}
                >
                  <span>
                    <IoIosRemoveCircle />
                  </span>
                  {"  "}
                  Delete Message
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div>
        {showEdit && (
          <>
            <div
              onClick={() => toggleEditMenu(false)}
              className="overlay"
            ></div>
            <div className="popupMenu">
              <div>
                <p className="userInfoHead">Edit Message</p>
              </div>
              <div className="labelDiv">
                <p>Message</p>
              </div>
              <div>
                <input
                  type="text"
                  name="editedMessage"
                  placeholder="Write Your new message"
                  className="registerInput"
                  onChange={(e) =>
                    props.setEditedMessage({
                      message_id: props.msg.message_id,
                      message_text: e.target.value,
                      message_chat_id: props.msg.message_chat_id,
                    })
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      props.editedMessage.message_text.length > 0
                    ) {
                      props.editMessages(props.editedMessage), toggleEditMenu();
                    }
                  }}
                />
                <div style={{ color: "red" }}>{editMerror && editMerror}</div>
                <div className="createDiv">
                  <button
                    className="createBtnDefault createBtn"
                    onClick={() => {
                      if (props.editedMessage.message_text.length > 0) {
                        props.editMessages(props.editedMessage),
                          toggleEditMenu();
                      } else {
                        setEditMerror("Message Cant Be Empty"); 
                      }
                    }}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => toggleEditMenu(false)}
                    className="cancelBtn createBtnDefault"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div>
        {showDelete && (
          <>
            <div
              onClick={() => toggleDeleteMenu(false)}
              className="overlay"
            ></div>
            <div
              className="popupMenu"

            >
              <div className="userInfoHead deleting">
                <p>Are you sure you want to delete this message ?</p>
              </div>
              <div className="deleteInfoMain">
                <div className="deleteInfoMain">
                  <img
                    src={`https://placehold.it/35x35&text=${initials}`}
                    alt="Profile"
                    className="profilePicture"
                  />
                </div>
                <div>
                  <div className="userTime">
                    <p className="usernamePtag">

                      {props.msg.username}
                    </p>
                    <p className="datePtag">

                      {formattedDate}
                    </p>
                  </div>
                  <div className="messagePtag editMessageP ">

                    <p>{props.msg.message_text}</p>
                  </div>
                </div>
              </div>
              <div className="createDiv">
                <button
                  className="createBtn createBtnDefault"
                  onClick={() => {
                    props.deleteMs(
                      props.msg.message_id,
                      props.msg.message_chat_id
                    ),
                      toggleDeleteMenu();
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={toggleDeleteMenu}
                  className="cancelBtn createBtnDefault"
                >
                  No
                </button>
              </div>
            </div>
          </>
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
          <SingleUserInfo username={toSeeUser} setToggleUser={setToggleUser} />
        </div>
      )}
    </div>
  );
}

export default SingleMessage;
