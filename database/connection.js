const promise = require("bluebird");
const monitor = require("pg-monitor");

let initOptions = {};

if (process.NODE_ENV !== "production") {
  promise.config({
    longStackTraces: true
  });
  initOptions = {
    promiseLib: promise
  };
}

monitor.attach(initOptions, ["query", "error"]);

const pgp = require("pg-promise")(initOptions);

const connectionURL = "postgres://localhost:5432/cryptobank_db";

const db = pgp(connectionURL);

module.exports = db;
