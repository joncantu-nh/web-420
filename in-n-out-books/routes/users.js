const express = require("express");
const createError = require("http-errors");
const Ajv = require("ajv");

const users = require("../database/users");

const router = express.Router();
const ajv = new Ajv();

const securityQuestionsSchema = {
  type: "array",
  minItems: 3,
  maxItems: 3,
  items: {
    type: "object",
    properties: {
      answer: {
        type: "string",
        minLength: 1
      }
    },
    required: ["answer"],
    additionalProperties: false
  }
};

const validateSecurityQuestions = ajv.compile(
  securityQuestionsSchema
);

/*
 * Normalizes answers so minor capitalization or whitespace differences
 * don't cause valid answers to fail.
 */
const normalizeAnswer = (answer) =>
  answer.trim().toLowerCase();

router.post(
  "/:email/verify-security-question",
  async (req, res, next) => {
    try {
      const email = req.params.email.trim().toLowerCase();
      const submittedQuestions = req.body;

      const valid = validateSecurityQuestions(
        submittedQuestions
      );

      if (!valid) {
        return next(createError(400, "Bad Request"));
      }

      let user;

      try {
        user = await users.findOne({ email });
      } catch (err) {
        return next(createError(401, "Unauthorized"));
      }

      /*
       * Returning Unauthorized for a nonexistent account avoids
       * revealing if an email address is registered. (security through obscurity)
       */
      if (
        !user ||
        !Array.isArray(user.securityQuestions) ||
        user.securityQuestions.length !==
        submittedQuestions.length
      ) {
        return next(createError(401, "Unauthorized"));
      }

      const answersMatch = submittedQuestions.every(
        (submittedQuestion, index) => {
          const savedQuestion =
            user.securityQuestions[index];

          return (
            savedQuestion &&
            typeof savedQuestion.answer === "string" &&
            normalizeAnswer(submittedQuestion.answer) ===
            normalizeAnswer(savedQuestion.answer)
          );
        }
      );

      if (!answersMatch) {
        return next(createError(401, "Unauthorized"));
      }

      res.status(200).send({
        message:
          "Security questions successfully answered"
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
