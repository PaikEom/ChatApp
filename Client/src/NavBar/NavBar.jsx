import React, { useContext } from "react";
import "./NavBar.css";
import { AuthContext } from "../index";
import { NavLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useLocation } from "react-router-dom";
function NavBar() {
  const { moveFriends, setMoveFriends } = useContext(AuthContext);
  const location = useLocation();
  return (
    <div className={moveFriends ? "NavMainContainer" : "showNothing"}>
      <div>
        <GiHamburgerMenu
          className="burgerMenu"
          onClick={() => setMoveFriends(!moveFriends)}
          size={30}
        />
      </div>
      <div className="landingHeader">
        <NavLink to="/friends">Friends</NavLink>
        <NavLink to="/pending">Pending</NavLink>

        {location.pathname === "/add-friends" && (
          <NavLink to="/add-friends" activeClassName="active">
            Add Friends
          </NavLink>
        )}
        {location.pathname === "/" && (
          <NavLink to="/" activeClassName="active">
            Add Friends
          </NavLink>
        )}
        {location.pathname !== "/add-friends" && location.pathname !== "/" && (
          <NavLink to="/add-friends" activeClassName="active">
            Add Friends
          </NavLink>
        )}
      </div>
    </div>
  );
}

export default NavBar;
