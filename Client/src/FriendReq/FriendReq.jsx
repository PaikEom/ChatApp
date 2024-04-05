import React, { useState } from "react";
import "./FriendReq.css";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import SingleUserInfo from "../singleUserInfo/singleUserInfo";
function FriendReq(props) {
  const [toggleUser, setToggleUser] = useState(false);
  const [toSeeUser, setToSeeUser] = useState("");
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
          <p>{props.data.username}</p>
        </div>
      </div>
      <div>
        <div className="actionsDiv">
          <IoMdCheckmarkCircle
            size={30}
            className="startChat"
            onClick={() => {
              props.updateStatus("accepted", props.id, props.data.id);
            }}
          />
          <IoMdCloseCircle
            size={30}
            onClick={() => {
              props.updateStatus("rejected", props.id, props.data.id);
            }}
          />
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

export default FriendReq;
