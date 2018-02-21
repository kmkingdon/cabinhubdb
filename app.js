const express = require("express");
const app = express();
const queries = require("./queries");
const bodyParser = require("body-parser");
const cors = require("cors");
const mailer = require('./mailer');
require('dotenv').config();

app.use(bodyParser.json());
app.use(cors());

app.get("/events", (request, response) => {
  queries
    .list("events")
    .then(events => {
      response.json({ events });
    })
    .catch(console.error);
});

app.get("/items", (request, response) => {
  queries
    .list("items")
    .then(events => {
      response.json({ events });
    })
    .catch(console.error);
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
        res.status(500);
        res.json({
          error: error
        });
      });

    })
    .catch(console.error);
});


app.post("/items", (request, response) => {
  queries
    .create("items", request.body)
    .then(items => {
      response.status(201).json({ items });
    })
    .catch(console.error);
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
  queries
    .update("events", request.params.id, request.body)
    .then(events => {
      response.json({ events });
    })
    .catch(console.error);
});

app.put("/items/:id", (request, response) => {
  queries
    .update("items", request.params.id, request.body)
    .then(items => {
      response.json({ items });
    })
    .catch(console.error);
});

app.use((request, response) => {
  response.send(404);
});

module.exports = app;
