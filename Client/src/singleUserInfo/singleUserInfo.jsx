import React, { useState, useEffect } from "react";
import axios from "axios";
import Conversation from "../Conversation/Conversation";
import { IoIosClose } from "react-icons/io";
import "./singleUserInfo.css";

function SingleUserInfo(props) {
  const [singleUser, setSingleUser] = useState([]);

  const [disableOnClick, setDisableOnClick] = useState(true);
  // function to grab the user's information
  const getAUser = async (username) => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/finduser/${username}`,
        {
          withCredentials: true,
        }
      );
      console.log("Response data:", res.data);
      setSingleUser(res.data[0]);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };
  useEffect(() => {
    getAUser(props?.username);
  }, [props?.username]);

  return (
    <div className="popupMenu " style={{ padding: "0" }}>
      <div className="infoForm ">
        <div className="userInfoTop">
          <div style={{ marginLeft: "-10px" }}>
            <Conversation user={singleUser} disableOnClick={disableOnClick} />
          </div>
          <div>
            <IoIosClose
              size={35}
              onClick={() => props.setToggleUser(false)}
              className="closeBtn perInfoBtn"
              title="close"
            />
          </div>
        </div>

        <div>
          <div className="labelDiv">
            <h4>First Name</h4>

            <p>{singleUser?.firstName}</p>
          </div>
        </div>
        <div className="labelDiv">
          <div>
            <h4>Last Name</h4>

            <p>{singleUser?.lastName}</p>
          </div>
        </div>
        <div className="labelDiv">
          <div>
            <h4>Email</h4>

            <p>{singleUser?.email || "Not Set Yet"}</p>
          </div>
        </div>
        <div className="labelDiv">
          <div>
            <h4>Mobile</h4>

            <p>{singleUser?.mobile || "Not Set Yet"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleUserInfo;
