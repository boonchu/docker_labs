'use strict';

const express = require('express');
const chalk = require('chalk')
const books = require('./db')

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/books', (req, res) => {
  res.json(books)
});

app.get('/books/:id', (req, res) => {
  res.json(books.find(book => book.id === req.params.id))
})

app.listen(PORT, HOST => {
  console.log(`${chalk.bgGreen.black('[Success]')} Running on http://${HOST}:${PORT}`)
  console.log(`${chalk.hex('#DEADED').underline('Bye!')}`)
})
