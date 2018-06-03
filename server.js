const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Transaction = require("./models/Transaction");
const app = express();
const saltRounds = 10;
const requireLogin = (request, response, next) => {
  if (!request.session.loggedIn) {
    return response.status(403).send("You do not have access");
  }
  next();
};

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));
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
  response.render("launch");
});

//account screen
app.get("/account", requireLogin, (request, response) => {
  Promise.all([
    User.all(),
    User.find(request.session.userId),
    Transaction.all(),
  ])
  .then(([users, userData, transactions]) => {
    console.log(`about to render account page`)
    response.render(`account`, {users: users, user: userData, transactions: transactions});
  });
});





app.post("/login", (request, response) => {
  User.findByUsername(request.body.username).then(user => {
    return bcrypt
      .compare(request.body.password, user.password_digest)
      
      .then(isPasswordCorrect => {
        // if (isPasswordCorrect) {
        //   request.session.loggedIn = true;
        //   request.session.userId = user.id;
        //   return response.redirect(301, "/account");
        // }
        console.log(isPasswordCorrect)
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
      return User.create(newUser);
    })
    .then(user => {
      request.session.loggedIn = true;
      request.session.userId = user.id;
      console.log("about to redirect to route -> /account");
      response.redirect(301, "/account");
    });
});

app.post("/newtransaction", (request, response) => {
  //need to get logged in user id
  //need to get selected user id
  //need to get selected coin
  //need to get selected amount of coins
  //need to reduce logged in user selected coin balance by selected amount
  //need to add selected users selected coin balance by selected amount
  //need to bring back to account page
  // Promise.all([
    const currentUserId = request.session.userId;
    const selectedUser = request.body.selectedfriend;
    const selectedCurrency = request.body.selectedcurrency;
    const selectedAmount = request.body.amount;

    const transactionData = {
      sending_user_id: currentUserId,
      receiving_username: selectedUser,
      amount: selectedAmount,
      coin: selectedCurrency
    };
    console.log(transactionData);

    const updateData = {
      sending_user_id: currentUserId,
      receiving_username: selectedUser,
      amount: selectedAmount
    }
    console.log(updateData);

    // const selectedUserId = User.findIdbyUsername(selectedUser);
    // console.log(selectedUserId);
    Transaction.create(transactionData);
    User.updateSender(updateData);
    User.updateReceiver(updateData);
    response.redirect(301, 'account');
});



app.post('/account', (request, response) => {
  User.find(request.session.userId)
  console.log(request.session.userId);
})



app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
