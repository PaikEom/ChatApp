import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../index";
import Users from "../rightSide/username";
import NavBar from "../NavBar/NavBar";
import axios from "axios";
import "./AddFriend.css";

function Friends() {
  const { currentUser } = useContext(AuthContext);
  const [foundedUser, setFoundedUser] = useState([]);
  const [findUser, setFindUser] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  const find = async (findUser, excludedUser) => {
    try {
      const res = await axios.get(
        "http://localhost:8800/api/finduser",
        { params: { findUser, excludedUser } },
        {
          withCredentials: true,
        }
      );

      return res.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  useEffect(() => {
    find("", currentUser.id).then((data) => setAllUsers(data));
    setFoundedUser([]);
  }, []);
  return (
    <div className="friendsPage" style={{ marginTop: "50px" }}>
      <NavBar />
      <div className="friendsPageMainDiv">
        <div className="friendInfoDiv">
          <p className="addFriendText">ADD FRIEND</p>
          <p className="addFriendP">You can add friends with their username</p>
          <div className="findPeopleDiv">
            <div className="findPeople ">
              <input
                type="text"
                className="addFriendIn"
                placeholder="Find users"
                onChange={(e) => setFindUser(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && findUser.length > 0) {
                    find(findUser, currentUser.id).then((data) =>
                      setFoundedUser(data)
                    );
                  }
                }}
              />

              <div>
                <button
                  onClick={() => {
                    if (findUser.length > 0) {
                      find(findUser, currentUser.id).then((data) =>
                        setFoundedUser(data)
                      );
                    }
                  }}
                >
                  Find Users
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="peopleDiv ">
            {foundedUser?.length > 0 && (
              <p className="directMessage firendsTP">Search Result</p>
            )}
            <div className="conversationList">
              {foundedUser?.map((data, index) => (
                <div key={index}>
                  <Users data={data} />
                </div>
              ))}
            </div>
          </div>
          <div className="peopleDiv ">
            <p className="directMessage firendsTP">All Users</p>
            <div className="conversationList">
              {allUsers?.map((data, index) => (
                <div key={index}>
                  <Users data={data} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Friends;
