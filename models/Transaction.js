const db = require("../database/connection");

const Transaction = {};

Transaction.all = () => {
  return db.any("SELECT * FROM transactions");
};

Transaction.findById = id => {
  return db.one("SELECT * FROM transactions WHERE id = ${id}", { id: id });
};

Transaction.create = transaction =>
  db.one(
    `INSERT INTO transactions (sending_user_id, receiving_username, amount) 
    VALUES ($1, $2, $3) 
    RETURNING *`,
    [transaction.sending_user_id, transaction.receiving_username, transaction.amount]
);

(${data.sending_user_id}, ${data.receiving_username}, ${data.amount})


module.exports = Transaction;