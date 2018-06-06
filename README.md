# Swap
*Cryptocurrency exchange platform powered by SWAP tokens*

[Live Swap App](https://swaptokens.herokuapp.com/)

## Instructions for running Swap on localhost

### Clone the repo to your computer
```
git@git.generalassemb.ly:troywsmith/project-two.git
```

### Install dependencies while in repo

```
npm iniit
npm i express
npm i express-session
npm i body-parser
npm i bcrypt
npm i moment
npm i web3
```

### Create the database, tables, and seed data
```
psql -f database/schema.sql
psql -f database/seed.sql
```

### Run the application
```
node server.js
```

### Open the web browser and go to the following

http://localhost:4567


## Technology
HTML / EJS - Used EJS to render information on the page

CSS - Used to style my app

Node/Express - Built server using Express

MVC Pattern - Used Models, Views, Controllers pattern

SQL / PG-PROMISE - Used to persist data

Heroku - Used to deploy app

Moment: - Used to timestamp transactions

Bcrypt - used to hash user passwords

Bodyparser - middleware used to parse incoming request bodies

API's:
- Web3 (Ethereum JavaScript API) - used to create ethereum wallet at time of user registration

## Timeline (completed in 4 days)
- Thursday, May 31st (5pm) - Prompt received

- Thursday, May 31st (5pm-8pm) - Planning (wireframes, user stories, ERD)

- Friday, June 1st 9am - Project Approved

- Monday, June 4th - Check in (schema/seeds, models, routes structure, initial Heroku deployment)

- Wednesday, June 6th - Project Presentation

## Process

### Wireframes
used balsamiq to detail the flow of the app 

![launch](/images/launchpage.png)
![register](/images/registerpage.png)
![login](/images/signin.png)
![dashboard](/images/dashboardpage.png)
![friends](/images/friendspage.png)
![settings](/images/settingspage.png)

### User Stories

![User Stories](/images/userstories.png)

### Database

![users](/images/users.png)

![transactions](/images/transactions.png)


## Video Walk Through

[Swap App Walk Through](https://www.youtube.com/watch?v=gtf7oZaqUsU&feature=youtu.be)


## Proud Code Snippet

```javascript
//when transaction form is submitted
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
```

## Next Steps
- Swap transaction to external wallet
- Improve error handlers
- User notifications/prompts
- Googe sign in