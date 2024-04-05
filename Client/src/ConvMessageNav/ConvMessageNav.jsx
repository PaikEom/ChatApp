import React, { useEffect, useContext, useState } from "react";
import "./ConvMessageNav.css";
import { FaSearch } from "react-icons/fa";
import Conversation from "../Conversation/Conversation.jsx";
import { AuthContext } from "../index";
import axios from "axios";
import { IoMdPersonAdd } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { MdPeopleAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import SingleUserInfo from "../singleUserInfo/singleUserInfo";
function ConvMessageNav() {
  const {
    currentChat,
    currentUser,
    moveFriends,
    setMoveFriends,
    currentChatId,
  } = useContext(AuthContext);
  const [friendStatus, setFriendStatus] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [showGroupM, setShowGroupM] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [disableOnClick, setDisableOnClick] = useState(true);
  const [findUser, setFindUser] = useState("");
  const [foundedUser, setFoundedUser] = useState([]);
  const [errorDisplay, setErrorDisplay] = useState("");
  const [showLeave, setShowLeave] = useState(false);
  const [toggleUser, setToggleUser] = useState(false);
  const [toSeeUser, setToSeeUser] = useState("");
  const navigate = useNavigate();

  // This function is used to check the members inside of the group
  const seeGroupMembers = async (groupId, group_type) => {
    try {
      const res = await axios.get(
        "http://localhost:8800/api/conv/see/nonPrivateGroups/Members",
        {
          params: { groupId, group_type },
        },
        {
          withCredentials: true,
        }
      );
      setGroupMembers(res.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    seeGroupMembers(
      currentChat?.chat_id || currentChat?.user_groups_chat_id || currentChatId
    );
  }, []);

  const seeFriendsStatus = async (user_id_1, status) => {
    try {
      const res = await axios.get(
        "http://localhost:8800/api/finduser/see/friends",
        {
          params: { user_id_1, status },
        },
        {
          withCredentials: true,
        }
      );
      setFriendStatus(res.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  useEffect(() => {
    seeFriendsStatus(currentUser.id, "accepted");
  }, [showAdd]);

  const [selectedConversations, setSelectedConversations] = useState([]);

  const toggleConversationSelection = (conversationId) => {
    if (selectedConversations.includes(conversationId)) {
      setSelectedConversations(
        selectedConversations.filter((id) => id !== conversationId)
      );
    } else {
      setSelectedConversations([...selectedConversations, conversationId]);
    }
  };
  const sendSelectedConversations = () => {
    selectedConversations?.map((id) =>
      addFriendToGroup(currentChat?.chat_id, id)
    );
  };
  const addFriendToGroup = async (chat_id, user_id) => {
    try {
      const res = await axios.post(
        "http://localhost:8800/api/conv/add_to_group",
        {
          chat_id,
          user_id,
        },
        {
          withCredentials: true,
        }
      );
      console.log("user_id:", user_id, "was added to group");
      location.reload();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  const find = async (findUser, excludedUser) => {
    try {
      const res = await axios.get(
        "http://localhost:8800/api/finduser",
        { params: { findUser, excludedUser } },
        {
          withCredentials: true,
        }
      );

      setFoundedUser(res.data);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };
  const leaveGroupChat = async (chat_id, id) => {
    try {
      const res = await axios.post(
        "http://localhost:8800/api/conv/remove_from_group",
        {
          chat_id,
          id,
        },
        {
          withCredentials: true,
        }
      );
      console.log("user_id:", id, "was removed from group");

      navigate("/add-friends");
      location.reload();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  return (
    <div className={moveFriends ? "chatNav-mainDiv" : "showNothing"}>
      <div>
        <GiHamburgerMenu
          className="burgerMenu"
          onClick={() => setMoveFriends(!moveFriends)}
          size={30}
        />
      </div>
      <div className="chatNav-content">
        <div
          className="convNavInfo"
          onClick={() => {
            if (currentChat?.username) {
              setToggleUser(true), setToSeeUser(currentChat?.username);
            }
          }}
        >
          <img
            src={
              currentChat?.profilePic || `https://placehold.it/40x40&text=MA`
            }
            alt="Profile"
            className="profilePicture"
          />

          <div className="convPtags">
            {currentChat?.username ? (
              <p>{currentChat?.username}</p>
            ) : (
              <p>{currentChat?.chat_topic}</p>
            )}
          </div>
        </div>
        <div className="navIcons">
          {currentChat?.chat_id && (
            <IoMdLogOut
              size={35}
              onClick={() => setShowLeave(true)}
              className="navBtn"
              title="leave Group"
            />
          )}
          {currentChat?.chat_id && (
            <IoMdPersonAdd
              size={35}
              onClick={() => setShowAdd(true)}
              className="navBtn"
              title="Add to Group"
            />
          )}

          <MdPeopleAlt
            className="navBtn"
            size={37}
            onClick={() => setShowGroupM(!showGroupM)}
            title="Group Members"
          />
        </div>
      </div>
      <div>
        {showLeave && (
          <div>
            <div className="overlay" onClick={() => setShowLeave(false)}>
              <div className="popupMenu">
                <p className="userInfoHead">
                  Are you sure you want to leave this group?
                </p>
                <div className="createDiv">
                  <button
                    className="createBtn createBtnDefault"
                    onClick={() => {
                      setShowLeave(false),
                        leaveGroupChat(currentChat.chat_id, currentUser.id);
                    }}
                  >
                    Leave
                  </button>
                  <button
                    className="cancelBtn createBtnDefault"
                    onClick={() => setShowLeave(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        {showGroupM && (
          <div className="memberList scroll ">
            {groupMembers.map((user, index) => (
              <div
                key={index}
                className="groupMembersDiv"
                onClick={() => {
                  setToggleUser(true), setToSeeUser(user?.username);
                }}
              >
                <Conversation user={user} disableOnClick={disableOnClick} />
              </div>
            ))}
          </div>
        )}
      </div>
      {showAdd && (
        <div>
          <div className="overlay" onClick={() => setShowAdd(false)}></div>
          <div className="popupMenu">
            <p className="userInfoHead">Add users to the group</p>

            {friendStatus
              .filter(
                (user) => !groupMembers.some((member) => member.id === user.id)
              )
              .map((user, index) => (
                <div
                  key={index}
                  className="selectionDiv"
                  onClick={() => {
                    toggleConversationSelection(user.id);
                  }}
                >
                  <Conversation user={user} disableOnClick={disableOnClick} />

                  <input
                    type="checkbox"
                    className="selectToGroupBtn"
                    checked={selectedConversations.includes(user.id)}
                    onChange={() => {}}
                  />
                </div>
              ))}
            <div>
              <div className="findUserOutDiv">
                <input
                  type="text"
                  placeholder="Find users"
                  className="findUserInput"
                  autoComplete="off"
                  onChange={(e) => setFindUser(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (findUser.length === 0) {
                        setErrorDisplay("Cant be empty");
                      } else {
                        setErrorDisplay("");
                        find(findUser, currentUser.id);
                      }
                    }
                  }}
                />
                <FaSearch
                  className="findUserIcon"
                  onClick={() => {
                    if (findUser.length > 0) {
                      find(findUser, currentUser.id);
                      setErrorDisplay("");
                    } else {
                      setErrorDisplay("Cant be empty");
                    }
                  }}
                >
                  Find Users
                </FaSearch>
              </div>
              {errorDisplay && <p>{errorDisplay}</p>}
            </div>
            <div>
              {foundedUser
                .filter(
                  (user) =>
                    !groupMembers.some((member) => member.id === user.id) &&
                    !friendStatus.some((friend) => friend.id === user.id)
                )
                .map((user, index) => (
                  <div
                    key={index}
                    className="selectionDiv"
                    onClick={() => {
                      toggleConversationSelection(user.id);
                    }}
                  >
                    <Conversation user={user} disableOnClick={disableOnClick} />
                    <input
                      type="checkbox"
                      className="selectToGroupBtn"
                      checked={selectedConversations.includes(user.id)}
                      onChange={() => {}}
                    />
                  </div>
                ))}
            </div>
            <div className="createDiv">
              <button
                className="createBtn createBtnDefault"
                onClick={() => {
                  sendSelectedConversations(), setShowAdd(false);
                }}
              >
                Send It
              </button>
              <button
                className="cancelBtn createBtnDefault"
                onClick={() => {
                  setShowAdd(false),
                    setFoundedUser([]),
                    setSelectedConversations([]);
                }}
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
      <div>
        {showGroupM && (
          <div className="memberList scroll ">
            {groupMembers.map((user, index) => (
              <div
                key={index}
                className="groupMembersDiv"
                onClick={() => {
                  setToggleUser(true), setToSeeUser(user?.username);
                }}
              >
                <Conversation user={user} disableOnClick={disableOnClick} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ConvMessageNav;
