# Swap
*Cryptocurrency exchange platform powered by SWAP tokens*

[Swap App](https://swaptokens.herokuapp.com/)

# Instructions
Instructions for downloading the code and running it on localhost

clone the repo to your computer
```
git@git.generalassemb.ly:troywsmith/project-two.git
```

Install dependencies

```
npm iniit
npm i express
npm i express-session
npm i body-parser
npm i bcrypt
npm i moment
npm i web3
npm i express
```

Create the database, tables, and seed data
```
psql -f database/schema.sql
psql -f database/seed.sql
```

Run the application
```
node server.js
```

Open the web browser and go to:

http://localhost:4567


# Technology
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

# Process

## Wireframes
used balsamiq to detail the flow of the app 

![launch](/images/launchpage.png)
![register](/images/registerpage.png)
![login](/images/loginpage.png)
![dashboard](/images/dashboardpage.png)
![friends](/images/friendspage.png)
![settings](/images/settingspage.png)

## User Stories

![User Stories](/images/userstories.png)

## Database
drew out the entity relationship diagram

PICTURE HERE

## Routes - designed the HTTP route architecture

## Schema & Seeds
when you are confident with your ERD, define its tables in SQL and put into a schema file. For easier testing, write a seed file as well to insert sample data to your DB.

## Models
you now have a working, populated database. Write a model with methods that use pg-promise to perform CRUD on the DB

# Timeline (completed in 4 days)
- Thursday, May 31st (5pm) - Prompt received

- Thursday, May 31st (5pm-8pm) - Planning (wireframes, user stories, ERD)

- Friday, June 1st 9am - Project Approved

- Monday, June 4th - Check in (schema/seeds, models, routes structure, initial Heroku deployment)

- Wednesday, June 6th - Project Presentation


# Video Walk Through

[Swap App](https://swaptokens.herokuapp.com/)

A video presentation that:
- Is 5 minutes in length
- Shows off the features of the app you're most proud of
- Shows off some of your code
- Explains one or two technical details
- Explains one or two technical challenges
- Explains which improvements you might make
- Is uploaded to a video steaming platform


# Proud Code Snippet

```javascript
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
```

# Next Steps
- Improve error handlers
- Googe sign in
- Swap transaction to external wallet
- Design logo