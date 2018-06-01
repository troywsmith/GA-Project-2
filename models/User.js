const db = require("../database/connection");

const User = {};

User.create = user =>
  db.one(
    `INSERT INTO users (username, password_digest, fname, lname, email) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *`,
    [user.username, user.password_digest, user.fname. user.lname, user.email]
  );

User.findByUsername = username =>
  db.one("SELECT * FROM users WHERE username = $1", [username]);

module.exports = User;
