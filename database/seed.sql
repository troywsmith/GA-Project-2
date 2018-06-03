\c cryptobank_db;

-- DELETE FROM transactions;
-- DELETE FROM users;

INSERT INTO users (username, password_digest, email, bal, account_active ) 
VALUES ('MASTER ACCOUNT', 'master', 'troywsmith2016@gmail.com', 1000000, TRUE);



