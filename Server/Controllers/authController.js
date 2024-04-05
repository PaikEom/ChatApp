const db = require("../dbConnection.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
// to deal with register
const register = (req, res) => {
  // check if user exists
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User Already Exists!");
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(req.body.password, salt);
    const q =
      "INSERT INTO users (`firstName`, `middleName`, `lastName`, `username`,`email`, `passwordHash`) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      req.body.firstName,
      req.body.middleName,
      req.body.lastName,
      req.body.username,
      req.body.email,
      hashedPassword,
    ];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
  // if it exist, then  create a new user
  // hash password
};
// to deal with log in
const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");
    const checkPassword = bcryptjs.compareSync(
      req.body.password,
      data[0].passwordHash
    );
    if (!checkPassword) return res.status(400).json("Wrong password");
    console.log(checkPassword);
    const token = jwt.sign({ id: data[0].id }, "secretkey");
    const { passwordHash, ...other } = data[0];
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
  });
};

// to deal with log out
const logout = (req, res) => {
  res
    .clearCookie("accessToken", { secure: true, sameSite: "none" })
    .status(200)
    .json("User has been logged out");
};

module.exports = { register, login, logout };
