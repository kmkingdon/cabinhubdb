const express = require("express");
const app = express();
const queries = require("./queries");
const bodyParser = require("body-parser");
const cors = require("cors");
const mailer = require('./mailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('./database-connection.js')
require('dotenv').config();

app.use(bodyParser.json());
app.use(cors());

app.get("/events", (request, response) => {
  if(request.headers.authorization) {

      let token = request.headers.authorization.substring(7);
      let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
      let email = decodedToken.email


      knex("users")
        .where('email', email)
        .then(user => {
          let userData = Object.assign({}, user[0])

          if(email === userData.email) {
            queries
              .list("events")
              .then(events => {
                response.json({ events });
              })
              .catch(console.error);
            } else {
            response.json({error:'Unable to access data based on unsecure request'})
          }
        })
    } else {
      response.json({error:'Unable to access data based on unsecure request'})
    }
});

app.get("/items", (request, response) => {
  if(request.headers.authorization) {

      let token = request.headers.authorization.substring(7);
      let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
      let email = decodedToken.email

      knex("users")
        .where('email', email)
        .then(user => {
          let userData = Object.assign({}, user[0])

          if(email === userData.email) {
            queries
              .list("items")
              .then(items => {
                response.json({ items });
              })
              .catch(console.error);
            } else {
            response.json({error:'Unable to access data based on unsecure request'})
          }
        })
    } else {
      response.json({error:'Unable to access data based on unsecure request'})
    }
});

app.get("/events/:id", (request, response) => {
  queries
    .read("events", request.params.id)
    .then(events => {
      events ? response.json({ events }) : response.sendStatus(404);
    })
    .catch(console.error);
});

app.get("/items/:id", (request, response) => {
  queries
    .read("items", request.params.id)
    .then(items => {
      items ? response.json({ items }) : response.sendStatus(404);
    })
    .catch(console.error);
});


app.post("/events", (request, response) => {
  if(request.headers.authorization) {

      let token = request.headers.authorization.substring(7);
      let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
      let email = decodedToken.email

      knex("users")
        .where('email', email)
        .then(user => {
          let userData = Object.assign({}, user[0])

          if(email === userData.email) {
            queries
              .create("events", request.body)
              .then(events => {

                const message = {
                from: process.env.FROM_EMAIL,
                to: process.env.TO_EMAIL,
                subject: 'New Cabin Reservation',
                text: `The cabin has been reserved by ${events.title} starting on ${events.start} and ending on ${events.end}`
                };

              mailer
                .sendMessage(message)
                .then(() => {
                  response.status(201).json({ events });
                }).catch(error => {
                  response.status(500);
                  response.json({
                    error: error
                  });
                });

              })
              .catch(console.error);
            } else {
            response.json({error:'Unable to access data based on unsecure request'})
          }
        })
    } else {
      response.json({error:'Unable to access data based on unsecure request'})
    }
});


app.post("/items", (request, response) => {
  if(request.headers.authorization) {

      let token = request.headers.authorization.substring(7);
      let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
      let email = decodedToken.email

      knex("users")
        .where('email', email)
        .then(user => {
          let userData = Object.assign({}, user[0])

          if(email === userData.email) {
            queries
              .create("items", request.body)
              .then(items => {
                response.status(201).json({ items });
              })
              .catch(console.error);
            } else {
            response.json({error:'Unable to access data based on unsecure request'})
          }
        })
    } else {
      response.json({error:'Unable to access data based on unsecure request'})
    }
});



app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  knex('users')
    .select('*')
    .where('email', email)
    .then(user => {
      if(user.length === 0) {
        res.json({error: 'Email not found. Please sign up or enter a new email'})
      } else {
        let hashedPassword = user[0].password;
        let match = bcrypt.compareSync(password , hashedPassword);

        if(match){
          let payload = user[0];
          delete payload.password;

          let token= jwt.sign(Object.assign({},payload), process.env.TOKEN_SECRET)

          res.json({token:token, id:user.id})

        } else {
          res.json({error: 'Password does not match the email entered.'})
        }
      }
    })
});

app.post('/signup', function(req, res, next) {
  let email= req.body.email;
  let password= req.body.password;
  let username= req.body.username;

  knex('users')
    .select('*')
    .where('email', email)
    .then(user => {
      if(user.length === 0) {
        let saltRounds= 10;
        let hash= bcrypt.hashSync(password, saltRounds);
        req.body.password = hash;

        knex('users')
          .insert(req.body)
          .then(res.json({confirmation: 'Account has been created'}))
      } else {
        res.json({error: 'Email already taken. Please enter a unique email'})
      }
    })
});

app.delete("/events/:id", (request, response) => {
  queries
    .delete("events", request.params.id)
    .then(() => {
      response.sendStatus(204);
    })
    .catch(console.error);
});

app.delete("/items/:id", (request, response) => {
  queries
    .delete("items", request.params.id)
    .then(() => {
      response.sendStatus(204);
    })
    .catch(console.error);
});

app.put("/events/:id", (request, response) => {
  if(request.headers.authorization) {

      let token = request.headers.authorization.substring(7);
      let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
      let email = decodedToken.email

      knex("users")
        .where('email', email)
        .then(user => {
          let userData = Object.assign({}, user[0])

          if(email === userData.email) {
            queries
              .update("events", request.params.id, request.body)
              .then(events => {
                response.json({ events });
              })
              .catch(console.error);
            } else {
            response.json({error:'Unable to access data based on unsecure request'})
          }
        })
    } else {
      response.json({error:'Unable to access data based on unsecure request'})
    }
});

app.put("/items/:id", (request, response) => {
  if(request.headers.authorization) {

      let token = request.headers.authorization.substring(7);
      let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
      let email = decodedToken.email

      knex("users")
        .where('email', email)
        .then(user => {
          let userData = Object.assign({}, user[0])

          if(email === userData.email) {
            queries
              .update("items", request.params.id, request.body)
              .then(items => {
                response.json({ items });
              })
              .catch(console.error);
            } else {
            response.json({error:'Unable to access data based on unsecure request'})
          }
        })
    } else {
      response.json({error:'Unable to access data based on unsecure request'})
    }
});


app.use((request, response) => {
  response.sendStatus(404);
});

module.exports = app;
