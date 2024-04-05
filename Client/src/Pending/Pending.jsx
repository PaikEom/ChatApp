import React, { useState, useContext, useEffect } from "react";
import Users from "../rightSide/username";
import axios from "axios";
import { AuthContext } from "../index";
import FriendReq from "../FriendReq/FriendReq";
import NavBar from "../NavBar/NavBar";
import "./pending.css";
function Pending() {
  const { currentUser } = useContext(AuthContext);
  const [friendStatus, setFriendStatus] = useState(null);
  const [whatIgot, setWhatIgot] = useState([]);

  const seeFriendsStatus = async (user_id_1, status) => {
    // To see what I sent to others

    try {
      const res = await axios.get(
        "http://localhost:8800/api/finduser/see/pending",
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
    seeFriendsStatus(currentUser.id, "pending");
  }, []);

  // Second Step Allow users to see the friend requests they got
  const seeRequests = async (user_id_2, status) => {
    try {
      const res = await axios.get(
        "http://localhost:8800/api/finduser/friend/requests",
        {
          params: { user_id_2, status },
        },
        {
          withCredentials: true,
        }
      );
      setWhatIgot(res.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  useEffect(() => {
    seeRequests(currentUser.id, "pending");
  }, []);
  // last step allow them to do something about the request
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
  return (
    <div className="friendsPage">
      <NavBar />
      <div className="friendsPageMainDiv">
        <p
          className="
          addFriendText pendingHead"
        >
          CHECK FRIEND STATUS
        </p>
        <div className="peopleDiv ">
          {friendStatus?.length > 0 && (
            <p className="directMessage firendsTP">Pending Friend Requests</p>
          )}
          {friendStatus?.length === 0 && (
            <p className="directMessage firendsTP">
              No pending friend requests.
            </p>
          )}
          <div
            className="
        conversationList"
          >
            {friendStatus?.map((data, index) => (
              <div key={index}>
                <Users data={data} />
              </div>
            ))}
          </div>
        </div>

        <div className="peopleDiv ">
          {whatIgot?.length > 0 && (
            <p className="directMessage firendsTP">Friend Request</p>
          )}
          {whatIgot?.length === 0 && (
            <p className="directMessage firendsTP">No friend requests.</p>
          )}
          <div
            className="
        conversationList"
          >
            {whatIgot?.map((data, index) => (
              <div key={index}>
                <FriendReq
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
  );
}

export default Pending;
