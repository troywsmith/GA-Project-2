CREATE DATABASE cryptobank_db;

\c cryptobank_db;

DROP TABLE IF EXISTS wallets;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS relationships;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT,
  password_digest TEXT,
  fname TEXT,
  lname TEXT,
  email TEXT
);

CREATE TABLE wallets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  btc_bal INTEGER,
  ltc_bal INTEGER,
  ufr_bal INTEGER
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  sending_user_id INTEGER REFERENCES users(id),
  receiving_user_id INTEGER REFERENCES users(id),
  amount INTEGER,
  coin TEXT
);

CREATE TABLE relationships (
  id SERIAL PRIMARY KEY,
  relating_user_id TEXT,
  related_user_id TEXT,
  type TEXT
);
