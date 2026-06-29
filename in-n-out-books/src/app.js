/*
      Course: WEB420

      Description: Hands-On 2.1: Building your Own Web Server
      Author: Jonathan Cantu
      Date:   June 19, 2026

      Filename: app.js
*/

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('../routes/index');
const books = require('../database/books');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);

app.get('/api/books', async (req, res, next) => {
  try {
    const allBooks = await books.find();

    res.status(200).json(allBooks);
  } catch (err) {
    next(err);
  }
});

app.get('/api/books/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      const err = new Error('Input must be a number');
      err.status = 400;
      next(err);
      return;
    }

    const book = await books.findOne({ id });

    if (!book) {
      const err = new Error('Book not found');
      err.status = 404;
      return next(err);
    }

    res.status(200).json(book);

  } catch (err) {
    next(err);
  }
});

app.get('/error-test', (req, res, next) => {
  const err = new Error('Forced server error');
  err.status = 500;
  next(err);
});

/**
 * 404
 */
app.use((req, res, next) => {
  next(createError(404, 'Resource not found'));
});

/**
 * 500
 */
app.use((err, req, res, next) => {
  const response = {
    status: err.status || 500,
    message: err.message
  };

  if (req.app.get('env') !== 'production') {
    response.stack = err.stack;
  }

  res.status(response.status).json(response);
});

module.exports = app;
