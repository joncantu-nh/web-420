const express = require("express");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const users = require("../database/users");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await users.insertOne({
      email,
      password: hashedPassword
    });

    res.status(200).send({
      user,
      message: "Registration successful"
    });
  } catch (err) {
    console.error("Error: ", err.message);
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw createError(400, "Email is required");
    }

    if (!password) {
      throw createError(400, "Password is required");
    }

    const user = await users.findOne({ email });

    if (!user) {
      throw createError(401, "Unauthorized");
    }

    const isPasswordValid = bcrypt.compareSync(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw createError(401, "Unauthorized");
    }

    res.status(200).send({
      message: "Authentication successful"
    });
  } catch (err) {
    if (!err.status || err.status >= 500) {
      console.error("Login error:", err);
    }

    next(err);
  }
});

module.exports = router;
