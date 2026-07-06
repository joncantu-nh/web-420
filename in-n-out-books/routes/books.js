const express = require("express");
const createError = require("http-errors");
const books = require("../database/books");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const allBooks = await books.find();
    res.status(200).json(allBooks);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return next(createError(400, "Input must be a number"));
    }

    const book = await books.findOne({ id });

    if (!book) {
      return next(createError(404, "Book not found"));
    }

    res.status(200).json(book);

  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {

  try {

    const newBook = req.body;

    const expectedKeys = ["id", "title", "author"];
    const receivedKeys = Object.keys(newBook);

    if (
      !receivedKeys.every(key => expectedKeys.includes(key)) ||
      receivedKeys.length !== expectedKeys.length
    ) {
      return next(createError(400, "Bad Request"));
    }

    const result = await books.insertOne(newBook);

    res.status(201).json({
      id: result.ops[0].id
    });

  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {

  try {

    const id = Number(req.params.id);

    await books.deleteOne({ id });

    res.sendStatus(204);

  } catch (err) {

    if (err.message === "No matching item found") {
      return next(createError(404, "Book not found"));
    }

    next(err);
  }
});

module.exports = router;
