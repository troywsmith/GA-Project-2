\c cryptobank_db;

DELETE FROM transactions;
DELETE FROM users;


INSERT INTO users (username, password_digest, btc_bal, ltc_bal, ufr_bal) 
VALUES ('Johnnyboy', 'drgsdfg3453', 0, 0, 0);
INSERT INTO users (username, password_digest, btc_bal, ltc_bal, ufr_bal) 
VALUES ('Jane123', 'sdfg3453sdfw', 5, 0, 0);

INSERT INTO transactions (sending_user_id, receiving_username, amount, coin)
VALUES (1, 'Jane123', 5, 'BTC');