const db = require("../database/connection");

const Model = {};

Model.allUsers = () => {
  return db.any("SELECT * FROM users");
};

Model.findUser = id => db.one("SELECT * FROM users WHERE id = $1", [id]);

Model.findByUsername = username =>
  db.one("SELECT * FROM users WHERE username = $1", [username]);

Model.findIdbyUsername = username =>
  db.one("SELECT id FROM users WHERE username = $1", [username]);

Model.createUser = user =>
  db.one(
    `INSERT INTO users (username, password_digest, bal) 
    VALUES ($1, $2, 10) 
    RETURNING *`, [user.username, user.password_digest, user.bal]
  );

Model.updateBalances = data =>
  db.none(
    `
    BEGIN TRANSACTION;

    UPDATE users
    SET bal = bal - ${data.amount}
    WHERE id = ${data.sending_user_id};

    UPDATE users
    SET bal = bal + ${data.amount}
    WHERE username = '${data.receiving_username}';

    INSERT INTO transactions (sending_user_id, receiving_username, amount, dateandtime) 
    VALUES (${data.sending_user_id}, '${data.receiving_username}', ${data.amount}, '${data.dateandtime}') 
    RETURNING *;

    COMMIT;
    `, data
  );

Model.allTransactions = () => {
  return db.any("SELECT * FROM transactions");
};

Model.findTransactionById = id => {
  return db.one("SELECT * FROM transactions WHERE id = ${id}", {
    id: id
  });
};


module.exports = Model;