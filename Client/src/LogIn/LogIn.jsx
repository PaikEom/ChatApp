import React, { useState, useContext } from "react";
import { AuthContext } from "../index.jsx";
import { useNavigate } from "react-router-dom";
import "./LogIn.css";

function LogIn() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { login } = useContext(AuthContext);

  const handleLogInClick = async (e) => {
    e.preventDefault();
    if (inputs.username == "") return setErrors("Username cannot be empty");
    if (inputs.password == "") return setErrors("Password cannot be empty");
    try {
      await login(inputs);

      navigate("/");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors("An error occurred while logging in.");
      }
    }
  };

  return (
    <div className="backgroundImg pageImg">
      <div className="registerForm">
        <p className="p_title">Welcome Back</p>
        <div className="inputInfo">
          <div className="labelDiv">
            <label htmlFor="">
              Username <span>*</span>
            </label>
          </div>
          <div>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              className="registerInput"
            />
          </div>
        </div>
        <div className="inputInfo">
          <div className="labelDiv">
            <label htmlFor="">
              Password <span>*</span>
            </label>
          </div>
          <div>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="registerInput"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogInClick(e);
                }
              }}
            />
          </div>
        </div>
        <button onClick={handleLogInClick} className="registerBtn">
          Log In
        </button>
        {errors && (
          <div style={{ color: "red", marginTop: "15px" }}>{errors}</div>
        )}
        <div className="aDiv">
          <a onClick={() => navigate("/register")}>Create Account</a>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
