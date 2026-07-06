/*
      Course: WEB420

      Description: Hands-On 2.1: Building your Own Web Server
      Author: Jonathan Cantu
      Date:   June 19, 2026

      Filename: app.js
*/

const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const indexRouter = require('../routes/index');
const booksRouter = require('../routes/books');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/api/books', booksRouter);

app.use((req, res, next) => {
  next(createError(404, 'Resource not found'));
});

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
