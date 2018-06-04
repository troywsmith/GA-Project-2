\c cryptobank_db;

DELETE FROM transactions;
DELETE FROM users;

INSERT INTO users (username, password_digest, email, wallet_address, privateKey, bal, account_active ) 
VALUES ('MASTER ACCOUNT', 'master', 'troywsmith2016@gmail.com', '0x8C708b53584D6891da7c7A6653c3Aaf9B0664e421000000', 'hash this private key', 100000000, TRUE);



