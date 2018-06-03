const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const moment = require('moment');
const bcrypt = require("bcrypt");
const Model = require("./models/Model");
const app = express();
const saltRounds = 10;
const timestamp = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");

const requireLogin = (request, response, next) => {
  if (!request.session.loggedIn) {
    return response.status(403).send("You do not have access");
  }
  next();
};

const requireUsernamePassword = (request, response, next) => {
  let un = request.body.username;
  let pw = request.body.password;
  if ((un == "") || (ps = "")) {
      return response.status(403).send("Username and Password must be filled out");
  }
  next();
};

app.use(methodOverride("_method"));
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

//splash screen
app.get("/", (request, response) => {
  console.log("about to render launch page");
  console.log(timestamp);
  response.render("launch");
});

//dashboard screen
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
        transactions: transactions
      });
    });
});

//depositwithdraw screen
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

//friends screen
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

//settings route
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

//logout route screen
app.get("/logout", (request, response) => {
  response.redirect(`/`);
});






//when login form submitted
app.post("/login", (request, response) => {
  Model.findByUsername(request.body.username).then(user => {
    return bcrypt
      .compare(request.body.password, user.password_digest)
      .then(isPasswordCorrect => {
        if (isPasswordCorrect) {
          request.session.loggedIn = true;
          request.session.userId = user.id;
          return response.redirect(301, "/dashboard");
        }
        response.send("That username and password was invalid");
      }
    );
  });
});

//when register form submitted
app.post("/register", requireUsernamePassword, (request, response) => {
  const password = request.body.password;
  bcrypt
    .hash(password, saltRounds)
    .then(hash => {
      const newUser = {
        username: request.body.username,
        password_digest: hash,
        email: request.body.email,
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

//when payment form is submitted
app.post("/newtransaction", (request, response) => {
  const transactionData = {
    sending_user_id: request.session.userId,
    receiving_username: request.body.selectedusername,
    amount: Number(request.body.amount),
    dateandtime: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
  };
  console.log(transactionData);
  Model.updateBalances(transactionData)
  .catch(error => {
    return response.status(403).send("That amount exceeds your current balance.");
  });
  response.redirect(301, 'dashboard');
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
  response.redirect(301, 'settings');
});

//when delete account form is submitted
app.post('/deleteaccount', (request, response) => {
  Model.deleteUser(request.session.userId);
  response.redirect(301, '/');
});





app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
