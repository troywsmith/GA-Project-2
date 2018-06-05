\c cryptobank_db;

DELETE FROM transactions;
DELETE FROM users;

INSERT INTO users (username, password_digest, email, wallet_address, privateKey, bal, account_active ) 
VALUES ('MASTER ACCOUNT', 'master', 'troywsmith2016@gmail.com', '0x8C708b53584D6891da7c7A6653c3Aaf9B0664e421000000', 'hash this private key', 100000000, TRUE);

-- INSERT INTO users (username, password_digest, email, wallet_address, privateKey, bal, account_active ) 
-- VALUES ('Alex234', 'pw', 'troywsmith2016@gmail', '0x8C708b53584D6891da7c7A6653c3Aaf9B0664e421000000', 'hash this private key', 10, TRUE);

-- INSERT INTO users (username, password_digest, email, wallet_address, privateKey, bal, account_active ) 
-- VALUES ('JohnnyCrypto', 'pw', 'troywsmith2016@gm', '0x8C708b53584D6891da7c7A6653c3Aaf9B0664e421000000', 'hash this private key', 10, TRUE);

-- INSERT INTO users (username, password_digest, email, wallet_address, privateKey, bal, account_active ) 
-- VALUES ('ChrisT99', 'pw', 'troywsmith2016@g', '0x8C708b53584D6891da7c7A6653c3Aaf9B0664e421000000', 'hash this private key', 10, TRUE);

-- INSERT INTO users (username, password_digest, email, wallet_address, privateKey, bal, account_active ) 
-- VALUES ('JRobinson', 'pw', 'troywsm@gmail.com', '0x8C708b53584D6891da7c7A6653c3Aaf9B0664e421000000', 'hash this private key', 10, TRUE);

-- INSERT INTO users (username, password_digest, email, wallet_address, privateKey, bal, account_active ) 
-- VALUES ('tws', 'pw', 'troywsmit2016@gmail.cm', '0x8C708b53584D6891da7c7A6653c3Aaf9B0664e421000000', 'hash this private key', 10, TRUE);

-- INSERT INTO users (username, password_digest, email, wallet_address, privateKey, bal, account_active ) 
-- VALUES ('troywsmith', 'pw', 'th2016@gmail.com', '0x8C708b53584D6891da7c7A6653c3Aaf9B0664e421000000', 'hash this private key', 10, TRUE);


