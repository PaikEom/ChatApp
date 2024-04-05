const db = require("../dbConnection.js");
// This is used to find users in the data base and see their relationships with the user that sent it
const getUser = (req, res) => {
  // Assuming you have a variable to store the user to be excluded

  // Modify the query to exclude a specific user
  const q =
    "SELECT IFNULL(f.status, 'null') AS status,  u.id,u.firstName,u.middleName,u.lastName,u.username,u.email,u.profilePic FROM users u LEFT JOIN friends f ON (f.user_id_1 = ? AND f.user_id_2 = u.id) OR (f.user_id_1 = u.id AND f.user_id_2 = ?) WHERE u.username LIKE ? AND u.id != ?;";

  // Use "%" + req.body.findUser + "%" to match similar usernames
  db.query(
    q,
    [
      req.query.excludedUser,
      req.query.excludedUser,
      "%" + req.query.findUser + "%",
      req.query.excludedUser,
    ],
    (err, data) => {
      if (err) return res.status(500).json(err);

      res.status(200).json(data);
    }
  );
};

// This is used to find information about a single user
const getSingleUser = (req, res) => {
  const q =
    "SELECT id, firstName, middleName, lastName, username, mobile, email, registeredAt, coverPic, profilePic, city FROM users WHERE username =?";
  db.query(q, [req.params.username], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};
// This is there to add send a friend request
const addUser = (req, res) => {
  const q =
    "SELECT * FROM Friends WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)";
  db.query(
    q,
    [
      req.body.user_id_1,
      req.body.user_id_2,
      req.body.user_id_2,
      req.body.user_id_1,
    ],
    (err, data) => {
      if (err) return res.status(500).json(err);
      if (data && data.length > 0)
        return res.status(409).json({
          message: "Cant send more applications to the same user",
        });

      const q2 = "INSERT INTO Friends (user_id_1, user_id_2) VALUES (?, ?)";
      db.query(q2, [req.body.user_id_1, req.body.user_id_2], (err, data) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(data);
      });
    }
  );
};
const seeFriends = (req, res) => {
  const q =
    "SELECT f.status, u.id, u.firstName, u.middleName, u.lastName, u.username,u.email, u.profilePic FROM friends f JOIN users u ON (f.user_id_2 = u.id OR f.user_id_1 = u.id ) WHERE (f.user_id_1 = ? OR f.user_id_2 = ?) AND f.status = ? AND u.id != ?";
  db.query(
    q,
    [
      req.query.user_id_1,
      req.query.user_id_1,
      req.query.status,
      req.query.user_id_1,
    ],
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json(data);
    }
  );
};
// This will find every
const seeFriendsStatus = (req, res) => {
  // to see what I sent ( see the applications I sent to )
  // ids = "9";
  // st = "pending";

  const q =
    "SELECT f.status, u.id, u.firstName, u.middleName, u.lastName, u.username, u.email, u.profilePic FROM friends f JOIN users u ON f.user_id_2 = u.id WHERE f.user_id_1 = ? AND f.status = ? AND u.id != ?";

  db.query(
    q,
    [req.query.user_id_1, req.query.status, req.query.user_id_1],
    (err, data) => {
      if (err) return res.status(500).json(err);

      // Log the data before sending the response

      // Send JSON response
      res.status(200).json(data);
    }
  );
};
const updateStatus = (req, res) => {
  const q = "UPDATE friends SET status =? WHERE user_id_2 =? AND user_id_1 =?";
  db.query(
    q,
    [req.body.status, req.body.user_id_2, req.body.user_id_1],
    (err, data) => {
      if (err) {
        console.error("Error updating status:", err);
        return res.status(500).json(err);
      }
      res.status(200).json(data);
    }
  );
};
const seeRequests = (req, res) => {
  // to see what I got sent to me
  const q =
    "SELECT f.status , u.* FROM friends f JOIN users u ON f.user_id_1 = u.id WHERE f.user_id_2 = ? AND f.status = ?";
  db.query(q, [req.query.user_id_2, req.query.status], (err, data) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json(err);
    }
    res.status(200).json(data);
  });
};
const editUser = (req, res) => {
  const q =
    "UPDATE users SET firstName =?, middleName =?, lastName =?, mobile =?, email =?, city =? ,profilePic = ? WHERE id =?";
  db.query(
    q,
    [
      req.body.firstName,
      req.body.middleName,
      req.body.lastName,
      req.body.mobile,
      req.body.email,
      req.body.city,
      req.body.profilePic,
      req.body.id,
    ],
    (err, data) => {
      if (err) {
        console.error("Error updating user:", err);
        return res.status(500).json(err);
      }

      // Fetch the updated user data from the database
      db.query(
        "SELECT * FROM users WHERE id = ?",
        [req.body.id],
        (err, userData) => {
          if (err) {
            console.error("Error fetching updated user data:", err);
            return res.status(500).json(err);
          }

          res.status(200).json(userData[0]); // Return the updated user data
        }
      );
    }
  );
};

module.exports = {
  getUser,
  getSingleUser,
  addUser,
  seeFriendsStatus,
  seeFriends,
  updateStatus,
  seeRequests,
  editUser,
};
