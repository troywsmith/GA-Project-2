const Model = require("./models/Model");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const moment = require('moment');
const Web3 = require('web3');
const Eth = require('web3-eth');
const Accounts = require('web3-eth-accounts');
// const google = require('googleapis');
// const path = require("path");
// const methodOverride = require("method-override");
// const alert = require('alert-node');
// const cheerio = require('cheerio');

const app = express();
const saltRounds = 10;
const timestamp = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");

// "Eth.providers.givenProvider" will be set if in an Ethereum supported browser.
const eth = new Eth(Eth.givenProvider || 'ws://some.local-or-remote.node:8546');
const web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');
const myAddress = "0x8C708b53584D6891da7c7A6653c3Aaf9B0664e42";
// Passing in the eth or web3 package is necessary to allow retrieving chainId, gasPrice and nonce automatically
// for accounts.signTransaction().
const accounts = new Accounts('ws://localhost:4567');

// //google functions
// const oauth2Client = new google.auth.OAuth2(
//   "965791184759-tgsho327qaevv7mqn21loun3t0p6u4ih.apps.googleusercontent.com",
//   "Z1ysKdr52KutQr_tK9G_rJtH",
//   "https://swaptokens.herokuapp.com/oauth2callback"
// );

// function onSignIn(googleUser) {
//   console.log('trying to sign in with google');
//   var profile = googleUser.getBasicProfile();
//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//   console.log('Name: ' + profile.getName());
//   console.log('Image URL: ' + profile.getImageUrl());
//   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
// }

// app.post("/google", onSignIn, (request, response) => {
//   console.log("about to redirect to route -> /dashboard");
//   response.redirect(301, "/dashboard");
// });

const requireLogin = (request, response, next) => {
  if (!request.session.loggedIn) {
    return response.status(403).send("You do not have access");
  }
  next();
};

const requireRegisterCredentials = (request, response, next) => {
  let un = request.body.username;
  let pw = request.body.password;
  let email = request.body.email;
  if ((un == "") || (ps = "") || (email = "")) {
    return response.render(`registererror`);
  }
  next();
};

const requireLoginCredentials = (request, response, next) => {
  let un = request.body.username;
  let pw = request.body.password;
  if ((un == "") || (ps = "")) {
    return response.render(`loginerror`);
  }
  next();
};

// app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use("/public", express.static("public"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "troys super secret password",
    resave: false,
    saveUninitialized: true
  })
);

const PORT = process.env.PORT || 4567;

//launch route > launch screen
app.get("/", (request, response) => {
  console.log("about to render launch page");
  console.log(timestamp);
  response.render("launch");
});

//dashboard route > dashboard screen
app.get("/dashboard", requireLogin, (request, response) => {
  Promise.all([
      Model.all(),
      Model.allUsers(),
      Model.findUser(request.session.userId),
      Model.allTransactions(),
    ])
    .then(([all, users, userData, transactions]) => {
      console.log(`about to render dashboard page`)
      response.render(`dashboard`, {
        all: all,
        users: users,
        user: userData,
        transactions: transactions,
      });
    });
});

//deposit/withdraw route > deposit/withdraw screen
app.get("/depositwithdraw", requireLogin, (request, response) => {
  Promise.all([
      Model.allUsers(),
      Model.findUser(request.session.userId),
      Model.allTransactions(),
    ])
    .then(([users, userData, transactions]) => {
      console.log(`about to render deposit page`)
      response.render(`depositwithdraw`, {
        users: users,
        user: userData,
        transactions: transactions
      });
    });
});

//friends route > friend screen 
app.get("/friends", requireLogin, (request, response) => {
  Promise.all([
      Model.allUsers(),
      Model.findUser(request.session.userId),
      Model.allTransactions(),
    ])
    .then(([users, userData, transactions]) => {
      console.log(`about to render friends page`)
      response.render(`friend`, {
        users: users,
        user: userData,
        transactions: transactions
      });
    });
});

//settings route > settings screen
app.get("/settings", requireLogin, (request, response) => {
  Promise.all([
      Model.allUsers(),
      Model.findUser(request.session.userId),
      Model.allTransactions(),
    ])
    .then(([users, userData, transactions]) => {
      console.log(`about to render dashboard page`)
      response.render(`settings`, {
        users: users,
        user: userData,
        transactions: transactions
      });
    });
});

//logout route > redirect to launch screen
app.get("/logout", (request, response) => {
  response.redirect(`/`);
});

//when login form submitted
app.post("/login", requireLoginCredentials, (request, response) => {
  console.log(request.body.username);
  if (request.body.username == "") {
    return response.render(`loginerror`);
  };
  Model.findByUsername(request.body.username).then(user => {
    return bcrypt
      .compare(request.body.password, user.password_digest)
      .then(isPasswordCorrect => {
        if (isPasswordCorrect) {
          request.session.loggedIn = true;
          request.session.userId = user.id;
          return response.redirect(301, "/dashboard");
        }
      })
  });
});

//when register form submitted
app.post("/register", requireRegisterCredentials, (request, response) => {
  const password = request.body.password;
  const newEtherWallet = accounts.create();
  bcrypt
    .hash(password, saltRounds)
    .then(hash => {
      const newUser = {
        username: request.body.username,
        password_digest: hash,
        email: request.body.email,
        wallet_address: newEtherWallet.address,
        privateKey: newEtherWallet.privateKey,
      };
      Model.updateMaster();
      return Model.createUser(newUser);
    })
    .then(user => {
      request.session.loggedIn = true;
      request.session.userId = user.id;
      request.session.userEmail = user.email;
      console.log("about to redirect to route -> /dashboard");
      response.redirect(301, "/dashboard");
    });
});

//when transaction form is submitted
app.post("/newtransaction", (request, response) => {
  const transactionData = {
    sending_user_id: request.session.userId,
    receiving_username: request.body.selectedusername,
    amount: Number(request.body.amount),
    dateandtime: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
  };
  console.log(transactionData);
  Model.updateBalances(transactionData).then(function (result) {
      if (!result) {
        console.log("nothing was returned");
      }
      response.redirect(301, 'dashboard');
    })
    .catch(function (err) {
      console.log('catch function was hit', err);
      response.redirect(301, 'dashboard');
    });
});

//when update profile form is submitted
app.post('/updateaccount', (request, response) => {
  const updatedData = {
    userId: request.session.userId,
    username: request.body.username,
    email: request.body.email,
    phone: request.body.phone,
    address: request.body.address
  };
  console.log(updatedData);
  Model.updateUser(updatedData);
  response.redirect(301, 'dashboard');
});

//when delete account form is submitted
app.post('/deleteaccount', (request, response) => {
  Model.deleteUser(request.session.userId);
  response.redirect(301, '/');
});

//when user tries to withdraw
app.post('/withdraw', (request, response) => {
  //make ether transaction from master wallet to user wallet

})


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
