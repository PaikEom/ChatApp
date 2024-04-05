import React, { useContext, useState, useEffect } from "react";
import generateInitials from "../initials.jsx";
import { AuthContext } from "../index.jsx";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Conversation from "../Conversation/Conversation.jsx";
import { MdGroups } from "react-icons/md";
import { IoMdPerson } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { MdSettingsApplications } from "react-icons/md";
import "./leftBar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GroupConv from "../GroupConv/GroupConv.jsx";
import SingleUserInfo from "../SingleUserInfo/singleUserInfo.jsx";
function LeftBar({ showFriends, setShowFriends }) {
  const {
    currentUser,
    setCurrentChatId,
    moveFriends,
    setMoveFriends,
    setCurrentChat,
  } = useContext(AuthContext);
  const [options, setOptions] = useState(false);
  const [toggleUser, setToggleUser] = useState(false);
  const [showPersonal, setShowPersonal] = useState(false);
  const [showCreateG, setShowCreateG] = useState(false);
  const [logOutQuestion, setLogOutQuestion] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [toSeeUser, setToSeeUser] = useState("");
  const [regularGroups, setRegularGroups] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [showDirectMessage, setShowDirectMessage] = useState(
    localStorage.getItem("showDirectMessage") === "true"
  );

  useEffect(() => {
    localStorage.setItem("showDirectMessage", showDirectMessage);
  }, [showDirectMessage]);

  const navigate = useNavigate();

  const toggleShowFriends = () => {
    setShowFriends(!showFriends);
    if (showFriends) {
      navigate("/");
    } else {
      navigate("/friends");
    }
    if (window.innerWidth <= 700) {
      setMoveFriends(!moveFriends);
    }
  };
  const togglePersonal = () => {
    setShowPersonal(!showPersonal);
  };

  const initials = generateInitials(
    currentUser.firstName,
    currentUser.lastName
  );
  const [userData, setUserData] = useState({
    firstName: currentUser?.firstName,
    middleName: currentUser?.middleName,
    lastName: currentUser?.lastName,
    mobile: currentUser?.mobile,
    email: currentUser?.email,
    city: currentUser?.city,
    profilePic: currentUser?.profilePic,
    id: currentUser?.id,
  });
  const [isEmpty, setIsEmpty] = useState({
    firstName: false,
    middleName: false,
    lastName: false,
    mobile: false,
    email: false,
    city: false,
  });
  const [editedData, setEditedData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setIsEmpty((prev) => ({ ...prev, [name]: true }));

    setIsEmpty((prev) => ({ ...prev, [name]: false }));
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedData = { ...userData, ...editedData };
    setUserData(updatedData);
    setEditedData({});

    editUser(
      updatedData.firstName,
      updatedData.middleName,
      updatedData.lastName,
      updatedData.mobile,
      updatedData.email,
      updatedData.city,
      updatedData.profilePic,
      updatedData.id
    );
  };

  const optionsSize = options ? 130 : 0;

  const handleLogOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("user");

    navigate("/login");
  };
  const seeGroups = async (user_id) => {
    try {
      const res = await axios.get(
        "http://localhost:8800/api/conv/see/get/groups",
        {
          params: { user_id },
        },
        {
          withCredentials: true,
        }
      );

      setGroups(res.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  useEffect(() => {
    seeGroups(currentUser.id);
  }, []);

  const createGroupChat = async (chat_topic, user_id) => {
    try {
      const res = await axios.post(
        "http://localhost:8800/api/conv/create_group",
        {
          chat_topic,
          user_id,
        },
        {
          withCredentials: true,
        }
      );

      setCurrentChatId(res.data.user_groups_chat_id);
      console.log(res.data);
      localStorage.setItem("currentChatId", res.data.user_groups_chat_id);
      setCurrentChat(res.data);
      navigate("/chats_message");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  // to see the gorups Im in
  const seeNonPrivateGroups = async (user_id) => {
    try {
      const res = await axios.get(
        "http://localhost:8800/api/conv/see/nonPrivateGroups",
        {
          params: { user_id },
        },
        {
          withCredentials: true,
        }
      );

      setRegularGroups(res.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  useEffect(() => {
    seeNonPrivateGroups(currentUser.id);
  }, []);

  // This function is used to check the members inside of the group
  const editUser = async (
    firstName,
    middleName,
    lastName,
    mobile,
    email,
    city,
    profilePic,
    id
  ) => {
    try {
      const res = await axios.put(
        "http://localhost:8800/api/finduser/edit",
        {
          firstName,
          middleName,
          lastName,
          mobile,
          email,
          city,
          profilePic,
          id,
        },
        {
          withCredentials: true,
        }
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      location.reload();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <div className="mainLeftDiv">
      <div className="topDiv">
        <div className="userPersonalDiv">
          <div
            className="userInfo"
            onClick={() => {
              setToSeeUser(currentUser.username), setToggleUser(true);
            }}
          >
            <img
              src={
                currentUser.profilePic ||
                `https://placehold.it/40x40&text=${initials}`
              }
              alt="Profile"
              className="profilePicture"
            />

            <div className="profileUsername">
              <p>{currentUser.username}</p>
            </div>
          </div>

          {options ? (
            <IoIosClose
              size={35}
              onClick={() => setOptions(false)}
              className="closeBtn"
              title="close"
            />
          ) : (
            <HiOutlineDotsHorizontal
              onClick={() => setOptions(true)}
              className="settings"
              title="Settings"
              size={35}
            />
          )}
        </div>

        <div style={{ height: optionsSize }} className="options">
          <div className="inerOptions">
            <div
              className="logOutOption settingsColor"
              onClick={togglePersonal}
            >
              <MdSettingsApplications size={30} />
              <p>User Settings</p>
            </div>
            <div
              className="logOutOption logOut"
              onClick={() => setLogOutQuestion(true)}
            >
              <IoLogOut size={30} />
              <p>Log Out </p>
            </div>
            <div>
              {logOutQuestion && (
                <div>
                  <div
                    className="overlay"
                    onClick={() => setLogOutQuestion(false)}
                  ></div>
                  <div className="popupMenu">
                    <div>
                      <p className="userInfoHead ">
                        Are you sure you want to log out?
                      </p>
                    </div>
                    <div className="createDiv">
                      <button
                        onClick={handleLogOut}
                        className="createBtn createBtnDefault"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setLogOutQuestion(false)}
                        className="cancelBtn createBtnDefault"
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="inputDiv">
          <div className="btnInnerDiv">
            <button
              onClick={() => setShowDirectMessage(true)}
              className={`leftBarBtn directBtn ${
                showDirectMessage ? "active" : "inactive"
              }`}
            >
              Direct
            </button>
            <button
              onClick={() => setShowDirectMessage(false)}
              className={`leftBarBtn groupBtn ${
                showDirectMessage ? "inactive" : "active"
              }`}
            >
              Groups
            </button>
          </div>
        </div>
      </div>
      <div className="peopleDiv peopleDiv_Left scroll scrollLeftColor">
        <p className="directMessage">Direct Messages</p>
        <div className="conversationList">
          {showDirectMessage
            ? groups.map((user, index) => (
                <Conversation user={user} key={index} />
              ))
            : regularGroups.map((user, index) => (
                <GroupConv user={user} key={index} />
              ))}
        </div>
      </div>
      <div className="bottomDiv">
        <div className="bottomIner">
          <div>
            <IoMdPerson
              size={45}
              className="friends"
              onClick={toggleShowFriends}
              title="Friends"
            />
          </div>
          <div>
            <MdGroups
              size={45}
              className="group"
              onClick={() => setShowCreateG(true)}
              title="Create Group"
            />
          </div>
        </div>
      </div>
      <div>
        {showCreateG && (
          <div>
            <div
              className="overlay"
              onClick={() => {
                setShowCreateG(false), setErrorMessage("");
              }}
            ></div>
            <div className="popupMenu">
              <div>
                <h4>Create a New Group</h4>
              </div>

              <div className="groupOut">
                <div className="groupInnerDiv">
                  <input
                    type="text"
                    placeholder="Group Name"
                    className="registerInput"
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>
                {errorMessage.length > 0 && (
                  <p className="errorMessage"> {errorMessage}</p>
                )}
              </div>
              <div className="createDiv">
                <button
                  onClick={() => {
                    if (groupName.length >= 1) {
                      createGroupChat(groupName, currentUser.id);
                    } else {
                      setErrorMessage("Group Name Can't be empty");
                    }
                  }}
                  className="createBtn createBtnDefault"
                >
                  Create
                </button>
                <button
                  className="cancelBtn createBtnDefault"
                  onClick={() => {
                    setShowCreateG(false), setErrorMessage("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        {showPersonal && (
          <div>
            <div className="overlay" onClick={togglePersonal}></div>
            <div className="popupMenu " style={{ padding: "0" }}>
              <div className="infoForm">
                <div>
                  <h4 className="userInfoHead ">Edit User Data</h4>
                  <div>
                    <div className="labelDiv">
                      <label>
                        <p>First Name</p>
                      </label>
                    </div>
                    <div className="groupInnerDiv">
                      <input
                        type="text"
                        name="firstName"
                        className="registerInput"
                        value={editedData.firstName || userData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    {isEmpty.firstName && <p>Input cannot be empty</p>}
                  </div>
                  <div className="groupOuterDiv">
                    <div className="labelDiv">
                      <label>
                        <p>Middle Name</p>
                      </label>
                    </div>
                    <div className="groupInnerDiv">
                      <input
                        type="text"
                        name="middleName"
                        className="registerInput"
                        value={
                          editedData?.middleName || userData?.middleName || ""
                        }
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="groupOuterDiv">
                    <div className="labelDiv">
                      <label>
                        <p>Last Name</p>
                      </label>
                    </div>
                    <div className="groupInnerDiv">
                      <input
                        type="text"
                        name="lastName"
                        className="registerInput"
                        value={editedData?.lastName || userData?.lastName || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="groupOuterDiv">
                    <div className="labelDiv">
                      <label>
                        <p>Mobile</p>
                      </label>
                    </div>

                    <div className="groupInnerDiv">
                      <input
                        type="text"
                        name="mobile"
                        className="registerInput"
                        value={editedData?.mobile || userData?.mobile || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="groupOuterDiv">
                    <div className="labelDiv">
                      <label>
                        <p>Email</p>
                      </label>
                    </div>
                    <div className="groupInnerDiv">
                      <input
                        type="text"
                        name="email"
                        className="registerInput"
                        value={editedData?.email || userData?.email || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="groupOuterDiv">
                    <div className="labelDiv">
                      <label>
                        <p>City</p>
                      </label>
                    </div>
                    <div className="groupInnerDiv">
                      <input
                        type="text"
                        name="city"
                        className="registerInput"
                        value={editedData?.city || userData?.city || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="createDiv">
                  <button
                    className="createBtnDefault createBtn"
                    onClick={handleSave}
                  >
                    send It
                  </button>
                  <button
                    className="cancelBtn createBtnDefault"
                    onClick={togglePersonal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
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

export default LeftBar;
