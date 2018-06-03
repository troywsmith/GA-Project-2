\c cryptobank_db;

DELETE FROM transactions;
DELETE FROM users;


INSERT INTO users (username, password_digest, bal) 
VALUES ('Alex', 'passwordAlex', 5);
INSERT INTO users (username, password_digest, bal) 
VALUES ('Ben', 'passwordBen', 15);
INSERT INTO users (username, password_digest, bal) 
VALUES ('Chris', 'passwordChris', 10);

