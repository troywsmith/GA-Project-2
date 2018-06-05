CREATE DATABASE cryptobank_db;

\c cryptobank_db;

DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_digest TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  wallet_address TEXT,
  privateKey TEXT,
  bal INTEGER CHECK (bal > -1),
  phone TEXT,
  address TEXT,
  account_active  boolean NOT NULL
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  sending_user_id INTEGER REFERENCES users(id),
  receiving_username TEXT,
  amount INTEGER CHECK (amount > 0),
  dateandtime TEXT
);