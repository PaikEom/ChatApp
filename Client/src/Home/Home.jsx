import { AuthContext } from "../index";
import React, { useState, useContext } from "react";
import "./Home.css";
import { Outlet } from "react-router-dom";
import LeftBar from "../LeftBar/LeftBar";

function Home() {
  const [showFriends, setShowFriends] = useState(false);
  const { moveFriends } = useContext(AuthContext);

  window.onload = function () {
    window.scrollTo(0, 0);
  };
  return (
    <div className="mainHomeDiv">
      <div className="leftBar">
        <LeftBar showFriends={showFriends} setShowFriends={setShowFriends} />
      </div>
      <div
        className="rightSide scroll scrollRightSideColor"
        style={{ left: moveFriends ? "0%" : "-100%" }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
