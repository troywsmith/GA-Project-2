const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
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
    Model.all(),
    Model.find(request.session.userId),
    Model.all(),
  ])
  .then(([users, userData, transactions]) => {
    console.log(`about to render account page`)
    response.render(`account`, {users: users, user: userData, transactions: transactions});
  });
});





app.post("/login", (request, response) => {
  Model.findByUsername(request.body.username).then(user => {
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
      return Model.createUser(newUser);
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
    const selectedUser = request.body.selectedusername;
    const selectedAmount = Number(request.body.amount);
    // const selectedCurrency = request.body.selectedcurrency;

    const transactionData = {
      sending_user_id: currentUserId,
      receiving_username: selectedUser,
      amount: selectedAmount,
    };

    console.log(transactionData);

    Model.updateBalances(transactionData);

    // const selectedUserId = user.findIdbyusername(selecteduser);
    // console.log(selecteduserId);
    // console.log('about to create a new row in transaction table')
    // Transaction.create(transactionData);
    // console.log('about to create a new row in transaction table')
    // user.updateSender(transactionData);
    // console.log('about to reduce sending users balance')
    // Model.updateReceiver(userData);
    // console.log('About to increase receiving users balance');
    response.redirect(301, 'account');
});



app.post('/account', (request, response) => {
  user.find(request.session.userId)
  console.log(request.session.userId);
})



app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
