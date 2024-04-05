import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [inputs, setInputs] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [err, setErr] = useState(null);
  const [register, setRegister] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleRegisterClick = async (e) => {
    e.preventDefault();
    if (inputs.firstName == "") return setErr("First Name cannot be empty");
    if (inputs.lastName == "") return setErr("Last Name cannot be empty");
    if (inputs.username == "") return setErr("Username cannot be empty");
    if (inputs.email == "") return setErr("Email cannot be empty");
    if (inputs.password == "") return setErr("Password cannot be empty");

    try {
      await axios.post("http://localhost:8800/api/auth/find/register", inputs);
      console.log("Register");

      setRegister("Registration successful");
      setTimeout(() => {
        navigate("/LogIn");
      }, 5000);
    } catch (error) {
      setErr(error.response.data);
    }
  };
  const navigate = useNavigate();
  return (
    <div className="backgroundImg pageImg">
      <div className="registerForm">
        <form action="">
          <div>
            <p className="userInfoHead">Create An Account</p>
          </div>
          <div className="inputInfo">
            <div className="labelDiv">
              <label htmlFor="">
                First Name <span>*</span>
              </label>
            </div>

            <div>
              <input
                type="text"
                name="firstName"
                onChange={handleChange}
                className="registerInput"
              />
            </div>
          </div>
          <div className="inputInfo">
            <div className="labelDiv">
              <label htmlFor="">Middle Name</label>
            </div>
            <div>
              <input
                type="text"
                name="middleName"
                onChange={handleChange}
                className="registerInput"
              />
            </div>
          </div>
          <div className="inputInfo">
            <div className="labelDiv">
              <label htmlFor="">
                Last Name <span>*</span>
              </label>
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                onChange={handleChange}
                className="registerInput"
              />
            </div>
          </div>
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
                Email <span>*</span>
              </label>
            </div>
            <div>
              <input
                type="email"
                name="email"
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
              />
            </div>
          </div>
          <div>
            <button className="registerBtn" onClick={handleRegisterClick}>
              Register
            </button>
          </div>
          <div>{err && !register && <div>{err}</div>}</div>
          <div>{register && <div>{register}</div>}</div>
          <div className="aDiv">
            <a onClick={() => navigate("/LogIn")}>Already have an account?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
