const mysql = require("mysql");

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "123",
	database: "socialmedia",
});

module.exports = db;
