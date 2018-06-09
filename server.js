const Model = require("./models/Model");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const moment = require('moment');
const Web3 = require('web3');
const Eth = require('web3-eth');
const Accounts = require('web3-eth-accounts');
const methodOverride = require('method-override')

const app = express();
const saltRounds = 10;
const timestamp = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");

const eth = new Eth(Eth.givenProvider || 'ws://some.local-or-remote.node:8546');
const web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');
const myAddress = "0x8C708b53584D6891da7c7A6653c3Aaf9B0664e42";
const accounts = new Accounts('ws://localhost:4567');

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

const requireLogin = (request, response, next) => {
  if (!request.session.loggedIn) {
    return response.status(403).send("You do not have access");
  }
  next();
};

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

app.get("/", (request, response) => {
  console.log("about to render launch page");
  console.log(timestamp);
  response.render('launch')
});

app.get("/dashboard", requireLogin, (request, response) => {
  Promise.all([
      Model.all(),
      Model.allUsers(),
      Model.findUser(request.session.userId),
      Model.allTransactions()
    ])
    .then(([all, users, userData, transactions]) => {
      console.log(`about to render dashboard page`)
      response.render(`dashboard`, {
        all: all,
        users: users,
        user: userData,
        transactions: transactions
      });
    });
});

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

app.get("/history", requireLogin, (request, response) => {
  Promise.all([
      Model.all(),
      Model.allUsers(),
      Model.findUser(request.session.userId),
      Model.allTransactions(),
      Model.jointable(request.session.userId),
    ])
    .then(([all, users, userData, transactions, userTransactions]) => {
      console.log(`about to render history page`)
      console.log(userTransactions);
      response.render(`history`, {
        all: all,
        users: users,
        user: userData,
        transactions: transactions,
        userTransactions: userTransactions,
      });
    });
});

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

app.get("/logout", (request, response) => {
  response.redirect(`/`);
});

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
