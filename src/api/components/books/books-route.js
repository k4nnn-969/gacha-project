const express = require('express');

const booksController = require('./books-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/books', route);

  route.get('/', booksController.getBooks);

  route.post('/', booksController.createBook);
};
