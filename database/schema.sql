CREATE DATABASE cryptobank_db;

\c cryptobank_db;

DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_digest TEXT NOT NULL,
  bal INTEGER CHECK (bal > -1)
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  sending_user_id INTEGER REFERENCES users(id),
  receiving_username TEXT,
  amount INTEGER CHECK (amount > 0),
  dateandtime TEXT
);
