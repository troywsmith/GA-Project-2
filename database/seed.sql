\c cryptobank;

DELETE FROM users;
DELETE FROM wallets;
DELETE FROM transactions;
DELETE FROM relationships;

INSERT INTO users (username, password_digest, fname, lname, email) 
VALUES ('Johnnyboy', 'drgsdfg3453', 'John', 'Doe', 'johndoe@gmail.com');
INSERT INTO users (username, password_digest, fname, lname, email) 
VALUES ('Jane123', 'sdfg3453sdfw', 'Jane', 'Doe', 'janedoe@gmail.com');

INSERT INTO wallets (user_id, btc_bal, ltc_bal, ufr_bal) 
VALUES (1, 324, 4343, 344);
INSERT INTO wallets (user_id, btc_bal, ltc_bal, ufr_bal) 
VALUES (2, 9877, 3453, 222222);

INSERT INTO transactions (sending_user_id, receiving_user_id, amount, coin)
VALUES (1, 2, 20, "UFR");
INSERT INTO transactions (sending_user_id, receiving_user_id, amount, coin)
VALUES (1, 2, 5, "BTC");
INSERT INTO transactions (sending_user_id, receiving_user_id, amount, coin)
VALUES (2, 1, 40, "LTC");

INSERT INTO relationships (related_user_id, related_user_id, type)
VALUES (1, 2, "friends");
INSERT INTO relationships (related_user_id, related_user_id, type)
VALUES (2, 1, "friends");
