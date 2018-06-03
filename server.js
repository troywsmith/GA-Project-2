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
const requireLogin = (request, response, next) => {
  if (!request.session.loggedIn) {
    return response.status(403).send("You do not have access");
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
  console.log(moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
  response.render("launch");
});

//dashboard screen
app.get("/dashboard", requireLogin, (request, response) => {
  Promise.all([
      Model.allUsers(),
      Model.findUser(request.session.userId),
      Model.allTransactions(),
    ])
    .then(([users, userData, transactions]) => {
      console.log(`about to render dashboard page`)
      response.render(`dashboard`, {
        users: users,
        user: userData,
        transactions: transactions
      });
    });
});

//dashboard screen
app.get("/depositwithdraw", requireLogin, (request, response) => {
  Promise.all([
      Model.allUsers(),
      Model.findUser(request.session.userId),
      Model.allTransactions(),
    ])
    .then(([users, userData, transactions]) => {
      console.log(`about to render dashboard page`)
      response.render(`dashboard`, {
        users: users,
        user: userData,
        transactions: transactions
      });
    });
});

//dashboard screen
app.get("/friends", requireLogin, (request, response) => {
  Promise.all([
      Model.allUsers(),
      Model.findUser(request.session.userId),
      Model.allTransactions(),
    ])
    .then(([users, userData, transactions]) => {
      console.log(`about to render dashboard page`)
      response.render(`dashboard`, {
        users: users,
        user: userData,
        transactions: transactions
      });
    });
});

//dashboard screen
app.get("/settings", requireLogin, (request, response) => {
  Promise.all([
      Model.allUsers(),
      Model.findUser(request.session.userId),
      Model.allTransactions(),
    ])
    .then(([users, userData, transactions]) => {
      console.log(`about to render dashboard page`)
      response.render(`dashboard`, {
        users: users,
        user: userData,
        transactions: transactions
      });
    });
});

//dashboard screen
app.get("/logout", (request, response) => {
  response.redirect(`/`);
});









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
      });
  });
});


app.post("/register", (request, response) => {
  const password = request.body.password;
  bcrypt
    .hash(password, saltRounds)
    .then(hash => {
      const newUser = {
        username: request.body.username,
        password_digest: hash,
      };
      return Model.createUser(newUser);
    })
    .then(user => {
      request.session.loggedIn = true;
      request.session.userId = user.id;
      console.log("about to redirect to route -> /dashboard");
      response.redirect(301, "/dashboard");
    });
});

app.post("/newtransaction", (request, response) => {
  // Promise.all([
  const currentUserId = request.session.userId;
  const selectedUser = request.body.selectedusername;
  const selectedAmount = Number(request.body.amount);
  const dateandtime = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
  const transactionData = {
    sending_user_id: currentUserId,
    receiving_username: selectedUser,
    amount: selectedAmount,
    dateandtime: dateandtime
  };
  console.log(transactionData);
  Model.updateBalances(transactionData);
  response.redirect(301, 'dashboard');
});


app.post('/dashboard', (request, response) => {
  user.find(request.session.userId)
  console.log(request.session.userId);
})



app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
