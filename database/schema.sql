CREATE DATABASE cryptobank_db;

\c cryptobank_db;

DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT,
  password_digest TEXT,
  bal INTEGER
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  sending_user_id INTEGER REFERENCES users(id),
  receiving_username TEXT,
  amount INTEGER,
  dateandtime TEXT
);
