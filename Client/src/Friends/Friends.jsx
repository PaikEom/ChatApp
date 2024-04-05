import React, { useContext, useEffect, useState } from "react";
import "./Friends.css";
import Users from "../rightSide/username";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../index";
import NavBar from "../NavBar/NavBar";
import Fuse from "fuse.js";
import { NavLink } from "react-router-dom";
function Friends() {
  const { currentUser } = useContext(AuthContext);
  const [friendStatus, setFriendStatus] = useState(null);
  const [filterResults, setFilterResults] = useState(null);
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

      console.log(res.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  useEffect(() => {
    seeFriendsStatus(currentUser.id, "accepted");
  }, []);
  const updateStatus = async (status, user_id_2, user_id_1) => {
    // To see what I sent to others

    try {
      const res = await axios.post(
        "http://localhost:8800/api/finduser/update_status",
        {
          status,
          user_id_2,
          user_id_1,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      location.reload();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  const fuseSearch = (username) => {
    const fuse = new Fuse(friendStatus, {
      keys: ["username"],
      includeScore: true,

      threshold: 0.3,
    });
    const result = fuse.search(username);
    const filteredFriends = result.map((r) => r.item);

    setFilterResults(filteredFriends);
  };
  return (
    <div className="friendsPage">
      <NavBar />
      <div className="friendsPageMainDiv">
        <div className="friendsInputOutDiv">
          <div className="friendsInputInnerDiv">
            <input
              type="text"
              placeholder="Search Friends"
              className="FriendsInput"
              onChange={(e) => {
                fuseSearch(e.target.value);
              }}
            />
            <FaSearch style={{ cursor: "pointer" }} />
          </div>
        </div>
        <div>
          {filterResults && filterResults.length > 0 && (
            <p className="firendsTP">Results</p>
          )}
          <div className="peopleDiv outerFriendsListDiv">
            <div
              className="
        friendsListDiv divGap"
            >
              {filterResults?.map((data, index) => (
                <div key={index}>
                  <Users
                    data={data}
                    updateStatus={updateStatus}
                    id={currentUser.id}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <p className="firendsTP divGap">Friends</p>
          <div className="peopleDiv outerFriendsListDiv">
            <div
              className="
            friendsListDiv divGap"
            >
              {friendStatus?.length <= 0 && (
                <NavLink to="/add-friends" className="addNavLink">
                  Add New Friends
                </NavLink>
              )}

              {friendStatus?.map((data, index) => (
                <div key={index}>
                  <Users
                    data={data}
                    updateStatus={updateStatus}
                    id={currentUser.id}
                  />
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
