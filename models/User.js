const db = require("../database/connection");

const User = {};

User.all = () => {
  return db.any("SELECT * FROM users");
};

User.find = id => db.one("SELECT * FROM users WHERE id = $1", [id]);

User.findByUsername = username =>
  db.one("SELECT * FROM users WHERE username = $1", [username]);

User.findIdbyUsername = username =>
  db.one("SELECT id FROM users WHERE username = $1", [username]);

User.create = user =>
  db.one(
    `INSERT INTO users (username, password_digest, btc_bal, ltc_bal, ufr_bal) 
    VALUES ($1, $2, 10, 10, 10) 
    RETURNING *`, [user.username, user.password_digest, user.btc_bal]
  );

User.updateSender = data =>
  db.none(
    `UPDATE users
    SET btc_bal = btc_bal - ${data.amount}
    WHERE id = ${data.sending_user_id}`, data
  );

  User.updateReceiver = data =>
  db.none(
    `UPDATE users
    SET btc_bal = btc_bal + ${data.amount}
    WHERE username = ${data.receiving_username}`, data
  );



module.exports = User;
